// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Menu as MenuIcon,
//   X as XIcon,
//   Check as CheckIcon,
//   Star as StarIcon,
//   ArrowRight as ArrowRightIcon,
//   BarChart3 as ChartBarIcon,
//   Settings as CogIcon,
//   ShieldCheck as ShieldCheckIcon,
//   Zap as BoltIcon,
//   Users as UserGroupIcon,
//   Code,
// } from 'lucide-react';

// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import * as THREE from "three";

// // Define the props interface for the logo component.
// interface LogoProps {
//   className?: string;
// }

// // Custom SVG for the new DB-Connect logo
// const DBConnectLogo = ({ className }: LogoProps) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     className={className}
//   >
//     <path
//       d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
//       className="text-gray-400"
//     />
//     <path
//       d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
//       className="text-indigo-500"
//     />
//     <path
//       d="M15 12h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2v-4z"
//       className="text-gray-100"
//     />
//     <path
//       d="M9 12h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H9v4z"
//       className="text-gray-100"
//     />
//     <path
//       d="M12 11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2z"
//       className="text-white"
//     />
//   </svg>
// );

// /* eslint-disable react/no-unknown-property */
// // The vertex shader remains the same. It's a simple pass-through shader.
// const waveVertexShader = `
// precision highp float;
// varying vec2 vUv;
// void main() {
//   vUv = uv;
//   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//   vec4 viewPosition = viewMatrix * modelPosition;
//   gl_Position = projectionMatrix * viewPosition;
// }
// `;

// // This is the new, combined fragment shader.
// // It first generates the wave pattern, then applies the dithering effect.
// const ditheredWaveFragmentShader = `
// precision highp float;
// varying vec2 vUv;
// uniform vec2 resolution;
// uniform float time;
// uniform float waveSpeed;
// uniform float waveFrequency;
// uniform float waveAmplitude;
// uniform vec3 waveColor;
// uniform vec2 mousePos;
// uniform int enableMouseInteraction;
// uniform float mouseRadius;
// uniform float colorNum;
// uniform float pixelSize;

// // Classic mod289 and permute functions for noise generation
// vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
// vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
// vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
// vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

// // Classic noise function
// float cnoise(vec2 P) {
//   vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
//   vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
//   Pi = mod289(Pi);
//   vec4 ix = Pi.xzxz;
// 4
//   vec4 iy = Pi.yyww;
//   vec4 fx = Pf.xzxz;
//   vec4 fy = Pf.yyww;
//   vec4 i = permute(permute(ix) + iy);
//   vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
//   vec4 gy = abs(gx) - 0.5;
//   vec4 tx = floor(gx + 0.5);
//   gx = gx - tx;
//   vec2 g00 = vec2(gx.x, gy.x);
//   vec2 g10 = vec2(gx.y, gy.y);
//   vec2 g01 = vec2(gx.z, gy.z);
//   vec2 g11 = vec2(gx.w, gy.w);
//   vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
//   g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
//   float n00 = dot(g00, vec2(fx.x, fy.x));
//   float n10 = dot(g10, vec2(fx.y, fy.y));
//   float n01 = dot(g01, vec2(fx.z, fy.z));
//   float n11 = dot(g11, vec2(fx.w, fy.w));
//   vec2 fade_xy = fade(Pf.xy);
//   vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
//   return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
// }

// const int OCTAVES = 4;
// float fbm(vec2 p) {
//   float value = 0.0;
//   float amp = 1.0;
//   float freq = waveFrequency;
//   for (int i = 0; i < OCTAVES; i++) {
//     value += amp * abs(cnoise(p));
//     p *= freq;
//     amp *= waveAmplitude;
//   }
//   return value;
// }

// float pattern(vec2 p) {
//   vec2 p2 = p - time * waveSpeed;
//   return fbm(p + fbm(p2)); 
// }

// // Dithering constants and function
// const float bayerMatrix8x8[64] = float[64](
//   0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
//   32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
//   8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
//   40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
//   2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
//   34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
//   10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
//   42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
// );

// vec3 dither(vec2 uv, vec3 color) {
//   vec2 scaledCoord = floor(uv * resolution / pixelSize);
//   int x = int(mod(scaledCoord.x, 8.0));
//   int y = int(mod(scaledCoord.y, 8.0));
//   float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
//   float step = 1.0 / (colorNum - 1.0);
//   color += threshold * step;
//   float bias = 0.2;
//   color = clamp(color - bias, 0.0, 1.0);
//   return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
// }

// void main() {
//   vec2 uv = gl_FragCoord.xy / resolution.xy;
//   uv -= 0.5;
//   uv.x *= resolution.x / resolution.y;
  
//   // 1. Generate the wave pattern
//   float f = pattern(uv);
//   if (enableMouseInteraction == 1) {
//     vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
//     mouseNDC.x *= resolution.x / resolution.y;
//     float dist = length(uv - mouseNDC);
//     float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
//     f -= 0.5 * effect;
//   }
//   vec3 col = mix(vec3(0.0), waveColor, f);
  
//   // 2. Apply the dithering effect
//   vec2 normalizedPixelSize = pixelSize / resolution;
//   vec2 uvPixel = normalizedPixelSize * floor(gl_FragCoord.xy / normalizedPixelSize);
//   vec3 ditheredColor = dither(gl_FragCoord.xy, col);
  
//   gl_FragColor = vec4(ditheredColor, 1.0);
// }
// `;

// // Props for the DitheredWaves component
// interface DitheredWavesProps {
//   waveSpeed: number;
//   waveFrequency: number;
//   waveAmplitude: number;
//   waveColor: [number, number, number];
//   colorNum: number;
//   pixelSize: number;
//   disableAnimation: boolean;
//   enableMouseInteraction: boolean;
//   mouseRadius: number;
// }

// // Props for the main Dither component
// interface DitherProps {
//   waveSpeed?: number;
//   waveFrequency?: number;
//   waveAmplitude?: number;
//   waveColor?: [number, number, number];
//   colorNum?: number;
//   pixelSize?: number;
//   disableAnimation?: boolean;
//   enableMouseInteraction?: boolean;
//   mouseRadius?: number;
// }

// function DitheredWaves({
//   waveSpeed,
//   waveFrequency,
//   waveAmplitude,
//   waveColor,
//   colorNum,
//   pixelSize,
//   disableAnimation,
//   enableMouseInteraction,
//   mouseRadius,
// }: DitheredWavesProps) {
//   const mesh = useRef<THREE.Mesh | null>(null);
//   const mouseRef = useRef(new THREE.Vector2());
//   const { viewport, size, gl } = useThree();

//   const waveUniformsRef = useRef<{ 
//     time: THREE.Uniform<number>;
//     resolution: THREE.Uniform<THREE.Vector2>;
//     waveSpeed: THREE.Uniform<number>;
//     waveFrequency: THREE.Uniform<number>;
//     waveAmplitude: THREE.Uniform<number>;
//     waveColor: THREE.Uniform<THREE.Color>;
//     mousePos: THREE.Uniform<THREE.Vector2>;
//     enableMouseInteraction: THREE.Uniform<number>;
//     mouseRadius: THREE.Uniform<number>;
//     colorNum: THREE.Uniform<number>;
//     pixelSize: THREE.Uniform<number>;
//   }>({
//     time: new THREE.Uniform(0),
//     resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
//     waveSpeed: new THREE.Uniform(waveSpeed),
//     waveFrequency: new THREE.Uniform(waveFrequency),
//     waveAmplitude: new THREE.Uniform(waveAmplitude),
//     waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
//     mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
//     enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
//     mouseRadius: new THREE.Uniform(mouseRadius),
//     colorNum: new THREE.Uniform(colorNum),
//     pixelSize: new THREE.Uniform(pixelSize),
//   });

//   useEffect(() => {
//     const dpr = gl.getPixelRatio();
//     const w = Math.floor(size.width * dpr),
//       h = Math.floor(size.height * dpr);
//     const res = waveUniformsRef.current.resolution.value;
//     if (res.x !== w || res.y !== h) {
//       res.set(w, h);
//     }
//   }, [size, gl]);

//   const prevColor = useRef([...waveColor]);
//   useFrame(({ clock }) => {
//     const u = waveUniformsRef.current;

//     if (!disableAnimation) {
//       u.time.value = clock.getElapsedTime();
//     }

//     if (u.waveSpeed.value !== waveSpeed) u.waveSpeed.value = waveSpeed;
//     if (u.waveFrequency.value !== waveFrequency)
//       u.waveFrequency.value = waveFrequency;
//     if (u.waveAmplitude.value !== waveAmplitude)
//       u.waveAmplitude.value = waveAmplitude;

//     if (!prevColor.current.every((v, i) => v === waveColor[i])) {
//       u.waveColor.value.set(...waveColor);
//       prevColor.current = [...waveColor];
//     }

//     u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
//     u.mouseRadius.value = mouseRadius;
//     u.colorNum.value = colorNum;
//     u.pixelSize.value = pixelSize;

//     if (enableMouseInteraction) {
//       u.mousePos.value.copy(mouseRef.current);
//     }
//   });

//   const handlePointerMove = (e: { clientX: number; clientY: number; }) => {
//     if (!enableMouseInteraction) return;
//     const rect = gl.domElement.getBoundingClientRect();
//     const dpr = gl.getPixelRatio();
//     mouseRef.current.set(
//       (e.clientX - rect.left) * dpr,
//       (e.clientY - rect.top) * dpr
//     );
//   };

//   return (
//     <>
//       <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
//         <planeGeometry args={[1, 1]} />
//         <shaderMaterial
//           vertexShader={waveVertexShader}
//           fragmentShader={ditheredWaveFragmentShader}
//           uniforms={waveUniformsRef.current}
//         />
//       </mesh>
      
//       <mesh
//         onPointerMove={handlePointerMove}
//         position={[0, 0, 0.01]}
//         scale={[viewport.width, viewport.height, 1]}
//         visible={false}
//       >
//         <planeGeometry args={[1, 1]} />
//         <meshBasicMaterial transparent opacity={0} />
//       </mesh>
//     </>
//   );
// }

// // Corrected Dither component with explicit props typing
// export default function Dither({
//   waveSpeed = 0.05,
//   waveFrequency = 3,
//   waveAmplitude = 0.3,
//   waveColor = [0.5, 0.5, 0.5],
//   colorNum = 4,
//   pixelSize = 2,
//   disableAnimation = false,
//   enableMouseInteraction = true,
//   mouseRadius = 1,
// }: DitherProps) {
//   return (
//     <Canvas
//       className="w-full h-full relative"
//       camera={{ position: [0, 0, 6] }}
//       dpr={window.devicePixelRatio}
//       gl={{ antialias: true, preserveDrawingBuffer: true }}
//     >
//       <DitheredWaves
//         waveSpeed={waveSpeed}
//         waveFrequency={waveFrequency}
//         waveAmplitude={waveAmplitude}
//         waveColor={waveColor}
//         colorNum={colorNum}
//         pixelSize={pixelSize}
//         disableAnimation={disableAnimation}
//         enableMouseInteraction={enableMouseInteraction}
//         mouseRadius={mouseRadius}
//       />
//     </Canvas>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import {
  Menu as MenuIcon,
  X as XIcon,
  Check as CheckIcon,
  Star as StarIcon,
  ArrowRight as ArrowRightIcon,
  BarChart3 as ChartBarIcon,
  Settings as CogIcon,
  ShieldCheck as ShieldCheckIcon,
  Zap as BoltIcon,
  Users as UserGroupIcon,
  Code,
} from 'lucide-react';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Define the props interface for the logo component.
interface LogoProps {
  className?: string;
}

// Custom SVG for the new DB-Connect logo
const DBConnectLogo = ({ className }: LogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
      className="text-gray-400"
    />
    <path
      d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
      className="text-indigo-500"
    />
    <path
      d="M15 12h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2v-4z"
      className="text-gray-100"
    />
    <path
      d="M9 12h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H9v4z"
      className="text-gray-100"
    />
    <path
      d="M12 11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2z"
      className="text-white"
    />
  </svg>
);

// The vertex shader remains the same. It's a simple pass-through shader.
const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

// This is the new, combined fragment shader.
// It first generates the wave pattern, then applies the dithering effect.
const ditheredWaveFragmentShader = `
precision highp float;
varying vec2 vUv;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform float colorNum;
uniform float pixelSize;

// Classic mod289 and permute functions for noise generation
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

// Classic noise function
float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2)); 
}

// Dithering constants and function
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  
  // 1. Generate the wave pattern
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  
  // 2. Apply the dithering effect
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(gl_FragCoord.xy / normalizedPixelSize);
  vec3 ditheredColor = dither(gl_FragCoord.xy, col);
  
  gl_FragColor = vec4(ditheredColor, 1.0);
}
`;

/**
 * @typedef {Object} DitheredWavesProps
 * @property {number} waveSpeed - The speed of the wave animation.
 * @property {number} waveFrequency - The frequency of the wave, controlling density.
 * @property {number} waveAmplitude - The amplitude of the wave, controlling height.
 * @property {[number, number, number]} waveColor - The color of the wave in RGB.
 * @property {number} colorNum - The number of colors to use for dithering.
 * @property {number} pixelSize - The size of the dithered pixels.
 * @property {boolean} disableAnimation - Whether to stop the wave animation.
 * @property {boolean} enableMouseInteraction - Whether the mouse affects the wave.
 * @property {number} mouseRadius - The radius of the mouse interaction effect.
 */
interface DitheredWavesProps {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
}

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius,
}: DitheredWavesProps) {
  const mesh = useRef<THREE.Mesh | null>(null);
  const mouseRef = useRef(new THREE.Vector2());
  const { viewport, size, gl } = useThree();

  const waveUniformsRef = useRef<{ 
    time: THREE.Uniform<number>;
    resolution: THREE.Uniform<THREE.Vector2>;
    waveSpeed: THREE.Uniform<number>;
    waveFrequency: THREE.Uniform<number>;
    waveAmplitude: THREE.Uniform<number>;
    waveColor: THREE.Uniform<THREE.Color>;
    mousePos: THREE.Uniform<THREE.Vector2>;
    enableMouseInteraction: THREE.Uniform<number>;
    mouseRadius: THREE.Uniform<number>;
    colorNum: THREE.Uniform<number>;
    pixelSize: THREE.Uniform<number>;
  }>({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius),
    colorNum: new THREE.Uniform(colorNum),
    pixelSize: new THREE.Uniform(pixelSize),
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const w = Math.floor(size.width * dpr),
      h = Math.floor(size.height * dpr);
    const res = waveUniformsRef.current.resolution.value;
    if (res.x !== w || res.y !== h) {
      res.set(w, h);
    }
  }, [size, gl]);

  const prevColor = useRef([...waveColor]);
  useFrame(({ clock }) => {
    const u = waveUniformsRef.current;

    if (!disableAnimation) {
      u.time.value = clock.getElapsedTime();
    }

    if (u.waveSpeed.value !== waveSpeed) u.waveSpeed.value = waveSpeed;
    if (u.waveFrequency.value !== waveFrequency)
      u.waveFrequency.value = waveFrequency;
    if (u.waveAmplitude.value !== waveAmplitude)
      u.waveAmplitude.value = waveAmplitude;

    if (!prevColor.current.every((v, i) => v === waveColor[i])) {
      u.waveColor.value.set(...waveColor);
      prevColor.current = [...waveColor];
    }

    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    u.mouseRadius.value = mouseRadius;
    u.colorNum.value = colorNum;
    u.pixelSize.value = pixelSize;

    if (enableMouseInteraction) {
      u.mousePos.value.copy(mouseRef.current);
    }
  });

  const handlePointerMove = (e: { clientX: number; clientY: number; }) => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    mouseRef.current.set(
      (e.clientX - rect.left) * dpr,
      (e.clientY - rect.top) * dpr
    );
  };

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={ditheredWaveFragmentShader}
          uniforms={waveUniformsRef.current}
        />
      </mesh>
      
      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

/**
 * @typedef {Object} DitherProps
 * @property {number} [waveSpeed=0.05] - The speed of the wave animation.
 * @property {number} [waveFrequency=3] - The frequency of the wave.
 * @property {number} [waveAmplitude=0.3] - The amplitude of the wave.
 * @property {[number, number, number]} [waveColor=[0.5, 0.5, 0.5]] - The RGB color of the wave.
 * @property {number} [colorNum=4] - The number of colors for dithering.
 * @property {number} [pixelSize=2] - The size of the dithered pixels.
 * @property {boolean} [disableAnimation=false] - Whether to disable the wave animation.
 * @property {boolean} [enableMouseInteraction=true] - Whether the mouse affects the wave.
 * @property {number} [mouseRadius=1] - The radius of the mouse interaction effect.
 * @property {React.ReactNode} [children] - The content to be rendered on top of the dithered background.
 */
interface DitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  children?: React.ReactNode;
}

// Corrected Dither component with explicit props typing
export default function App({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
  children,
}: DitherProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-inter">
      {/* This Canvas element will now render the dithered background */}
      <Canvas
        className="absolute top-0 left-0 w-full h-full -z-10"
        camera={{ position: [0, 0, 6] }}
        dpr={window.devicePixelRatio}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <DitheredWaves
          waveSpeed={waveSpeed}
          waveFrequency={waveFrequency}
          waveAmplitude={waveAmplitude}
          waveColor={waveColor}
          colorNum={colorNum}
          pixelSize={pixelSize}
          disableAnimation={disableAnimation}
          enableMouseInteraction={enableMouseInteraction}
          mouseRadius={mouseRadius}
        />
      </Canvas>

      {/* This is the content that will be rendered on top of the Canvas. */}
      {/* We use a relative position and z-index to ensure it sits above the background. */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
        <header className="absolute top-0 left-0 w-full p-6 backdrop-blur-sm bg-slate-900 bg-opacity-70 rounded-b-xl shadow-lg border-b border-slate-700">
            <div className="flex items-center justify-between">
                <a href="#" className="text-xl font-bold text-teal-300">MyBrand</a>
                <nav className="space-x-4">
                    <a href="#" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Home</a>
                    <a href="#" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Features</a>
                    <a href="#" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Contact</a>
                </nav>
            </div>
        </header>

        <main className="text-center mt-24">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                Dynamic Backgrounds
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                Explore a new way to interact with your site's background.
            </p>
        </main>
      </div>
    </div>
  );
}
