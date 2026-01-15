'use client';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as THREE from 'three';

/**
 * Returns a GLTFLoader that can handle Draco-compressed GLB/GLTF files
 */
export function getDracoGLTFLoader(): GLTFLoader {
  const dracoLoader = new DRACOLoader();

  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  return loader;
}

/**
 * Loads a Draco-compressed model
 */
export async function loadDracoModel(path: string): Promise<THREE.Group> {
  const loader = getDracoGLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => resolve(gltf.scene),
      undefined,
      (err) => reject(err)
    );
  });
}
