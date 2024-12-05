import { useAtom } from 'jotai';
import { themeAtom } from '@/atoms/themeAtom';

export function useThemeAtom() {
  return useAtom(themeAtom);
}