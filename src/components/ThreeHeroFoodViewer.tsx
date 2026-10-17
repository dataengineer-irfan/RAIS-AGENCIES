import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHeroFoodViewerProps {
  modelType: 'momo' | 'nugget' | 'carton';
}

export const ThreeHeroFoodViewer: React.FC<ThreeHeroFoodViewerProps> = ({ modelType }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 6.5);
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

    // Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff7ed, 3.0);
    key.position.set(5, 8, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xdbeafe, 1.5);
    fill.position.set(-5, -2, -4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc8900a, 2.5);
    rim.position.set(0, 5, -6);
    scene.add(rim);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- MODEL 1: Steamed Pleated Momo Dumpling ---
    const momoGroup = new THREE.Group();
    momoGroup.name = 'momo';

    // Build pleated dumpling geometry
    const momoGeo = new THREE.CylinderGeometry(0.12, 1.6, 1.7, 48, 20);
    const mPos = momoGeo.attributes.position;
    for (let i = 0; i < mPos.count; i++) {
      const x = mPos.getX(i);
      const y = mPos.getY(i);
      const z = mPos.getZ(i);

      const r = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);

      // 12 authentic handmade dumpling pleats
      const pleat = Math.sin(angle * 12) * 0.14 * Math.max(0, 1.0 - Math.abs(y) / 1.0);
      const bulge = Math.sin((y + 0.85) / 1.7 * Math.PI) * 0.42;

      const newR = Math.max(0.06, r + pleat + bulge);
      mPos.setX(i, Math.cos(angle) * newR);
      mPos.setZ(i, Math.sin(angle) * newR);

      // Spiral pinched apex
      if (y > 0.5) {
        const swirlAngle = angle + (y - 0.5) * 1.8;
        mPos.setX(i, Math.cos(swirlAngle) * (newR * 0.6));
        mPos.setZ(i, Math.sin(swirlAngle) * (newR * 0.6));
      }
    }
    momoGeo.computeVertexNormals();

    // Translucent steamed dough material
    const doughMat = new THREE.MeshStandardMaterial({
      color: 0xFDFBF7,
      roughness: 0.32,
      metalness: 0.04,
    });
    const momoMesh = new THREE.Mesh(momoGeo, doughMat);
    momoMesh.position.y = -0.2;
    momoGroup.add(momoMesh);

    // Dipping sauce ramekin with red chilli chutney
    const bowlGeo = new THREE.CylinderGeometry(0.75, 0.55, 0.45, 24);
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0x1C1410, roughness: 0.4 });
    const bowlMesh = new THREE.Mesh(bowlGeo, bowlMat);
    bowlMesh.position.set(1.9, -0.7, 0.4);
    momoGroup.add(bowlMesh);

    const sauceGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.05, 24);
    const sauceMat = new THREE.MeshStandardMaterial({ color: 0x991B1B, roughness: 0.15, metalness: 0.1 });
    const sauceMesh = new THREE.Mesh(sauceGeo, sauceMat);
    sauceMesh.position.set(1.9, -0.48, 0.4);
    momoGroup.add(sauceMesh);

    rootGroup.add(momoGroup);

    // --- MODEL 2: Crispy Tempura Chicken Nugget ---
    const nuggetGroup = new THREE.Group();
    nuggetGroup.name = 'nugget';

    const nuggetGeo = new THREE.BoxGeometry(2.6, 1.3, 1.9, 24, 16, 20);
    const nPos = nuggetGeo.attributes.position;
    for (let i = 0; i < nPos.count; i++) {
      const x = nPos.getX(i);
      const y = nPos.getY(i);
      const z = nPos.getZ(i);
      const noise = Math.sin(x * 3.8) * Math.cos(y * 4.2) * Math.sin(z * 3.2) * 0.18;
      nPos.setX(i, x + noise * 0.4);
      nPos.setY(i, (y + noise) * 0.85);
      nPos.setZ(i, z + noise * 0.4);
    }
    nuggetGeo.computeVertexNormals();

    // Procedural breadcrumb tempura coating
    const nuggetCanvas = document.createElement('canvas');
    nuggetCanvas.width = 512;
    nuggetCanvas.height = 512;
    const nctx = nuggetCanvas.getContext('2d')!;
    nctx.fillStyle = '#D97706'; // Golden amber
    nctx.fillRect(0, 0, 512, 512);

    // Crisp toasted crumbs & paprika flecks
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      nctx.fillStyle = Math.random() > 0.4 ? '#92400E' : '#FBBF24';
      nctx.fillRect(rx, ry, Math.random() * 4 + 1, Math.random() * 4 + 1);
    }
    const nuggetTex = new THREE.CanvasTexture(nuggetCanvas);

    const nuggetMat = new THREE.MeshStandardMaterial({
      map: nuggetTex,
      roughness: 0.82,
      metalness: 0.08,
    });
    const nuggetMesh = new THREE.Mesh(nuggetGeo, nuggetMat);
    nuggetMesh.rotation.y = 0.35;
    nuggetMesh.rotation.z = -0.1;
    nuggetGroup.add(nuggetMesh);

    rootGroup.add(nuggetGroup);

    // --- MODEL 3: 5-Ply Master Delivery Carton ---
    const cartonGroup = new THREE.Group();
    cartonGroup.name = 'carton';

    const cartonCanvas = document.createElement('canvas');
    cartonCanvas.width = 512;
    cartonCanvas.height = 512;
    const cctx = cartonCanvas.getContext('2d')!;
    cctx.fillStyle = '#C29864';
    cctx.fillRect(0, 0, 512, 512);
    cctx.strokeStyle = '#1C1410';
    cctx.lineWidth = 4;
    cctx.strokeRect(20, 20, 472, 472);
    cctx.fillStyle = '#1C1410';
    cctx.font = 'bold 22px sans-serif';
    cctx.textAlign = 'center';
    cctx.fillText('RAIS AGENCIES · B2B', 256, 70);

    cctx.fillStyle = '#1E3A8A';
    cctx.fillRect(80, 240, 352, 45);
    cctx.fillStyle = '#FFFFFF';
    cctx.font = 'bold 18px sans-serif';
    cctx.fillText('-18°C SUB-ZERO COLD CHAIN', 256, 270);
    cctx.fillStyle = '#1C1410';
    cctx.font = 'bold 16px monospace';
    cctx.fillText('12 × 1.0 KG WHOLESALE CASE', 256, 340);
    for (let x = 160; x < 352; x += 4) {
      cctx.fillRect(x, 420, (x % 8 === 0) ? 3 : 1.5, 40);
    }
    const cartonTex = new THREE.CanvasTexture(cartonCanvas);

    const cartonMat = new THREE.MeshStandardMaterial({ map: cartonTex, roughness: 0.65 });
    const cartonGeo = new THREE.BoxGeometry(2.8, 2.0, 2.2);
    const cartonMesh = new THREE.Mesh(cartonGeo, cartonMat);
    cartonGroup.add(cartonMesh);

    rootGroup.add(cartonGroup);

    // Sync visibility with prop
    momoGroup.visible = modelType === 'momo';
    nuggetGroup.visible = modelType === 'nugget';
    cartonGroup.visible = modelType === 'carton';

    // Interactive Drag Rotation
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

      rootGroup.rotation.x = currentRotX;
      rootGroup.rotation.y = currentRotY;

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

      momoGeo.dispose();
      doughMat.dispose();
      bowlGeo.dispose();
      bowlMat.dispose();
      sauceGeo.dispose();
      sauceMat.dispose();
      nuggetGeo.dispose();
      nuggetMat.dispose();
      nuggetTex.dispose();
      cartonGeo.dispose();
      cartonMat.dispose();
      cartonTex.dispose();
      renderer.dispose();
      if (dom && container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [modelType]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};
