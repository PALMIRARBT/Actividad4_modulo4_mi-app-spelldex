import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./danger-spell-modal.module.css";
 
export type DangerSpellModalProps = {
  icon: string;
  name: string;
  onClose: () => void;
};

export function DangerSpellModal(props: DangerSpellModalProps) {
  const { icon, name, onClose } = props;
  const navigate = useNavigate();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleContinue() {
    navigate("/danger");
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <img src={icon} alt={name} className={styles.icon} />
        <div className={styles.name}>{name}</div>
        <div className={styles.alert}>¡Hechizo peligroso!</div>
        <button className={styles.close} onClick={onClose}>Cerrar</button>
        <button className={styles.continue} onClick={handleContinue}>Continuar</button>
        {/* La imagen danger.png ahora se muestra en la pantalla /danger */}
      </div>
    </div>
  );
}
