import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 1.2, 4);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

const modelContainer = document.querySelector('#hero-model') || document.body;
const containerWidth = window.innerWidth;
const containerHeight = window.innerHeight;
camera.aspect = containerWidth / containerHeight;
camera.updateProjectionMatrix();
renderer.setSize(containerWidth, containerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.style.width = '100vw';
renderer.domElement.style.height = '100vh';
renderer.domElement.style.display = 'block';
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.margin = '0';
renderer.domElement.style.padding = '0';
renderer.domElement.style.border = 'none';

modelContainer.style.position = 'fixed';
modelContainer.style.top = '0';
modelContainer.style.left = '0';
modelContainer.style.width = '100vw';
modelContainer.style.height = '100vh';
modelContainer.style.overflow = 'visible';

if (!modelContainer.contains(renderer.domElement)) {
    modelContainer.appendChild(renderer.domElement);
}

// Expose core objects for debugging in the browser console
window.scene = scene;
window.camera = camera;
window.renderer = renderer;
window.THREE = THREE;

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let model = null;

const loader = new GLTFLoader();

loader.load(
    "./model.glb",
    (gltf) => {
        model = gltf.scene;
        model.scale.set(4.0, 4.0, 4.0);
        model.position.set(0, 0, 0);
        
        scene.add(model);
        // expose loaded model for easy inspection
        window.model = model;
        console.log("Model loaded successfully");
            // compute bounding box and recenter model so its geometric center is at origin
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            // scale and lift slightly to frame nicely
            model.position.y += 1.0; // raised more for better framing

            // orient model to face the camera (yaw only) and store base orientation
            const lookTarget = camera.position.clone();
            lookTarget.y = model.position.y;
            const tmp = new THREE.Object3D();
            tmp.position.copy(model.position);
            tmp.lookAt(lookTarget);
            model.quaternion.copy(tmp.quaternion);
            // save base orientation to apply cursor-driven yaw relative to this
            // apply an initial 90° left (negative yaw) offset to the base orientation
            const initialYaw = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
            model.userData.baseQuaternion = model.quaternion.clone().multiply(initialYaw);

            console.log("Model loaded successfully and oriented to camera");
    },
    undefined,
    (error) => {
        console.error("GLTF load error:", error);
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Modelni yuklashda xato yuz berdi. Iltimos, faylning mavjudligini va to'g'ri joylashuvini tekshiring.";
        errorMessage.style.cssText = "position:absolute;top:20px;left:20px;color:#fff;background:rgba(0,0,0,0.8);padding:12px;border-radius:8px;max-width:320px;z-index:100;";
        document.body.appendChild(errorMessage);
    }
);

// Use normalized device coords for correct unprojection
const mouse = new THREE.Vector2(0, 0);
// allow runtime inversion toggle if direction is reversed
let invertHorizontal = false;
let invertVertical = false;

// helper to toggle from console: call `toggleInvert()` or press 'i'/'k'
window.toggleInvert = () => { invertHorizontal = !invertHorizontal; window.__invertH = invertHorizontal; };
window.toggleInvertV = () => { invertVertical = !invertVertical; window.__invertV = invertVertical; };
window.__invertH = invertHorizontal;
window.__invertV = invertVertical;

window.addEventListener('keydown', (e) => {
    if (e.key === 'i') window.toggleInvert();
    if (e.key === 'k') window.toggleInvertV();
});

window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1; // NDC y is inverted
    // expose for debugging
    window.__mouse = { x: mouse.x, y: mouse.y };
});

window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
});

function animate() {
    requestAnimationFrame(animate);
    // frame counter for debugging
    window.__frameCount = (window.__frameCount || 0) + 1;
    try {
    if (model) {
        // Cursor-driven yaw and pitch (parallel movement): use mouse.x for yaw, mouse.y for pitch
        const baseQ = model.userData && model.userData.baseQuaternion ? model.userData.baseQuaternion.clone() : model.quaternion.clone();
        const maxYaw = Math.PI / 2; // maximum yaw offset (±90deg)
        const maxPitch = Math.PI / 3; // maximum pitch offset (±60deg) to avoid extreme flips

        let desiredYaw = mouse.x * maxYaw;
        let desiredPitch = mouse.y * maxPitch;
        if (invertHorizontal) desiredYaw = -desiredYaw;
        if (invertVertical) desiredPitch = -desiredPitch;

        // build combined rotation from pitch (X) then yaw (Y)
        const rot = new THREE.Quaternion().setFromEuler(new THREE.Euler(desiredPitch, desiredYaw, 0, 'XYZ'));
        const targetQ = baseQ.clone().multiply(rot);
        model.quaternion.slerp(targetQ, 0.12);
    }
    renderer.render(scene, camera);
    } catch (e) {
        window.__animateError = e && e.message ? e.message : String(e);
        console.error('Animate error:', e);
    }
}

animate();

// expose controls to manually start/inspect animation loop
window.animate = animate;
window.startAnimation = () => { animate(); window.__animStarted = true; };
