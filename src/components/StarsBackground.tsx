import { useEffect, useRef } from "react";

type Star = {
  alpha: number;
  size: number;
  speed: number;
  x: number;
  y: number;
  z: number;
};

const FAR_DEPTH = 1600;
const MIN_STARS = 180;
const MAX_STARS = 420;

function createStar(width: number, height: number, randomDepth = true): Star {
  const spread = Math.max(width, height) * 0.9;

  return {
    alpha: 0.3 + Math.random() * 0.7,
    size: 0.5 + Math.random() * 1.8,
    speed: 0.65 + Math.random() * 1.2,
    x: (Math.random() - 0.5) * spread * 2,
    y: (Math.random() - 0.5) * spread * 2,
    z: randomDepth ? 12 + Math.random() * (FAR_DEPTH - 12) : FAR_DEPTH,
  };
}

function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrameId = 0;
    let height = 0;
    let lastFrameTime = performance.now();
    let prefersReducedMotion = false;
    let stars: Star[] = [];
    let width = 0;

    const projectionScale = () => Math.max(width, height) * 0.85;
    const starCount = () =>
      Math.max(
        MIN_STARS,
        Math.min(MAX_STARS, Math.round((width * height) / 4200)),
      );

    const resetStar = (star: Star, randomDepth = false) => {
      const nextStar = createStar(width, height, randomDepth);
      star.alpha = nextStar.alpha;
      star.size = nextStar.size;
      star.speed = nextStar.speed;
      star.x = nextStar.x;
      star.y = nextStar.y;
      star.z = nextStar.z;
    };

    const resizeCanvas = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = nextWidth;
      height = nextHeight;

      canvas.width = nextWidth * devicePixelRatio;
      canvas.height = nextHeight * devicePixelRatio;
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      stars = Array.from({ length: starCount() }, () =>
        createStar(nextWidth, nextHeight),
      );
    };

    const renderFrame = (time: number) => {
      const frameScale = Math.min((time - lastFrameTime) / 16.6667 || 1, 2);
      const centerX = width / 2;
      const centerY = height / 2;
      const fov = projectionScale();
      const travelSpeed = prefersReducedMotion ? 3.6 : 7.8;

      lastFrameTime = time;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "screen";

      for (const star of stars) {
        const previousZ = star.z;

        star.z -= star.speed * travelSpeed * frameScale;

        if (star.z <= 6) {
          resetStar(star);
          continue;
        }

        const currentScale = fov / star.z;
        const previousScale = fov / previousZ;
        const currentX = star.x * currentScale + centerX;
        const currentY = star.y * currentScale + centerY;
        const previousX = star.x * previousScale + centerX;
        const previousY = star.y * previousScale + centerY;

        if (
          currentX < -width * 0.2 ||
          currentX > width * 1.2 ||
          currentY < -height * 0.2 ||
          currentY > height * 1.2
        ) {
          resetStar(star);
          continue;
        }

        const depthRatio = 1 - star.z / FAR_DEPTH;
        const trailOpacity = Math.min(0.95, star.alpha * (0.18 + depthRatio));
        const starRadius = Math.max(0.35, depthRatio * 2.8 * star.size);

        context.beginPath();
        context.strokeStyle = `rgba(255,255,255,${trailOpacity})`;
        context.lineWidth = Math.max(0.25, starRadius * 0.85);
        context.moveTo(previousX, previousY);
        context.lineTo(currentX, currentY);
        context.stroke();

        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${Math.min(1, trailOpacity + 0.08)})`;
        context.arc(currentX, currentY, starRadius, 0, Math.PI * 2);
        context.fill();
      }

      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const handleReducedMotionChange = () => {
      prefersReducedMotion = reducedMotionQuery.matches;
    };

    handleReducedMotionChange();
    resizeCanvas();
    animationFrameId = window.requestAnimationFrame(renderFrame);

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default StarsBackground;
