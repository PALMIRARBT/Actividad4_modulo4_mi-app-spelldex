import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ClassGrid } from "src/components/class-grid";
import { SpellDiagram } from "src/components/spell-diagram";
import type { ClassId } from "src/models/character-class";
import styles from "../app.module.css";

export function Home() {
  const [highlightedClass, setHighlightedClass] = useState<ClassId>();
  const navigate = useNavigate();

  function handleClassClick(classId: ClassId) {
    navigate(`/${classId}`);
  }

  return (
    <>
      <SpellDiagram highlightedClass={highlightedClass} selectedClass={undefined} background={true} />
      <ClassGrid
        highlight={setHighlightedClass}
        onClick={(c) => c && handleClassClick(c)}
        background={true}
      />
    </>
  );
}
