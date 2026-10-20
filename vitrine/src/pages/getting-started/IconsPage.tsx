import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Icon, Input, Stack, Toggle, type CanopIconName, type CanopIconVariant } from "@canop/ui";
import { useDocLocale } from "../../i18n/useDocLocale";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { useIconsGallery } from "./useIconsGallery";

const usageCode = `import { Icon } from "@canop/ui";

<Icon name="check" variant="solid" size="lg" color="success" />`;

const fr = {
  title: "Icônes",
  intro:
    "Le set d'icônes CanopUI, disponible en variantes outline et solid, cinq tailles et huit couleurs du thème. Cliquez sur une icône pour copier son code.",
  galleryTitle: "Galerie",
  searchLabel: "Rechercher une icône",
  searchPlaceholder: "check, user, folder…",
  solidLabel: "Variante solid",
  count: "icônes",
  copied: "Copié !",
};

const en: typeof fr = {
  title: "Icons",
  intro:
    "The CanopUI icon set, available in outline and solid variants, five sizes and eight theme colors. Click an icon to copy its code.",
  galleryTitle: "Gallery",
  searchLabel: "Search an icon",
  searchPlaceholder: "check, user, folder…",
  solidLabel: "Solid variant",
  count: "icons",
  copied: "Copied!",
};

const texts = { fr, en };

interface IconTileProps {
  name: CanopIconName;
  variant: CanopIconVariant;
  copied: boolean;
  copiedLabel: string;
  onCopy: (name: CanopIconName) => void;
}

function IconTile({ name, variant, copied, copiedLabel, onCopy }: IconTileProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onCopy(name)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        padding: "1rem 0.5rem",
        border: "0.0625rem solid",
        borderColor: copied ? "success.main" : "divider",
        borderRadius: "0.75rem",
        bgcolor: "background.paper",
        cursor: "pointer",
        transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), border-color 180ms ease",

        "@media (prefers-reduced-motion: no-preference)": {
          "&:hover": { transform: "translateY(-0.2rem)" },
        },
      }}
    >
      {copied ? (
        <Icon name="check" variant="solid" size="lg" color="success" />
      ) : (
        <Icon name={name} variant={variant} size="lg" />
      )}
      <Typography
        color={copied ? "success.main" : "text.secondary"}
        noWrap
        sx={{
          fontSize: "0.75rem",
        }}
      >
        {copied ? copiedLabel : name}
      </Typography>
    </Box>
  );
}

export function IconsPage() {
  const t = texts[useDocLocale()];
  const { search, setSearch, variant, solid, setSolid, names, copiedName, copyName } =
    useIconsGallery();

  return (
    <DocPage title={t.title} intro={t.intro} importCode={usageCode}>
      <DocSection title={t.galleryTitle}>
        <Stack direction="row" alignItems="center" gap="lg" wrap>
          <Box
            sx={{
              flex: 1,
              minWidth: "14rem",
            }}
          >
            <Input
              label={t.searchLabel}
              value={search}
              onChange={setSearch}
              icon="search"
              placeholder={t.searchPlaceholder}
            />
          </Box>
          <Toggle checked={solid} onChange={setSolid} ariaLabel={t.solidLabel} />
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            {solid ? "solid" : "outline"} · {names.length} {t.count}
          </Typography>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(7rem, 1fr))",
          }}
        >
          {names.map((name) => (
            <IconTile
              key={name}
              name={name}
              variant={variant}
              copied={copiedName === name}
              copiedLabel={t.copied}
              onCopy={copyName}
            />
          ))}
        </Box>
      </DocSection>
    </DocPage>
  );
}
