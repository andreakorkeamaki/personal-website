// 3D World Management for Portfolio Game
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import * as CANNON from 'cannon-es';
import { gsap } from 'gsap';

// World class to manage the 3D environment
export class World {
    constructor() {
        // DOM elements
        this.canvas = document.querySelector('canvas.webgl');
        this.loadingBarElement = document.querySelector('.loading-bar');
        this.loadingScreen = document.querySelector('.loading-screen');
        
        // World state
        this.currentWorld = 'hub';
        this.worlds = {
            hub: { position: new THREE.Vector3(0, 0, 0) },
            design: { position: new THREE.Vector3(-50, 0, -20) },
            code: { position: new THREE.Vector3(50, 0, -20) },
            '3d': { position: new THREE.Vector3(0, 0, -60) }
        };
        
        // Project data
        this.projects = [
            {
                id: 'geometric',
                title: 'Geometric Visions',
                category: 'design',
                description: 'Branding & Identity project featuring geometric patterns and minimalist design.',
                position: new THREE.Vector3(-60, 0, -30),
                modelPath: 'models/design_world/geometric_showcase.glb'
            },
            {
                id: 'algorithmic',
                title: 'Algorithmic Patterns',
                category: 'code',
                description: 'Generative art created through algorithms and creative coding techniques.',
                position: new THREE.Vector3(60, 0, -30),
                modelPath: 'models/code_world/algorithm_showcase.glb'
            },
            {
                id: 'liquid',
                title: 'Liquid Formations',
                category: '3d',
                description: '3D animation project exploring fluid dynamics and organic forms.',
                position: new THREE.Vector3(0, 0, -70),
                modelPath: 'models/3d_world/liquid_showcase.glb'
            },
            {
                id: 'typography',
                title: 'Interactive Typography',
                category: 'design code',
                description: 'Web design project focused on interactive typography and user experience.',
                position: new THREE.Vector3(-40, 0, -40),
                modelPath: 'models/design_world/typography_showcase.glb'
            },
            {
                id: 'landscapes',
                title: 'Digital Landscapes',
                category: '3d code',
                description: 'WebGL experience creating immersive digital landscapes and environments.',
                position: new THREE.Vector3(40, 0, -40),
                modelPath: 'models/code_world/landscape_showcase.glb'
            },
            {
                id: 'minimalist',
                title: 'Minimalist Collection',
                category: 'design',
                description: 'Minimalist design collection focusing on simplicity and visual impact.',
                position: new THREE.Vector3(-50, 0, -50),
                modelPath: 'models/design_world/minimalist_showcase.glb'
            }
        ];
        
        // Setup components
        this.setupLoading();
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupControls();
        this.setupPhysics();
        this.setupPostProcessing();
        
        // Load assets
        this.loadAssets();
        
        // Start animation loop
        this.clock = new THREE.Clock();
        this.tick();
        
        // Handle resizing
        window.addEventListener('resize', () => this.resize());
    }
    
    setupLoading() {
        // Loading progress
        const loadingManager = new THREE.LoadingManager();
        const loadingScreen = document.querySelector('.loading-screen');
        const loadingBar = document.querySelector('.loading-bar');
        
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = itemsLoaded / itemsTotal;
            loadingBar.style.transform = `scaleX(${progress})`;
        };
        
        // Force complete loading after timeout to prevent hanging
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
            this.initScrollAnimations();
        }, 3000);
        
        loadingManager.onLoad = () => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
            this.initScrollAnimations();
        };
        
        return loadingManager;
    }
    
    initScrollAnimations() {
        const scrollElements = document.querySelectorAll('[data-scroll]');
        
        const elementInView = (el) => {
            const elementTop = el.getBoundingClientRect().top;
            return elementTop <= (window.innerHeight || document.documentElement.clientHeight) * 0.8;
        };
        
        const displayScrollElement = (element) => {
            element.setAttribute('data-scroll', 'in');
        };
        
        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el)) {
                    displayScrollElement(el);
                }
            });
        };
        
        window.addEventListener('scroll', () => {
            handleScrollAnimation();
        });
        
        // Initial check on page load
        setTimeout(handleScrollAnimation, 100);
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#000817');
        
        // Enhanced fog effect
        this.sceneFog = new THREE.FogExp2('#000817', 0.015);
        this.scene.fog = this.sceneFog;
        
        // Fog colors for different worlds
        this.fogColors = {
            hub: new THREE.Color('#000817'),
            design: new THREE.Color('#170808'),
            code: new THREE.Color('#081708'),
            '3d': new THREE.Color('#080817')
        };
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 15);
        this.scene.add(this.camera);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 5, 3);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);
        
        // Point lights for each world
        const hubLight = new THREE.PointLight(0x88ccff, 2, 50);
        hubLight.position.set(0, 5, 0);
        hubLight.castShadow = true;
        this.scene.add(hubLight);
        
        const designLight = new THREE.PointLight(0xffaa88, 2, 50);
        designLight.position.set(-50, 5, -20);
        designLight.castShadow = true;
        this.scene.add(designLight);
        
        const codeLight = new THREE.PointLight(0x88ffaa, 2, 50);
        codeLight.position.set(50, 5, -20);
        codeLight.castShadow = true;
        this.scene.add(codeLight);
        
        const tdLight = new THREE.PointLight(0xaa88ff, 2, 50);
        tdLight.position.set(0, 5, -60);
        tdLight.castShadow = true;
        this.scene.add(tdLight);
    }
    
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 30;
    }
    
    setupPhysics() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.world.allowSleep = true;
        
        // Create ground plane
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);
    }
    
    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Bloom effect
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.4, 0.85);
        this.composer.addPass(bloomPass);
    }
    
    loadAssets() {
        // Initialize loaders
        const textureLoader = new THREE.TextureLoader(this.loadingManager);
        const gltfLoader = new GLTFLoader(this.loadingManager);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        gltfLoader.setDRACOLoader(dracoLoader);
        
        // Load skybox
        const skyboxTexture = textureLoader.load('textures/skybox.jpg');
        skyboxTexture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = skyboxTexture;
        
        // Load floor texture
        const floorTexture = textureLoader.load('textures/floor.jpg');
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(100, 100);
        
        // Create floor
        const floorGeometry = new THREE.PlaneGeometry(500, 500);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            map: floorTexture,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.5;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Load hub world
        this.loadHubWorld(gltfLoader, textureLoader);
        
        // Load project worlds
        this.loadProjectWorlds(gltfLoader, textureLoader);
    }
    
    loadHubWorld(gltfLoader, textureLoader) {
        // Create central hub
        const hubGeometry = new THREE.CylinderGeometry(10, 10, 1, 32);
        const hubMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            roughness: 0.3,
            metalness: 0.8,
            envMap: this.scene.environment
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.position.set(0, -0.25, 0);
        hub.receiveShadow = true;
        this.scene.add(hub);
        
        // Add central hologram
        const hologramGeometry = new THREE.SphereGeometry(3, 32, 32);
        const hologramMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.5,
            wireframe: true
        });
        const hologram = new THREE.Mesh(hologramGeometry, hologramMaterial);
        hologram.position.set(0, 4, 0);
        this.scene.add(hologram);
        
        // Add portals to other worlds
        this.createPortal('design', new THREE.Vector3(-15, 0, 0), 0xffaa88);
        this.createPortal('code', new THREE.Vector3(15, 0, 0), 0x88ffaa);
        this.createPortal('3d', new THREE.Vector3(0, 0, -15), 0xaa88ff);
    }
    
    createPortal(worldName, position, color) {
        const portalGeometry = new THREE.CircleGeometry(3, 32);
        const portalMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const portal = new THREE.Mesh(portalGeometry, portalMaterial);
        portal.position.copy(position);
        portal.position.y = 3;
        
        // Make portal face center
        portal.lookAt(0, 3, 0);
        
        // Add text above portal
        const textDiv = document.createElement('div');
        textDiv.className = 'portal-label';
        textDiv.textContent = worldName.toUpperCase();
        textDiv.style.color = '#' + color.toString(16).padStart(6, '0');
        document.body.appendChild(textDiv);
        
        const label = new THREE.Object3D();
        label.position.copy(position);
        label.position.y = 7;
        this.scene.add(label);
        
        portal.userData = {
            type: 'portal',
            worldName: worldName,
            label: label
        };
        
        this.scene.add(portal);
        
        // Add animation
        gsap.to(portal.rotation, {
            y: Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: 'none'
        });
    }
    
    loadProjectWorlds(gltfLoader, textureLoader) {
        // For each project world, create an environment
        // This is simplified - would need actual models
        
        // Design world
        const designGeometry = new THREE.CircleGeometry(15, 32);
        const designMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa88,
            roughness: 0.4,
            metalness: 0.6
        });
        const designWorld = new THREE.Mesh(designGeometry, designMaterial);
        designWorld.position.copy(this.worlds.design.position);
        designWorld.position.y = -0.25;
        designWorld.rotation.x = -Math.PI / 2;
        designWorld.receiveShadow = true;
        this.scene.add(designWorld);
        
        // Code world
        const codeGeometry = new THREE.CircleGeometry(15, 32);
        const codeMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ffaa,
            roughness: 0.4,
            metalness: 0.6
        });
        const codeWorld = new THREE.Mesh(codeGeometry, codeMaterial);
        codeWorld.position.copy(this.worlds.code.position);
        codeWorld.position.y = -0.25;
        codeWorld.rotation.x = -Math.PI / 2;
        codeWorld.receiveShadow = true;
        this.scene.add(codeWorld);
        
        // 3D world
        const tdGeometry = new THREE.CircleGeometry(15, 32);
        const tdMaterial = new THREE.MeshStandardMaterial({
            color: 0xaa88ff,
            roughness: 0.4,
            metalness: 0.6
        });
        const tdWorld = new THREE.Mesh(tdGeometry, tdMaterial);
        tdWorld.position.copy(this.worlds['3d'].position);
        tdWorld.position.y = -0.25;
        tdWorld.rotation.x = -Math.PI / 2;
        tdWorld.receiveShadow = true;
        this.scene.add(tdWorld);
        
        // Create project showcases within each world
        this.projects.forEach(project => {
            this.createProjectShowcase(project, textureLoader);
        });
    }
    
    createProjectShowcase(project, textureLoader) {
        // Create a pedestal for the project
        const pedestalGeometry = new THREE.CylinderGeometry(2, 2.5, 1, 16);
        const pedestalMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.2
        });
        const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
        pedestal.position.copy(project.position);
        pedestal.position.y = -0.25;
        pedestal.castShadow = true;
        pedestal.receiveShadow = true;
        this.scene.add(pedestal);
        
        // Create a placeholder model for the project
        let showcaseGeometry;
        
        if (project.category.includes('design')) {
            showcaseGeometry = new THREE.BoxGeometry(2, 2, 2);
        } else if (project.category.includes('code')) {
            showcaseGeometry = new THREE.DodecahedronGeometry(1.5, 0);
        } else { // 3d
            showcaseGeometry = new THREE.TorusKnotGeometry(1, 0.4, 64, 16);
        }
        
        const showcaseMaterial = new THREE.MeshStandardMaterial({
            color: this.getCategoryColor(project.category),
            roughness: 0.3,
            metalness: 0.7,
            envMap: this.scene.environment
        });
        
        const showcase = new THREE.Mesh(showcaseGeometry, showcaseMaterial);
        showcase.position.copy(project.position);
        showcase.position.y = 2;
        showcase.castShadow = true;
        showcase.receiveShadow = true;
        this.scene.add(showcase);
        
        // Add project info panel
        const textDiv = document.createElement('div');
        textDiv.className = 'project-label';
        textDiv.innerHTML = `<h3>${project.title}</h3><p>${project.description}</p>`;
        textDiv.style.opacity = '0';
        document.body.appendChild(textDiv);
        
        const label = new THREE.Object3D();
        label.position.copy(project.position);
        label.position.y = 5;
        this.scene.add(label);
        
        showcase.userData = {
            type: 'project',
            project: project,
            label: label,
            infoElement: textDiv
        };
        
        // Add animation
        gsap.to(showcase.rotation, {
            y: Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: 'none'
        });
        
        if (project.category.includes('3d')) {
            gsap.to(showcase.rotation, {
                x: Math.PI * 2,
                duration: 15,
                repeat: -1,
                ease: 'none'
            });
        }
    }
    
    getCategoryColor(category) {
        if (category.includes('design')) return 0xffaa88;
        if (category.includes('code')) return 0x88ffaa;
        if (category.includes('3d')) return 0xaa88ff;
        return 0xffffff;
    }
    
    navigateToWorld(worldName) {
        if (!this.worlds[worldName]) return;
        
        const targetPosition = this.worlds[worldName].position.clone();
        targetPosition.y = 5; // Camera height
        
        // Disable controls during transition
        this.controls.enabled = false;
        
        // Animate camera movement
        gsap.to(this.camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z + 15, // Position camera 15 units away from world center
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                this.currentWorld = worldName;
                this.controls.enabled = true;
                
                // Update UI
                document.querySelector('.world-title').textContent = worldName.toUpperCase();
                
                // Show back button if not in hub
                if (worldName !== 'hub') {
                    document.querySelector('.back-to-hub').style.display = 'block';
                } else {
                    document.querySelector('.back-to-hub').style.display = 'none';
                }
            }
        });
        
        // Look at world center
        const lookAtPosition = this.worlds[worldName].position.clone();
        gsap.to(this.controls.target, {
            x: lookAtPosition.x,
            y: lookAtPosition.y,
            z: lookAtPosition.z,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        // Fade fog color to match the world
        if (this.fogColors && this.fogColors[worldName]) {
            const currentColor = this.sceneFog.color.clone();
            const targetColor = this.fogColors[worldName].clone();
            
            // Use gsap to animate color change
            gsap.to(currentColor, {
                r: targetColor.r,
                g: targetColor.g,
                b: targetColor.b,
                duration: 2.5,
                ease: 'power2.inOut',
                onUpdate: () => {
                    this.sceneFog.color.setRGB(currentColor.r, currentColor.g, currentColor.b);
                    this.scene.background.setRGB(currentColor.r, currentColor.g, currentColor.b);
                }
            });
            
            // Also animate fog density for effect
            gsap.to(this.sceneFog, {
                density: worldName === 'hub' ? 0.015 : 0.025,
                duration: 2,
                ease: 'power2.inOut'
            });
        }
    }
    
    checkIntersections() {
        // Raycaster to detect mouse over objects
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        // Update mouse position
        document.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Handle clicks on objects
        document.addEventListener('click', () => {
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            
            for (const intersect of intersects) {
                if (intersect.object.userData.type === 'portal') {
                    const worldName = intersect.object.userData.worldName;
                    this.navigateToWorld(worldName);
                    break;
                }
                else if (intersect.object.userData.type === 'project') {
                    const project = intersect.object.userData.project;
                    this.showProjectDetails(project);
                    break;
                }
            }
        });
        
        // Check for mouseover on every frame
        return () => {
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            
            // Reset all highlight states
            this.scene.traverse((child) => {
                if (child.userData.type === 'project') {
                    child.userData.infoElement.style.opacity = '0';
                }
            });
            
            // Set highlight for intersected object
            for (const intersect of intersects) {
                if (intersect.object.userData.type === 'portal') {
                    document.body.style.cursor = 'pointer';
                    return;
                }
                else if (intersect.object.userData.type === 'project') {
                    document.body.style.cursor = 'pointer';
                    intersect.object.userData.infoElement.style.opacity = '1';
                    return;
                }
            }
            
            document.body.style.cursor = 'default';
        };
    }
    
    showProjectDetails(project) {
        // Show modal with project details
        const modal = document.querySelector('.project-modal');
        const modalTitle = document.querySelector('.project-modal-title');
        const modalDesc = document.querySelector('.project-modal-description');
        const modalCategory = document.querySelector('.project-modal-category');
        
        modalTitle.textContent = project.title;
        modalDesc.textContent = project.description;
        modalCategory.textContent = project.category.toUpperCase();
        
        // Set modal category color
        modalCategory.style.backgroundColor = '#' + this.getCategoryColor(project.category).toString(16).padStart(6, '0');
        
        // Show modal
        modal.style.display = 'flex';
        gsap.fromTo(modal, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
    }
    
    resize() {
        // Update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Update composer size
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }
    
    tick() {
        // Get elapsed time
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update physics
        this.world.step(1 / 60, elapsedTime, 3);
        
        // Update controls
        this.controls.update();
        
        // Check for intersections
        const checkIntersectionsFn = this.checkIntersections();
        checkIntersectionsFn();
        
        // Update labels (billboarding)
        this.scene.traverse((object) => {
            if (object.userData && object.userData.label) {
                const label = object.userData.label;
                const screenPosition = object.userData.position?.clone() || object.position.clone();
                
                screenPosition.project(this.camera);
                
                const translateX = screenPosition.x * window.innerWidth / 2;
                const translateY = -screenPosition.y * window.innerHeight / 2;
                
                if (object.userData.infoElement) {
                    object.userData.infoElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
                }
            }
        });
        
        // Render
        this.composer.render();
        
        // Call tick again on the next frame
        window.requestAnimationFrame(() => this.tick());
    }
}
