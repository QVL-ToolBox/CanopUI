export interface CanopAutocompleteOption {
  value: string;
  label?: string;
}

export interface CanopAutocompleteProps {
  /** Libellés uniques une fois passés par `normalize` : seul le premier homonyme est retenu. */
  options: readonly CanopAutocompleteOption[];
  /** Valeur retenue, ou chaîne vide quand rien n'est choisi. */
  value: string;
  /** Reçoit la `value` de l'option retenue, jamais son libellé. */
  onChange: (value: string) => void;
  /** Texte saisi, quand l'appelant veut le tenir lui-même. */
  inputValue?: string;
  onInputChange?: (text: string) => void;
  label?: string;
  /** Nom accessible explicite, pour un champ sans libellé visible. */
  ariaLabel?: string;
  placeholder?: string;
  /**
   * Accepte une saisie qui ne figure pas dans la liste : `onChange` reçoit
   * alors le texte brut à chaque frappe.
   *
   * Par défaut non : une saisie hors liste donne `onChange("")`, et le champ
   * reprend le libellé de la valeur retenue en perdant le focus.
   */
  allowFreeText?: boolean;
  /** @deprecated Sans effet : la suggestion s'affiche en ligne, il n'y a plus de liste. */
  maxSuggestions?: number;
  /**
   * Ce qu'on compare, des deux côtés : la saisie et le libellé de chaque
   * option passent par cette fonction avant d'être confrontés, pour choisir
   * la suggestion comme pour reconnaître une saisie exacte.
   *
   * Par défaut `foldForSearch`, qui retire accents, casse et séparateurs :
   * « cote d » propose « Côte-d'Or ». La remplacer permet d'ajouter un alias
   * métier : `normalize={(texte) => foldForSearch(texte).replace(/\bst\b/g, "saint")}`.
   */
  normalize?: (text: string) => string;
  /**
   * Vide le champ dès qu'une option est retenue, pour une saisie répétée.
   * Seules les options retenues sont alors transmises à `onChange`.
   *
   * Une saisie exacte n'est retenue tout de suite que si aucun autre libellé
   * ne la prolonge : « Loire » attend tant que « Loire-Atlantique » est
   * proposable, et n'est retenue qu'à l'acceptation d'une suggestion ou en
   * quittant le champ.
   */
  clearOnSelect?: boolean;
  helperText?: string;
  error?: string | null;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  size?: "small" | "medium";
}
