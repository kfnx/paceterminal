import { useTranslations } from 'next-intl';

export function useT() {
  return useTranslations();
}

export function useCommonT() {
  return useTranslations('common');
}

export function useNavT() {
  return useTranslations('nav');
}

export function useAuthT() {
  return useTranslations('auth');
}

export function useTokensT() {
  return useTranslations('tokens');
}

export function useWalletT() {
  return useTranslations('wallet');
}

export function useMembershipT() {
  return useTranslations('membership');
}
