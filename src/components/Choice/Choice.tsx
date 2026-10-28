import { useTranslation } from "../../i18n";
import { Icon } from "../Icon";
import { Pressable, type CanopPressableSpacing } from "../Pressable";
import { Stack } from "../Stack";
import type { ReactNode } from "react";

/**
 * Ce que devient une réponse une fois la question tranchée.
 *
 * `correct` désigne **la** bonne réponse, qu'elle ait été choisie ou non :
 * c'est ce qui permet de la révéler après une erreur. `incorrect` désigne
 * celle qui a été choisie à tort.
 */
export type CanopChoiceState = "neutral" | "correct" | "incorrect";

export interface CanopChoiceProps {
  children: ReactNode;
  onClick?: () => void;
  state?: CanopChoiceState;
  disabled?: boolean;
  fullWidth?: boolean;
  padding?: CanopPressableSpacing;
  /** Nom accessible explicite, si le contenu ne suffit pas. */
  ariaLabel?: string;
}

const TINT_KEEPING_THEME_TEXT_CONTRAST: Record<Exclude<CanopChoiceState, "neutral">, string> = {
  correct:
    "color-mix(in srgb, var(--canop-palette-success-main) 8%, var(--canop-palette-background-paper))",
  incorrect:
    "color-mix(in srgb, var(--canop-palette-error-main) 8%, var(--canop-palette-background-paper))",
};

const MARK = {
  correct: { icon: "check", color: "success", key: "canop.choice.correct" },
  incorrect: { icon: "close", color: "error", key: "canop.choice.incorrect" },
} as const;

/**
 * Une réponse proposée, qui sait dire si elle était la bonne.
 *
 * `Pressable` apporte déjà la forme et le clavier, mais
 * n'a pas d'état juste ou faux — or c'est l'interaction la plus fréquente d'un
 * questionnaire, et chaque application la redessinait à coups de classes CSS.
 *
 * L'état n'est **pas porté par la seule couleur** : une marque cochée ou
 * barrée apparaît, et elle est nommée. Un daltonien, ou quelqu'un qui écoute
 * la page, sait donc lui aussi ce qui vient d'être répondu.
 */
export function Choice({
  children,
  onClick,
  state = "neutral",
  disabled = false,
  fullWidth = true,
  padding = "md",
  ariaLabel,
}: CanopChoiceProps) {
  const { t } = useTranslation();
  const mark = state === "neutral" ? null : MARK[state];
  const isAnswerSettled = state !== "neutral";

  return (
    <Pressable
      onClick={onClick}
      disabled={disabled}
      dimWhenDisabled={!isAnswerSettled}
      fullWidth={fullWidth}
      padding={padding}
      background={state === "neutral" ? undefined : TINT_KEEPING_THEME_TEXT_CONTRAST[state]}
      ariaLabel={ariaLabel}
    >
      <Stack direction="row" gap="sm" alignItems="center" justifyContent="space-between">
        {children}
        {mark && (
          <Icon name={mark.icon} variant="solid" size="sm" color={mark.color} title={t(mark.key)} />
        )}
      </Stack>
    </Pressable>
  );
}
