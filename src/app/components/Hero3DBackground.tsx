'use client';
// src/components/Hero3DBackground.tsx
import { useRef, useEffect, ReactNode } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import './Hero3DBackground.css';
import { loadDracoModel } from './Loaders/DracoGLTFLoader';

interface Hero3DBackgroundProps {
  children: ReactNode;
  modelPath: string;
  modelType?: 'gltf' | 'glb' | 'fbx' | 'obj';
}

export default function Hero3DBackground({
  children,
  modelPath,
  modelType = 'glb',
}: Hero3DBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    model: THREE.Group | THREE.Object3D;
    bubbles: THREE.Mesh[];
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    // Platform
    const platform = createCarShowPlatform();
    scene.add(platform);

    // Placeholder model
    let model: THREE.Group | THREE.Object3D = new THREE.Group();
    scene.add(model);

    // Load model
    loadModel(modelPath, modelType)
      .then((loadedModel) => {
        scene.remove(model);
        model = loadedModel;

        // Scale it first
        model.scale.set(0.01, 0.01, 0.01);

// Compute bounding box AFTER scaling
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

// Platform height = 0.5, top surface at y = 0.25
        const platformTop = 0.25;

// Position the model so its bottom sits on top of platform
        model.position.y = 0.25 - box.min.y;

// Optional: center model in X/Z
        model.position.x = -center.x;
        model.position.z = -center.z;
        scene.add(model);

        camera.position.set(0, 5, 10);  // Back and up
        camera.lookAt(0, platformTop, 0);

        if (sceneRef.current) sceneRef.current.model = model;
      })
      .catch((error) => {
        console.error('Error loading model:', error);
      });

    // Bubbles
    const bubbles = createBubbles(scene);

    // Environment
    const envMap = createGradientEnvMap();
    scene.environment = envMap;
    scene.background = null;

    sceneRef.current = { scene, camera, renderer, model, bubbles};

    // Animation loop
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate model
      if (model) {
        model.rotation.y = elapsed * 0.3;
        //model.position.y = 0.25 + (model.scale.y * 6) / 2 + Math.sin(elapsed * 0.5) * 0.05;
      }

      // Animate bubbles
      bubbles.forEach((bubble, i) => {
        bubble.position.y += 0.02 + Math.sin(elapsed + i) * 0.01;
        bubble.position.x += Math.sin(elapsed * 0.5 + i * 0.5) * 0.01;
        bubble.rotation.x += 0.01;
        bubble.rotation.y += 0.01;
        const scale = 1 + Math.sin(elapsed * 2 + i) * 0.1;
        bubble.scale.set(scale, scale, scale);

        if (bubble.position.y > 10) {
          bubble.position.y = -5;
          bubble.position.x = (Math.random() - 0.5) * 20;
          bubble.position.z = (Math.random() - 0.5) * 10 - 5;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath, modelType]);

  return (
    <div className="hero-3d-container">
      <div ref={containerRef} className="three-canvas" />
      <div className="content-overlay">{children}</div>
    </div>
  );
}

// --------------------------
// Utility functions below
// --------------------------

function createCarShowPlatform(): THREE.Group {
  const platform = new THREE.Group();

  // Main platform - bright white metallic
  const platformMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 7, 0.5, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,       // Pure white
      metalness: 0.9,
      roughness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    })
  );
  platformMesh.receiveShadow = true;
  platformMesh.castShadow = true;
  platform.add(platformMesh);

  // Edge ring - cyan for contrast
  const edge = new THREE.Mesh(
    new THREE.TorusGeometry(6.5, 0.05, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
  );
  edge.rotation.x = Math.PI / 2;
  edge.position.y = 0.25;
  platform.add(edge);

  // Inner decorative ring - magenta for contrast
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(4, 0.05, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
  );
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = 0.26;
  platform.add(innerRing);

  // Floor reflection - slightly darker to contrast with white platform
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(20, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xff00ff,       // Dark reflective floor
      metalness: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.95,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.26;
  floor.receiveShadow = true;
  platform.add(floor);

  return platform;
}

function createSpotlights(scene: THREE.Scene): THREE.SpotLight[] {
  const spotlights: THREE.SpotLight[] = [];

  const configs: { position: [number, number, number]; color: number; intensity: number }[] =
    [
      { position: [0, 8, 5], color: 0xffffff, intensity: 2 },
      { position: [-4, 6, -3], color: 0x00ffff, intensity: 1.5 },
      { position: [4, 6, -3], color: 0xff00ff, intensity: 1.5 },
    ];

  configs.forEach((c) => {
    const s = new THREE.SpotLight(c.color, c.intensity, 15, Math.PI / 6, 0.5, 1);
    s.position.set(...c.position);
    s.castShadow = true;
    scene.add(s);
    scene.add(s.target);
    spotlights.push(s);
  });

  return spotlights;
}

async function loadModel(path: string, type: string): Promise<THREE.Group | THREE.Object3D> {
  switch (type) {
    case 'gltf':
    case 'glb':
      // Use our Draco loader for GLTF/GLB
      return loadDracoModel(path);
    case 'fbx':
      const fbxLoader = new FBXLoader();
      return new Promise((resolve, reject) =>
        fbxLoader.load(path, (obj) => resolve(obj), undefined, (err) => reject(err))
      );
    case 'obj':
      const objLoader = new OBJLoader();
      return new Promise((resolve, reject) =>
        objLoader.load(path, (obj) => resolve(obj), undefined, (err) => reject(err))
      );
    default:
      throw new Error(`Unsupported model type: ${type}`);
  }
}

function createBubbles(scene: THREE.Scene): THREE.Mesh[] {
  const bubbles: THREE.Mesh[] = [];
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 0.95,
    thickness: 0.5,
    transparent: true,
    opacity: 0.6,
    iridescence: 1,
    iridescenceIOR: 1.3,
    clearcoat: 1,
  });

  for (let i = 0; i < 30; i++) {
    const size = Math.random() * 0.3 + 0.1;
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), bubbleMat.clone());
    bubble.position.set((Math.random() - 0.5) * 20, Math.random() * 15 - 5, (Math.random() - 0.5) * 10 - 5);
    scene.add(bubble);
    bubbles.push(bubble);
  }
  return bubbles;
}

function createGradientEnvMap(): THREE.CubeTexture {
  const size = 128;
  const data = new Uint8Array(size * size * 4);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const idx = (i * size + j) * 4;
      const gradient = i / size;
      data[idx] = Math.floor(20 + gradient * 40);
      data[idx + 1] = Math.floor(20 + gradient * 60);
      data[idx + 2] = Math.floor(40 + gradient * 80);
      data[idx + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;

  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
  cubeRenderTarget.texture.type = THREE.HalfFloatType;

  return cubeRenderTarget.texture as unknown as THREE.CubeTexture;
}
