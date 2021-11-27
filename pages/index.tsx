import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import Head from "next/head";
import Typical from "react-typical";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Text from "../components/Text";
import { NextPage } from "next";

type Ref = {
  current: THREE.Mesh | undefined;
};
type birdProps = {
  position: THREE.Vector3;
  rotation: THREE.Euler | undefined;
  speed: number;
  factor: number;
  url: string;
};

function Jumbo() {
  const ref: Ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x =
        ref.current.rotation.y =
        ref.current.rotation.z =
          Math.sin(clock.getElapsedTime()) * 0.3;
    }
  });
  return (
    <group ref={ref}>
      <Text hAlign="right" position={new THREE.Vector3(-12, 6.5, 0)} text="JHAIR" />
      <Text hAlign="right" position={new THREE.Vector3(-12, 0, 0)} text="PARIS" />
    </group>
  );
}

// This component was auto-generated from GLTF by: https://github.com/react-spring/gltfjsx
function Bird({ speed, factor, url, ...props }: birdProps) {
  const model = useLoader(GLTFLoader, url);
  const { nodes, materials, animations }: any = model;
  const group: Ref = useRef();
  const mesh: Ref = useRef();
  const [start] = useState(() => Math.random() * 5000);
  const [mixer] = useState(() => new THREE.AnimationMixer(new THREE.Group()));
  useEffect(
    () => void mixer.clipAction(animations[0], group.current).play(),
    []
  );
  useFrame((state, delta) => {
    if (group.current && mesh.current) {
      mesh.current.position.y = Math.sin(start + state.clock.elapsedTime) * 5;
      mesh.current.rotation.x =
        Math.PI / 2 +
        (Math.sin(start + state.clock.elapsedTime) * Math.PI) / 10;
      mesh.current.rotation.y =
        (Math.sin(start + state.clock.elapsedTime) * Math.PI) / 2;
      group.current.rotation.y +=
        Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5;
      mixer.update(delta * speed);
    }
  });

  return (
    <group ref={group} dispose={null}>
      <scene name="Scene" {...props}>
        <mesh
          ref={mesh}
          scale={1.5}
          name="Object_0"
          morphTargetDictionary={nodes.Object_0.morphTargetDictionary}
          morphTargetInfluences={nodes.Object_0.morphTargetInfluences}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={nodes.Object_0.geometry}
          material={materials.Material_0_COLOR_0}
        />
      </scene>
    </group>
  );
}

const Birds = () => {
  const arrayBirds = Array<number>(10)
    .fill(0)
    .map((_, i) => {
      const x =
        (15 + Math.random() * 30) * (Math.round(Math.random()) ? -1 : 1);
      const y = -10 + Math.random() * 20;
      const z = -5 + Math.random() * 10;
      const bird = ["Stork", "Parrot", "Flamingo"][
        Math.round(Math.random() * 2)
      ];
      let speed = bird === "Stork" ? 0.25 : bird === "Flamingo" ? 0.5 : 5;
      let factor =
        bird === "Stork"
          ? 0.5 + Math.random()
          : bird === "Flamingo"
          ? 0.25 + Math.random()
          : 1 + Math.random() - 0.5;
      return (
        <Bird
          key={i}
          position={new THREE.Vector3(x, y, z)}
          rotation={new THREE.Euler(0, x > 0 ? Math.PI : 0, 0)}
          speed={speed}
          factor={factor}
          url={`/${bird}.glb`}
        />
      );
    });
  return <>{arrayBirds}</>;
};

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const App: NextPage = () => {
  return (
    <>
      <Head>
        <title>Portfolio | Jhair Paris</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Canvas camera={{ position: [0, 0, 35] }}>
        <ambientLight intensity={2} />
        <pointLight position={[40, 40, 40]} />
        <Suspense fallback={<Loader />}>
          <Jumbo />
          <Birds />
        </Suspense>
      </Canvas>
      <Typical
        steps={[
          "by",
          1000,
          "Jhair Paris ✋",
          1000,
          "Wcraft-dev ✋",
          1000,
          "Page in process of creation ⌛",
          1000,
          "Come back in a few days 😁",
        ]}
        wrapper="p"
        loop={Infinity}
      />
    </>
  );
};
export default App;
