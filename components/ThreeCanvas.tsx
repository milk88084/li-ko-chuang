"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

interface ThreeCanvasProps {
  visualType: "engineer" | "marketer" | "creator";
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
  const marketerNodesRef = useRef<THREE.Mesh[]>([]);
  const marketerLinksRef = useRef<THREE.LineSegments | null>(null);
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
    return themeRef.current === "dark" ? 0x60a5fa : 0x3b82f6;
  }, []);

  const getRippleColor = useCallback(() => {
    return themeRef.current === "dark" ? 0xfcd34d : 0xd97706;
  }, []);

  const getParticleColor = useCallback(() => {
    return themeRef.current === "dark" ? 0xf472b6 : 0xec4899;
  }, []);

  const updateEngineerColors = useCallback(() => {
    const colorHex = getLineColor();
    const isDark = themeRef.current === "dark";
    linesRef.current.forEach((line) => {
      (line.material as THREE.LineBasicMaterial).color.setHex(colorHex);
      (line.material as THREE.LineBasicMaterial).opacity = isDark ? 0.5 : 0.3;
    });
  }, [getLineColor]);

  const updateParticleColors = useCallback(() => {
    if (particlesRef.current) {
      const colorHex = getParticleColor();
      (particlesRef.current.material as THREE.PointsMaterial).color.setHex(
        colorHex,
      );
    }
  }, [getParticleColor]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
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

    const createMarketerVisuals = (group: THREE.Group) => {
      const nodeCount = 40;
      const sphereGeometry = new THREE.SphereGeometry(0.4, 12, 12);

      for (let i = 0; i < nodeCount; i++) {
        const material = new THREE.MeshPhongMaterial({
          color: getRippleColor(),
          transparent: true,
          opacity: 0.7,
          emissive: getRippleColor(),
          emissiveIntensity: 0.5,
        });

        const node = new THREE.Mesh(sphereGeometry, material);
        node.position.set(
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40,
        );

        node.userData = {
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
          ),
          originalPos: node.position.clone(),
        };

        marketerNodesRef.current.push(node);
        group.add(node);
      }

      const lineMaterial = new THREE.LineBasicMaterial({
        color: getRippleColor(),
        transparent: true,
        opacity: 0.15,
      });
      const lineGeometry = new THREE.BufferGeometry();
      const marketerLinks = new THREE.LineSegments(lineGeometry, lineMaterial);
      marketerLinksRef.current = marketerLinks;
      group.add(marketerLinks);

      const light = new THREE.PointLight(getRippleColor(), 1.5, 120);
      light.position.set(0, 0, 20);
      group.add(light);
    };

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
          (Math.random() - 0.5) * 0.01,
        );
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
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

    const engineerGroup = new THREE.Group();
    engineerGroupRef.current = engineerGroup;
    createEngineerLines(engineerGroup);
    scene.add(engineerGroup);

    const marketerGroup = new THREE.Group();
    marketerGroupRef.current = marketerGroup;
    createMarketerVisuals(marketerGroup);
    scene.add(marketerGroup);

    const creatorGroup = new THREE.Group();
    creatorGroupRef.current = creatorGroup;
    createCreatorParticles(creatorGroup);
    scene.add(creatorGroup);

    engineerGroup.visible = visualTypeRef.current === "engineer";
    marketerGroup.visible = visualTypeRef.current === "marketer";
    creatorGroup.visible = visualTypeRef.current === "creator";

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

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      const currentType = visualTypeRef.current;

      if (engineerGroupRef.current) {
        engineerGroupRef.current.visible = currentType === "engineer";
      }
      if (marketerGroupRef.current) {
        marketerGroupRef.current.visible = currentType === "marketer";
      }
      if (creatorGroupRef.current) {
        creatorGroupRef.current.visible = currentType === "creator";
      }

      if (currentType === "engineer" && engineerGroupRef.current?.visible) {
        linesRef.current.forEach((line) => {
          const positions = (
            line.geometry.attributes.position as THREE.BufferAttribute
          ).array as Float32Array;
          const offset = (line.userData as { offset: number }).offset;
          for (let j = 0; j < positions.length; j += 3) {
            const x = positions[j];
            positions[j + 1] = Math.sin(x * 0.05 + time + offset) * 3;
          }
          line.geometry.attributes.position.needsUpdate = true;
        });
        engineerGroupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
      } else if (
        currentType === "marketer" &&
        marketerGroupRef.current?.visible
      ) {
        const positions: number[] = [];
        const nodes = marketerNodesRef.current;
        const maxDistance = 15;

        nodes.forEach((node, i) => {
          const userData = node.userData as {
            velocity: THREE.Vector3;
            originalPos: THREE.Vector3;
          };

          node.position.add(userData.velocity);

          if (Math.abs(node.position.x) > 45) userData.velocity.x *= -1;
          if (Math.abs(node.position.y) > 35) userData.velocity.y *= -1;
          if (Math.abs(node.position.z) > 25) userData.velocity.z *= -1;

          const mouseV = new THREE.Vector3(
            mouseRef.current.x * 0.2,
            -mouseRef.current.y * 0.2,
            0,
          );
          const distToMouse = node.position.distanceTo(mouseV);
          if (distToMouse < 20) {
            const dir = new THREE.Vector3()
              .subVectors(mouseV, node.position)
              .normalize();
            node.position.addScaledVector(dir, 0.05);
          }

          for (let j = i + 1; j < nodes.length; j++) {
            const dist = node.position.distanceTo(nodes[j].position);
            if (dist < maxDistance) {
              positions.push(node.position.x, node.position.y, node.position.z);
              positions.push(
                nodes[j].position.x,
                nodes[j].position.y,
                nodes[j].position.z,
              );
            }
          }
        });

        if (marketerLinksRef.current) {
          marketerLinksRef.current.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3),
          );
          marketerLinksRef.current.geometry.attributes.position.needsUpdate = true;
        }
      } else if (
        currentType === "creator" &&
        creatorGroupRef.current?.visible &&
        particlesRef.current
      ) {
        const positions = particlesRef.current.geometry.attributes.position
          .array as Float32Array;
        const velocities = particlesRef.current.geometry.userData
          .velocities as number[];

        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.01;
          positions[i * 3 + 1] +=
            velocities[i * 3 + 1] + Math.cos(time + i) * 0.01;
          positions[i * 3 + 2] += velocities[i * 3 + 2];

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
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);

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

  useEffect(() => {
    if (visualType === "engineer") {
      updateEngineerColors();
    } else if (visualType === "marketer") {
      const colorHex = getRippleColor();
      marketerNodesRef.current.forEach((node) => {
        (node.material as THREE.MeshPhongMaterial).color.setHex(colorHex);
        (node.material as THREE.MeshPhongMaterial).emissive.setHex(colorHex);
      });
      if (marketerLinksRef.current) {
        (
          marketerLinksRef.current.material as THREE.LineBasicMaterial
        ).color.setHex(colorHex);
      }
    } else {
      updateParticleColors();
    }
  }, [
    resolvedTheme,
    visualType,
    updateEngineerColors,
    updateParticleColors,
    getRippleColor,
  ]);

  return <div id="canvas-container" ref={containerRef} />;
}
