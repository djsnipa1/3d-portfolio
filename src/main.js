import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

const space_bg = require("../static/space_bg.jpg");

const spaceTexture = new THREE.TextureLoader().load(space_bg);
scene.background = spaceTexture;

const chadTexture = new THREE.TextureLoader().load(
  "https://avatars.githubusercontent.com/u/118037?v=4"
);

const chad = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({ map: chadTexture })
);

scene.add(chad);

const moonTextureImage = require("../static/moon.jpg");
const moonBumpmapImage = require("../static/moon_map.jpg");
const moonTexture = new THREE.TextureLoader().load(moonTextureImage);
const moonBumomap = new THREE.TextureLoader().load(moonBumpmapImage);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    bumpMap: moonBumomap,
  })
);

moon.position.x = -15;
moon.position.z = -20;
moon.position.y = 5;
scene.add(moon);

const gui = new GUI();
const chadFolder = gui.addFolder("chad");
chadFolder.add(chad.rotation, "x", 0, Math.PI * 2);
chadFolder.add(chad.rotation, "y", 0, Math.PI * 2);
chadFolder.add(chad.rotation, "z", 0, Math.PI * 2);
chadFolder.open();
const cameraFolder = gui.addFolder("camera");
cameraFolder.add(camera.position, "z", 0, 20);

var axis = new THREE.Vector3(1, 0, 1).normalize();
var speed = 0.01;

//const axisFolder = gui,addFolder("axis");

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.09;
  torus.rotation.y += 0.06;
  torus.rotation.z += 0.01;

  moon.rotateOnAxis(axis, speed);
  chad.rotateOnAxis(axis, speed);
  // chad.rotation.y += 0.02;
  // chad.rotation.x += 0.02;
  // moon.rotation.y += 0.02;

  controls.update();

  renderer.render(scene, camera);
}

animate();
