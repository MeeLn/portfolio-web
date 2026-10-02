"use client";

import {
  Canvas,
  events as fiberEvents,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Line as ThreeLine,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Vector3,
} from "three";
import { gsap } from "gsap";
import { projects } from "@/data/projects";
import { journey } from "@/data/journey";
import { hubCamera, worldPortals, type CameraDestination, type RealmId } from "@/data/world";
import { useWorldStore } from "@/lib/world-store";

const palette: Record<RealmId, string> = {
  hub: "#4da8ff",
  about: "#59c7f1",
  skills: "#a18af4",
  projects: "#58c5de",
  journey: "#987be7",
  contact: "#67baf1",
};

const worldEvents: typeof fiberEvents = (store) => {
  const manager = fiberEvents(store);
  return {
    ...manager,
    compute(event, state) {
      const rect = state.gl.domElement.getBoundingClientRect();
      state.pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      state.raycaster.setFromCamera(state.pointer, state.camera);
    },
  };
};

function CameraDirector() {
  const destination = useWorldStore((state) => state.destination);
  const complete = useWorldStore((state) => state.completeTransition);
  const token = useWorldStore((state) => state.transitionToken);
  const reduceMotion = useWorldStore((state) => state.reduceMotion);
  const { camera, invalidate } = useThree();
  const lookTarget = useRef(new Vector3(0, 0, 0));

  useEffect(() => {
    const duration = reduceMotion ? 0.01 : destination.duration;
    const positionTween = gsap.to(camera.position, {
      x: destination.position[0],
      y: destination.position[1],
      z: destination.position[2],
      duration,
      ease: "power3.inOut",
      overwrite: true,
    });
    const targetTween = gsap.to(lookTarget.current, {
      x: destination.target[0],
      y: destination.target[1],
      z: destination.target[2],
      duration,
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: () => {
        camera.lookAt(lookTarget.current);
        invalidate();
      },
      onComplete: () => complete(token),
    });
    const perspective = camera as typeof camera & {
      fov?: number;
      updateProjectionMatrix?: () => void;
    };
    if (typeof perspective.fov === "number") {
      gsap.to(perspective, {
        fov: destination.fov,
        duration,
        ease: "power2.out",
        onUpdate: () => perspective.updateProjectionMatrix?.(),
      });
    }
    return () => {
      positionTween.kill();
      targetTween.kill();
      gsap.killTweensOf(perspective);
    };
  }, [camera, complete, destination, invalidate, reduceMotion, token]);

  useFrame(({ camera: liveCamera, pointer }) => {
    if (!reduceMotion && useWorldStore.getState().phase !== "transitioning") {
      liveCamera.position.x +=
        (destination.position[0] + pointer.x * 0.14 - liveCamera.position.x) *
        0.025;
      liveCamera.position.y +=
        (destination.position[1] + pointer.y * 0.1 - liveCamera.position.y) *
        0.025;
    }
    liveCamera.lookAt(lookTarget.current);
  });
  return null;
}

function FloatingParticles({
  color,
  count = 90,
}: {
  color: string;
  count?: number;
}) {
  const points = useRef<Group>(null);
  const reduceMotion = useWorldStore((state) => state.reduceMotion);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const seed = i + 1;
      positions[i * 3] = (Math.sin(seed * 12.9898) * 0.5 + 0.5) * 15 - 7.5;
      positions[i * 3 + 1] = (Math.sin(seed * 78.233) * 0.5 + 0.5) * 9 - 4.5;
      positions[i * 3 + 2] = (Math.sin(seed * 39.425) * 0.5 + 0.5) * 12 - 8;
    }
    const result = new BufferGeometry();
    result.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return result;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, delta) => {
    if (!reduceMotion && points.current)
      points.current.rotation.y += delta * 0.012;
  });
  return (
    <group ref={points}>
      <points geometry={geometry}>
        <pointsMaterial
          color={color}
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.72}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function Floating({
  children,
  speed = 0.5,
  floatIntensity = 0.12,
  rotationIntensity = 0,
}: {
  children: ReactNode;
  speed?: number;
  floatIntensity?: number;
  rotationIntensity?: number;
}) {
  const ref = useRef<Group>(null);
  const base = useRef<[number, number, number]>([0, 0, 0]);
  const reduceMotion = useWorldStore((state) => state.reduceMotion);
  useEffect(() => {
    if (ref.current)
      base.current = [
        ref.current.position.x,
        ref.current.position.y,
        ref.current.position.z,
      ];
  }, []);
  useFrame(({ clock }) => {
    if (reduceMotion || !ref.current) return;
    const time = clock.elapsedTime * speed;
    ref.current.position.y = base.current[1] + Math.sin(time) * floatIntensity;
    ref.current.rotation.y = Math.sin(time * 0.6) * rotationIntensity;
  });
  return <group ref={ref}>{children}</group>;
}

function LinePath({
  points,
  color,
  opacity = 1,
  lineWidth = 1,
}: {
  points: [number, number, number][];
  color: string;
  opacity?: number;
  lineWidth?: number;
}) {
  const geometry = useMemo(() => {
    const result = new BufferGeometry();
    result.setFromPoints(points.map((point) => new Vector3(...point)));
    return result;
  }, [points]);
  const line = useMemo(
    () =>
      new ThreeLine(
        geometry,
        new LineBasicMaterial({
          color,
          transparent: opacity < 1,
          opacity,
          linewidth: lineWidth,
        }),
      ),
    [color, geometry, lineWidth, opacity],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      (line.material as LineBasicMaterial).dispose();
    },
    [geometry, line],
  );
  return <primitive object={line} />;
}

function Portal({
  portal,
  navigate,
}: {
  portal: (typeof worldPortals)[number];
  navigate: (realm: RealmId, section: string) => void;
}) {
  const group = useRef<Group>(null);
  const rim = useRef<Mesh>(null);
  const hovered = useWorldStore((state) => state.hovered === portal.id);
  const setHovered = useWorldStore((state) => state.setHovered);
  const reduceMotion = useWorldStore((state) => state.reduceMotion);
  const interactionProps = {
    onPointerOver: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      setHovered(portal.id);
    },
    onPointerOut: () => setHovered(null),
    onClick: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      navigate(portal.id, portal.section);
    },
  };
  useFrame((_, delta) => {
    if (!reduceMotion && group.current)
      group.current.rotation.y += delta * 0.09;
    if (rim.current) {
      const material = rim.current.material as MeshStandardMaterial;
      material.emissiveIntensity +=
        ((hovered ? 2.4 : 0.55) - material.emissiveIntensity) * 0.12;
    }
  });
  return (
    <Floating
      speed={reduceMotion ? 0 : 0.45}
      floatIntensity={reduceMotion ? 0 : 0.12}
      rotationIntensity={0}
    >
      <group ref={group} position={portal.position}>
        <mesh ref={rim} {...interactionProps}>
          <torusGeometry args={[0.78, 0.035, 12, 96]} />
          <meshStandardMaterial
            color={portal.accent}
            emissive={portal.accent}
            emissiveIntensity={0.55}
            metalness={0.62}
            roughness={0.24}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} {...interactionProps}>
          <torusGeometry args={[0.67, 0.012, 8, 72]} />
          <meshBasicMaterial
            color={portal.accent}
            transparent
            opacity={hovered ? 0.8 : 0.28}
          />
        </mesh>
        <mesh position={[0, -1.12, 0]} {...interactionProps}>
          <cylinderGeometry args={[0.58, 0.73, 0.14, 6]} />
          <meshStandardMaterial
            color="#111722"
            metalness={0.8}
            roughness={0.32}
            emissive={portal.accent}
            emissiveIntensity={hovered ? 0.45 : 0.08}
          />
        </mesh>
        <mesh position={[0, 0, -0.1]} {...interactionProps}>
          <circleGeometry args={[0.68, 48]} />
          <meshBasicMaterial
            color={portal.accent}
            transparent
            opacity={hovered ? 0.14 : 0.055}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0, 0.04]} {...interactionProps}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </Floating>
  );
}

function HubRealm({
  navigate,
}: {
  navigate: (realm: RealmId, section: string) => void;
}) {
  const positions = worldPortals.map(
    (p) =>
      [p.position[0], p.position[1] + 0.25, p.position[2]] as [
        number,
        number,
        number,
      ],
  );
  return (
    <group>
      <ambientLight intensity={0.75} />
      <pointLight
        position={[0, 2.8, 3]}
        color="#438fff"
        intensity={34}
        distance={20}
      />
      <pointLight
        position={[-5, -2, -3]}
        color="#694ce8"
        intensity={17}
        distance={14}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]}>
        <circleGeometry args={[9, 96]} />
        <meshStandardMaterial
          color="#101622"
          metalness={0.7}
          roughness={0.38}
          transparent
          opacity={0.72}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.08, 0]}>
        <ringGeometry args={[2.2, 2.24, 96]} />
        <meshBasicMaterial color="#5cbaff" transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0.1, -2.8]}>
        <torusGeometry args={[2.4, 0.018, 5, 120]} />
        <meshBasicMaterial color="#79c9ff" transparent opacity={0.38} />
      </mesh>
      <mesh position={[0, 0.1, -2.82]} rotation={[0.15, 0.2, 0.4]}>
        <torusGeometry args={[3.05, 0.012, 4, 120]} />
        <meshBasicMaterial color="#947bf0" transparent opacity={0.25} />
      </mesh>
      <group position={[0, 0, -4.8]}>
        {[-6, -4.6, -3.3, 3.6, 4.9, 6.4].map((x, i) => (
          <mesh key={x} position={[x, -0.2 + (i % 2) * 0.28, 0]}>
            <cylinderGeometry
              args={[
                0.28 + (i % 3) * 0.08,
                0.42,
                2.8 + (i % 3) * 0.8,
                6,
                1,
                true,
              ]}
            />
            <meshBasicMaterial
              color="#3689c7"
              wireframe
              transparent
              opacity={0.2}
            />
          </mesh>
        ))}
      </group>
      <LinePath points={positions} color="#5c9dd1" opacity={0.26} />
      {worldPortals.map((portal) => (
        <Portal key={portal.id} portal={portal} navigate={navigate} />
      ))}
    </group>
  );
}

function CharacterRealm() {
  const texture = useLoader(
    TextureLoader,
    "/images/characters/about-portrait.webp",
  );
  return (
    <group>
      <ambientLight intensity={0.68} />
      <pointLight
        position={[-4, 3, 3]}
        color="#51bfff"
        intensity={50}
        distance={18}
      />
      <pointLight
        position={[3, -2, 1]}
        color="#5648bc"
        intensity={24}
        distance={14}
      />
      <mesh position={[3.5, 0.2, -2.5]}>
        <planeGeometry args={[5.98, 7.2]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.54}
          depthWrite={false}
        />
      </mesh>
      {[2.2, 2.7, 3.3].map((radius, i) => (
        <mesh
          key={radius}
          position={[-2.8, 0, -2]}
          rotation={[0.2, i * 0.22, i * 0.42]}
        >
          <torusGeometry args={[radius, 0.012, 5, 110]} />
          <meshBasicMaterial
            color={i === 1 ? "#a68cff" : "#64c8ff"}
            transparent
            opacity={0.42 - i * 0.08}
          />
        </mesh>
      ))}
      <FloatingParticles color="#6fcaff" count={70} />
    </group>
  );
}

const abilityNodes = [
  "Next.js",
  "TypeScript",
  "Java",
  "Python",
  "Django",
  "Node.js",
  "TensorFlow",
  "PostgreSQL",
  "SQLite",
  "Flutter",
  "C++",
  "VS Code",
];
function AbilityRealm() {
  const selected = useWorldStore((state) => state.selected);
  const setSelected = useWorldStore((state) => state.beginTransition);
  const points = useMemo(
    () =>
      abilityNodes.map(
        (_, i) =>
          [
            Math.cos((i * Math.PI * 2) / abilityNodes.length) * 3.2,
            Math.sin((i * Math.PI * 2) / abilityNodes.length) * 1.85,
            -0.7 + Math.sin(i * 1.8) * 0.55,
          ] as [number, number, number],
      ),
    [],
  );
  return (
    <group>
      <ambientLight intensity={0.65} />
      <pointLight
        position={[0, 1, 3]}
        color="#9379ff"
        intensity={40}
        distance={20}
      />
      <mesh position={[0, 0, -2]}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshStandardMaterial
          color="#16162b"
          emissive="#6555c4"
          emissiveIntensity={0.72}
          wireframe
          metalness={0.6}
        />
      </mesh>
      <LinePath points={points} color="#8f7bf1" opacity={0.3} />
      {points.map((position, i) => (
        <Floating key={abilityNodes[i]} speed={0.4} floatIntensity={0.12}>
          <mesh
            position={position}
            onClick={(event) => {
              event.stopPropagation();
              setSelected(
                "skills",
                worldPortals[1].destination,
                abilityNodes[i],
              );
            }}
            onPointerOver={() =>
              useWorldStore.getState().setHovered(abilityNodes[i])
            }
            onPointerOut={() => useWorldStore.getState().setHovered(null)}
          >
            <icosahedronGeometry
              args={[selected === abilityNodes[i] ? 0.24 : 0.16, 1]}
            />
            <meshStandardMaterial
              color={selected === abilityNodes[i] ? "#e0d8ff" : "#9580ff"}
              emissive="#7160e2"
              emissiveIntensity={selected === abilityNodes[i] ? 1.8 : 0.65}
              metalness={0.3}
              roughness={0.25}
            />
          </mesh>
        </Floating>
      ))}
      <FloatingParticles color="#aa98ff" count={75} />
    </group>
  );
}

function MissionRealm({ onProject }: { onProject: (slug: string) => void }) {
  const selected = useWorldStore((state) => state.selected);
  return (
    <group>
      <ambientLight intensity={0.7} />
      <pointLight
        position={[0, 2.8, 3]}
        color="#42bfed"
        intensity={38}
        distance={19}
      />
      {projects.map((project, i) => {
        const x = (i - (projects.length - 1) / 2) * 2.15;
        return (
          <Floating key={project.id} speed={0.5} floatIntensity={0.15}>
            <group position={[x, 0, -0.5 + Math.abs(i - 1.5) * -0.5]}>
              <mesh
                onClick={(event) => {
                  event.stopPropagation();
                  useWorldStore
                    .getState()
                    .beginTransition(
                      "projects",
                      worldPortals[2].destination,
                      project.slug,
                    );
                  onProject(project.slug);
                }}
                onPointerOver={() =>
                  useWorldStore.getState().setHovered(project.slug)
                }
                onPointerOut={() => useWorldStore.getState().setHovered(null)}
              >
                <torusGeometry args={[0.72, 0.04, 12, 72]} />
                <meshStandardMaterial
                  color="#56c9ed"
                  emissive="#40a9e9"
                  emissiveIntensity={selected === project.slug ? 1.7 : 0.55}
                  metalness={0.7}
                  roughness={0.2}
                />
              </mesh>
              <mesh
                position={[0, 0, -0.15]}
                onClick={(event) => {
                  event.stopPropagation();
                  useWorldStore
                    .getState()
                    .beginTransition(
                      "projects",
                      worldPortals[2].destination,
                      project.slug,
                    );
                  onProject(project.slug);
                }}
                onPointerOver={() =>
                  useWorldStore.getState().setHovered(project.slug)
                }
                onPointerOut={() => useWorldStore.getState().setHovered(null)}
              >
                <circleGeometry args={[0.62, 48]} />
                <meshBasicMaterial
                  color="#28688c"
                  transparent
                  opacity={selected === project.slug ? 0.24 : 0.11}
                  depthWrite={false}
                />
              </mesh>
              <mesh position={[0, -1.05, 0]}>
                <cylinderGeometry args={[0.54, 0.68, 0.16, 6]} />
                <meshStandardMaterial
                  color="#121924"
                  metalness={0.7}
                  roughness={0.35}
                />
              </mesh>
            </group>
          </Floating>
        );
      })}
      <FloatingParticles color="#6ad8f2" count={80} />
    </group>
  );
}

function JourneyRealm() {
  const selected = useWorldStore((state) => state.selected);
  const nodes = journey.map((milestone, index) => ({
    milestone,
    position: [
      -3.6 + index * 2.4,
      index % 2 === 0 ? -0.4 : 0.5,
      -0.6 - Math.abs(1.5 - index) * 0.18,
    ] as [number, number, number],
  }));
  return (
    <group>
      <ambientLight intensity={0.62} />
      <pointLight
        position={[0, 2, 3]}
        color="#9678ee"
        intensity={35}
        distance={18}
      />
      <LinePath points={nodes.map(({ position }) => position)} color="#a08aff" opacity={0.56} lineWidth={2} />
      {nodes.map(({ milestone, position }) => {
        const focus: CameraDestination = {
          id: `journey-${milestone.id}`,
          position: [position[0] * 0.36, position[1] * 0.25, 7.8],
          target: position,
          fov: 38,
          duration: 0.85,
        };
        const select = () => useWorldStore.getState().beginTransition("journey", focus, milestone.id);
        return <group key={milestone.id} position={position}>
          <mesh onClick={(event) => { event.stopPropagation(); select(); }} onPointerOver={() => useWorldStore.getState().setHovered(milestone.id)} onPointerOut={() => useWorldStore.getState().setHovered(null)}>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color={selected === milestone.id ? "#f0ecff" : "#cabdff"}
              emissive="#795eef"
              emissiveIntensity={selected === milestone.id ? 1.8 : 0.9}
            />
          </mesh>
          <mesh onClick={(event) => { event.stopPropagation(); select(); }} onPointerOver={() => useWorldStore.getState().setHovered(milestone.id)} onPointerOut={() => useWorldStore.getState().setHovered(null)}>
            <torusGeometry args={[0.44, 0.012, 6, 48]} />
            <meshBasicMaterial color="#a18cff" transparent opacity={selected === milestone.id ? 0.9 : 0.6} />
          </mesh>
        </group>;
      })}
      <FloatingParticles color="#9e8aff" count={70} />
    </group>
  );
}

function ContactRealm() {
  const setHovered = useWorldStore((state) => state.setHovered);
  const connect = () => window.location.assign("mailto:rttmilan76@gmail.com");
  return (
    <group>
      <ambientLight intensity={0.7} />
      <pointLight
        position={[0, 0, 4]}
        color="#54baff"
        intensity={55}
        distance={18}
      />
      <mesh
        position={[0, 0, -1]}
        onPointerOver={() => setHovered("contact-mail")}
        onPointerOut={() => setHovered(null)}
        onClick={(event) => { event.stopPropagation(); connect(); }}
      >
        <torusGeometry args={[2.4, 0.085, 16, 100]} />
        <meshStandardMaterial
          color="#56bfff"
          emissive="#328cce"
          emissiveIntensity={1.2}
          metalness={0.64}
          roughness={0.24}
        />
      </mesh>
      <mesh position={[0, 0, -1.1]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.85, 0.018, 8, 80]} />
        <meshBasicMaterial color="#ac95ff" transparent opacity={0.72} />
      </mesh>
      <FloatingParticles color="#6ecaff" count={100} />
    </group>
  );
}

function ActiveRealm({
  realm,
  onProject,
  navigate,
}: {
  realm: RealmId;
  onProject: (slug: string) => void;
  navigate: (realm: RealmId, section: string) => void;
}) {
  return (
    <group key={realm}>
      {realm === "hub" && <HubRealm navigate={navigate} />}
      {realm === "about" && <CharacterRealm />}
      {realm === "skills" && <AbilityRealm />}
      {realm === "projects" && <MissionRealm onProject={onProject} />}
      {realm === "journey" && <JourneyRealm />}
      {realm === "contact" && <ContactRealm />}
    </group>
  );
}

function SceneContents({
  navigate,
  onProject,
}: {
  navigate: (realm: RealmId, section: string) => void;
  onProject: (slug: string) => void;
}) {
  const realm = useWorldStore((state) => state.realm);
  const quality = useWorldStore((state) => state.quality);
  const color = new Color(palette[realm]);
  return (
    <>
      <fog attach="fog" args={["#080b11", 9, 24]} />
      <ambientLight intensity={0.22} />
      <pointLight
        position={[0, 0, 3]}
        color={color}
        intensity={4}
        distance={14}
      />
      <Suspense fallback={null}>
        <ActiveRealm realm={realm} navigate={navigate} onProject={onProject} />
      </Suspense>
      {realm !== "hub" && (
        <mesh position={[0, 0, -6]}>
          <torusGeometry args={[6.6, 0.012, 4, 128]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}
      <FloatingParticles
        color={palette[realm]}
        count={
          quality === "performance" ? 32 : quality === "cinematic" ? 130 : 75
        }
      />
      <CameraDirector />
    </>
  );
}

export default function WorldScene({
  eventSource,
  navigate,
  onProject,
}: {
  eventSource: RefObject<HTMLDivElement | null>;
  navigate: (realm: RealmId, section: string) => void;
  onProject: (slug: string) => void;
}) {
  const reduceMotion = useWorldStore((state) => state.reduceMotion);
  const quality = useWorldStore((state) => state.quality);
  const compact = window.matchMedia("(max-width: 760px)").matches;
  const devicePixelRatio: [number, number] =
    quality === "performance"
      ? [0.75, 1]
      : quality === "cinematic"
        ? [1, 1.65]
        : compact
          ? [0.85, 1.1]
          : [1, 1.45];
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    useWorldStore.getState().setReduceMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) =>
      useWorldStore.getState().setReduceMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return (
    <Canvas
      className="persistent-world-canvas"
      camera={{
        position: hubCamera.position,
        fov: hubCamera.fov,
        near: 0.1,
        far: 70,
      }}
      dpr={devicePixelRatio}
      frameloop={reduceMotion ? "demand" : "always"}
      eventSource={eventSource}
      events={worldEvents}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        stencil: false,
      }}
      fallback={<div className="world-webgl-fallback" aria-hidden="true" />}
      onCreated={({ gl }) => {
        gl.setClearColor("#080b11", 0);
      }}
    >
      <SceneContents navigate={navigate} onProject={onProject} />
    </Canvas>
  );
}
