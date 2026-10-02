"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DomainCanvas({ onReady }: { onReady?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.z = 6.7;
    const world = new THREE.Group();
    scene.add(world);
    scene.add(new THREE.AmbientLight(0xa8dcff, 1.1));

    const cyan = new THREE.MeshBasicMaterial({
      color: 0x83d4ff,
      transparent: true,
      opacity: 0.56,
    });
    const violet = new THREE.MeshBasicMaterial({
      color: 0x9e87f5,
      transparent: true,
      opacity: 0.46,
    });
    const ringGeometry = new THREE.TorusGeometry(1.52, 0.008, 4, 180);
    const ringA = new THREE.Mesh(ringGeometry, cyan);
    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(1.16, 0.006, 4, 150),
      violet,
    );
    const ringC = new THREE.Mesh(
      new THREE.TorusGeometry(1.86, 0.004, 3, 180),
      cyan.clone(),
    );
    ringA.rotation.x = 1.13;
    ringB.rotation.set(0.25, 1.08, 0.1);
    ringC.rotation.set(1.36, -0.28, 0.55);
    world.add(ringA, ringB, ringC);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.62, 1),
      new THREE.MeshBasicMaterial({
        color: 0xa9e6ff,
        wireframe: true,
        transparent: true,
        opacity: 0.56,
      }),
    );
    world.add(core);
    const innerCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.28, 0),
      new THREE.MeshBasicMaterial({
        color: 0x7dc9ff,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      }),
    );
    world.add(innerCore);

    const count = 560;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 1.95 + Math.random() * 1.1;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 2.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x8bd6ff,
        size: 0.018,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true,
      }),
    );
    world.add(particles);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    renderer.setClearColor(0x000000, 0);
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let visible = false;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const clock = new THREE.Clock();
    const render = () => {
      if (!visible) return;
      const elapsed = clock.getElapsedTime();
      if (!reducedMotion) {
        world.rotation.y = elapsed * 0.055 + pointerX * 0.12;
        world.rotation.x = Math.sin(elapsed * 0.16) * 0.035 - pointerY * 0.08;
        core.rotation.y = -elapsed * 0.09;
        innerCore.rotation.set(elapsed * 0.12, -elapsed * 0.16, elapsed * 0.08);
        particles.rotation.y = -elapsed * 0.018;
      }
      renderer.render(scene, camera);
      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (reducedMotion) renderer.render(scene, camera);
          else if (!frame) frame = window.requestAnimationFrame(render);
        } else {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "180px" },
    );
    visibilityObserver.observe(container);
    const trackPointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener("pointermove", trackPointer, { passive: true });
    onReady?.();

    return () => {
      window.cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", trackPointer);
      ringGeometry.dispose();
      ringB.geometry.dispose();
      ringC.geometry.dispose();
      cyan.dispose();
      violet.dispose();
      (ringC.material as THREE.Material).dispose();
      (core.geometry as THREE.BufferGeometry).dispose();
      (core.material as THREE.Material).dispose();
      (innerCore.geometry as THREE.BufferGeometry).dispose();
      (innerCore.material as THREE.Material).dispose();
      particleGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      scene.clear();
      renderer.dispose();
    };
  }, [onReady]);

  return (
    <canvas ref={canvasRef} className="domain-canvas" aria-hidden="true" />
  );
}
