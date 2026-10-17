import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
import { assetUrl } from '../utils/assetUrl';

interface SatelliteItem {
  src: string;
  alt: string;
  offset: number;
  label: string;
  badge: string;
}

const SATELLITE_ITEMS: SatelliteItem[] = [
  {
    src: assetUrl('/images/ref-assets/hero_momos_cutout.png'),
    alt: 'Steamed Momos',
    offset: 0,
    label: 'ITC Chicken Momos',
    badge: 'IQF -18°C'
  },
  {
    src: assetUrl('/images/ref-assets/hero_fries_cutout.png'),
    alt: 'French Fries',
    offset: Math.PI * 0.5,
    label: 'Shoestring Fries',
    badge: '9mm Grade-A'
  },
  {
    src: assetUrl('/images/ref-assets/hero_popcorn_cutout.png'),
    alt: 'Chicken Popcorn',
    offset: Math.PI,
    label: 'Crispy Nuggets & Pops',
    badge: 'High-Hold Crisp'
  },
  {
    src: assetUrl('/images/ref-assets/hero_cheese_cutout.png'),
    alt: 'Mozzarella & Paneer',
    offset: Math.PI * 1.5,
    label: 'Malai Paneer Cubes',
    badge: '100% Dairy'
  }
];

export const HeroFoodStage: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 45, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 15 });

  const rotateY = useTransform(springX, [-1, 1], [-14, 14]);
  const rotateX = useTransform(springY, [-1, 1], [10, -10]);

  // Orbit rotation angle driven by animation frame
  const [angle, setAngle] = useState(0);

  useAnimationFrame((time) => {
    // Smooth continuous revolution around central stack (1 full loop in ~12 seconds)
    setAngle((time / 2000) % (Math.PI * 2));
  });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto [perspective:1400px] select-none">
      
      {/* 3D Tilting Stage Plane */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        className="relative w-full h-full"
      >
        {/* Overhead Conical Cyan Light Beam */}
        <div
          className="absolute left-1/2 top-0 h-[72%] w-[48%] -translate-x-1/2 bg-gradient-to-b from-cyan-400/0 via-cyan-400/15 to-cyan-400/0 blur-2xl pointer-events-none"
          style={{ clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)' }}
        />

        {/* Illuminated Cryogenic Pedestal / Ice Plinth Platform */}
        <div className="absolute left-1/2 top-[65%] h-[24%] w-[88%] -translate-x-1/2 pointer-events-none">
          {/* Cyan radial glow aura */}
          <motion.div
            animate={{ opacity: [0.65, 1, 0.65], scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-[50%] bg-[radial-gradient(ellipse,rgba(0,210,255,0.55),rgba(30,58,138,0.3)_45%,transparent_72%)] blur-xl"
          />
          {/* Outer dashed orbit track */}
          <div className="absolute inset-[3%] rounded-[50%] border-2 border-dashed border-cyan-300/35 animate-[spin_60s_linear_infinite]" />
          {/* Inner frosted ice lens */}
          <div className="absolute inset-[10%] rounded-[50%] border border-cyan-200/60 bg-gradient-to-b from-white/20 via-sky-400/10 to-transparent shadow-[0_0_60px_rgba(0,210,255,0.55),inset_0_0_30px_rgba(255,255,255,0.3)] backdrop-blur-md" />
        </div>

        {/* Concentric ambient orbital guide ring */}
        <div className="absolute left-[8%] top-[45%] h-[32%] w-[84%] rounded-[50%] border border-cyan-200/15 pointer-events-none" />

        {/* Central Master Food Stack (Burger + Paneer Blocks + Fries) */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[20%] z-20 w-[60%] -translate-x-1/2 drop-shadow-[0_25px_35px_rgba(0,0,0,0.65)]"
        >
          <motion.img
            src={assetUrl('/images/ref-assets/hero_burger_stack.png')}
            alt="RAIS Wholesale Frozen Food Portfolio"
            initial={{ rotateY: -80, scale: 0.5, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 50, damping: 12, delay: 0.2 }}
            className="w-full h-auto object-contain pointer-events-none filter drop-shadow-[0_15px_25px_rgba(0,210,255,0.25)]"
            draggable={false}
          />
        </motion.div>

        {/* Orbiting Satellite Food Items in 3D Elliptical Paths */}
        {SATELLITE_ITEMS.map((item) => {
          const currentAngle = angle + item.offset;
          // Elliptical perspective orbit coordinates
          const xRadius = 42; // percentage of stage width
          const yRadius = 15; // compressed vertical axis for 3D tilt perspective
          const xPercent = 50 + Math.cos(currentAngle) * xRadius;
          const yPercent = 52 + Math.sin(currentAngle) * yRadius;

          // Depth sorting: if sin(angle) > 0, item is in foreground; if < 0, background
          const isForeground = Math.sin(currentAngle) > 0;
          const scale = isForeground ? 1.05 : 0.82;
          const opacity = isForeground ? 1 : 0.65;
          const zIndex = isForeground ? 30 : 10;

          return (
            <motion.div
              key={item.alt}
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: 'translate(-50%, -50%)',
                zIndex
              }}
              animate={{
                scale,
                opacity
              }}
              transition={{ duration: 0.15 }}
              className="absolute group cursor-pointer"
            >
              {/* Product Disc */}
              <div className="relative p-2 rounded-2xl bg-[#0f1c3f]/85 border border-cyan-400/40 shadow-xl shadow-black/60 backdrop-blur-md transition-transform duration-300 group-hover:scale-115">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_4px_10px_rgba(0,210,255,0.35)]"
                  draggable={false}
                />
                
                {/* Floating Micro Tooltip on Hover */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-[#081026]/95 border border-cyan-400/50 text-[10px] font-bold text-cyan-200 px-2 py-0.5 rounded-full shadow-lg">
                  {item.label} · {item.badge}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Cold-Chain Status Micro-Badge */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[4%] top-[12%] flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f1c3f]/90 border border-cyan-400/40 shadow-xl backdrop-blur-md pointer-events-none z-20"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider">-18°C IQF Certified</span>
        </motion.div>

        {/* FSSAI Commercial Seal Micro-Badge */}
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-[4%] top-[22%] hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f1c3f]/90 border border-cyan-400/40 shadow-xl backdrop-blur-md pointer-events-none z-20"
        >
          <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider">FSSAI Certified</span>
        </motion.div>

        {/* Floating Verified Brand Authority Badge (Top Right) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 0.8 },
            x: { delay: 0.8 },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute right-0 top-[6%] hidden sm:block rounded-2xl border border-white/20 bg-[#0f1c3f]/85 px-4 py-2.5 shadow-2xl backdrop-blur-xl z-40"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">
            Authorised Wholesale
          </div>
          <div className="pt-0.5 text-xs sm:text-sm font-semibold text-white">
            McCain · ITC Master Chef · Milky Mist
          </div>
        </motion.div>

        {/* Floating Operational Stock Badge (Bottom Left) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1 },
            x: { delay: 1 },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute bottom-[4%] left-0 hidden sm:flex items-center gap-2.5 rounded-2xl border border-white/20 bg-[#0f1c3f]/85 px-4 py-2.5 shadow-2xl backdrop-blur-xl z-40"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs sm:text-sm font-semibold text-white">
            In stock · Same-day Rayachoty dispatch
          </span>
        </motion.div>

      </motion.div>
    </div>
  );
};
