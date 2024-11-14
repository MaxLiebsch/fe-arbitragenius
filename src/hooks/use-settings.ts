import { useAtom } from 'jotai';
import { userSettingsAtom } from '../atoms/userSettings';

export function useUserSettings() {
  return useAtom(userSettingsAtom);
}