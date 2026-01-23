'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

interface ThreeCanvasProps {
  visualType: 'engineer' | 'marketer' | 'creator';
}

export function ThreeCanvas({ visualType }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const engineerGroupRef = useRef<THREE.Group | null>(null);
  const marketerGroupRef = useRef<THREE.Group | null>(null);
  const creatorGroupRef = useRef<THREE.Group | null>(null);
  const linesRef = useRef<THREE.Line[]>([]);
  const rippleRingsRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  
  const visualTypeRef = useRef(visualType);
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    visualTypeRef.current = visualType;
  }, [visualType]);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  const getLineColor = useCallback(() => {
    return themeRef.current === 'dark' ? 0x60a5fa : 0x3b82f6;
  }, []);

  const getRippleColor = useCallback(() => {
    return themeRef.current === 'dark' ? 0xfcd34d : 0xd97706;
  }, []);

  const getParticleColor = useCallback(() => {
    return themeRef.current === 'dark' ? 0xf472b6 : 0xec4899;
  }, []);

  const updateEngineerColors = useCallback(() => {
    const colorHex = getLineColor();
    const isDark = themeRef.current === 'dark';
    linesRef.current.forEach((line) => {
      (line.material as THREE.LineBasicMaterial).color.setHex(colorHex);
      (line.material as THREE.LineBasicMaterial).opacity = isDark ? 0.5 : 0.3;
    });
  }, [getLineColor]);

  const updateRippleColors = useCallback(() => {
    const colorHex = getRippleColor();
    rippleRingsRef.current.forEach((ring) => {
      (ring.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
    });
  }, [getRippleColor]);

  const updateParticleColors = useCallback(() => {
    if (particlesRef.current) {
      const colorHex = getParticleColor();
      (particlesRef.current.material as THREE.PointsMaterial).color.setHex(colorHex);
    }
  }, [getParticleColor]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    camera.position.y = 5;
    camera.rotation.x = -0.05;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create Engineer Lines
    const createEngineerLines = (group: THREE.Group) => {
      const lineCount = 15;
      const pointsCount = 50;
      const width = 120;
      const depth = 60;

      for (let i = 0; i < lineCount; i++) {
        const points: THREE.Vector3[] = [];
        const z = (i / lineCount) * depth - depth / 2;

        for (let j = 0; j <= pointsCount; j++) {
          const x = (j / pointsCount) * width - width / 2;
          points.push(new THREE.Vector3(x, 0, z));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: getLineColor(),
          transparent: true,
          opacity: 0.4,
        });

        const line = new THREE.Line(geometry, material);
        line.userData = { originalZ: z, offset: i * 0.5 };
        linesRef.current.push(line);
        group.add(line);
      }
    };

    // Create Marketer Ripples
    const createMarketerRipples = (group: THREE.Group) => {
      const ringCount = 12;
      const geometry = new THREE.RingGeometry(1.8, 2.0, 64);

      for (let i = 0; i < ringCount; i++) {
        const material = new THREE.MeshBasicMaterial({
          color: getRippleColor(),
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
        });

        const ring = new THREE.Mesh(geometry, material);
        const startX = -60 + (i / ringCount) * 120;

        ring.position.set(startX, 0, 0);
        ring.position.z = (Math.random() - 0.5) * 10;

        ring.userData = {
          baseSpeed: 0.1 + Math.random() * 0.05,
          phaseOffset: Math.random() * Math.PI * 2,
        };

        rippleRingsRef.current.push(ring);
        group.add(ring);
      }
    };

    // Create Creator Particles (floating particles for creative/personal vibe)
    const createCreatorParticles = (group: THREE.Group) => {
      const particleCount = 200;
      const positions = new Float32Array(particleCount * 3);
      const velocities: number[] = [];

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        velocities.push(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        );
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.userData = { velocities };

      const material = new THREE.PointsMaterial({
        color: getParticleColor(),
        size: 0.8,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(geometry, material);
      particlesRef.current = particles;
      group.add(particles);
    };

    // Engineer Group
    const engineerGroup = new THREE.Group();
    engineerGroupRef.current = engineerGroup;
    createEngineerLines(engineerGroup);
    scene.add(engineerGroup);

    // Marketer Group
    const marketerGroup = new THREE.Group();
    marketerGroupRef.current = marketerGroup;
    createMarketerRipples(marketerGroup);
    scene.add(marketerGroup);

    // Creator Group
    const creatorGroup = new THREE.Group();
    creatorGroupRef.current = creatorGroup;
    createCreatorParticles(creatorGroup);
    scene.add(creatorGroup);

    // Set initial visibility
    engineerGroup.visible = visualTypeRef.current === 'engineer';
    marketerGroup.visible = visualTypeRef.current === 'marketer';
    creatorGroup.visible = visualTypeRef.current === 'creator';

    // Event listeners
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX - window.innerWidth / 2) * 0.1;
      mouseRef.current.y = (event.clientY - window.innerHeight / 2) * 0.1;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      const currentType = visualTypeRef.current;

      // Update visibility
      if (engineerGroupRef.current) {
        engineerGroupRef.current.visible = currentType === 'engineer';
      }
      if (marketerGroupRef.current) {
        marketerGroupRef.current.visible = currentType === 'marketer';
      }
      if (creatorGroupRef.current) {
        creatorGroupRef.current.visible = currentType === 'creator';
      }

      if (currentType === 'engineer' && engineerGroupRef.current?.visible) {
        // Engineer animation - flowing lines
        linesRef.current.forEach((line) => {
          const positions = (line.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
          const offset = (line.userData as { offset: number }).offset;
          for (let j = 0; j < positions.length; j += 3) {
            const x = positions[j];
            positions[j + 1] = Math.sin(x * 0.05 + time + offset) * 3;
          }
          line.geometry.attributes.position.needsUpdate = true;
        });
        engineerGroupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
      } else if (currentType === 'marketer' && marketerGroupRef.current?.visible) {
        // Marketer animation - flowing ripples
        const minX = -60;
        const maxX = 60;
        const totalDist = maxX - minX;

        rippleRingsRef.current.forEach((ring) => {
          ring.position.x += 0.2;

          if (ring.position.x > maxX) {
            ring.position.x = minX;
          }

          let progress = (ring.position.x - minX) / totalDist;
          progress = Math.max(0, Math.min(1, progress));

          const scale = 0.5 + progress * 3.5;
          ring.scale.set(scale, scale, 1);

          let opacity = 0;
          if (progress < 0.2) {
            opacity = progress / 0.2;
          } else if (progress > 0.7) {
            opacity = 1 - (progress - 0.7) / 0.3;
          } else {
            opacity = 1;
          }
          (ring.material as THREE.MeshBasicMaterial).opacity = opacity * 0.6;

          const targetY = mouseRef.current.y * 0.05;
          ring.position.y += (targetY - ring.position.y) * 0.05;
          ring.position.y += Math.sin(time * 2 + (ring.userData as { phaseOffset: number }).phaseOffset) * 0.02;

          ring.rotation.x = mouseRef.current.y * 0.001;
          ring.rotation.y = mouseRef.current.x * 0.001;
        });
      } else if (currentType === 'creator' && creatorGroupRef.current?.visible && particlesRef.current) {
        // Creator animation - floating particles
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = particlesRef.current.geometry.userData.velocities as number[];

        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.01;
          positions[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(time + i) * 0.01;
          positions[i * 3 + 2] += velocities[i * 3 + 2];

          // Boundary check and wrap around
          if (Math.abs(positions[i * 3]) > 50) positions[i * 3] *= -0.9;
          if (Math.abs(positions[i * 3 + 1]) > 50) positions[i * 3 + 1] *= -0.9;
          if (Math.abs(positions[i * 3 + 2]) > 25) positions[i * 3 + 2] *= -0.9;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        creatorGroupRef.current.rotation.y = time * 0.05;
        creatorGroupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Cleanup
      linesRef.current.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      rippleRingsRef.current.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
      
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      linesRef.current = [];
      rippleRingsRef.current = [];
      particlesRef.current = null;
    };
  }, [getLineColor, getRippleColor, getParticleColor]);

  // Update colors when theme changes
  useEffect(() => {
    if (visualType === 'engineer') {
      updateEngineerColors();
    } else if (visualType === 'marketer') {
      updateRippleColors();
    } else {
      updateParticleColors();
    }
  }, [resolvedTheme, visualType, updateEngineerColors, updateRippleColors, updateParticleColors]);

  return <div id="canvas-container" ref={containerRef} />;
}
