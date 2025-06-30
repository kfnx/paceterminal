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
    // Get initial user - more secure than getSession()
    const getInitialUser = async () => {
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    return { error };
  };

  const updatePassword = async ({ password }: UpdatePasswordCredentials) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    return { error };
  };

  return {
    ...authState,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
}
