import type { CanopAutocompleteOption } from "@canop/ui";

export const DEPARTEMENTS: readonly CanopAutocompleteOption[] = [
  { value: "21", label: "Côte-d'Or" },
  { value: "22", label: "Côtes-d'Armor" },
  { value: "29", label: "Finistère" },
  { value: "75", label: "Paris" },
  { value: "13", label: "Bouches-du-Rhône" },
  { value: "06", label: "Alpes-Maritimes" },
  { value: "2A", label: "Corse-du-Sud" },
  { value: "68", label: "Haut-Rhin" },
  { value: "42", label: "Loire" },
  { value: "44", label: "Loire-Atlantique" },
  { value: "43", label: "Haute-Loire" },
  { value: "93", label: "Seine-Saint-Denis" },
  { value: "59", label: "Nord" },
  { value: "69", label: "Rhône" },
  { value: "31", label: "Haute-Garonne" },
  { value: "33", label: "Gironde" },
];

export const VILLES: readonly CanopAutocompleteOption[] = [
  { value: "75056", label: "Paris" },
  { value: "64445", label: "Pau" },
  { value: "66136", label: "Perpignan" },
  { value: "69123", label: "Lyon" },
  { value: "59350", label: "Lille" },
  { value: "87085", label: "Limoges" },
  { value: "13055", label: "Marseille" },
  { value: "34172", label: "Montpellier" },
  { value: "57463", label: "Metz" },
  { value: "42218", label: "Saint-Étienne" },
  { value: "35288", label: "Saint-Malo" },
  { value: "74010", label: "Annecy" },
  { value: "49007", label: "Angers" },
  { value: "13001", label: "Aix-en-Provence" },
  { value: "69081", label: "Écully" },
  { value: "33063", label: "Bordeaux" },
  { value: "29019", label: "Brest" },
  { value: "67482", label: "Strasbourg" },
];

export function labelOfDepartement(code: string): string {
  return DEPARTEMENTS.find((option) => option.value === code)?.label ?? code;
}
