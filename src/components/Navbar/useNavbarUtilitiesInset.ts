import { useTranslation } from "../../i18n";
import { NAVBAR_UTILITIES_FOOTPRINT } from "./navbarStyles";

export function useNavbarUtilitiesInset(hasActions: boolean): string {
  const { locales } = useTranslation();
  const languageSelectorRendered = locales.length >= 2;
  const occupied = hasActions || languageSelectorRendered;
  return occupied ? NAVBAR_UTILITIES_FOOTPRINT : "0rem";
}
