"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = canvas?.parentElement;
    if (!canvas || !root) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      root.dataset.webgl = "fallback";
      return;
    }

    root.dataset.webgl = "ready";
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b10, 0.075);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0, 11);
    const world = new THREE.Group();
    scene.add(world);

    const cyan = new THREE.LineBasicMaterial({
      color: 0x6bbfff,
      transparent: true,
      opacity: 0.35,
    });
    const violet = new THREE.LineBasicMaterial({
      color: 0x8874e8,
      transparent: true,
      opacity: 0.22,
    });
    const rings = [
      { radius: 2.5, tube: 0.012, x: 1.05, y: 0.2, z: 0.12 },
      { radius: 3.15, tube: 0.009, x: 0.28, y: 0.83, z: -0.18 },
      { radius: 1.7, tube: 0.008, x: 1.4, y: -0.2, z: 0.35 },
    ].map((item, index) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(item.radius, item.tube, 3, 120),
        index === 1 ? violet : cyan,
      );
      mesh.rotation.set(item.x, item.y, item.z);
      mesh.position.set(1.45, 0.05, -1.8 - index * 0.4);
      world.add(mesh);
      return mesh;
    });

    const architecture = new THREE.Group();
    const towerMaterial = new THREE.MeshBasicMaterial({
      color: 0x539bd3,
      wireframe: true,
      transparent: true,
      opacity: 0.19,
    });
    const buildings = [
      [-4.2, -1.2, -2.8, 0.55, 4.2, 0.55],
      [-3.1, -2.2, -4.1, 0.8, 2.2, 0.8],
      [4.3, -1.4, -3.4, 0.7, 3.8, 0.7],
      [3.3, -2.4, -4.8, 1.05, 2, 0.8],
      [0.2, 3.1, -4.2, 0.6, 0.75, 0.6],
      [-1.5, 2.6, -5.1, 0.9, 0.6, 0.7],
    ];
    for (const [x, y, z, w, h, d] of buildings) {
      const geometry = new THREE.BoxGeometry(w, h, d);
      const block = new THREE.Mesh(geometry, towerMaterial);
      block.position.set(x, y, z);
      architecture.add(block);
    }
    world.add(architecture);

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 20, 16),
      new THREE.MeshBasicMaterial({
        color: 0x2e8ed8,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      }),
    );
    orb.position.set(1.25, 0.15, -2.3);
    const glow = new THREE.PointLight(0x297fc4, 8, 9);
    glow.position.set(1.1, 0.8, 1.2);
    world.add(orb, glow);

    const particleCount = window.matchMedia("(max-width: 760px)").matches
      ? 150
      : 360;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 13;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 9 - 1;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8bceff,
      size: 0.025,
      transparent: true,
      opacity: 0.63,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    world.add(particles);

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    resize();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let visible = false;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;
    const clock = new THREE.Clock();
    const render = () => {
      if (!visible) return;
      const time = clock.getElapsedTime();
      if (!reduceMotion) {
        camera.position.x += (pointerX * 0.28 - camera.position.x) * 0.035;
        camera.position.y += (pointerY * 0.18 - camera.position.y) * 0.035;
        camera.position.z = 11 + scrollProgress * 0.22;
        camera.lookAt(pointerX * 0.12, pointerY * 0.08, 0);
        world.rotation.y = time * 0.025 + pointerX * 0.025;
        world.rotation.x = Math.sin(time * 0.12) * 0.018 - pointerY * 0.018;
        rings[0].rotation.z = time * 0.012;
        rings[1].rotation.y = 0.83 + Math.sin(time * 0.08) * 0.025;
        particles.rotation.y = time * 0.006;
        orb.scale.setScalar(1 + Math.sin(time * 0.6) * 0.04);
      }
      renderer.render(scene, camera);
      if (!reduceMotion) frame = window.requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (reduceMotion) renderer.render(scene, camera);
          else if (!frame) frame = window.requestAnimationFrame(render);
        } else {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(root);
    const onPointer = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = (0.5 - (event.clientY - rect.top) / rect.height) * 2;
    };
    const onScroll = () => {
      const rect = root.getBoundingClientRect();
      scrollProgress = THREE.MathUtils.clamp(
        -rect.top / window.innerHeight,
        0,
        1,
      );
    };
    root.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      root.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      for (const ring of rings) ring.geometry.dispose();
      for (const material of [cyan, violet, towerMaterial, particleMaterial])
        material.dispose();
      for (const child of architecture.children) {
        if (child instanceof THREE.Mesh) child.geometry.dispose();
      }
      orb.geometry.dispose();
      (orb.material as THREE.Material).dispose();
      particleGeometry.dispose();
      scene.clear();
      renderer.dispose();
      delete root.dataset.webgl;
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
