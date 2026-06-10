import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.2, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const modelContainer = document.querySelector('#hero-model') || document.body;
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

Object.assign(renderer.domElement.style, {
    width: '100vw', height: '100vh', display: 'block',
    position: 'fixed', top: '0', left: '0',
    margin: '0', padding: '0', border: 'none',
});

Object.assign(modelContainer.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh', overflow: 'visible',
});

if (!modelContainer.contains(renderer.domElement)) {
    modelContainer.appendChild(renderer.domElement);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let model = null;

const loader = new GLTFLoader();
loader.load('./model.glb', (gltf) => {
    model = gltf.scene;
    const s = isMobile ? 3.0 : 4.0;
    model.scale.set(s, s, s);
    model.position.set(0, 0, 0);
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.position.y += 1.0;

    const lookTarget = camera.position.clone();
    lookTarget.y = model.position.y;
    const tmp = new THREE.Object3D();
    tmp.position.copy(model.position);
    tmp.lookAt(lookTarget);
    model.quaternion.copy(tmp.quaternion);

    const initialYaw = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
    model.userData.baseQuaternion = model.quaternion.clone().multiply(initialYaw);
}, undefined, (error) => {
    console.error('GLTF load error:', error);
    const msg = document.createElement('div');
    msg.textContent = 'Modelni yuklashda xato yuz berdi.';
    msg.style.cssText = 'position:absolute;top:20px;left:20px;color:#fff;background:rgba(0,0,0,0.8);padding:12px;border-radius:8px;max-width:320px;z-index:100;';
    document.body.appendChild(msg);
});

// Unified input: x/y in -1..1 range, drives model rotation
const input = new THREE.Vector2(0, 0);
const isMobile = window.matchMedia('(pointer: coarse)').matches;

if (!isMobile) {
    // --- Desktop: follow mouse cursor ---
    window.addEventListener('mousemove', (e) => {
        input.x = (e.clientX / window.innerWidth) * 2 - 1;
        input.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
} else {
    // --- Mobile: gyroscope (tilt phone to rotate model) ---
    const BETA_NEUTRAL = 60; // upright (90°) minus 30° backward tilt = 60°
    const TILT_RANGE = 35;   // degrees of tilt for full -1..1 sweep

    let gyroActive = false;

    function onOrientation(e) {
        if (e.gamma === null || e.beta === null) return;
        gyroActive = true;
        // gamma: left/right tilt (-90..90) → horizontal rotation
        // beta deviation from neutral → vertical rotation
        input.x = Math.max(-1, Math.min(1, e.gamma / TILT_RANGE));
        input.y = Math.max(-1, Math.min(1, (e.beta - BETA_NEUTRAL) / TILT_RANGE));
    }

    function setupGyro() {
        window.addEventListener('deviceorientation', onOrientation, true);
    }

    // iOS 13+ requires a user-gesture permission request
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        // Show a tap-to-enable hint
        const hint = document.createElement('div');
        hint.textContent = '📱 Tap to enable tilt';
        hint.style.cssText = [
            'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
            'background:rgba(0,0,0,0.6)', 'color:#fff', 'padding:10px 20px',
            'border-radius:20px', 'font-size:13px', 'z-index:9999',
            'pointer-events:none', 'transition:opacity 0.5s',
        ].join(';');
        document.body.appendChild(hint);

        document.addEventListener('touchend', async function requestOnce() {
            document.removeEventListener('touchend', requestOnce);
            try {
                const result = await DeviceOrientationEvent.requestPermission();
                if (result === 'granted') setupGyro();
            } catch (_) {}
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 600);
        }, { once: true });
    } else {
        // Android / older iOS — permission not required
        setupGyro();
    }

    // Touch drag fallback: works when gyro unavailable OR as supplement
    let lastTouch = null;
    window.addEventListener('touchstart', (e) => {
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!lastTouch || gyroActive) return;
        const dx = (e.touches[0].clientX - lastTouch.x) / window.innerWidth * 2;
        const dy = -(e.touches[0].clientY - lastTouch.y) / window.innerHeight * 2;
        input.x = Math.max(-1, Math.min(1, input.x + dx));
        input.y = Math.max(-1, Math.min(1, input.y + dy));
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => { lastTouch = null; }, { passive: true });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
    requestAnimationFrame(animate);
    if (model) {
        const baseQ = model.userData.baseQuaternion
            ? model.userData.baseQuaternion.clone()
            : model.quaternion.clone();

        const rot = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(input.y * (Math.PI / 3), input.x * (Math.PI / 2), 0, 'XYZ')
        );
        model.quaternion.slerp(baseQ.multiply(rot), 0.08);
    }
    renderer.render(scene, camera);
}

animate();
