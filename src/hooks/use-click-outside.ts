import { useEffect } from "react";

export function useClickOutsideEffect({
  ref,
  cb,
}: {
  ref: React.RefObject<HTMLElement | null>;
  cb: () => void;
}) {
  useEffect(() => {
    if (!ref.current) return;

    const clickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        cb();
      }
    };

    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [ref, cb]);
}
