"use client";

import AssistantNavBridge from "../components/AssistantNavBridge";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AssistantNavBridge />
    </>
  );
}
