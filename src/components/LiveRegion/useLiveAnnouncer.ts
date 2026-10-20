import { useCallback, useState } from "react";

export interface UseLiveAnnouncerResult {
  message: string;
  announcementId: number;
  announce: (message: string) => void;
}

interface Announcement {
  message: string;
  id: number;
}

const SILENCE: Announcement = { message: "", id: 0 };

export function useLiveAnnouncer(): UseLiveAnnouncerResult {
  const [announcement, setAnnouncement] = useState<Announcement>(SILENCE);

  const announce = useCallback((message: string) => {
    setAnnouncement((previous) => ({ message, id: previous.id + 1 }));
  }, []);

  return { message: announcement.message, announcementId: announcement.id, announce };
}
