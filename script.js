import * as THREE from "./three.js/build/three.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 5, 20);
camera.lookAt(0, 0, 0);

function createPoint(x, y, z) {
  return new THREE.Vector3(x, y, z);
}

function createPoints(points) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    color: 0xf0f000,
    size: 0.5,
  });

  geometry.setFromPoints(points);

  return new THREE.Points(geometry, material);
}

function createLines(points) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.LineBasicMaterial({
    color: 0xa3842f,
  });

  geometry.setFromPoints(points);

  return new THREE.Line(geometry, material);
}

function createPlane(w, h) {
  const geometry = new THREE.PlaneGeometry(w, h);
  const material = new THREE.MeshPhongMaterial({
    color: 0xff00ff,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geometry, material);
}

function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateRandomPoints(count, minCoordinate, maxCoordinate) {
  const points = [];

  for (let i = 0; i < count; i++) {
    const x = getRandomBetween(minCoordinate, maxCoordinate);
    const y = getRandomBetween(minCoordinate, maxCoordinate);
    const z = getRandomBetween(minCoordinate, maxCoordinate);
    points.push(createPoint(x, y, z));
  }

  return points;
}

const edgeLimit = 10;
const count = 500;
const points = generateRandomPoints(count, -edgeLimit, edgeLimit);
const createdPoints = createPoints(points);
const createdLines = createLines(points);
const plane = createPlane(10, 10);
const light = new THREE.PointLight();

light.position.set(3, 5, 3);
plane.rotation.set(Math.PI / 2, 0, 0);

scene.add(plane);
scene.add(light);
scene.add(createdPoints);
scene.add(createdLines);

const velocities = [];

for (let i = 0; i < count * 3; i++) {
  velocities.push(getRandomBetween(-0.1, 0.1));
}

function animate() {
  requestAnimationFrame(animate);

  plane.rotation.z += 0.01;

  const positions = createdPoints.geometry.attributes.position.array;
  const lines = createdLines.geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i++) {
    positions[i] += velocities[i];
    lines[i] += velocities[i];

    if (positions[i] < -edgeLimit || positions[i] > edgeLimit) {
      velocities[i] = -velocities[i];
    }
  }

  createdPoints.geometry.attributes.position.needsUpdate = true;
  createdLines.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

function resizeScene() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resizeScene);
