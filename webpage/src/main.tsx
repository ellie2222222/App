import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.ts";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ThemeProvider>
        <CssBaseline /> {/* Normalize default browser styles */}
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
