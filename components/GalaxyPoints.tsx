"use client";
import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

type GalaxyPointsProps = {
  count?: number;
};

// Utility to convert hex to THREE.Color
const hex = (h: string) => new THREE.Color(h);

const C1 = hex('#4DA8DA'); // azzurro
const C2 = hex('#52357B'); // viola
const C3 = hex('#468A9A'); // teal

export default function GalaxyPoints({ count = 12000 }: GalaxyPointsProps) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const { size } = useThree();

  const isMobile = size.width < 768;
  const finalCount = Math.floor(isMobile ? count * 0.45 : count);

  const { positions, colors, scales, seeds } = useMemo(() => {
    const positions = new Float32Array(finalCount * 3);
    const colors = new Float32Array(finalCount * 3);
    const scales = new Float32Array(finalCount);
    const seeds = new Float32Array(finalCount);

    const tmp = new THREE.Vector3();
    for (let i = 0; i < finalCount; i++) {
      // Distribute in a soft galaxy-like sphere with denser center
      const r = Math.pow(Math.random(), 1.5) * 6.0; // radius
      const phi = Math.random() * 2 * Math.PI;
      const costh = Math.random() * 2 - 1;
      const sinth = Math.sqrt(1 - costh * costh);
      tmp.set(r * sinth * Math.cos(phi), r * sinth * Math.sin(phi), r * costh);

      positions[i * 3 + 0] = tmp.x;
      positions[i * 3 + 1] = tmp.y;
      positions[i * 3 + 2] = tmp.z;

      // Color as a soft gradient mix between three palette colors
      const t1 = Math.random();
      const t2 = Math.random() * (1 - t1);
      const t3 = 1 - t1 - t2;
      const col = C1.clone().multiplyScalar(t1);
      col.add(C2.clone().multiplyScalar(t2));
      col.add(C3.clone().multiplyScalar(t3));
      colors[i * 3 + 0] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      scales[i] = 0.4 + Math.random() * 0.9; // size variance
      seeds[i] = Math.random() * 1000; // phase seed
    }

    return { positions, colors, scales, seeds };
  }, [finalCount]);

  // --- Shape morphing setup ---
  const basePositions = useRef<Float32Array>(positions);
  const offsetRef = useRef<number>(0);
  const morphStartRef = useRef<number>(0);
  const morphDurationRef = useRef<number>(8); // seconds per morph
  const lastTimeRef = useRef<number>(0);

  const shapesRef = useRef<{ sets: Float32Array[]; idxA: number; idxB: number }>(
    { sets: [], idxA: 0, idxB: 1 }
  );

  // Pseudo-random helper deterministic per index
  const rnd = (i: number, k: number) => {
    const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const buildShapes = (offset: number) => {
    const count = finalCount;
    const ak = new Float32Array(count * 3);
    const sphere = new Float32Array(count * 3);
    const torus = new Float32Array(count * 3);
    const helix = new Float32Array(count * 3);
    const swirl = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = rnd(i, 1 + offset);
      const v = rnd(i, 2 + offset);
      const w = rnd(i, 3 + offset);

      // "AK" letters built from simple stroke segments in XY plane
      // Layout params
      const H = 4.0; // letter height
      const WA = 1.8; // A width
      const WK = 1.8; // K width
      const gap = 0.9; // spacing between letters
      const ax = - (WA * 0.5 + gap * 0.5); // center X for A
      const kx =   (WK * 0.5 + gap * 0.5); // center X for K
      const jitter = 0.06; // thickness jitter

      // Choose letter and stroke based on rnd
      const chooseLetter = v < 0.5 ? 'A' : 'K';
      const tStroke = u; // position along stroke
      const r1 = rnd(i, 7 + offset);
      const r2 = rnd(i, 8 + offset);
      const jx = (r1 - 0.5) * jitter;
      const jy = (r2 - 0.5) * jitter;
      const jz = (w - 0.5) * 0.2;

      let px = 0, py = 0, pz = jz;
      if (chooseLetter === 'A') {
        // A strokes: left diag, right diag, crossbar
        // Points of the A in local space around (0,0)
        const A_top = new THREE.Vector2(0, H * 0.5);
        const A_left = new THREE.Vector2(-WA * 0.5, -H * 0.5);
        const A_right = new THREE.Vector2(WA * 0.5, -H * 0.5);
        const A_barL = new THREE.Vector2(-WA * 0.25, 0);
        const A_barR = new THREE.Vector2(WA * 0.25, 0);

        // pick stroke
        const sPick = rnd(i, 9 + offset);
        let from = A_left, to = A_top;
        if (sPick < 1 / 3) {
          // left diagonal
          from = A_left; to = A_top;
        } else if (sPick < 2 / 3) {
          // right diagonal
          from = A_right; to = A_top;
        } else {
          // crossbar
          from = A_barL; to = A_barR;
        }
        px = ax + from.x + (to.x - from.x) * tStroke + jx;
        py = from.y + (to.y - from.y) * tStroke + jy;
      } else {
        // K strokes: vertical bar, upper diag, lower diag
        const K_bot = new THREE.Vector2(0, -H * 0.5);
        const K_top = new THREE.Vector2(0, H * 0.5);
        const K_mid = new THREE.Vector2(0, 0);
        const K_ur = new THREE.Vector2(WK * 0.6, H * 0.5);
        const K_lr = new THREE.Vector2(WK * 0.6, -H * 0.5);

        const sPick = rnd(i, 10 + offset);
        let from = K_bot, to = K_top;
        if (sPick < 1 / 3) {
          // vertical bar
          from = K_bot; to = K_top;
        } else if (sPick < 2 / 3) {
          // upper diagonal
          from = K_mid; to = K_ur;
        } else {
          // lower diagonal
          from = K_mid; to = K_lr;
        }
        px = kx + from.x + (to.x - from.x) * tStroke + jx;
        py = from.y + (to.y - from.y) * tStroke + jy;
      }
      ak[i * 3 + 0] = px;
      ak[i * 3 + 1] = py;
      ak[i * 3 + 2] = pz;

      // Sphere (even-ish distribution)
      const theta = 2 * Math.PI * u;
      const z = 2 * v - 1; // [-1,1]
      const rxy = Math.sqrt(Math.max(0, 1 - z * z));
      const R = 4.5;
      sphere[i * 3 + 0] = R * rxy * Math.cos(theta);
      sphere[i * 3 + 1] = R * rxy * Math.sin(theta);
      sphere[i * 3 + 2] = R * z;

      // Torus
      const R1 = 3.2; // major radius
      const R2 = 1.2; // minor radius
      const a = 2 * Math.PI * u;
      const b = 2 * Math.PI * v;
      const cx = (R1 + R2 * Math.cos(b));
      torus[i * 3 + 0] = cx * Math.cos(a);
      torus[i * 3 + 1] = cx * Math.sin(a);
      torus[i * 3 + 2] = R2 * Math.sin(b);

      // Helix
      const turns = 3.0;
      const t = (u + w * 0.1) * 2 * Math.PI * turns;
      const hr = 2.6 + 0.6 * Math.sin(3 * v * Math.PI);
      helix[i * 3 + 0] = hr * Math.cos(t);
      helix[i * 3 + 1] = hr * Math.sin(t);
      helix[i * 3 + 2] = (v - 0.5) * 8.0;

      // Spiral galaxy-like swirl in XY plane
      const rr = Math.pow(u, 0.6) * 5.0;
      const arms = 3;
      const ang = rr * 1.4 + (Math.floor(v * arms) / arms) * Math.PI * 2 + w * 0.4;
      swirl[i * 3 + 0] = rr * Math.cos(ang);
      swirl[i * 3 + 1] = rr * Math.sin(ang);
      swirl[i * 3 + 2] = (w - 0.5) * 1.5;
    }

    // Start the cycle with the "AK" shape first
    shapesRef.current.sets = [ak, sphere, torus, helix, swirl];
    shapesRef.current.idxA = 0;
    shapesRef.current.idxB = 1;
  };

  useFrame(({ clock, mouse, viewport }) => {
    const t = clock.getElapsedTime();
    lastTimeRef.current = t;
    const pts = pointsRef.current;
    if (!pts) return;

    const geo = pts.geometry as THREE.BufferGeometry;
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    const sca = geo.getAttribute('aScale') as THREE.BufferAttribute;
    const sed = geo.getAttribute('aSeed') as THREE.BufferAttribute;

    const mouse3 = new THREE.Vector3(
      (mouse.x || 0) * viewport.width * 0.45,
      (mouse.y || 0) * viewport.height * 0.45,
      0
    );

    // Ensure shapes built
    if (shapesRef.current.sets.length === 0) buildShapes(offsetRef.current);

    const sets = shapesRef.current.sets;
    const a = sets[shapesRef.current.idxA];
    const b = sets[shapesRef.current.idxB];
    const dur = morphDurationRef.current;
    const s = Math.min(1, Math.max(0, (t - morphStartRef.current) / dur));
    const ease = s < 0.5 ? 4 * s * s * s : 1 - Math.pow(-2 * s + 2, 3) / 2; // easeInOutCubic

    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      // Morph target blending between shapes
      const tx = a[ix + 0] * (1 - ease) + b[ix + 0] * ease;
      const ty = a[ix + 1] * (1 - ease) + b[ix + 1] * ease;
      const tz = a[ix + 2] * (1 - ease) + b[ix + 2] * ease;

      // Gentle drift using sin waves, phase by seed
      const phase = sed.getX(i);
      const dx = Math.sin(tx * 0.6 + t * 0.25 + phase) * 0.06;
      const dy = Math.sin(ty * 0.5 + t * 0.22 + phase * 0.7) * 0.06;
      const dz = Math.sin(tz * 0.4 + t * 0.2 + phase * 0.3) * 0.06;

      // Subtle orbital swirl around Z
      const ang = 0.12 * Math.sin(t * 0.25 + phase * 2.1);
      const cosA = Math.cos(ang), sinA = Math.sin(ang);
      const rx = tx * cosA - ty * sinA;
      const ry = tx * sinA + ty * cosA;

      // Subtle mouse repulsion/attraction in view space
      const toMouseX = rx - mouse3.x;
      const toMouseY = ry - mouse3.y;
      const dist2 = toMouseX * toMouseX + toMouseY * toMouseY + 0.05;
      const falloff = 1.0 / (1.0 + dist2 * 0.6);
      const influence = Math.min(0.9, falloff * 1.8);

      // Desired target after effects
      const tx2 = rx + dx + toMouseX * influence * 0.12;
      const ty2 = ry + dy + toMouseY * influence * 0.12;
      const tz2 = tz + dz;

      // Smoothly approach target from current position
      const cx = pos.getX(i);
      const cy = pos.getY(i);
      const cz = pos.getZ(i);
      const lerp = 0.12;
      const nx = cx + (tx2 - cx) * lerp;
      const ny = cy + (ty2 - cy) * lerp;
      const nz = cz + (tz2 - cz) * lerp;

      pos.setXYZ(i, nx, ny, nz);

      // Flicker scale a touch
      const baseScale = sca.getX(i);
      const flicker = 0.85 + 0.15 * Math.sin(t * 1.2 + phase * 3.3);
      sca.setX(i, baseScale * flicker);
    }

    pos.needsUpdate = true;
    sca.needsUpdate = true;

    // Advance morph cycle
    if (s >= 1) {
      shapesRef.current.idxA = shapesRef.current.idxB;
      shapesRef.current.idxB = (shapesRef.current.idxB + 1) % shapesRef.current.sets.length;
      morphStartRef.current = t;
    }
  });

  const geometry = useMemo(() => new THREE.BufferGeometry(), []);

  // Initialize attributes once
  if (!geometry.hasAttribute('position')) {
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  }

  const material = useMemo(() => {
    const mat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    return mat;
  }, []);

  const ptsObject = useMemo(() => {
    const obj = new THREE.Points(geometry, material);
    obj.frustumCulled = false;
    return obj;
  }, [geometry, material]);

  const { scene, gl } = useThree();
  useEffect(() => {
    pointsRef.current = ptsObject;
    scene.add(ptsObject);
    // Initialize shapes and morph timing
    buildShapes(offsetRef.current);
    morphStartRef.current = 0;

    // Double click to regenerate and restart cycle
    const canvasEl: HTMLCanvasElement | null = (gl as any)?.domElement ?? null;
    const onDblClick = () => {
      // Randomly choose a new target shape (no regeneration)
      const setsLen = shapesRef.current.sets.length;
      if (setsLen > 1) {
        const current = shapesRef.current.idxA; // current base shape
        let next = Math.floor(Math.random() * (setsLen - 1));
        if (next >= current) next += 1; // skip current
        shapesRef.current.idxB = next;
      }
      morphStartRef.current = lastTimeRef.current;
    };
    if (canvasEl) canvasEl.addEventListener('dblclick', onDblClick);
    return () => {
      scene.remove(ptsObject);
      if (canvasEl) canvasEl.removeEventListener('dblclick', onDblClick);
    };
  }, [scene, ptsObject]);

  return null;
}
