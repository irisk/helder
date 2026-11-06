import { Route, Routes } from "react-router-dom";
import { Dekkingskaart } from "./pages/Dekkingskaart";

export default function App() {
  return (
    <Routes>
      <Route path="/:schoolId?" element={<Dekkingskaart />} />
    </Routes>
  );
}
