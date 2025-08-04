  function handleReturn() {
    navigate("/");
  }
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ClassGrid } from "src/components/class-grid";
import { SpellDiagram } from "src/components/spell-diagram";
import { DangerSpellModal } from "src/components/danger-spell-modal";
import type { ClassId } from "src/models/character-class";
import type { Spell } from "src/models/spell";
import styles from "../app.module.css";

export function ClassView() {
  const { classId } = useParams();
  const [highlightedClass, setHighlightedClass] = useState<ClassId>();
  const [dangerSpell, setDangerSpell] = useState<Spell | null>(null);
  const navigate = useNavigate();

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape" || event.key === "Backspace") {
      event.preventDefault();
      navigate("/");
    }
  }

  // Detecta spells de daño
  function isDangerSpell(spell: Spell) {
    return Array.isArray(spell.damage) && spell.damage.length > 0;
  }

  function handleSpellClick(spell: Spell) {
    if (isDangerSpell(spell)) {
      setDangerSpell(spell);
    } else {
      navigate("/positive", { state: { spellName: spell.name } });
    }
  }

  function handleCloseModal() {
    setDangerSpell(null);
  }

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} style={{ outline: "none" }}>
      <SpellDiagram
        highlightedClass={highlightedClass}
        selectedClass={classId as ClassId}
        background={false}
        onSpellClick={handleSpellClick}
      />
      <ClassGrid
        selectedClass={classId as ClassId}
        highlight={setHighlightedClass}
        onClick={() => undefined}
        background={false}
      />
      {dangerSpell && (
        <DangerSpellModal
          icon={dangerSpell.icon}
          name={dangerSpell.name}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
