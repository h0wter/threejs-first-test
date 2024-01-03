import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createRandomFigure } from "./helpers/create-random-figure.helper.js";
import { generateVercexes } from "./helpers/generate-vertexes.helper.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#242424");

const DURATION = 9;

const explodeCube = () => {
  const children = scene.children;
  for (const child of children) {
    if (!child.isCamera) {
      gsap.to(child.position, {
        duration: DURATION,
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 50,
      });
      gsap.to(child.rotation, {
        duration: DURATION,
        x: (Math.random() - 0.5) * Math.PI * 8,
        y: (Math.random() - 0.5) * Math.PI * 8,
      });
    }
  }
};

const buildCanvas = (canvas, cubeParams) => {
  scene.clear();

  const { x, y, z, isWireframeEnabled } = cubeParams;

  const numberOfFigures = x * y * z;
  const SIZES = {
    width: canvas.offsetWidth,
    height: canvas.offsetHeight,
  };

  const vertexes = generateVercexes(cubeParams);

  for (let i = 0; i < numberOfFigures; i++) {
    const { x, y, z } = vertexes[i];
    const mesh = createRandomFigure(isWireframeEnabled);
    mesh.position.set(x, y, z);
    scene.add(mesh);
  }

  const camera = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height);
  camera.position.z = 7;

  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.target = new THREE.Vector3(
    (x - 0.5) * 0.5,
    (y - 0.5) * 0.5,
    (z - 0.5) * 0.5
  );

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setSize(SIZES.width, SIZES.height);
  renderer.render(scene, camera);

  const tick = () => {
    requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  };

  tick();
};

export { buildCanvas, explodeCube };
