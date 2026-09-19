import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroBadge: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = size;
    const height = size;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 18;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x818cf8, 2, 50);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Group
    const group = new THREE.Group();
    scene.add(group);

    // Inner Gem (Icosahedron)
    const gemGeo = new THREE.IcosahedronGeometry(4, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.9,
      flatShading: true
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    group.add(gemMesh);

    // Outer Wireframe Gyroscope Rings
    const ring1Geo = new THREE.TorusGeometry(6.5, 0.18, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(8, 0.14, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      roughness: 0.2,
      metalness: 0.8
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // Tiny Orbiting Satellite Spheres
    const sat1Geo = new THREE.SphereGeometry(0.8, 16, 16);
    const sat1Mat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const sat1 = new THREE.Mesh(sat1Geo, sat1Mat);
    group.add(sat1);

    const sat2Geo = new THREE.SphereGeometry(0.7, 16, 16);
    const sat2Mat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const sat2 = new THREE.Mesh(sat2Geo, sat2Mat);
    group.add(sat2);

    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gyroscope Rotations
      gemMesh.rotation.y += 0.015;
      gemMesh.rotation.x += 0.008;

      ring1.rotation.z += 0.012;
      ring1.rotation.x += 0.006;

      ring2.rotation.y += 0.01;
      ring2.rotation.z -= 0.008;

      sat1.position.x = Math.cos(elapsedTime * 1.5) * 6.5;
      sat1.position.y = Math.sin(elapsedTime * 1.5) * 3;
      sat1.position.z = Math.sin(elapsedTime * 1.5) * 6.5;

      sat2.position.x = Math.sin(elapsedTime * 2) * 8;
      sat2.position.y = Math.cos(elapsedTime * 2) * 4;
      sat2.position.z = Math.cos(elapsedTime * 2) * 8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className="shrink-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
      title="SkillBridge 3D Engine Core"
    />
  );
};
