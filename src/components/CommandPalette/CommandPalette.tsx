import Dialog from "@mui/material/Dialog";
import { useId } from "react";
import { useTranslation } from "../../i18n";
import { tokens } from "../../tokens";
import { squircleClip } from "../../squircle";
import { CommandPaletteInput } from "./CommandPaletteInput";
import { CommandPaletteList } from "./CommandPaletteList";
import type { CanopCommandPaletteProps } from "./commandPaletteTypes";
import { useCommandPaletteController } from "./useCommandPaletteController";

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder,
  emptyLabel,
  onSelect,
}: CanopCommandPaletteProps) {
  const { t } = useTranslation();
  const listboxId = `${useId()}-listbox`;
  const resolvedPlaceholder = placeholder ?? t("canop.commandPalette.placeholder");
  const {
    query,
    setQuery,
    groups,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    select,
    optionId,
    activeDescendant,
  } = useCommandPaletteController({ open, items, onClose, onSelect });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      sx={{ "& .MuiDialog-container": { alignItems: "flex-start" } }}
      slotProps={{
        paper: {
          "aria-label": t("canop.commandPalette.dialogLabel"),
          "aria-labelledby": undefined,
          sx: {
            mt: { xs: tokens.spacing.md, sm: tokens.spacing["4xl"] },
            mx: tokens.spacing.md,
            width: { xs: "calc(100% - 2rem)", sm: "40rem" },
            maxWidth: "40rem",
            ...squircleClip("var(--canop-radius-xl)"),
            backgroundColor: (theme) => theme.palette.surface.raised,
            filter: "var(--canop-drop-shadow-e4)",
            overflow: "hidden",
          },
        },
        backdrop: {
          sx: { backdropFilter: "blur(0.25rem)" },
        },
      }}
    >
      <CommandPaletteInput
        value={query}
        placeholder={resolvedPlaceholder}
        ariaLabel={resolvedPlaceholder}
        listboxId={listboxId}
        expanded={groups.length > 0}
        activeDescendant={activeDescendant}
        onChange={setQuery}
        onKeyDown={handleKeyDown}
      />
      <CommandPaletteList
        id={listboxId}
        groups={groups}
        activeIndex={activeIndex}
        emptyLabel={emptyLabel ?? t("canop.commandPalette.empty")}
        optionId={optionId}
        onHighlight={setActiveIndex}
        onSelect={select}
      />
    </Dialog>
  );
}
