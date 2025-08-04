import c from "classnames";
import { useEffect, useMemo, useState } from "react";
import upcastIcon from "src/assets/icons/other/upcast.png";
import { Tooltip } from "./tooltip";
import type { Spell } from "src/models/spell";
import styles from "./spell.module.css";

export function Spell(props: { spell: Spell; highlighted?: boolean; detailed?: boolean; focusable?: boolean; onClick?: () => void; danger?: boolean }) {
  const { spell, highlighted, detailed, focusable = true, onClick, danger } = props;
  const [imageError, setImageError] = useState(false);
  const [selected, setSelected] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const randomDuration = useMemo(() => (Math.random() + 0.5).toFixed(2), []);
  const randomDelay = useMemo(() => (Math.random() * 2 + 1).toFixed(2), []);
  function handleClick() {
    if (!detailed) return;
    setSelected(!selected);
  }

  const animatedSpellStyles = {
    "--randomDelay": randomDelay + "s",
    "--randomDuration": randomDuration + "s",
  } as React.CSSProperties;

  useEffect(() => {
    if (detailed) {
      const transitionTime = (parseFloat(randomDuration) + parseFloat(randomDelay)) * 1000;
      const timer = setTimeout(() => {
        setShowImage(true);
      }, transitionTime);
      return () => clearTimeout(timer);
    } else {
      setShowImage(false);
    }
  }, [detailed, randomDuration, randomDelay]);

  const hasIcon = spell && typeof spell.icon === "string" && spell.icon.trim() !== "" && spell.icon.trim() !== "." && (/\.(png|jpg|jpeg|svg|webp)$/i.test(spell.icon.trim()));

  // Si no hay icono válido o la imagen falló, renderiza como inactivo (punto gris, sin nombre, sin tooltip, sin foco ni click)
  if (!hasIcon || imageError) {
    return (
      <article
        className={c(
          styles.spell,
          styles.inactive,
          styles.dormant,
          highlighted && !detailed && styles.highlighted,
          detailed && styles.detailed,
          danger && styles.danger
        )}
        data-spell-id={spell.id}
        style={animatedSpellStyles}
        tabIndex={-1}
        aria-hidden="true"
      />
    );
  }

  // Render normal con tooltip y nombre solo si la imagen es válida y se muestra
  const showTooltip = detailed && showImage && hasIcon && !imageError;
  const articleContent = (
    <article
      className={c(
        styles.spell,
        highlighted && !detailed && styles.highlighted,
        detailed && styles.detailed,
        detailed && selected && styles.selected,
        danger && styles.danger
      )}
      data-spell-id={spell.id}
      style={animatedSpellStyles}
      onClick={onClick ? onClick : (detailed ? handleClick : undefined)}
      tabIndex={detailed && focusable ? 0 : -1}
    >
      {showTooltip && (
        <div className={styles.image}>
          <img
            src={spell.icon}
            alt={spell.name}
            className={styles.icon}
            onError={() => setImageError(true)}
          />
          {spell.upcast && (
            <img src={upcastIcon} alt="upcast" className={styles.upcast} />
          )}
        </div>
      )}
    </article>
  );

  return showTooltip ? <Tooltip text={spell.name}>{articleContent}</Tooltip> : articleContent;
}