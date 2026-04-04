import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Heart(props) {
  // Make sure heart.gltf is inside your /public folder!
  const { nodes, materials } = useGLTF("/heart.gltf");

  return (
    <group {...props} dispose={null}>
      <group rotation={[0, 0, 0]}>
        <mesh
          geometry={nodes.Object_8.geometry}
          material={materials.Heart}
          rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        />
        <mesh
          geometry={nodes.Object_11.geometry}
          material={materials.Marble}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/heart.gltf");