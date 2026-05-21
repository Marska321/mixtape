import { useRef, useCallback } from "react";

export function useDraggable(onDrop?: (x: number, y: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const rotate = useRef<string>("");
  const dragging = useRef(false);
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  const getCoords = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e && e.touches.length > 0)
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    if ("changedTouches" in e && (e as TouchEvent).changedTouches.length > 0)
      return { clientX: (e as TouchEvent).changedTouches[0].clientX, clientY: (e as TouchEvent).changedTouches[0].clientY };
    return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
  };

  const onMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging.current || !ref.current) return;
    e.preventDefault();
    const { clientX, clientY } = getCoords(e);
    pos.current.x += clientX - pos.current.startX;
    pos.current.y += clientY - pos.current.startY;
    pos.current.startX = clientX;
    pos.current.startY = clientY;
    ref.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) ${rotate.current}`;
  }, []);

  const onEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd as EventListener);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd as EventListener);
    if (ref.current) {
      ref.current.style.cursor = "grab";
      // Restore z-index after drop (the component's own zIndex style will take over on re-render)
      ref.current.style.zIndex = "";
    }
    const { clientX, clientY } = getCoords(e);
    onDropRef.current?.(clientX, clientY);
  }, [onMove]);

  const onStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    const { clientX, clientY } = getCoords(e.nativeEvent as MouseEvent | TouchEvent);
    pos.current.startX = clientX;
    pos.current.startY = clientY;
    // Capture existing rotation so we can restore it during drag
    if (ref.current) {
      const existing = ref.current.style.transform;
      const rotMatch = existing.match(/rotate\([^)]+\)/);
      rotate.current = rotMatch ? rotMatch[0] : "";
      ref.current.style.cursor = "grabbing";
      // Lift above everything (Walkman is z-index 1002) so cassette appears on top while dragging
      ref.current.style.zIndex = "2000";
    }
    document.addEventListener("mousemove", onMove, { passive: false });
    document.addEventListener("mouseup", onEnd as EventListener);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd as EventListener);
  }, [onMove, onEnd]);

  return { ref, onStart };
}
