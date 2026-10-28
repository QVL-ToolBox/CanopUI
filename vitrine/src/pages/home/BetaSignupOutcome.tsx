import { Feedback, Presence, PresenceItem } from "@canop/ui";

export interface BetaSignupOutcomeProps {
  message: string | null;
}

export function BetaSignupOutcome({ message }: BetaSignupOutcomeProps) {
  return (
    <Presence mode="wait">
      {message === null ? null : (
        <PresenceItem key="sent">
          <Feedback severity="success">{message}</Feedback>
        </PresenceItem>
      )}
    </Presence>
  );
}
