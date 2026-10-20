import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import type { ReactNode } from "react";

export interface CanopBulletListItem {
  key: string;
  content: ReactNode;
  action?: ReactNode;
}

export interface CanopBulletListProps {
  items: CanopBulletListItem[];
}

export function BulletList({ items }: CanopBulletListProps) {
  return (
    <Box
      component="ul"
      sx={{
        padding: "0",
        margin: "0",
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        listStyle: "none",
      }}
    >
      {items.map((item) => (
        <Box
          component="li"
          key={item.key}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Box
            sx={[
              {
                width: "0.4375rem",
                height: "0.4375rem",
                bgcolor: "primary.main",
                flexShrink: 0,
              },
              squircleClip("50%", { shape: "circle" }),
            ]}
          />
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            {item.content}
          </Box>
          {item.action ? (
            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              {item.action}
            </Box>
          ) : null}
        </Box>
      ))}
    </Box>
  );
}
