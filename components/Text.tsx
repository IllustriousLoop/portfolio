import * as THREE from "three";
import React, { useMemo, useRef, useLayoutEffect } from "react";
import { extend, useLoader } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

extend({ TextGeometry });

type Ref = {
  current: THREE.Mesh | undefined;
};
type Props = {
  text: string;
  position: THREE.Vector3;
  vAlign?: string;
  hAlign?: string;
  size?: number;
  color?: string;
};
const Text = ({
  text,
  vAlign = "center",
  hAlign = "center",
  size = 1.5,
  color = "#000000",
  ...props
}: Props) => {
  const font = useLoader(FontLoader, "/bold.blob");
  const config = useMemo(
    () => ({
      font,
      size: 40,
      height: 30,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 6,
      bevelSize: 2.5,
      bevelOffset: 0,
      bevelSegments: 8,
    }),
    [font]
  );
  const mesh: Ref = useRef();
  useLayoutEffect(() => {
    const size = new THREE.Vector3();
    if (mesh.current) {
      mesh.current.geometry.computeBoundingBox();
      mesh.current.geometry.boundingBox?.getSize(size);
      mesh.current.position.x =
        hAlign === "center" ? -size.x / 2 : hAlign === "right" ? 0 : -size.x;
      mesh.current.position.y =
        vAlign === "center" ? -size.y / 2 : vAlign === "top" ? 0 : -size.y;
    }
  }, [text]);

  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry args={[text, config]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  );
};
export default Text;
