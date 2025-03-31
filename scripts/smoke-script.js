// SmokeSeer background animation
let camera, scene, renderer, geometry, material, mesh;
let smokeParticles = [];
let clock, delta, cubeSineDriver;

// const SMOKE_RGB = "rgb(255, 218, 176)" 
const SMOKE_RGB = "rgb(176, 176, 176)" 

function init() {
    // Create clock for timing
    clock = new THREE.Clock();
    
    // Set up renderer with alpha (transparency)
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = 'smoke-canvas';
    
    // Set up scene
    scene = new THREE.Scene();
    
    // Set up camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.z = 1000;
    scene.add(camera);
    
    // Create cube geometry (though not visible in final render)
    geometry = new THREE.BoxGeometry(200, 200, 200); // Note: CubeGeometry is deprecated
    material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(SMOKE_RGB),
        wireframe: false
    });
    mesh = new THREE.Mesh(geometry, material);
    cubeSineDriver = 0;
    
    // Set up lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 0, 1);
    scene.add(light);
    
    // Load smoke texture
    const smokeTexture = new THREE.TextureLoader().load(
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png"
    );
    
    const smokeMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(SMOKE_RGB),
        map: smokeTexture,
        transparent: true
    });
    
    const smokeGeo = new THREE.PlaneGeometry(300, 300);
    
    // Create smoke particles
    for (let p = 0; p < 150; p++) {
        const particle = new THREE.Mesh(smokeGeo, smokeMaterial);
        particle.position.set(
            Math.random() * 500 - 250,
            Math.random() * 500 - 250,
            Math.random() * 1000 - 100
        );
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }
    
    // Add canvas to page
    document.getElementById('smoke-container').appendChild(renderer.domElement);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    delta = clock.getDelta();
    evolveSmoke();
    render();
}

function evolveSmoke() {
    let sp = smokeParticles.length;
    while (sp--) {
        smokeParticles[sp].rotation.z += delta * 0.2;
    }
}

function render() {
    renderer.setClearColor(0xffffff, 0);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    cubeSineDriver += 0.01;
    mesh.position.z = 100 + Math.sin(cubeSineDriver) * 500;
    renderer.render(scene, camera);
}

// Initialize and start animation
document.addEventListener('DOMContentLoaded', function() {
    init();
    animate();
});