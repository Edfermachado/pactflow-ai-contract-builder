"use client";

import * as React from "react";
import { Toaster } from "./use-toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      {children}
      <Toaster />
    </React.Fragment>
  );
}