import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeMiniCarton: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff7ed, 2.8);
    key.position.set(5, 7, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fill.position.set(-5, -2, -3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc8900a, 2.0);
    rim.position.set(0, 4, -6);
    scene.add(rim);

    // Procedural mini carton texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#C29864';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#1C1410';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 472, 472);

    ctx.fillStyle = '#1C1410';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RAIS AGENCIES · B2B', 256, 70);

    // Diamond emblem
    ctx.beginPath();
    ctx.moveTo(256, 120);
    ctx.lineTo(296, 160);
    ctx.lineTo(256, 200);
    ctx.lineTo(216, 160);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#C8900A';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('R', 256, 170);

    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(80, 240, 352, 45);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('-18°C SUB-ZERO COLD CHAIN', 256, 270);

    ctx.fillStyle = '#1C1410';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('12 × 1.0 KG WHOLESALE CASE', 256, 340);
    ctx.fillText('RAYACHOTY COMMERCIAL DEPOT', 256, 380);

    // Barcode
    for (let x = 160; x < 352; x += 4) {
      ctx.fillRect(x, 420, (x % 8 === 0) ? 3 : 1.5, 40);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    const boxMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65 });
    const boxGeo = new THREE.BoxGeometry(2.8, 2.0, 2.2);
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    scene.add(boxMesh);

    // Mouse drag interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = 0.5;
    let targetRotX = 0.2;
    let currentRotY = 0.5;
    let currentRotX = 0.2;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = x;
      prevY = y;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      targetRotY += (x - prevX) * 0.012;
      targetRotX += (y - prevY) * 0.012;
      targetRotX = Math.max(-0.5, Math.min(0.6, targetRotX));
      prevX = x;
      prevY = y;
    };

    const onPointerUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      if (!isDragging) {
        targetRotY += 0.005;
      }

      boxMesh.rotation.x = currentRotX;
      boxMesh.rotation.y = currentRotY;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      boxGeo.dispose();
      boxMat.dispose();
      tex.dispose();
      renderer.dispose();
      if (dom && container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};
