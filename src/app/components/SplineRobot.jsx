"use client";

import { useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineRobot({ className = "", style = {} }) {
  return (
    <div
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    >
      <Spline scene="https://prod.spline.design/FVWhrgXbZnxB9lHz/scene.splinecode" />
    </div>
  );
}
