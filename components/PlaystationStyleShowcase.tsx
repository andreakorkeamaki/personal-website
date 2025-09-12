"use client";
import React from "react";
import DesktopShowcase from "./showcase/DesktopShowcase";
import MobileShowcase from "./showcase/MobileShowcase";
import { ShowcaseProps } from "./showcase/shared";

export default function PlaystationStyleShowcase(props: ShowcaseProps) {
  return (
    <>
      <div className="hidden md:block">
        <DesktopShowcase {...props} />
      </div>
      <div className="block md:hidden">
        <MobileShowcase {...props} />
      </div>
    </>
  );
}

