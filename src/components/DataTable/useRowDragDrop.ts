import { useState, type DragEvent } from "react";

export interface CanopRowDragHandlers {
  onDragStart?: (event: DragEvent<HTMLTableRowElement>) => void;
  onDragOver?: (event: DragEvent<HTMLTableRowElement>) => void;
  onDragLeave?: () => void;
  onDrop?: (event: DragEvent<HTMLTableRowElement>) => void;
}

export interface CanopRowDragState {
  isDraggable: boolean;
  isDragOver: boolean;
  handlers: CanopRowDragHandlers;
}

export interface UseRowDragDropParams<T> {
  draggableRow?: (row: T) => boolean;
  canDropRow?: (row: T) => boolean;
  onRowDrop?: (target: T, draggedKey: string) => void;
}

export interface UseRowDragDropResult<T> {
  rowDragState: (row: T, key: string) => CanopRowDragState;
}

const draggedKeyFormat = "text/plain";

export function useRowDragDrop<T>({
  draggableRow,
  canDropRow,
  onRowDrop,
}: UseRowDragDropParams<T>): UseRowDragDropResult<T> {
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const rowDragState = (row: T, key: string): CanopRowDragState => {
    const isDraggable = draggableRow?.(row) ?? false;
    const isDropTarget = canDropRow?.(row) ?? false;

    return {
      isDraggable,
      isDragOver: isDropTarget && dragOverKey === key,
      handlers: {
        onDragStart: isDraggable
          ? (event) => {
              event.dataTransfer.setData(draggedKeyFormat, key);
              event.dataTransfer.effectAllowed = "move";
            }
          : undefined,
        onDragOver: isDropTarget
          ? (event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              if (dragOverKey !== key) setDragOverKey(key);
            }
          : undefined,
        onDragLeave: isDropTarget
          ? () => setDragOverKey((current) => (current === key ? null : current))
          : undefined,
        onDrop: isDropTarget
          ? (event) => {
              event.preventDefault();
              const draggedKey = event.dataTransfer.getData(draggedKeyFormat);
              setDragOverKey(null);
              if (draggedKey && draggedKey !== key) onRowDrop?.(row, draggedKey);
            }
          : undefined,
      },
    };
  };

  return { rowDragState };
}
