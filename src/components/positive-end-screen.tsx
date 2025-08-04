import React, { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styles from "./positive-end-screen.module.css"
import angelImg from "../assets/icons/futuristic_angel_ascending.gif"

export function PositiveEndScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const bgRef = useRef<HTMLDivElement>(null)
  const spellName = location.state?.spellName as string | undefined

  useEffect(() => {
    // Accesibilidad: volver al inicio con Enter, Escape, Backspace
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === "Backspace") {
        e.preventDefault()
        navigate("/")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [navigate])

  function handleReturn() {
    navigate("/")
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className={styles.positiveEndScreenBg} ref={bgRef}></div>
      <div className={styles.positiveEndScreenContainer}>
        <img src={angelImg} alt="Celestial" className={styles.positiveEndImage} />
        <div className={styles.positiveEndTitle}>¡Has elegido sabiamente!</div>
        <div className={styles.positiveEndText}>
          {spellName && (
            <><strong>{spellName}</strong> no es peligroso.<br /></>
          )}
          Tu camino sigue iluminado.<br />¡Sigue explorando la magia!
        </div>
        <button
          type="button"
          onClick={handleReturn}
          style={{
            background: "#fff",
            color: "#3a7bd5",
            border: "2px solid #3a7bd5",
            borderRadius: "8px",
            padding: "12px 32px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "24px",
            boxShadow: "0 0 16px #aee9f7"
          }}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleReturn()
            }
          }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
