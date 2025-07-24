import { useEffect, useState } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface UpdatePasswordCredentials {
  password: string;
}

interface AuthHookReturn extends AuthState {
  signIn: (
    credentials: LoginCredentials,
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (
    credentials: UpdatePasswordCredentials,
  ) => Promise<{ error: AuthError | null }>;
}

export function useAuth(): AuthHookReturn {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Check if Supabase is properly configured
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !==
        'https://placeholder.supabase.co';

    if (!isSupabaseConfigured) {
      // If Supabase is not configured, set loading to false and user to null
      setAuthState({
        user: null,
        session: null,
        loading: false,
      });
      return;
    }

    // Get initial user - more secure than getSession()
    const getInitialUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error('Error getting user:', error);
        }

        setAuthState({
          user: user ?? null,
          session: null, // We'll get session from auth state change
          loading: false,
        });
      } catch (error) {
        console.error('Supabase auth error:', error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      }
    };

    getInitialUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async ({ email, password }: LoginCredentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/update-password`,
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  };

  const updatePassword = async ({ password }: UpdatePasswordCredentials) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as AuthError };
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
}
