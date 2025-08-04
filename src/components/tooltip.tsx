import { useState } from "react";

import styles from "./tooltip.module.css";

export type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

export function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const showTooltip = typeof text === "string" && text.trim() !== "";
  return (
    <span
      className={styles.tooltipWrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
    >
      {children}
      {isVisible && showTooltip && (
        <span className={styles.tooltip}>{text}</span>
      )}
    </span>
  );
}
