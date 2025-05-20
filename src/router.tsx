import { Routes, Route, useLocation } from "react-router";
import NotFound from "./pages/not_found";
import { AnimatePresence } from "motion/react";
import OSSimulator from "./pages/simulator";

export default function Router() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.key}>
        <Route index element={<OSSimulator />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
