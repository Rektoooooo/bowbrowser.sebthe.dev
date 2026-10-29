import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./index.css";
import App from "./App";
import { Demo } from "./Demo";

const demo = import.meta.env.DEV ? new URLSearchParams(location.search).get("demo") : null;

createRoot(document.getElementById("root")!).render(<StrictMode>{demo ? <Demo name={demo} /> : <App />}</StrictMode>);
