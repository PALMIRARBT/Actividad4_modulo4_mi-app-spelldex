import React, { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./danger-end-screen.module.css"
import dangerIcon from "src/assets/icons/danger.png"

export function DangerEndScreen() {
  const particlesRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Generar partículas aleatorias
    const container = particlesRef.current
    if (container) {
      container.innerHTML = ""
      for (let i = 0; i < 18; i++) {
        const p = document.createElement("div")
        p.className = styles.particle
        p.style.left = `${Math.random() * 100}vw`
        p.style.top = `${Math.random() * 100}vh`
        p.style.width = `${16 + Math.random() * 32}px`
        p.style.height = p.style.width
        p.style.animationDuration = `${2 + Math.random() * 2}s`
        container.appendChild(p)
      }
    }
    // Listener de teclado para volver al inicio
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
      <div className={styles.dangerEndScreenBg} ref={particlesRef}></div>
      <div className={styles.dangerEndScreenContainer}>
        <img src={dangerIcon} alt="Danger" className={styles.dangerEndImage} />
        <div className={styles.dangerEndTitle}>¡Fin del juego!</div>
        <div className={styles.dangerEndText}>
          Has activado un hechizo peligroso.<br />El juego termina aquí.<br />¿Te atreves a intentarlo de nuevo?
        </div>
        <button
          type="button"
          onClick={handleReturn}
          style={{
            background: "#fff",
            color: "#e53935",
            border: "2px solid #e53935",
            borderRadius: "8px",
            padding: "12px 32px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "24px",
            boxShadow: "0 0 16px #e53935"
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
