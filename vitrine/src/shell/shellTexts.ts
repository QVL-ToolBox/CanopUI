const fr = {
  brand: "CanopUI",
  home: "Accueil",
  catalog: "Tous les composants",
  searchLabel: "Rechercher dans la documentation",
  searchPlaceholder: "Rechercher un composant…",
  searchClear: "Effacer la recherche",
  searchResults: "Pages trouvées",
  searchEmpty: (query: string) => `Aucune page ne correspond à « ${query} ».`,
  searchFound: (count: number) => (count === 1 ? "1 page trouvée" : `${count} pages trouvées`),
  seasonOn: "Activer le thème Halloween",
  seasonOff: "Couper le thème Halloween",
};

const en: typeof fr = {
  brand: "CanopUI",
  home: "Home",
  catalog: "All components",
  searchLabel: "Search the documentation",
  searchPlaceholder: "Search components…",
  searchClear: "Clear search",
  searchResults: "Matching pages",
  searchEmpty: (query: string) => `No page matches “${query}”.`,
  searchFound: (count: number) => (count === 1 ? "1 page found" : `${count} pages found`),
  seasonOn: "Turn the Halloween theme on",
  seasonOff: "Turn the Halloween theme off",
};

export const shellTexts = { fr, en };

export type ShellTexts = typeof fr;
