import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./app.module.css";
import { Home } from "./components/home";
import { ClassView } from "./components/class-view";
import { DangerEndScreen } from "src/components/danger-end-screen";
import { PositiveEndScreen } from "src/components/positive-end-screen";

export function App() {
  return (
    <BrowserRouter>
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path=":classId" element={<ClassView />} />
          <Route path="/danger" element={<DangerEndScreen />} />
          <Route path="/positive" element={<PositiveEndScreen />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}