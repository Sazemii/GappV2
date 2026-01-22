"use client";

import { useEffect, useRef } from "react";

export default function LedMatrix({
  shapeType = "Square", // "Square" or "Circle"
  size = 10,
  gap = 2,
  primaryColor = "#000000",
  secondaryColor = "rgb(229, 231, 235)", // Light grey slots
  probability = 4, // Percentage of accent color dots
  animSpeed = 90, // Animation speed (1-100)
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let shapes = [];
    let animationFrameId;

    const getColor = () =>
      Math.random() < probability / 100 ? primaryColor : secondaryColor;

    // Adjust canvas size for sharp rendering
    const adjustCanvasSize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    // Initialize shapes with random timing
    const initialize = (width, height) => {
      const newShapes = [];
      for (let y = 0; y < height; y += size + gap) {
        for (let x = 0; x < width; x += size + gap) {
          newShapes.push({
            x,
            y,
            delay: Math.random() * (-99.9 * animSpeed + 10099.9),
            duration: Math.random() * (-99.9 * animSpeed + 10099.9),
            startTime: performance.now() + Math.random() * 5000,
            color: getColor(),
            shapeType,
            radius: size / 2,
          });
        }
      }
      return newShapes;
    };

    // Draw shapes on canvas
    const draw = () => {
      const currentTime = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((shape) => {
        const timeElapsed = currentTime - shape.startTime;

        // Reset and get new color when animation cycle completes
        if (timeElapsed > shape.delay + shape.duration) {
          shape.startTime = currentTime + shape.delay;
          shape.color = getColor();
        }

        ctx.fillStyle = shape.color;

        ctx.fillRect(shape.x, shape.y, size, size);
      });
    };

    // Render loop
    const render = () => {
      draw();
      animationFrameId = requestAnimationFrame(render);
    };

    // Handle resize
    const resizeObserver = new ResizeObserver((entries) => {
      adjustCanvasSize();
      for (let entry of entries) {
        shapes = initialize(entry.contentRect.width, entry.contentRect.height);
      }
    });

    resizeObserver.observe(canvas);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      resizeObserver.unobserve(canvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    shapeType,
    size,
    gap,
    primaryColor,
    secondaryColor,
    probability,
    animSpeed,
  ]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {/* Fade overlay - fades from white at top to transparent at bottom */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "90%",
          background:
            "linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "30%",
          right: 0,
          background:
            "linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
