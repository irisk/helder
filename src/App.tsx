import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Dekkingskaart } from "./pages/Dekkingskaart";
import { Over } from "./pages/Over";
import { Product } from "./pages/Product";

// SPA routing keeps no scroll position of its own; reset on navigation.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Over />} />
        <Route path="/over" element={<Over />} />
        <Route path="/dekkingskaart/:schoolId?" element={<Dekkingskaart />} />
        {/* old address, went out by email on 22 Sept, so it has to keep working */}
        <Route path="/dekkingsscan" element={<Navigate to="/dekkingskaart" replace />} />
        <Route path="/product" element={<Product />} />
        <Route path="*" element={<Over />} />
      </Routes>
    </>
  );
}
