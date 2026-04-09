import en from "./en.json";
import kk from "./kk.json";
import ru from "./ru.json";
import { useAuthStore } from "../store/authStore";

const dictionaries = { ru, kk, en };

type Dictionary = typeof ru;

export type TranslationKey = keyof Dictionary;

export const t = (key: TranslationKey): string => {
  const locale = useAuthStore.getState().user.locale;
  return dictionaries[locale][key] ?? ru[key] ?? key;
};
