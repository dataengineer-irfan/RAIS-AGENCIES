import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSubZeroCanvasProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

export const ThreeSubZeroCanvas: React.FC<ThreeSubZeroCanvasProps> = ({
  className = 'absolute inset-0 pointer-events-none',
  particleCount = 180,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 25;

    // 2. Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Sub-Zero Ice Crystal / Cold Mist Particle Geometry
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 1] = -0.01 - Math.random() * 0.02; // Gentle downward drifting frost
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;

      scales[i] = Math.random() * 2.5 + 1.0;
      alphas[i] = Math.random() * 0.45 + 0.15;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create a subtle circular frost particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      gradient.addColorStop(0.35, 'rgba(200, 225, 255, 0.4)');
      gradient.addColorStop(0.8, 'rgba(200, 144, 10, 0.15)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 1.2,
      map: texture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse Tracking for dynamic sub-zero fluid air resistance
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      targetMouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };

    if (interactive) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
    }

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const pos = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Apply drifting velocity with subtle wave motion
        pos[i3 + 0] += velocities[i3 + 0] + Math.sin(elapsedTime * 0.5 + i) * 0.008 + mouseX * 0.015;
        pos[i3 + 1] += velocities[i3 + 1] + mouseY * 0.015;
        pos[i3 + 2] += velocities[i3 + 2] + Math.cos(elapsedTime * 0.5 + i) * 0.008;

        // Boundary wrap
        if (pos[i3 + 1] < -16) {
          pos[i3 + 1] = 16;
          pos[i3 + 0] = (Math.random() - 0.5) * 45;
        }
        if (pos[i3 + 0] < -24) pos[i3 + 0] = 24;
        if (pos[i3 + 0] > 24) pos[i3 + 0] = -24;
      }

      geometry.attributes.position.needsUpdate = true;

      // Subtle scene camera drift
      camera.position.x = mouseX * 2.5;
      camera.position.y = mouseY * 2.0;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handlePointerMove);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [particleCount, interactive]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
};
