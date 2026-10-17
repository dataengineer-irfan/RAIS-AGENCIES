import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Sparkles } from 'lucide-react';

interface VerifiedSpotlight {
  id: string;
  name: string;
  brand: string;
  pack: string;
  sku: string;
  image: string;
}

const VERIFIED_SPOTLIGHTS: VerifiedSpotlight[] = [
  {
    id: 'triangle',
    name: 'ITC Cheesy Corn Triangle',
    brand: 'ITC Master Chef',
    pack: '1 kg Packet',
    sku: 'RAIS-VEG-07',
    image: '/images/cheesy_triangle.jpg'
  },
  {
    id: 'patty',
    name: 'Nutrich Chicken Burger Patty',
    brand: 'Nutrich',
    pack: '1 kg Packet',
    sku: 'RAIS-CHK-06',
    image: '/images/chicken_patty.jpg'
  },
  {
    id: 'cheese',
    name: 'Milky Mist Mozzarella Diced Cheese',
    brand: 'Milky Mist',
    pack: '2 kg Packet',
    sku: 'RAIS-CHS-01',
    image: '/images/mozzarella_cheese.jpg'
  },
  {
    id: 'sauces',
    name: 'Del Monte Tomato Ketchup & Sauces',
    brand: 'Del Monte',
    pack: '1.1 kg Packet',
    sku: 'RAIS-SAU-01',
    image: '/images/gourmet_sauces.jpg'
  },
  {
    id: 'boxes',
    name: 'Commercial Pizza & Burger Boxes',
    brand: 'Packaging Solutions',
    pack: '100 Nos Pack',
    sku: 'RAIS-BOX-01',
    image: '/images/burger_boxes.jpg'
  }
];

export const ThreeHeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeSpotlight, setActiveSpotlight] = useState<VerifiedSpotlight>(VERIFIED_SPOTLIGHTS[0]);
  const [show3D, setShow3D] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setShow3D(false);
    }
  }, []);

  useEffect(() => {
    if (!show3D || !mountRef.current) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;

    try {
      const container = mountRef.current;
      const width = container.clientWidth || 450;
      const height = container.clientHeight || 480;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.0);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // Root group for mouse rotation and tilt
      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // 1. Bespoke RAIS 3D Diamond Crest
      // Create a faceted diamond gem geometry using custom vertices or high-quality faceted geometry
      const diamondShape = new THREE.Shape();
      diamondShape.moveTo(0, 1.4);
      diamondShape.lineTo(1.1, 0);
      diamondShape.lineTo(0, -1.4);
      diamondShape.lineTo(-1.1, 0);
      diamondShape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: 0.35,
        bevelEnabled: true,
        bevelThickness: 0.18,
        bevelSize: 0.15,
        bevelSegments: 3
      };

      const diamondGeo = new THREE.ExtrudeGeometry(diamondShape, extrudeSettings);
      diamondGeo.center();

      // Gold Metallic Material matching RAIS monogram
      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4AF37, // Rich metallic gold
        metalness: 0.85,
        roughness: 0.22,
        transparent: true,
        opacity: 0.95
      });
      const diamondMesh = new THREE.Mesh(diamondGeo, goldMaterial);
      rootGroup.add(diamondMesh);

      // Inner Frosted Core Prism
      const innerGeo = new THREE.OctahedronGeometry(0.85, 1);
      const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0x38BDF8, // Cold-chain cyan
        metalness: 0.4,
        roughness: 0.15,
        transparent: true,
        opacity: 0.65,
        wireframe: false
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMaterial);
      rootGroup.add(innerMesh);

      // Delicate gold wireframe contour
      const wireGeo = new THREE.WireframeGeometry(diamondGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: 0xFFFBEB,
        transparent: true,
        opacity: 0.35
      });
      const wireLine = new THREE.LineSegments(wireGeo, wireMat);
      rootGroup.add(wireLine);

      // Orbital Cold-Chain Rings
      const ringGeo = new THREE.TorusGeometry(1.9, 0.025, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xBAE6FD,
        transparent: true,
        opacity: 0.5
      });
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      ring1.rotation.x = Math.PI / 2.6;
      ring1.rotation.y = Math.PI / 6;
      rootGroup.add(ring1);

      const ring2 = new THREE.Mesh(ringGeo, ringMat);
      ring2.rotation.x = -Math.PI / 2.8;
      ring2.rotation.y = -Math.PI / 5;
      ring2.scale.set(0.85, 0.85, 0.85);
      rootGroup.add(ring2);

      // Sub-zero micro particles
      const particleCount = 45;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        const theta = Math.random() * Math.PI * 2;
        const radius = 1.3 + Math.random() * 1.5;
        pPos[i] = Math.cos(theta) * radius;
        pPos[i + 1] = (Math.random() - 0.5) * 3;
        pPos[i + 2] = Math.sin(theta) * radius;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xE0F2FE,
        size: 0.045,
        transparent: true,
        opacity: 0.75
      });
      const particles = new THREE.Points(pGeo, pMat);
      rootGroup.add(particles);

      // Lighting system
      const keyLight = new THREE.DirectionalLight(0xFFF7ED, 2.2);
      keyLight.position.set(3, 4, 4);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x38BDF8, 2.0);
      rimLight.position.set(-3, -2, -2);
      scene.add(rimLight);

      const ambient = new THREE.AmbientLight(0x0f172a, 1.6);
      scene.add(ambient);

      // Mouse Parallax
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      };

      container.addEventListener('mousemove', handleMouseMove);

      let isPaused = false;
      const observer = new IntersectionObserver(([entry]) => {
        isPaused = !entry.isIntersecting;
      }, { threshold: 0.1 });
      observer.observe(container);

      // Render Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        if (isPaused) return;

        const elapsed = clock.getElapsedTime();

        // Smooth mouse follow
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        rootGroup.rotation.y = elapsed * 0.35 + targetX * 0.8;
        rootGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.1 + targetY * 0.5;

        // Inner core gentle counter-rotation
        innerMesh.rotation.y = -elapsed * 0.5;
        innerMesh.rotation.z = Math.cos(elapsed * 0.4) * 0.2;

        // Orbiting rings
        ring1.rotation.z = elapsed * 0.2;
        ring2.rotation.z = -elapsed * 0.25;

        // Particles gentle pulsing
        particles.rotation.y = elapsed * 0.1;

        renderer?.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || 400;
        const h = container.clientHeight || 450;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animId);
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousemove', handleMouseMove);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (e) {
      console.warn('3D initialization fallback triggered:', e);
    }
  }, [show3D]);

  return (
    <div className="relative w-full h-full min-h-[420px] sm:min-h-[500px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl flex flex-col justify-between">
      {/* Background authentic studio photography of currently active verified product */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeSpotlight.image}
          alt={activeSpotlight.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            show3D ? 'opacity-25 blur-[1px] scale-105' : 'opacity-95 scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20 pointer-events-none" />
      </div>

      {/* Top Header: Clean controls & view toggle */}
      <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Verified Studio Photography
          </span>
        </div>

        {!isReducedMotion && (
          <button
            onClick={() => setShow3D(!show3D)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] font-semibold transition-all shadow-sm"
          >
            {show3D ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>View Full Photo</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive 3D Emblem</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 3D WebGL Canvas Layer */}
      {show3D && (
        <div
          ref={mountRef}
          className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center pointer-events-auto"
        />
      )}

      {/* Bottom: Authentic Spotlight Carousel Tabs */}
      <div className="relative z-20 p-4 sm:p-5 pt-0 space-y-3">
        {/* Active Item Description */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-left">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-amber-400 font-bold text-[11px]">
              {activeSpotlight.sku}
            </span>
            <span className="text-slate-400 text-[11px]">
              {activeSpotlight.brand} • {activeSpotlight.pack}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white leading-snug">
            {activeSpotlight.name}
          </h4>
        </div>

        {/* 5 Verified Products Selector Tabs */}
        <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md">
          {VERIFIED_SPOTLIGHTS.map((spotlight) => {
            const isSelected = activeSpotlight.id === spotlight.id;
            return (
              <button
                key={spotlight.id}
                onClick={() => setActiveSpotlight(spotlight)}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-all truncate text-center ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                title={spotlight.name}
              >
                {spotlight.id === 'triangle' && 'Triangles'}
                {spotlight.id === 'patty' && 'Patty'}
                {spotlight.id === 'cheese' && 'Mozzarella'}
                {spotlight.id === 'sauces' && 'Sauces'}
                {spotlight.id === 'boxes' && 'Boxes'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
