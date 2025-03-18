// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize everything once DOM is loaded
    initLoader();
    initNavigation();
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

// ========== HERO ANIMATIONS ==========
function animateHeroElements() {
    // Animate the hero heading
    gsap.to('.hero h1', {
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Animate subtitle elements
    const textReveals = document.querySelectorAll('.text-reveal-content');
    
    textReveals.forEach((content, index) => {
        gsap.to(content, {
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.8 + (index * 0.2)
        });
    });
    
    // Animate scroll indicator
    gsap.to('.scroll-indicator', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.5
    });
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    // Animate section titles on scroll
    const sectionTitles = document.querySelectorAll('.section-title');
    
    sectionTitles.forEach(title => {
        const triggerPosition = title.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.8;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > triggerPosition) {
                title.classList.add('animate');
            }
        });
    });
    
    // Animate work items on scroll
    const workItems = document.querySelectorAll('.work-item');
    
    workItems.forEach((item, index) => {
        const triggerPosition = item.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.8;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > triggerPosition) {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 100);
            }
        });
    });
    
    // Add hover effect for work items
    workItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('.work-overlay'), {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(item.querySelector('.work-info'), {
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('.work-overlay'), {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in'
            });
            
            gsap.to(item.querySelector('.work-info'), {
                y: 20,
                duration: 0.4,
                ease: 'power2.in'
            });
        });
    });
}

// ========== WORK FILTERS ==========
function initWorkFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filterValue = btn.getAttribute('data-filter');
            
            // Filter work items
            workItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category').includes(filterValue)) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        clearProps: 'all'
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0.2,
                        scale: 0.95,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }
            });
        });
    });
}

// ========== CONTACT FORM ==========
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For now, just log the values
            console.log('Form submitted:', { name, email, message });
            
            // Reset form
            form.reset();
            
            // Show success message (you can implement this)
            alert('Thank you for your message. I will get back to you soon.');
        });
    }
}
