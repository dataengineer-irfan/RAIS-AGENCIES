import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, RotateCw, Layers, Sparkles, Sun, Snowflake, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

interface Interactive3DShowcaseProps {
  onOpenQuote?: () => void;
}

type ModelType = 'momo' | 'nugget' | 'fries' | 'carton' | 'burger_box' | 'cryo_pod';
type LightingMode = 'studio' | 'cold_vault' | 'depot_warm';

export const Interactive3DShowcase: React.FC<Interactive3DShowcaseProps> = ({ onOpenQuote }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<ModelType>('momo');
  const [lightingMode, setLightingMode] = useState<LightingMode>('studio');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isOpenState, setIsOpenState] = useState(false);

  // References for Three.js control outside useEffect
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const lidFlapLeftRef = useRef<THREE.Group | null>(null);
  const lidFlapRightRef = useRef<THREE.Group | null>(null);
  const burgerLidRef = useRef<THREE.Group | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Helper to create procedural carton texture
  const createCartonTexture = (face: 'front' | 'top' | 'side') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#C29864';
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    for (let i = 0; i < 4000; i++) {
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let y = 0; y < 1024; y += 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    if (face === 'front') {
      ctx.strokeStyle = '#1C1410';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, 944, 944);

      ctx.fillStyle = '#1C1410';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('RAIS AGENCIES · RAYACHOTY', 512, 120);

      ctx.fillStyle = '#C8900A';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('AUTHORISED FOOD SERVICE WHOLESALE STOCKIST', 512, 160);

      ctx.fillStyle = '#1C1410';
      ctx.beginPath();
      ctx.moveTo(512, 230);
      ctx.lineTo(580, 298);
      ctx.lineTo(512, 366);
      ctx.lineTo(444, 298);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#C8900A';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('R', 512, 312);

      ctx.fillStyle = '#1C1410';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText('MASTER COMMERCIAL CARTON', 512, 450);

      ctx.font = '600 28px sans-serif';
      ctx.fillStyle = '#33271C';
      ctx.fillText('HEAVY-GAUGE 5-PLY MOISTURE-BARRIER BOARD', 512, 500);

      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(200, 560, 624, 75);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('❄  SUB-ZERO COLD CHAIN (-18°C)  ❄', 512, 608);

      ctx.fillStyle = '#1C1410';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('SPEC: 5-PLY FLUTE / BURST: 16.5 KG/CM²', 512, 700);
      ctx.fillText('BATCH: RAC-2026-FZN · RAYACHOTY DEPOT', 512, 740);

      const barY = 800;
      for (let x = 320; x < 704; x += 6) {
        ctx.fillRect(x, barY, (x % 14 === 0 || x % 24 === 0) ? 4 : 2, 70);
      }
      ctx.font = '18px monospace';
      ctx.fillText('RAIS-WHOLESALE-DIST-516269', 512, 895);

    } else if (face === 'top') {
      ctx.fillStyle = '#B08852';
      ctx.fillRect(440, 0, 144, 1024);
      ctx.strokeStyle = '#8E6735';
      ctx.lineWidth = 2;
      ctx.strokeRect(440, 0, 144, 1024);

      ctx.save();
      ctx.translate(512, 512);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#4A331A';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★ FACTORY SEALED ★ DO NOT BREAK COLD CHAIN ★', 0, 10);
      ctx.restore();

      ctx.fillStyle = '#1C1410';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('↑↑ THIS SIDE UP', 100, 200);
      ctx.fillText('HANDLE WITH CARE', 100, 260);

      ctx.textAlign = 'right';
      ctx.fillText('MAX STACK: 5 UNITS', 924, 200);
      ctx.fillText('KEEP DRY & FROZEN', 924, 260);

    } else {
      ctx.strokeStyle = '#1C1410';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, 924, 924);

      ctx.fillStyle = '#1C1410';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('COMMERCIAL DISTRIBUTION UNIT', 512, 140);

      ctx.font = '26px sans-serif';
      ctx.fillStyle = '#4A331A';
      ctx.fillText('NET WEIGHT: 12.0 KG (12 × 1.0 KG)', 512, 220);
      ctx.fillText('STORAGE: MAINTAIN CONTINUOUS -18°C', 512, 280);
      ctx.fillText('ORIGIN: AUTHORISED FMCG ALLOCATION', 512, 340);

      ctx.font = '80px sans-serif';
      ctx.fillStyle = '#1C1410';
      ctx.fillText('❄ ☂ ⛟', 512, 520);

      ctx.font = 'bold 24px monospace';
      ctx.fillText('DESTINATION: RAYACHOTY COMM. HUB (516269)', 512, 650);
      ctx.fillText('DIRECT DESK: +91 9347453135', 512, 700);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // Helper to create burger clamshell texture
  const createBurgerBoxTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#CDA87B';
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.fillStyle = 'rgba(0,0,0,0.025)';
    for (let i = 0; i < 5000; i++) {
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }

    ctx.strokeStyle = '#2B1E14';
    ctx.lineWidth = 5;
    ctx.strokeRect(60, 60, 904, 904);

    ctx.fillStyle = '#2B1E14';
    ctx.font = 'bold 44px serif';
    ctx.textAlign = 'center';
    ctx.fillText('RAIS COMMERCIAL PACKAGING', 512, 180);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#8B5A2B';
    ctx.fillText('4" × 4" HEAVY KRAFT BURGER CLAMSHELL', 512, 240);

    ctx.fillStyle = '#2B1E14';
    ctx.font = '70px sans-serif';
    ctx.fillText('🍔', 512, 420);

    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('HEAT RETENTION & CRUST INTEGRITY', 512, 560);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#4A331A';
    ctx.fillText('STEAM-VENTED · GREASEPROOF · FOOD GRADE', 512, 610);
    ctx.fillText('100% RECYCLABLE CORRUGATED FLUTE', 512, 655);

    ctx.fillStyle = '#2B1E14';
    ctx.fillRect(260, 740, 504, 60);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('RAYACHOTY WHOLESALE SUPPLY', 512, 778);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 2.4, 9.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. Lighting System
    const ambient = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambient);
    ambientLightRef.current = ambient;

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 3.0);
    keyLight.position.set(6, 9, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.5);
    fillLight.position.set(-6, -2, -5);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.DirectionalLight(0xc8900a, 2.4);
    rimLight.position.set(0, 6, -8);
    scene.add(rimLight);

    // Ground Shadow Plate
    const floorGeo = new THREE.PlaneGeometry(18, 18);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.14 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.8;
    floor.receiveShadow = true;
    scene.add(floor);

    // Root Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // ==========================================
    // MODEL 1: Steamed Pleated Momo Dumpling
    // ==========================================
    const momoGroup = new THREE.Group();
    momoGroup.name = 'momo';

    const momoGeo = new THREE.CylinderGeometry(0.14, 1.7, 1.9, 48, 24);
    const mPos = momoGeo.attributes.position;
    for (let i = 0; i < mPos.count; i++) {
      const x = mPos.getX(i);
      const y = mPos.getY(i);
      const z = mPos.getZ(i);

      const r = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);

      // 12 pleat definition
      const pleat = Math.sin(angle * 12) * 0.16 * Math.max(0, 1.0 - Math.abs(y) / 1.0);
      const bulge = Math.sin((y + 0.95) / 1.9 * Math.PI) * 0.45;

      const newR = Math.max(0.06, r + pleat + bulge);
      mPos.setX(i, Math.cos(angle) * newR);
      mPos.setZ(i, Math.sin(angle) * newR);

      if (y > 0.55) {
        const swirlAngle = angle + (y - 0.55) * 2.0;
        mPos.setX(i, Math.cos(swirlAngle) * (newR * 0.55));
        mPos.setZ(i, Math.sin(swirlAngle) * (newR * 0.55));
      }
    }
    momoGeo.computeVertexNormals();

    const doughMat = new THREE.MeshStandardMaterial({
      color: 0xFDFBF7,
      roughness: 0.32,
      metalness: 0.04,
    });
    const momoMesh = new THREE.Mesh(momoGeo, doughMat);
    momoMesh.position.y = -0.3;
    momoMesh.castShadow = true;
    momoGroup.add(momoMesh);

    // Dark ceramic dipping ramekin with red schezwan chutney
    const bowlGeo = new THREE.CylinderGeometry(0.85, 0.65, 0.5, 32);
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0x1C1410, roughness: 0.45 });
    const bowlMesh = new THREE.Mesh(bowlGeo, bowlMat);
    bowlMesh.position.set(2.2, -0.75, 0.5);
    bowlMesh.castShadow = true;
    momoGroup.add(bowlMesh);

    const sauceGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.05, 32);
    const sauceMat = new THREE.MeshStandardMaterial({ color: 0x991B1B, roughness: 0.12, metalness: 0.1 });
    const sauceMesh = new THREE.Mesh(sauceGeo, sauceMat);
    sauceMesh.position.set(2.2, -0.5, 0.5);
    momoGroup.add(sauceMesh);

    // Bamboo steamer ring base
    const ringGeo = new THREE.TorusGeometry(2.3, 0.15, 16, 64);
    const bambooMat = new THREE.MeshStandardMaterial({ color: 0x855D36, roughness: 0.8 });
    const bambooRing = new THREE.Mesh(ringGeo, bambooMat);
    bambooRing.rotation.x = Math.PI / 2;
    bambooRing.position.y = -1.2;
    momoGroup.add(bambooRing);

    modelGroup.add(momoGroup);

    // ==========================================
    // MODEL 2: Crispy Tempura Chicken Nugget
    // ==========================================
    const nuggetGroup = new THREE.Group();
    nuggetGroup.name = 'nugget';
    nuggetGroup.visible = false;

    const nuggetGeo = new THREE.BoxGeometry(2.8, 1.4, 2.1, 24, 16, 20);
    const nPos = nuggetGeo.attributes.position;
    for (let i = 0; i < nPos.count; i++) {
      const x = nPos.getX(i);
      const y = nPos.getY(i);
      const z = nPos.getZ(i);
      const noise = Math.sin(x * 3.8) * Math.cos(y * 4.2) * Math.sin(z * 3.2) * 0.2;
      nPos.setX(i, x + noise * 0.45);
      nPos.setY(i, (y + noise) * 0.85);
      nPos.setZ(i, z + noise * 0.45);
    }
    nuggetGeo.computeVertexNormals();

    const nuggetCanvas = document.createElement('canvas');
    nuggetCanvas.width = 512;
    nuggetCanvas.height = 512;
    const nctx = nuggetCanvas.getContext('2d')!;
    nctx.fillStyle = '#D97706';
    nctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 4000; i++) {
      nctx.fillStyle = Math.random() > 0.4 ? '#92400E' : '#FBBF24';
      nctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 4 + 1, Math.random() * 4 + 1);
    }
    const nuggetTex = new THREE.CanvasTexture(nuggetCanvas);

    const nuggetMat = new THREE.MeshStandardMaterial({
      map: nuggetTex,
      roughness: 0.82,
      metalness: 0.08,
    });
    const nuggetMesh = new THREE.Mesh(nuggetGeo, nuggetMat);
    nuggetMesh.rotation.y = 0.35;
    nuggetMesh.rotation.z = -0.08;
    nuggetMesh.castShadow = true;
    nuggetGroup.add(nuggetMesh);

    modelGroup.add(nuggetGroup);

    // ==========================================
    // MODEL 3: Shoestring French Fries in Fryer Basket
    // ==========================================
    const friesGroup = new THREE.Group();
    friesGroup.name = 'fries';
    friesGroup.visible = false;

    // Commercial wire fryer basket
    const basketGeo = new THREE.BoxGeometry(3.4, 1.8, 2.4);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xCBD5E1,
      metalness: 0.95,
      roughness: 0.2,
      wireframe: true,
    });
    const basketMesh = new THREE.Mesh(basketGeo, wireMat);
    basketMesh.position.y = -0.2;
    friesGroup.add(basketMesh);

    // Basket Handle
    const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.4, 12);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.9, roughness: 0.2 });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.rotation.z = Math.PI / 3.2;
    handleMesh.position.set(2.4, 0.8, 0);
    friesGroup.add(handleMesh);

    // 32 individual golden fries
    const fryGeo = new THREE.BoxGeometry(0.18, 2.5, 0.18);
    const fryMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      roughness: 0.72,
      metalness: 0.05,
    });
    for (let f = 0; f < 36; f++) {
      const fry = new THREE.Mesh(fryGeo, fryMat);
      const angle = (f / 36) * Math.PI * 2;
      const radius = Math.random() * 1.1;
      fry.position.set(Math.cos(angle) * radius, -0.1 + Math.random() * 0.45, Math.sin(angle) * (radius * 0.7));
      fry.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4);
      fry.castShadow = true;
      friesGroup.add(fry);
    }

    modelGroup.add(friesGroup);

    // ==========================================
    // MODEL 4: 5-Ply Master Delivery Carton
    // ==========================================
    const cartonGroup = new THREE.Group();
    cartonGroup.name = 'carton';
    cartonGroup.visible = false;

    const frontTex = createCartonTexture('front');
    const topTex = createCartonTexture('top');
    const sideTex = createCartonTexture('side');

    const cartonMats = [
      new THREE.MeshStandardMaterial({ map: sideTex, roughness: 0.65, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ map: sideTex, roughness: 0.65, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ color: 0x9c7446, transparent: true, opacity: 0 }),
      new THREE.MeshStandardMaterial({ color: 0x9c7446, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.65, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.65, metalness: 0.05 }),
    ];

    const cartonBody = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.8, 3.0), cartonMats);
    cartonBody.castShadow = true;
    cartonBody.receiveShadow = true;
    cartonGroup.add(cartonBody);

    const interiorGeo = new THREE.BoxGeometry(3.8, 2.6, 2.8);
    const interiorMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      metalness: 0.85,
      roughness: 0.25,
      side: THREE.BackSide,
    });
    const interiorMesh = new THREE.Mesh(interiorGeo, interiorMat);
    cartonGroup.add(interiorMesh);

    // Internal frozen sample pouches
    const pouchCanvas = document.createElement('canvas');
    pouchCanvas.width = 256;
    pouchCanvas.height = 384;
    const pctx = pouchCanvas.getContext('2d')!;
    pctx.fillStyle = '#0F172A';
    pctx.fillRect(0, 0, 256, 384);
    pctx.fillStyle = '#C8900A';
    pctx.fillRect(10, 10, 236, 12);
    pctx.fillStyle = '#FFFFFF';
    pctx.font = 'bold 20px sans-serif';
    pctx.textAlign = 'center';
    pctx.fillText('ITC MASTER CHEF', 128, 80);
    pctx.fillStyle = '#38BDF8';
    pctx.font = 'bold 18px monospace';
    pctx.fillText('-18°C IQF CERTIFIED', 128, 240);
    const pouchTex = new THREE.CanvasTexture(pouchCanvas);

    const pouchGeo = new THREE.BoxGeometry(1.6, 2.2, 0.45);
    const pouchMat = new THREE.MeshStandardMaterial({ map: pouchTex, metalness: 0.35, roughness: 0.35 });
    const pouch1 = new THREE.Mesh(pouchGeo, pouchMat);
    pouch1.position.set(-0.8, 0.4, 0);
    pouch1.rotation.y = 0.18;
    const pouch2 = new THREE.Mesh(pouchGeo, pouchMat);
    pouch2.position.set(0.8, 0.4, 0);
    pouch2.rotation.y = -0.18;
    cartonGroup.add(pouch1);
    cartonGroup.add(pouch2);

    // Flaps for animated lid opening
    const flapGeo = new THREE.BoxGeometry(2.0, 0.06, 3.0);
    const flapMat = new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.65 });

    const flapLeftPivot = new THREE.Group();
    flapLeftPivot.position.set(-2.0, 1.4, 0);
    const flapLeftMesh = new THREE.Mesh(flapGeo, flapMat);
    flapLeftMesh.position.set(1.0, 0, 0);
    flapLeftMesh.castShadow = true;
    flapLeftPivot.add(flapLeftMesh);
    cartonGroup.add(flapLeftPivot);
    lidFlapLeftRef.current = flapLeftPivot;

    const flapRightPivot = new THREE.Group();
    flapRightPivot.position.set(2.0, 1.4, 0);
    const flapRightMesh = new THREE.Mesh(flapGeo, flapMat);
    flapRightMesh.position.set(-1.0, 0, 0);
    flapRightMesh.castShadow = true;
    flapRightPivot.add(flapRightMesh);
    cartonGroup.add(flapRightPivot);
    lidFlapRightRef.current = flapRightPivot;

    modelGroup.add(cartonGroup);

    // ==========================================
    // MODEL 5: Kraft Burger Clamshell
    // ==========================================
    const burgerGroup = new THREE.Group();
    burgerGroup.name = 'burger_box';
    burgerGroup.visible = false;

    const burgerTex = createBurgerBoxTexture();
    const kraftPlainMat = new THREE.MeshStandardMaterial({ color: 0xC59E70, roughness: 0.7 });
    const kraftPrintedMat = new THREE.MeshStandardMaterial({ map: burgerTex, roughness: 0.7 });

    const baseTrayGeo = new THREE.BoxGeometry(3.2, 1.2, 3.2);
    const baseTray = new THREE.Mesh(baseTrayGeo, kraftPlainMat);
    baseTray.position.y = -0.6;
    baseTray.castShadow = true;
    baseTray.receiveShadow = true;
    burgerGroup.add(baseTray);

    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 0, -1.6);
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.1, 3.2), [
      kraftPlainMat,
      kraftPlainMat,
      kraftPrintedMat,
      kraftPlainMat,
      kraftPlainMat,
      kraftPlainMat,
    ]);
    lidMesh.position.set(0, 0.55, 1.6);
    lidMesh.castShadow = true;
    lidPivot.add(lidMesh);
    burgerGroup.add(lidPivot);
    burgerLidRef.current = lidPivot;

    modelGroup.add(burgerGroup);

    // ==========================================
    // MODEL 6: Cryo IQF Storage Pod
    // ==========================================
    const cryoGroup = new THREE.Group();
    cryoGroup.name = 'cryo_pod';
    cryoGroup.visible = false;

    const cylinderGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.8, 32);
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xD1D5DB, metalness: 0.9, roughness: 0.2 });
    const cylinder = new THREE.Mesh(cylinderGeo, steelMat);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cryoGroup.add(cylinder);

    const rimGeo = new THREE.TorusGeometry(1.62, 0.06, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xC8900A, metalness: 0.85, roughness: 0.25 });
    const rimTop = new THREE.Mesh(rimGeo, goldMat);
    rimTop.rotation.x = Math.PI / 2;
    rimTop.position.y = 1.3;
    cryoGroup.add(rimTop);

    const rimBottom = new THREE.Mesh(rimGeo, goldMat);
    rimBottom.rotation.x = Math.PI / 2;
    rimBottom.position.y = -1.3;
    cryoGroup.add(rimBottom);

    const dialGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.15, 32);
    const dialCanvas = document.createElement('canvas');
    dialCanvas.width = 256;
    dialCanvas.height = 256;
    const dctx = dialCanvas.getContext('2d')!;
    dctx.fillStyle = '#0F172A';
    dctx.fillRect(0, 0, 256, 256);
    dctx.strokeStyle = '#38BDF8';
    dctx.lineWidth = 6;
    dctx.strokeRect(10, 10, 236, 236);
    dctx.fillStyle = '#38BDF8';
    dctx.font = 'bold 36px monospace';
    dctx.textAlign = 'center';
    dctx.fillText('-18.4°C', 128, 120);
    dctx.font = 'bold 18px sans-serif';
    dctx.fillStyle = '#C8900A';
    dctx.fillText('SUB-ZERO PASS', 128, 165);
    const dialTex = new THREE.CanvasTexture(dialCanvas);

    const dialMesh = new THREE.Mesh(dialGeo, new THREE.MeshStandardMaterial({ map: dialTex }));
    dialMesh.rotation.x = Math.PI / 2;
    dialMesh.position.set(0, 0.2, 1.6);
    cryoGroup.add(dialMesh);

    modelGroup.add(cryoGroup);

    // Initial Active Model Visibility
    momoGroup.visible = activeModel === 'momo';
    nuggetGroup.visible = activeModel === 'nugget';
    friesGroup.visible = activeModel === 'fries';
    cartonGroup.visible = activeModel === 'carton';
    burgerGroup.visible = activeModel === 'burger_box';
    cryoGroup.visible = activeModel === 'cryo_pod';

    // Interactive Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0.6;
    let targetRotX = 0.2;
    let currentRotY = 0.6;
    let currentRotX = 0.2;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      targetRotY += (clientX - prevMouseX) * 0.008;
      targetRotX += (clientY - prevMouseY) * 0.008;
      targetRotX = Math.max(-0.6, Math.min(0.8, targetRotX));
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => { isDragging = false; };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(5.5, Math.min(13.0, camera.position.z + e.deltaY * 0.005));
    };
    domElement.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId: number;
    let flapAngle = 0;
    let targetFlapAngle = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      if (autoRotate && !isDragging) {
        targetRotY += 0.003;
      }

      modelGroup.rotation.x = currentRotX;
      modelGroup.rotation.y = currentRotY;

      targetFlapAngle = isOpenState ? Math.PI * 0.65 : 0;
      flapAngle += (targetFlapAngle - flapAngle) * 0.1;

      if (lidFlapLeftRef.current) {
        lidFlapLeftRef.current.rotation.z = flapAngle;
      }
      if (lidFlapRightRef.current) {
        lidFlapRightRef.current.rotation.z = -flapAngle;
      }
      if (burgerLidRef.current) {
        burgerLidRef.current.rotation.x = -flapAngle * 1.2;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (domElement && container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  // Sync active model visibility
  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.children.forEach((child) => {
      child.visible = child.name === activeModel;
    });
  }, [activeModel]);

  // Sync lighting mode
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !ambientLightRef.current) return;

    if (lightingMode === 'cold_vault') {
      keyLightRef.current.color.setHex(0xCBEAFE);
      keyLightRef.current.intensity = 3.2;
      fillLightRef.current.color.setHex(0x38BDF8);
      ambientLightRef.current.color.setHex(0x1E293B);
      ambientLightRef.current.intensity = 0.9;
    } else if (lightingMode === 'depot_warm') {
      keyLightRef.current.color.setHex(0xFFEDD5);
      keyLightRef.current.intensity = 2.8;
      fillLightRef.current.color.setHex(0xFED7AA);
      ambientLightRef.current.color.setHex(0xFFFBEB);
      ambientLightRef.current.intensity = 1.0;
    } else {
      keyLightRef.current.color.setHex(0xFFF5EA);
      keyLightRef.current.intensity = 2.8;
      fillLightRef.current.color.setHex(0xDBEAFE);
      ambientLightRef.current.color.setHex(0xFFFFFF);
      ambientLightRef.current.intensity = 0.85;
    }
  }, [lightingMode]);

  return (
    <section id="packaging-3d" className="py-12 sm:py-14 scroll-mt-28 bg-[#081026] text-white border-b border-cyan-500/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-2">
              <span className="block w-6 h-px bg-cyan-400" />
              <span>Three.js Interactive Culinary & Packaging Lab</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              3D Frozen Food & Cold-Chain Inspector
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Drag to inspect 360° commercial frozen food lines, breading textures, pleat definitions, and heavy-gauge wholesale packaging engineered for Rayachoty commercial kitchens.
            </p>
          </div>

          {/* Model Switcher Tabs: Frozen Food & Packaging */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0f1c3f]/90 p-1.5 rounded-xl border border-cyan-500/30">
            {/* Frozen Food Lines */}
            <button
              onClick={() => { setActiveModel('momo'); setIsOpenState(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'momo'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🥟 Pleated Momo</span>
            </button>
            <button
              onClick={() => { setActiveModel('nugget'); setIsOpenState(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'nugget'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🍗 Crispy Nugget</span>
            </button>
            <button
              onClick={() => { setActiveModel('fries'); setIsOpenState(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'fries'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🍟 French Fries</span>
            </button>

            <span className="text-cyan-500/40 px-1 hidden sm:inline">|</span>

            {/* Packaging & Logistics */}
            <button
              onClick={() => { setActiveModel('carton'); setIsOpenState(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'carton'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-cyan-300" />
              <span>Master Case</span>
            </button>
            <button
              onClick={() => { setActiveModel('burger_box'); setIsOpenState(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'burger_box'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span>Burger Box</span>
            </button>
            <button
              onClick={() => { setActiveModel('cryo_pod'); setIsOpenState(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'cryo_pod'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-cyan-300" />
              <span>Cryo Vault</span>
            </button>
          </div>
        </div>

        {/* Main 3D Canvas Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Interactive WebGL 3D Canvas Box */}
          <div className="lg:col-span-8 bg-gradient-to-b from-[#0f1c3f] to-[#081026] border-2 border-cyan-500/30 rounded-2xl shadow-2xl relative min-h-[460px] sm:min-h-[540px] flex flex-col justify-between overflow-hidden">

            {/* 3D Canvas Mount Point */}
            <div
              ref={containerRef}
              className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full"
            />

            {/* Top Toolbar Overlay */}
            <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2 bg-[#081026]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-400/40 shadow-lg text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>Drag to Rotate 360° · Scroll to Zoom</span>
              </div>

              {/* Lighting Switcher */}
              <div className="pointer-events-auto flex items-center gap-1 bg-[#081026]/90 backdrop-blur-md p-1 rounded-full border border-cyan-400/40 shadow-lg">
                <button
                  onClick={() => setLightingMode('studio')}
                  title="Studio Neutral 5000K"
                  className={`p-1.5 rounded-full text-xs transition-colors ${
                    lightingMode === 'studio' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLightingMode('cold_vault')}
                  title="Sub-Zero Vault -18°C Blue"
                  className={`p-1.5 rounded-full text-xs transition-colors ${
                    lightingMode === 'cold_vault' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Snowflake className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLightingMode('depot_warm')}
                  title="Rayachoty Depot Warm 3000K"
                  className={`p-1.5 rounded-full text-xs transition-colors ${
                    lightingMode === 'depot_warm' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom 3D Action Controls */}
            <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2">
                {(activeModel === 'carton' || activeModel === 'burger_box') && (
                  <button
                    onClick={() => setIsOpenState(!isOpenState)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                      isOpenState
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-[#081026]/90 text-white hover:bg-[#0f1c3f] border border-cyan-400/40'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{isOpenState ? 'Close Packaging Lid' : 'Unbox & Open Lid in 3D'}</span>
                  </button>
                )}

                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all shadow border border-cyan-400/40 ${
                    autoRotate ? 'bg-cyan-400 text-slate-950' : 'bg-[#081026]/90 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle Auto Rotation"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pointer-events-auto bg-[#081026]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-cyan-400/40 text-[11px] text-cyan-300 font-mono font-bold shadow-md">
                FPS: 60 · Three.js WebGL2 Shaders Active
              </div>
            </div>

          </div>

          {/* Commercial Technical Specifications Sidebar */}
          <div className="lg:col-span-4 bg-[#0f1c3f]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              {/* Active Asset Badge */}
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
                <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  {activeModel === 'momo' && 'FROZEN FOOD LINE · CULINARY REQUISITION'}
                  {activeModel === 'nugget' && 'FROZEN POULTRY · COMMERCIAL QSR'}
                  {activeModel === 'fries' && 'IQF POTATO LINE · FRYER STAPLE'}
                  {activeModel === 'carton' && 'MASTER CASE SPECIFICATION'}
                  {activeModel === 'burger_box' && 'COMMERCIAL FOOD PACKAGING'}
                  {activeModel === 'cryo_pod' && 'COLD-CHAIN INFRASTRUCTURE'}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full">
                  FSSAI Certified
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {activeModel === 'momo' && 'ITC Handcrafted Pleated Momos'}
                {activeModel === 'nugget' && 'ITC Master Chef Crunchy Chicken Nuggets'}
                {activeModel === 'fries' && 'Grade-A Shoestring French Fries (9mm)'}
                {activeModel === 'carton' && '5-Ply Heavy Moisture-Barrier Carton'}
                {activeModel === 'burger_box' && '4"×4" Kraft Takeaway Clamshell'}
                {activeModel === 'cryo_pod' && 'Rayachoty -18°C Insulated Buffer Pod'}
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {activeModel === 'momo' &&
                  'Handcrafted 12-pleat wheat starch dumplings with spiced poultry filling. Individually quick frozen (IQF) at -18°C to retain moisture and ensure delicate pleats never tear during commercial steaming or frying.'}
                {activeModel === 'nugget' &&
                  'Minced poultry nuggets in golden tempura batter. Engineered for commercial quick-service fryers with high fry-hold retention (retains exterior crispness up to 45 minutes in holding chutes).'}
                {activeModel === 'fries' &&
                  'Straight-cut Grade-A Russet Burbank potatoes, par-fried in trans-fat-free vegetable oil and flash frozen. Low oil uptake (<6%) and superior crisp retention for high-turnover QSR menus.'}
                {activeModel === 'carton' &&
                  'Engineered for sub-zero frozen poultry and dairy cartons. Heavy-gauge flute board prevents crushing during multi-tier warehouse palletizing and refrigerated transport.'}
                {activeModel === 'burger_box' &&
                  'Rigid micro-corrugated virgin kraft paperboard. Laser die-cut steam vents preserve exterior crispness while retaining thermal core heat for commercial delivery.'}
                {activeModel === 'cryo_pod' &&
                  'Cold-chain staging chamber maintaining continuous sub-zero thermal equilibrium prior to route dispatch across Rayalaseema commercial kitchen corridors.'}
              </p>

              {/* Technical Specifications Matrix */}
              <div className="mt-5 space-y-2.5">
                <div className="p-3 bg-[#081026]/80 border border-cyan-500/20 rounded-xl">
                  <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Kitchen Preparation Standard:</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 pl-5">
                    {activeModel === 'momo' && 'Steam for 6–8 mins at 100°C or Deep Fry for 3 mins at 175°C without thawing'}
                    {activeModel === 'nugget' && 'Deep fry straight from freezer in 180°C oil for 3.5 mins until golden brown'}
                    {activeModel === 'fries' && 'Deep fry directly from frozen at 175°C–180°C for 2.5–3 minutes'}
                    {activeModel === 'carton' && '5-Ply Corrugated Kraft (180 GSM Outer / 140 GSM Fluting)'}
                    {activeModel === 'burger_box' && '320 GSM Virgin Food-Grade Kraft Paperboard'}
                    {activeModel === 'cryo_pod' && 'Polyurethane Double-Wall Core with Stainless Liner'}
                  </div>
                </div>

                <div className="p-3 bg-[#081026]/80 border border-cyan-500/20 rounded-xl">
                  <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cold Chain & Storage Protocol:</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 pl-5">
                    {activeModel === 'momo' && 'Continuous -18°C storage. Zero ice crystallization. Shelf life 12 months.'}
                    {activeModel === 'nugget' && 'Sub-zero IQF holding at -18°C. Do not refreeze once thawed.'}
                    {activeModel === 'fries' && 'Maintain at -18°C or below. Rapid cooking directly from freezer state.'}
                    {activeModel === 'carton' && 'Tested stable down to -25°C without fiber softening'}
                    {activeModel === 'burger_box' && 'Heat tolerant up to 105°C; oil & grease resistant'}
                    {activeModel === 'cryo_pod' && 'Certified -18°C to -22°C continuous holding'}
                  </div>
                </div>

                <div className="p-3 bg-[#081026]/80 border border-cyan-500/20 rounded-xl">
                  <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Wholesale Unit Packaging:</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 pl-5">
                    {activeModel === 'momo' && '500g commercial packs (approx. 20–22 pcs) · Master carton of 20 packs'}
                    {activeModel === 'nugget' && '1kg heavy-gauge commercial pack · 10 packs per master carton'}
                    {activeModel === 'fries' && '2.5kg commercial foodservice bags · 4 bags (10kg) per wholesale case'}
                    {activeModel === 'carton' && 'Master cases containing 10 or 12 individual 1kg retail bags'}
                    {activeModel === 'burger_box' && 'Bundled in packs of 100 Nos / Master bundle 600 Nos'}
                    {activeModel === 'cryo_pod' && 'Depot staging buffer; daily kitchen replenishment routes'}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Commercial Requisition CTA */}
            <div className="pt-5 border-t border-cyan-500/20 mt-6">
              <button
                onClick={onOpenQuote}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-lg shadow-cyan-400/25 active:scale-95"
              >
                <span>Request Commercial Requisition Terms</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Factory allocations direct from Rayachoty depot. Zero retail markup.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
