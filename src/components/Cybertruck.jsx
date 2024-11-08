import { shaderMaterial, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import stripesFragment from "../shaders/stripes.fragment.glsl";
import stripesVertex from "../shaders/stripes.vertex.glsl";
import disksFragment from "../shaders/disks.fragment.glsl";
import disksVertex from "../shaders/disks.vertex.glsl";

const StripesShaderMaterial = shaderMaterial(
  {
    uAlpha: 0.5,
    uMultiplier: 42,
    uColorA: new THREE.Color(0x000000),
    uColorB: new THREE.Color(0x000000),
    uTime: 0,
  },
  stripesVertex,
  stripesFragment
);

const DisksShaderMaterial = shaderMaterial(
  {
    uAlpha: 0.5,
    uMultiplier: 42,
    uColorA: new THREE.Color(0x000000),
    uColorB: new THREE.Color(0x000000),
    uTime: 0,
  },
  disksVertex,
  disksFragment
);

extend({ StripesShaderMaterial });
extend({ DisksShaderMaterial });

export function Cybertruck(props) {
  const { nodes, materials } = useGLTF("./models/cybertruck.gltf");

  const { shader } = useControls({
    shader: {
      options: ["none", "disks", "stripes"],
    },
  });

  const disksControls = useControls("disks", {
    alpha: {
      min: 0,
      max: 1,
      value: 0.5,
    },
    multiplier: {
      min: 1,
      max: 142,
      value: 12,
    },
    colorA: "#0000FF",
    colorB: "#00FF00",
  });

  const stripesControls = useControls("stripes", {
    alpha: {
      min: 0,
      max: 1,
      value: 0.5,
    },
    multiplier: {
      min: 1,
      max: 142,
      value: 42,
    },
    colorA: "#FF0000",
    colorB: "#FFFF00",
  });

  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.uTime = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    // Set car body color to white
    materials.body.color = new THREE.Color(0xFFFFFF); 
    materials.glassframes.color = new THREE.Color(0xFFFFFF);
    materials.warninglights.toneMapped = false;
    materials.warninglights.color = new THREE.Color(82, 0, 0);
  });

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.interior001.geometry} material={materials.lights} />
      <mesh geometry={nodes.interior001_1.geometry} castShadow>
        <meshStandardMaterial {...materials.body} />
      </mesh>
      <mesh geometry={nodes.interior001_2.geometry}>
        <meshStandardMaterial
          opacity={0.92}
          envMapIntensity={1}
          transparent
          roughness={0.2}
          color={"black"}
        />
      </mesh>
      <mesh
        geometry={nodes.interior001_3.geometry}
        material={materials.glassframes}
        castShadow
      />
      <mesh
        geometry={nodes.interior001_4.geometry}
        material={materials.warninglights}
      />
      <mesh
        geometry={nodes.interior001_5.geometry}
        material={materials.black}
        castShadow
      />
      {/* BODY MESH -> SHADER */}
      {shader === "disks" && (
        <mesh geometry={nodes.interior001_6.geometry}>
          <disksShaderMaterial
            ref={ref}
            transparent
            uAlpha={disksControls.alpha}
            uMultiplier={disksControls.multiplier}
            uColorA={disksControls.colorA}
            uColorB={disksControls.colorB}
          />
        </mesh>
      )}
      {shader === "stripes" && (
        <mesh geometry={nodes.interior001_6.geometry}>
          <stripesShaderMaterial
            ref={ref}
            transparent
            uAlpha={stripesControls.alpha}
            uMultiplier={stripesControls.multiplier}
            uColorA={stripesControls.colorA}
            uColorB={stripesControls.colorB}
          />
        </mesh>
      )}

      <mesh geometry={nodes.steer.geometry} material={materials.gray} />
      <mesh
        geometry={nodes.tires001.geometry}
        material={materials.tires}
        castShadow
      />
      <mesh
        geometry={nodes.tires001_1.geometry}
        material={materials.rims}
        castShadow
      />
    </group>
  );
}

useGLTF.preload("./models/cybertruck.gltf");
