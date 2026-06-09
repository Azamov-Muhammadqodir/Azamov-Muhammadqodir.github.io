const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0.8, 3);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.style.margin = "0";
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let model = null;

const loader = new THREE.GLTFLoader();

loader.load(
    "./model.glb",
    (gltf) => {
        model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, -1, 0);
        scene.add(model);
        console.log("Model loaded successfully");
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

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        const targetY = mouseX * 0.6;
        const targetX = -mouseY * 0.2;

        model.rotation.y += (targetY - model.rotation.y) * 0.05;
        model.rotation.x += (targetX - model.rotation.x) * 0.05;
    }

    renderer.render(scene, camera);
}

animate();
