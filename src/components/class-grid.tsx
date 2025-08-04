import c from "classnames";
import classesJson from "src/data/classes.json";

import { ClassGridItem } from "./class-item";
import { useRef } from "react";

import type { CharacterClass, ClassId } from "src/models/character-class";

import styles from "./class-grid.module.css";

type Props = {
  selectedClass?: ClassId;
  background?: boolean;
  onClick: (c: ClassId | undefined) => void;
  highlight: (c: ClassId | undefined) => void;
};

const classes = classesJson as CharacterClass[];

const KEYBOARD_KEYS = [
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
  "Escape",
  "Backspace",
  "Tab",
];

export function ClassGrid({
  selectedClass,
  background,
  highlight,
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const itemButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items = selectedClass
    ? classes.filter((cls) => cls.slug === selectedClass)
    : classes;

  const currentHighlight = () => {
    return selectedClass
      ? items.findIndex((cls) => cls.slug === selectedClass)
      : Array.from(itemButtonRefs.current).findIndex(
          (ref) => ref === document.activeElement
        );
  };

  const keyDown = (event: React.KeyboardEvent) => {
    if (!KEYBOARD_KEYS.includes(event.key)) {
      return;
    }

    // Permitir ESC y Backspace en cualquier momento
    if (event.key === "Escape" || event.key === "Backspace") {
      event.preventDefault();
      onClick(undefined);
      return;
    }

    // El resto solo si el foco está en un classCell
    if (!document.activeElement?.classList.contains(styles.classCell)) {
      return;
    }

    const currentIndex = currentHighlight();
    if (currentIndex < 0) {
      return;
    }

    let nextIndex = currentIndex;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = Math.min(items.length - 1, currentIndex + 1);
        event.preventDefault();
        itemButtonRefs.current[nextIndex]?.focus();
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = Math.max(0, currentIndex - 1);
        event.preventDefault();
        itemButtonRefs.current[nextIndex]?.focus();
        break;
      case "Tab":
        if (!event.shiftKey) {
          nextIndex = (currentIndex + 1) % items.length;
        } else {
          nextIndex = (currentIndex - 1 + items.length) % items.length;
        }
        event.preventDefault();
        itemButtonRefs.current[nextIndex]?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <section
      ref={ref}
      className={c(styles.classGrid, background && styles.background)}
      aria-label="Class Grid"
      onKeyDown={keyDown}
      role="grid"
    >
      {items.map((cls, index) => (
        <ClassGridItem
          key={cls.slug}
          name={cls.name}
          classId={cls.slug}
          selected={selectedClass === cls.slug}
          highlight={highlight}
          onClick={() => onClick(cls.slug)}
          ref={(el) => {
            if (el) {
              itemButtonRefs.current[index] = el;
              if (selectedClass === cls.slug) {
                el.focus();
              }
            } else {
              itemButtonRefs.current[index] = null;
            }

            return () => {
              itemButtonRefs.current[index] = null;
            };
          }}
        />
      ))}
    </section>
  );
}
