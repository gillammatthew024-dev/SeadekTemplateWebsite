'use client';
// src/components/Hero3DBackground.tsx
import { useRef, useEffect, ReactNode } from 'react';
import * as THREE from 'three';
import './Hero3DBackground.css';

interface Hero3DBackgroundProps {
  children: ReactNode;
}

export default function Hero3DBackground({ children }: Hero3DBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    car: THREE.Group;
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
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting for that polished car look
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x4a90d9, 1);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff6b35, 0.8);
    rimLight.position.set(0, -5, -10);
    scene.add(rimLight);

    // Accent lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x00d4ff, 2, 20);
    pointLight1.position.set(-5, 2, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff0080, 1.5, 20);
    pointLight2.position.set(5, 2, -3);
    scene.add(pointLight2);

    // Create stylized car model
    const car = createStylizedCar();
    scene.add(car);

    // Create floating soap bubbles
    const bubbles = createBubbles(scene);

    // Environment map for reflections
    const envMapLoader = new THREE.CubeTextureLoader();
    const envMap = createGradientEnvMap();
    scene.environment = envMap;
    scene.background = null;

    sceneRef.current = { scene, camera, renderer, car, bubbles };

    // Animation loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate car smoothly
      car.rotation.y = elapsed * 0.3;
      
      // Subtle floating motion
      car.position.y = Math.sin(elapsed * 0.5) * 0.1;

      // Animate bubbles
      bubbles.forEach((bubble, i) => {
        bubble.position.y += 0.01 + Math.sin(elapsed + i) * 0.005;
        bubble.position.x += Math.sin(elapsed * 0.5 + i * 0.5) * 0.002;
        
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

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      camera.position.x = x * 1.5;
      camera.position.y = 2 - y * 0.5;
      camera.lookAt(0, 0, 0);
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="hero-3d-container">
      <div ref={containerRef} className="three-canvas" />
      <div className="content-overlay">
        {children}
      </div>
    </div>
  );
}

// Create a stylized low-poly sports car
function createStylizedCar(): THREE.Group {
  const car = new THREE.Group();

  // Car body material - ultra glossy
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a2e,
    metalness: 0.9,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 1,
    envMapIntensity: 2,
  });

  // Alternative colors you can swap
  // const bodyMaterial = new THREE.MeshPhysicalMaterial({
  //   color: 0x8b0000, // Deep red
  //   ...same properties
  // });

  // Main body - sleek sports car shape
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-2, 0);
  bodyShape.lineTo(-1.8, 0.3);
  bodyShape.lineTo(-1.5, 0.4);
  bodyShape.lineTo(-0.5, 0.5);
  bodyShape.lineTo(0.5, 0.8);
  bodyShape.lineTo(1.2, 0.8);
  bodyShape.lineTo(1.8, 0.5);
  bodyShape.lineTo(2, 0.3);
  bodyShape.lineTo(2, 0);
  bodyShape.lineTo(-2, 0);

  const extrudeSettings = {
    depth: 1.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 5,
  };

  const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
  bodyGeometry.center();
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.scale.set(1.2, 1, 1);
  body.position.y = 0.3;
  car.add(body);

  // Hood/roof smooth dome
  const hoodGeometry = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
  hood.scale.set(1.5, 0.4, 0.8);
  hood.position.set(0, 0.5, 0);
  car.add(hood);

  // Windshield
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    metalness: 0,
    roughness: 0,
    transmission: 0.9,
    thickness: 0.1,
    transparent: true,
    opacity: 0.3,
  });

  const windshieldGeometry = new THREE.PlaneGeometry(1, 0.5);
  const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
  windshield.position.set(0.3, 0.75, 0);
  windshield.rotation.set(0, 0, -0.4);
  car.add(windshield);

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 32);
  const wheelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x222222,
    metalness: 0.8,
    roughness: 0.3,
  });

  const rimMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xcccccc,
    metalness: 1,
    roughness: 0.1,
  });

  const wheelPositions = [
    [-1.2, 0, 0.7],
    [-1.2, 0, -0.7],
    [1.2, 0, 0.7],
    [1.2, 0, -0.7],
  ];

  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, y, z);
    car.add(wheel);

    // Rim detail
    const rimGeometry = new THREE.TorusGeometry(0.18, 0.03, 8, 16);
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.set(x, y, z + (z > 0 ? 0.08 : -0.08));
    car.add(rim);
  });

  // Headlights
  const headlightMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    emissive: 0xffffcc,
    emissiveIntensity: 2,
  });

  const headlightGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  
  [[-0.4, 0.4, 2], [0.4, 0.4, 2]].forEach(([x, y, z]) => {
    const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight.position.set(z, y, x);
    headlight.scale.set(1.5, 0.8, 0.5);
    car.add(headlight);
  });

  // Taillights
  const taillightMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 1,
  });

  [[-0.4, 0.4, -2.1], [0.4, 0.4, -2.1]].forEach(([x, y, z]) => {
    const taillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
    taillight.position.set(z, y, x);
    taillight.scale.set(1, 0.5, 0.5);
    car.add(taillight);
  });

  // Ground reflection plane
  const groundGeometry = new THREE.CircleGeometry(5, 64);
  const groundMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x111122,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.8,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.25;
  car.add(ground);

  car.scale.set(0.8, 0.8, 0.8);
  return car;
}

// Create floating soap bubbles
function createBubbles(scene: THREE.Scene): THREE.Mesh[] {
  const bubbles: THREE.Mesh[] = [];
  
  const bubbleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 0.95,
    thickness: 0.5,
    transparent: true,
    opacity: 0.4,
    iridescence: 1,
    iridescenceIOR: 1.3,
    clearcoat: 1,
  });

  for (let i = 0; i < 30; i++) {
    const size = Math.random() * 0.3 + 0.1;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const bubble = new THREE.Mesh(geometry, bubbleMaterial.clone());
    
    bubble.position.set(
      (Math.random() - 0.5) * 20,
      Math.random() * 15 - 5,
      (Math.random() - 0.5) * 10 - 5
    );
    
    scene.add(bubble);
    bubbles.push(bubble);
  }

  return bubbles;
}

// Create gradient environment map for reflections
function createGradientEnvMap(): THREE.CubeTexture {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const idx = (i * size + j) * 4;
      const gradient = i / size;
      
      data[idx] = Math.floor(20 + gradient * 40);     // R
      data[idx + 1] = Math.floor(20 + gradient * 60); // G
      data[idx + 2] = Math.floor(40 + gradient * 80); // B
      data[idx + 3] = 255;                            // A
    }
  }

  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;

  // Create cube texture from gradient
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
  cubeRenderTarget.texture.type = THREE.HalfFloatType;
  
  return cubeRenderTarget.texture as unknown as THREE.CubeTexture;
}