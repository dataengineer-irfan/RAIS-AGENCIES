import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  crystalPoints: number;
  rotation: number;
  rotationSpeed: number;
}

export const SubZeroAtmosphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for gentle particle repulsion
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Create 35 delicate crystalline ice & frost particles
    const particleCount = Math.min(38, Math.floor(width / 35));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: Math.random() * 0.45 + 0.15, // Gentle downward/float drift
        opacity: Math.random() * 0.5 + 0.15,
        fadeSpeed: (Math.random() - 0.5) * 0.004,
        crystalPoints: Math.random() > 0.6 ? 6 : 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric sub-zero aurora ambient vignette
      const radial = ctx.createRadialGradient(
        width * 0.75, height * 0.35, 10,
        width * 0.75, height * 0.35, width * 0.65
      );
      radial.addColorStop(0, 'rgba(56, 189, 248, 0.04)'); // Soft ice-blue glow
      radial.addColorStop(0.5, 'rgba(245, 158, 11, 0.02)'); // Warm gold secondary
      radial.addColorStop(1, 'rgba(11, 15, 23, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Render drifting crystalline frost particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Repulsion from cursor
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.65 || p.opacity < 0.1) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Screen wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        // Draw soft crystal diamond
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.fillStyle = `rgba(217, 249, 157, ${p.opacity * 0.4})`; // Soft cold-chain cyan-frost
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.3)';

        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.8);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(0, p.size * 1.8);
        ctx.lineTo(-p.size, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
