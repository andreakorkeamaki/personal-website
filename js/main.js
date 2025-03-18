// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize everything once DOM is loaded
    initLoader();
    initNavigation();
    initHeroCanvas();
    initScrollAnimations();
    initWorkFilters();
    initContactForm();
});

// ========== LOADER ==========
function initLoader() {
    const loader = document.querySelector('.loader');
    const loaderText = document.querySelector('.loader-text');
    
    // Animate loader text
    gsap.to(loaderText, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
    });
    
    // Hide loader after everything is loaded
    window.addEventListener('load', () => {
        gsap.to(loaderText, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: 'power3.in'
        });
        
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: 'power3.inOut',
            delay: 0.7,
            onComplete: () => {
                loader.style.display = 'none';
                animateHeroElements();
            }
        });
    });
}

// ========== NAVIGATION ==========
function initNavigation() {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Change header style on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Highlight active section in navigation
        activateCurrentSection();
    });
    
    // Function to highlight the active navigation link based on scroll position
    function activateCurrentSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
}

// ========== HERO CANVAS ==========
function initHeroCanvas() {
    // Get the canvas container
    const container = document.getElementById('hero-canvas');
    
    // Create scene, camera and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Responsive canvas
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Create geometry and material
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x4f76ff,
        blending: THREE.AdditiveBlending,
        transparent: true,
    });
    
    // Create mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the particle system
        particlesMesh.rotation.x = elapsedTime * 0.05 + mouseY * 0.1;
        particlesMesh.rotation.y = elapsedTime * 0.05 + mouseX * 0.1;
        
        // Render
        renderer.render(scene, camera);
        
        // Call animate again on the next frame
        requestAnimationFrame(animate);
    };
    
    animate();
}

// ========== HERO ANIMATIONS ==========
function animateHeroElements() {
    // Animate the hero heading
    gsap.to('.hero h1', {
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Animate subtitle elements
    const textReveals = document.querySelectorAll('.text-reveal');
    
    textReveals.forEach((reveal, index) => {
        const mask = reveal.querySelector('.text-reveal-mask');
        const content = reveal.querySelector('.text-reveal-content');
        
        const tl = gsap.timeline();
        
        tl.to(mask, {
            x: 0,
            duration: 0.6,
            ease: 'power3.inOut',
            delay: 0.5 + (index * 0.2)
        })
        .to(content, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            delay: -0.6
        })
        .to(mask, {
            x: '100%',
            duration: 0.6,
            ease: 'power3.inOut'
        });
    });
    
    // Animate scroll indicator
    gsap.to('.scroll-indicator', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.8,
        ease: 'power3.out'
    });
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Section titles animation
    document.querySelectorAll('.section-title').forEach(title => {
        ScrollTrigger.create({
            trigger: title,
            start: 'top 80%',
            onEnter: () => title.classList.add('animate'),
            once: true
        });
    });
    
    // About section animations
    const aboutContent = document.querySelector('.about-content');
    
    if (aboutContent) {
        // Text paragraphs
        gsap.utils.toArray('.about-text p').forEach((p, i) => {
            gsap.to(p, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: p,
                    start: 'top 85%',
                    once: true
                },
                delay: i * 0.2
            });
        });
        
        // Skills section
        gsap.to('.skills', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.skills',
                start: 'top 85%',
                once: true
            }
        });
        
        // Image
        gsap.to('.image-container', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.image-container',
                start: 'top 85%',
                once: true
            }
        });
    }
    
    // Work section animations
    const workSection = document.querySelector('.work');
    
    if (workSection) {
        // Filters
        gsap.to('.work-filters', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.work-filters',
                start: 'top 85%',
                once: true
            }
        });
        
        // Work items
        gsap.utils.toArray('.work-item').forEach((item, i) => {
            gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    once: true
                },
                delay: i * 0.1
            });
        });
    }
    
    // Contact section animations
    const contactSection = document.querySelector('.contact');
    
    if (contactSection) {
        // Info
        gsap.to('.contact-info', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 85%',
                once: true
            }
        });
        
        // Form
        gsap.to('.contact-form', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 85%',
                once: true
            }
        });
    }
}

// ========== WORK FILTERS ==========
function initWorkFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter work items
            workItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power3.out',
                        onStart: function() {
                            item.style.display = 'block';
                        }
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.5,
                        ease: 'power3.out',
                        onComplete: function() {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// ========== CONTACT FORM ==========
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would normally send the form data to a server
            // For this demo we'll just log to console
            console.log(`Form submitted:\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`);
            
            // Show success message (in a real project you'd wait for server response)
            alert('Thanks for your message! I\'ll get back to you soon.');
            
            // Reset form
            form.reset();
        });
    }
}
