# 🧙‍♂️ Renderizado de spells sin icono (puntos grises)

## Causa y solución del bug de nombre/tooltip en spells inactivos

**Problema detectado:**
Los spells sin icono válido o con imagen rota (punto gris) mostraban el nombre y el tooltip, lo que generaba confusión y problemas de accesibilidad.

**Causa raíz:**
- El renderizado del nombre y el tooltip dependía solo de la validez del icono (`hasIcon`), pero no del estado real de la imagen ni del modo de visualización.
- Si la imagen no existía o fallaba al cargar, el estado `imageError` solo se activaba si el componente intentaba mostrar la imagen. En otros modos, el nombre seguía apareciendo.

**Solución aplicada:**
- Se añadió la variable `showTooltip`, que solo es verdadera si:
  - El spell está en modo detallado (`detailed`)
  - La imagen se intentó mostrar (`showImage`)
  - El icono es válido (`hasIcon`)
  - La imagen no falló al cargar (`!imageError`)
- El nombre y el tooltip solo se renderizan si `showTooltip` es verdadero.
- Así, los spells sin imagen o con imagen rota nunca muestran nombre ni tooltip, y los puntos grises son realmente inactivos.

**Resumen lógico:**
- El renderizado del nombre y el tooltip debe depender no solo de la validez del icono, sino también del estado de la imagen y del modo de visualización.
- La verificación estricta de todos estos estados evita que los spells inactivos (punto gris) muestren información innecesaria.

**Pseudocódigo de la lógica:**

```ts
if (!hasIcon || imageError) {
  // Renderiza solo el punto gris, sin nombre ni tooltip
}
else {
  // Renderiza nombre y tooltip solo si showTooltip es true
  // showTooltip = detailed && showImage && hasIcon && !imageError
}
```

**Recomendación:**
Si en el futuro se modifica el renderizado de spells, asegúrate de condicionar el nombre y el tooltip a la lógica de `showTooltip` para mantener la accesibilidad y la experiencia de usuario.
# BG3 Spell List

## Refactorización: Navegación por rutas

La aplicación ahora utiliza React Router para navegar entre vistas:


### Pasos para implementar rutas

1. Instala React Router:
   ```powershell
   npm install react-router-dom
   ```
2. Refactoriza `src/app.tsx` para definir las rutas principales.
3. Crea los componentes `src/components/home.tsx` y `src/components/class-view.tsx`.
4. La funcionalidad y el comportamiento de cada vista se mantienen igual, solo cambia la estructura de navegación.

Al hacer clic en una clase, se navega automáticamente a la ruta correspondiente, manteniendo la funcionalidad original.

## Navegación con teclado

- En la pantalla principal y en la vista de clase, puedes navegar entre los ítems usando las flechas y la tecla TAB.
- En la vista de clase, la tecla ESC o Backspace te devuelve a la pantalla principal, sin importar dónde esté el foco.
- Esta funcionalidad se implementa en la función `keyDown` dentro de `src/components/class-grid.tsx` y en la función `handleKeyDown` dentro de `src/components/class-view.tsx`.

## Tooltips en spells

## Spells inactivos (sin icono)

Los spells que no tienen icono se renderizan como elementos inactivos: no son focusables, no responden a TAB, flechas ni clic, y no muestran tooltip.
Esto se logra con la siguiente fracción de código en `src/components/spell.tsx`:

```tsx
const hasIcon = typeof spell.icon === "string" && spell.icon.trim() !== "";

if (!hasIcon) {
  // Render como elemento inactivo, sin tabindex, sin onClick, sin tooltip
  return (
    <article
      className={c(
        styles.spell,
        styles.inactive,
        highlighted && !detailed && styles.highlighted,
        detailed && styles.detailed,
      )}
      data-spell-id={spell.id}
      style={animatedSpellStyles}
      aria-label={spell.name}
      aria-detailed={detailed ? "true" : "false"}
      tabIndex={-1}
    >
      {/* No imagen, no interacción */}
    </article>
  );
}
```

Y el siguiente estilo en `src/components/spell.module.css`:

```css
.inactive {
  opacity: 0.3;
  filter: grayscale(100%);
  pointer-events: none;
  cursor: default;
}
```

- Al hacer hover sobre cada hechizo en la vista detallada de clase, se muestra un tooltip con el nombre del hechizo **solo si el hechizo tiene un icono válido**.
- Solo los spells con icono son focusables y navegables con TAB en la vista detallada de clase.
- Esta funcionalidad se implementa usando el componente `Tooltip` en `src/components/tooltip.tsx` y se integra en cada spell en `src/components/spell.tsx` y `src/components/spell-diagram.tsx`.
- El bug que permitía mostrar tooltips en spells sin icono fue corregido verificando que `spell.icon` sea una string no vacía.

---

## Nueva funcionalidad: Resaltado y modal para spells de daño

Se agregó una nueva funcionalidad que resalta los spells de daño en la vista de clase y muestra un modal especial al hacer click sobre ellos. Esta mejora utiliza el componente `DangerSpellModal`.

- Los spells que tienen daño se identifican automáticamente.
- Al hacer click en un spell de daño, se muestra un modal con el icono grande, el nombre y una alerta visual.
- El modal se puede cerrar con el botón o presionando Escape.
- El resaltado y el modal solo afectan la vista de clase, sin modificar la lógica original de los spells normales.

**Componentes involucrados:**
- `DangerSpellModal`: Modal visual para spells peligrosos.
- `ClassView` y `SpellDiagram`: Integración y lógica de activación.

**Motivación:**
- Mejorar la experiencia visual y la accesibilidad para identificar spells peligrosos.
- Mantener la lógica original modular y no invasiva.

---

## Lógica y funcionamiento de spells de daño y DangerSpellModal

**¿Dónde están los spells de daño?**
- Los datos de todos los spells se encuentran en `src/data/spells.json`.
- Cada spell tiene una propiedad `damage` (arreglo). Si el arreglo tiene elementos, ese spell es considerado de daño (por ejemplo, fire, acid, thorn, etc.).

**¿Cómo funciona la detección y el modal?**
- En la vista de clase (`ClassView`), al hacer click en un spell, se verifica si tiene daño:
  - Si `spell.damage.length > 0`, se considera peligroso.
  - Se muestra el componente `DangerSpellModal` como overlay, mostrando el icono grande, el nombre y una alerta visual.
- El modal se puede cerrar con el botón o presionando Escape.
- Los spells normales no activan el modal y mantienen el despliegue original.

**Ventajas de la lógica modular:**
- El componente `DangerSpellModal` es reutilizable y fácil de personalizar.
- La lógica de activación está separada y no afecta el renderizado de spells normales.
- Facilita el mantenimiento y futuras extensiones.

**Ejemplo de lógica para detectar spells de daño:**
```ts
function isDangerSpell(spell) {
  return Array.isArray(spell.damage) && spell.damage.length > 0;
}
```

**Resumen:**
- Los spells de daño se identifican por la propiedad `damage` en el JSON.
- El modal de alerta se activa solo para spells peligrosos, mejorando la experiencia y accesibilidad.

---

## Pantalla positiva para spells no peligrosos

En la pantalla positiva (`/positive`), el usuario accede automáticamente al seleccionar un spell que no es peligroso (sin daño). Esta pantalla muestra un fondo celestial animado, una imagen especial y un mensaje positivo.

**Además, se muestra el nombre del spell positivo seleccionado para mayor contexto.**

### Accesibilidad y navegación por teclado en la pantalla positiva

En la pantalla positiva, el usuario puede regresar al inicio usando:
- Tecla **Enter** (en cualquier parte de la pantalla)
- Tecla **Escape**
- Tecla **Backspace**

Esto mantiene la experiencia de teclado consistente con el resto de la aplicación y mejora la accesibilidad para usuarios que prefieren navegar sin mouse.

---

## Accesibilidad y navegación por teclado en la pantalla final de peligro

En la pantalla final (`/danger`), el usuario puede regresar al inicio usando:
- Tecla **Enter** (en cualquier parte de la pantalla)
- Tecla **Escape**
- Tecla **Backspace**

Esto mantiene la experiencia de teclado consistente con el resto de la aplicación y mejora la accesibilidad para usuarios que prefieren navegar sin mouse.

---

