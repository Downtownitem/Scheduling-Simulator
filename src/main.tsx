import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router.tsx";
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from "react-router";

const container = document.getElementById("root");
if (!container) throw new Error("Could not find root element with id 'root'");

createRoot(container).render(
  <StrictMode>
    <HeroUIProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </HeroUIProvider>
  </StrictMode>
);
