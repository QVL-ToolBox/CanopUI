import { describe, expect, expectTypeOf, it } from "vitest";
import type { ComponentProps } from "react";
import type {
  CanopBackgroundTone,
  CanopHalloweenDecorProps,
  CanopMainElement,
  CanopNavbarGroup,
  CanopNavbarItem,
  CanopNavbarTitleLevel,
  CanopResponsiveValue,
  CanopSeason,
  CanopTitleLevel,
} from "../index";
import * as canopUi from "../index";
import * as canopUiMap from "../map";
import * as canopUiVite from "../vite";
import { createRequire } from "node:module";

const rootExports = ["CANOP_VERSION"];

const tokenExports = [
  "tokens",
  "palette",
  "paletteDark",
  "paletteHalloween",
  "paletteHalloweenDark",
  "typography",
  "spacing",
  "radius",
  "shadows",
  "motion",
  "breakpoints",
  "shadowsLight",
  "shadowsDark",
  "dropShadowsLight",
  "dropShadowsDark",
  "squircle",
  "map",
  "scrollbar",
];

const squircleExports = [
  "superellipseCorner",
  "squircleClipPath",
  "squircleRingPath",
  "squirclePath",
  "resolveExponent",
  "insetRadius",
  "squircleClip",
  "squircleFill",
  "squircleRing",
  "squircleShadow",
  "squircleSurface",
  "useSquircleRadius",
  "SquircleDashedBorder",
  "scrollbarSx",
];

const colorExports = [
  "parseHexColor",
  "perceivedLuminance",
  "isLightColor",
  "contrastTextFor",
  "LIGHT_COLOR_THRESHOLD",
];

const interactionExports = ["hoverOrKeyboardFocus", "keyboardFocus", "withoutFocusRing"];

const breakpointExports = ["useBreakpoint", "useBreakpointDown", "useBreakpointUp"];

const themeExports = [
  "CanopThemeProvider",
  "useCanopTheme",
  "canopTheme",
  "createCanopTheme",
  "canopSeasonAt",
];

const neonGlowExports = ["glow", "glowFilter", "innerGlow", "NEON_GLOW_VAR", "useNeonGlow"];

const motionExports = [
  "useReducedMotion",
  "useEnterAnimation",
  "useStagger",
  "motionDurationSeconds",
  "motionEasing",
  "Presence",
  "PresenceItem",
];

const componentExports = [
  "AddButton",
  "ApproveButton",
  "Badge",
  "Breadcrumb",
  "BulletList",
  "Button",
  "Card",
  "CardGrid",
  "Carousel",
  "Checkbox",
  "CommandPalette",
  "CommandList",
  "CommandGroup",
  "CommandOption",
  "CommandEmpty",
  "ConfirmDialog",
  "Countdown",
  "DataTable",
  "DeleteButton",
  "DescriptionList",
  "Divider",
  "Donut",
  "Dropzone",
  "EditButton",
  "EmptyState",
  "Feedback",
  "FileCard",
  "Form",
  "HalloweenDecor",
  "Heading",
  "Icon",
  "IconActionButton",
  "icons",
  "InlineInput",
  "Input",
  "InputEmail",
  "InputPassword",
  "InputText",
  "LanguageSelector",
  "LegalLinks",
  "LEGAL_NOTICE_ANCHOR",
  "useMenuAnchor",
  "Layout",
  "Legend",
  "Lightbox",
  "Link",
  "Menu",
  "MenuItem",
  "MultiSelect",
  "Navbar",
  "CookieBanner",
  "SaveButton",
  "PageContent",
  "PageScaffold",
  "Pressable",
  "PasswordStrength",
  "ProgressBar",
  "Rating",
  "SegmentedControl",
  "Select",
  "SelectionBar",
  "Separator",
  "SettingsMenu",
  "ShapeBackground",
  "CanopyBackground",
  "SidePanel",
  "Slider",
  "Spinner",
  "Stack",
  "StatCard",
  "StatusChip",
  "Text",
  "ThemeToggle",
  "SoundToggle",
  "Lives",
  "Streak",
  "ShareResult",
  "Autocomplete",
  "foldForSearch",
  "Choice",
  "SvgMap",
  "SvgMapControls",
  "useSvgMapGestures",
  "Toast",
  "Toggle",
  "Toolbar",
  "useBreadcrumb",
  "useCarousel",
  "useCommandPalette",
  "useDonut",
  "useForm",
  "useInView",
  "useCookieConsent",
  "useSaveButton",
  "useSelectionBar",
  "useThemeToggle",
  "useSoundToggle",
  "useToolbar",
  "getStoredConsent",
  "DEFAULT_COOKIE_CONSENT_KEY",
  "CANOP_CANOPY_SCENES",
  "CAROUSEL_DEFAULT_INTERVAL",
  "CANOPY_ASSET_BASE",
  "CANOPY_LOOP_SECONDS",
  "canopyScenesFrom",
  "resolveCanopyScene",
];

const pageInsetExports = ["avoidPageTopRight", "reservePageTopRight", "resetPageInsets"];

const i18nExports = [
  "CanopI18nProvider",
  "useTranslation",
  "createTranslate",
  "apiErrorMessage",
  "interpolate",
  "canopBaseMessages",
  "canopErrorMessages",
];

const httpExports = [
  "CanopApiError",
  "createApiClient",
  "isUnauthorized",
  "isForbidden",
  "useAsyncResource",
];

const uploadExports = [
  "MEBIBYTE",
  "GIBIBYTE",
  "DEFAULT_CHUNK_SIZE",
  "SINGLE_SHOT_THRESHOLD",
  "MAX_DECLARED_SIZE",
  "DEFAULT_MAX_RETRIES_PER_CHUNK",
  "DEFAULT_RETRY_BASE_DELAY_MS",
  "selectStrategy",
  "planChunks",
  "countChunks",
  "firstMissingChunkIndex",
  "pendingChunks",
  "withRetry",
  "createUploadTransport",
  "createUploader",
  "fileUploadSource",
  "formatBytes",
  "useChunkedUpload",
  "UploadDropZone",
  "FileUploader",
  "defaultFileUploaderLabels",
];

const authExports = [
  "useLogout",
  "CurrentUserContext",
  "useCurrentUser",
  "CurrentUserProvider",
  "navigateTo",
  "buildLoginUrl",
  "buildCguUrl",
  "REDIRECT_INTENT_PARAM",
  "useRouteGuard",
  "RouteGuard",
  "createRouteGuard",
];

const validationExports = [
  "classifyUrl",
  "isSafeUrl",
  "EMAIL_REGEX",
  "NAME_REGEX",
  "PASSWORD_MIN_LENGTH",
  "PASSWORD_UPPERCASE_REGEX",
  "PASSWORD_LOWERCASE_REGEX",
  "PASSWORD_DIGIT_REGEX",
  "PASSWORD_SPECIAL_REGEX",
  "PASSWORD_CRITERIA",
  "passwordCriteriaState",
  "passwordStrength",
  "isValidEmail",
  "isValidName",
  "isValidPassword",
];

const soundExports = [
  "CanopSoundProvider",
  "CanopSoundContext",
  "useCanopSound",
  "createSoundEngine",
  "canopSoundNames",
  "canopSoundRecipes",
];

const storageExports = [
  "createLocalStore",
  "useLocalStore",
  "usePersistentState",
  "persistentStore",
  "clearPersistentStores",
];

const timeExports = ["useCountdown", "useTransientState"];

const clipboardExports = ["useCopyToClipboard"];

const svgMapExports = [
  "parseViewBox",
  "formatViewBox",
  "viewBoxAspect",
  "clampViewBox",
  "zoomViewBox",
  "panViewBox",
  "fitViewBox",
  "isZoomed",
  "useSvgMapViewport",
];

const bentoExports = ["BentoGrid", "BentoTile"];
const liquidGlassExports = [
  "liquidGlassBackground",
  "liquidGlassFallbackBackground",
  "liquidGlassBackdropFilter",
  "LiquidGlassLayers",
  "useRefractionFilter",
  "useRefractionSupport",
  "FROSTED_CARD_LIQUID_GLASS",
];
const primitiveExports = [
  "Avatar",
  "Skeleton",
  "ContentSkeleton",
  "SkeletonScope",
  "VisuallyHidden",
  "LiveRegion",
  "useLiveAnnouncer",
];

const expectedPublicApi = [
  ...rootExports,
  ...tokenExports,
  ...themeExports,
  ...neonGlowExports,
  ...motionExports,
  ...interactionExports,
  ...breakpointExports,
  ...colorExports,
  ...squircleExports,
  ...liquidGlassExports,
  ...componentExports,
  ...pageInsetExports,
  ...i18nExports,
  ...httpExports,
  ...uploadExports,
  ...authExports,
  ...validationExports,
  ...soundExports,
  ...storageExports,
  ...timeExports,
  ...clipboardExports,
  ...svgMapExports,
  ...bentoExports,
  ...primitiveExports,
].sort();

const actualPublicApi = Object.keys(canopUi).sort();

const expectedMapApi = [
  "Map",
  "buildCanopMapStyle",
  "canopMapPalette",
  "resolveMapTiles",
  "mapPoiClasses",
  "CANOP_MAP_TILES",
  "MAP_DEFAULT_ZOOM",
].sort();

const actualMapApi = Object.keys(canopUiMap).sort();

const expectedViteApi = ["canopyVideo", "CANOPY_VIDEO_DIRECTORY"].sort();

const actualViteApi = Object.keys(canopUiVite).sort();

const publicApiValues = new Map<string, unknown>(Object.entries(canopUi));

const mapApiValues = new Map<string, unknown>(Object.entries(canopUiMap));

const viteApiValues = new Map<string, unknown>(Object.entries(canopUiVite));

function absentFrom(names: readonly string[], reference: readonly string[]): string[] {
  const known = new Set(reference);
  return names.filter((name) => !known.has(name));
}

function undefinedAmong(names: readonly string[], values: ReadonlyMap<string, unknown>): string[] {
  return names.filter((name) => values.get(name) === undefined);
}

describe("surface publique de src/index.ts", () => {
  it("expose exactement les symboles de valeur figes", () => {
    expect({
      symbolesDisparus: absentFrom(expectedPublicApi, actualPublicApi),
      symbolesNonDeclares: absentFrom(actualPublicApi, expectedPublicApi),
    }).toEqual({ symbolesDisparus: [], symbolesNonDeclares: [] });
  });

  it("fige le nombre de symboles de valeur exposes", () => {
    expect(actualPublicApi).toHaveLength(expectedPublicApi.length);
  });

  it("ne declare aucun symbole en double dans la liste figee", () => {
    expect(new Set(expectedPublicApi).size).toBe(expectedPublicApi.length);
  });

  it("lie chaque symbole fige a une valeur definie", () => {
    expect({
      symbolesLiesAUndefined: undefinedAmong(expectedPublicApi, publicApiValues),
    }).toEqual({ symbolesLiesAUndefined: [] });
  });

  it("ne publie plus la recette neon par defaut ni ses variables, mais garde NEON_GLOW_VAR", () => {
    expect({
      recetteNeonPubliee: ["NEON_GLOW_DEFAULT_RECIPE", "neonGlowRecipeVariables"].filter((name) =>
        actualPublicApi.includes(name),
      ),
      neonGlowVarPublie: actualPublicApi.includes("NEON_GLOW_VAR"),
    }).toEqual({ recetteNeonPubliee: [], neonGlowVarPublie: true });
  });

  it("expose la grille bento et sa tuile comme composants", () => {
    expect({
      symbolesBentoAbsents: absentFrom(bentoExports, actualPublicApi),
      symbolesBentoNonFonctions: bentoExports.filter(
        (name) => typeof publicApiValues.get(name) !== "function",
      ),
    }).toEqual({ symbolesBentoAbsents: [], symbolesBentoNonFonctions: [] });
  });
});

describe("surface publique de src/map.ts", () => {
  it("expose exactement les symboles de valeur figes", () => {
    expect({
      symbolesDisparus: absentFrom(expectedMapApi, actualMapApi),
      symbolesNonDeclares: absentFrom(actualMapApi, expectedMapApi),
    }).toEqual({ symbolesDisparus: [], symbolesNonDeclares: [] });
  });

  it("fige le nombre de symboles de valeur exposes", () => {
    expect(actualMapApi).toHaveLength(expectedMapApi.length);
  });

  it("lie chaque symbole fige a une valeur definie", () => {
    expect({
      symbolesLiesAUndefined: undefinedAmong(expectedMapApi, mapApiValues),
    }).toEqual({ symbolesLiesAUndefined: [] });
  });
});

describe("surface publique de src/vite.ts", () => {
  it("expose exactement les symboles de valeur figes", () => {
    expect({
      symbolesDisparus: absentFrom(expectedViteApi, actualViteApi),
      symbolesNonDeclares: absentFrom(actualViteApi, expectedViteApi),
    }).toEqual({ symbolesDisparus: [], symbolesNonDeclares: [] });
  });

  it("lie chaque symbole fige a une valeur definie", () => {
    expect({
      symbolesLiesAUndefined: undefinedAmong(expectedViteApi, viteApiValues),
    }).toEqual({ symbolesLiesAUndefined: [] });
  });

  it("est declare dans les exports du paquet, sinon il est inatteignable", () => {
    const paquet = createRequire(import.meta.url)("../../package.json") as {
      exports: Record<string, unknown>;
    };

    expect(paquet.exports["./vite"]).toEqual({
      types: "./dist/vite.d.ts",
      import: "./dist/vite.js",
    });
  });
});

describe("surface publique des etats d'interaction", () => {
  it("expose les helpers de focus clavier comme valeurs definies", () => {
    expect({
      symbolesAbsents: absentFrom(interactionExports, actualPublicApi),
      symbolesLiesAUndefined: undefinedAmong(interactionExports, publicApiValues),
    }).toEqual({ symbolesAbsents: [], symbolesLiesAUndefined: [] });
  });
});

describe("types publics du theme saisonnier", () => {
  it("expose CanopSeason comme l'union des saisons connues", () => {
    expectTypeOf<CanopSeason>().toEqualTypeOf<"halloween">();
  });

  it("expose CanopHalloweenDecorProps comme les props de HalloweenDecor", () => {
    expectTypeOf<CanopHalloweenDecorProps>().toEqualTypeOf<
      ComponentProps<typeof canopUi.HalloweenDecor>
    >();
  });

  it("type la densite du decor en low ou medium", () => {
    expectTypeOf<NonNullable<CanopHalloweenDecorProps["density"]>>().toEqualTypeOf<
      "low" | "medium"
    >();
  });
});

describe("types publics des corrections de la lib", () => {
  it("expose CanopTitleLevel comme les niveaux 1 a 4 ou text", () => {
    expectTypeOf<CanopTitleLevel>().toEqualTypeOf<1 | 2 | 3 | 4 | "text">();
  });

  it("garde CanopNavbarTitleLevel comme alias de CanopTitleLevel", () => {
    expectTypeOf<CanopNavbarTitleLevel>().toEqualTypeOf<CanopTitleLevel>();
  });

  it("expose CanopMainElement comme main ou div", () => {
    expectTypeOf<CanopMainElement>().toEqualTypeOf<"main" | "div">();
  });

  it("expose CanopBackgroundTone comme primary ou accent", () => {
    expectTypeOf<CanopBackgroundTone>().toEqualTypeOf<"primary" | "accent">();
  });

  it("accepte une valeur simple ou par point de rupture dans CanopResponsiveValue", () => {
    expectTypeOf<"row">().toMatchTypeOf<CanopResponsiveValue<"row" | "column">>();
    expectTypeOf<{ xs: "column"; md: "row" }>().toMatchTypeOf<
      CanopResponsiveValue<"row" | "column">
    >();
  });

  it("expose CanopNavbarGroup comme un intertitre et ses items", () => {
    expectTypeOf<CanopNavbarGroup>().toEqualTypeOf<{ label: string; items: CanopNavbarItem[] }>();
  });

  it("exporte les composants de liste de palette comme des composants", () => {
    expect(
      ["CommandList", "CommandGroup", "CommandOption", "CommandEmpty"].filter(
        (name) => typeof publicApiValues.get(name) !== "function",
      ),
    ).toEqual([]);
  });

  it("exporte les helpers de reserve de page comme des fonctions", () => {
    expect(
      pageInsetExports.filter((name) => typeof publicApiValues.get(name) !== "function"),
    ).toEqual([]);
  });
});
