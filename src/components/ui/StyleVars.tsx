"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";

// Carries the active theme's CSS custom properties (from themeCssVars) down
// the React tree. Because React context crosses createPortal boundaries, this
// lets portaled overlays (Dialog, Toast) re-apply the same vars to their own
// detached DOM roots so they stay on-theme.
const StyleVarsContext = createContext<CSSProperties | undefined>(undefined);

export function useStyleVars(): CSSProperties | undefined {
  return useContext(StyleVarsContext);
}

export function StyleVarsProvider({
  vars,
  children,
}: {
  vars: CSSProperties;
  children: ReactNode;
}) {
  return <StyleVarsContext.Provider value={vars}>{children}</StyleVarsContext.Provider>;
}
