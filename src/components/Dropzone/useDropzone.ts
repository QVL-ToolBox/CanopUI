import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";

interface UseDropzoneParams {
  disabled: boolean;
  multiple: boolean;
  onFiles: (files: File[]) => void;
}

interface DropzoneRootHandlers {
  onDragEnter: (event: DragEvent<HTMLElement>) => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDragLeave: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}

interface DropzoneInputHandlers {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface UseDropzoneResult {
  isDragging: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  openPicker: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  rootHandlers: DropzoneRootHandlers;
  inputHandlers: DropzoneInputHandlers;
}

function collectFiles(list: FileList | null, multiple: boolean): File[] {
  if (!list || list.length === 0) return [];
  const files = Array.from(list);
  return multiple ? files : files.slice(0, 1);
}

function hasExternalFiles(event: DragEvent<HTMLElement>): boolean {
  return event.dataTransfer.types.includes("Files");
}

export function useDropzone({ disabled, multiple, onFiles }: UseDropzoneParams): UseDropzoneResult {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPicker();
      }
    },
    [disabled, openPicker],
  );

  const onDragEnter = useCallback(
    (event: DragEvent<HTMLElement>) => {
      if (disabled || !hasExternalFiles(event)) return;
      event.preventDefault();
      dragDepth.current += 1;
      setIsDragging(true);
    },
    [disabled],
  );

  const onDragOver = useCallback(
    (event: DragEvent<HTMLElement>) => {
      if (disabled || !hasExternalFiles(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    [disabled],
  );

  const onDragLeave = useCallback((event: DragEvent<HTMLElement>) => {
    if (!hasExternalFiles(event)) return;
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      if (!hasExternalFiles(event)) return;
      event.preventDefault();
      dragDepth.current = 0;
      setIsDragging(false);
      if (disabled) return;
      const files = collectFiles(event.dataTransfer.files, multiple);
      if (files.length > 0) onFiles(files);
    },
    [disabled, multiple, onFiles],
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = collectFiles(event.target.files, multiple);
      if (files.length > 0) onFiles(files);
      event.target.value = "";
    },
    [multiple, onFiles],
  );

  return {
    isDragging,
    inputRef,
    openPicker,
    handleKeyDown,
    rootHandlers: { onDragEnter, onDragOver, onDragLeave, onDrop },
    inputHandlers: { onChange },
  };
}
