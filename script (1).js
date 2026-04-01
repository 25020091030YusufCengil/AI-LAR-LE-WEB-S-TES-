document.addEventListener('DOMContentLoaded', () => {
    // Preloader Timeout for İletişim Sayfası
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Lock scrolling during preload
        document.body.style.overflow = 'hidden';
        
        // Wait ~3.5s then fade out
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.style.overflow = ''; // restore scroll
            
            // Remove from DOM strictly after fade out animation
            setTimeout(() => {
                preloader.remove();
            }, 800);
        }, 3500);
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                mobileToggle.classList.add('active');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Lock scroll
            } else {
                mobileToggle.classList.remove('active');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = ''; // Unlock scroll
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if(icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            document.body.style.overflow = '';
        }
        
        // Language dropdown outside click
        const langDropdown = document.getElementById('langDropdown');
        if (langDropdown && langDropdown.classList.contains('open') && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('open');
        }
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            const icon = mobileToggle.querySelector('i');
            if(icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Header scroll background change
    const header = document.querySelector('.glass-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 5, 0.8)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(5, 5, 5, 0.4)';
            header.style.boxShadow = 'none';
        }
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Fade In Animation on Scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const fadeOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeOptions);

    fadeElements.forEach(element => {
        fadeOnScroll.observe(element);
    });

    // Form Submission (Prevent Default for demo)
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Gönderiliyor...';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.textContent = 'Mesaj Başarıyla Gönderildi!';
                btn.style.background = '#10b981'; // Success Green
                form.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // --- Skeleton/Network Particles Background ---
    const canvas = document.getElementById('networkCanvas');
    const heroSectionDOM = document.getElementById('home');
    
    // Remove old spotlight if it exists
    const oldSpotlight = document.querySelector('.mouse-spotlight');
    if (oldSpotlight) oldSpotlight.remove();

    if (canvas && heroSectionDOM) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const mouse = { x: null, y: null, radius: 150 };

        function resize() {
            width = canvas.width = heroSectionDOM.offsetWidth;
            height = canvas.height = heroSectionDOM.offsetHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        heroSectionDOM.addEventListener('mousemove', (e) => {
            const rect = heroSectionDOM.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        heroSectionDOM.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > height || this.y < 0) this.speedY = -this.speedY;
            }
            draw() {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = (width * height) / 8000; 
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Skeleton/Network connection logic
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 - distance/400})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Connect particles to mouse
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - particles[i].x;
                    let dy = mouse.y - particles[i].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.8 - distance/mouse.radius})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }

    // Carousel Logic
    window.moveToSelected = function(element) {
        if (element.classList.contains('item-center')) return;
        
        const items = document.querySelectorAll('.service-card.slide');
        let currentCenter = document.querySelector('.item-center');
        let currentLeft = document.querySelector('.item-left');
        let currentRight = document.querySelector('.item-right');
        
        let newCenter, newLeft, newRight;
        
        if (element.classList.contains('item-left')) {
            newCenter = currentLeft;
            newRight = currentCenter;
            newLeft = currentRight;
        } else if (element.classList.contains('item-right')) {
            newCenter = currentRight;
            newLeft = currentCenter;
            newRight = currentLeft;
        }
        
        items.forEach(item => {
            item.classList.remove('item-left', 'item-center', 'item-right');
        });
        
        newLeft.classList.add('item-left');
        newCenter.classList.add('item-center');
        newRight.classList.add('item-right');
    };

    // Autoplay Carousel
    setInterval(() => {
        const rightItem = document.querySelector('.item-right');
        if (rightItem) {
            window.moveToSelected(rightItem);
        }
    }, 4000);

    // WhatsApp Floating Button Logic
    const whatsappBtn = document.getElementById('whatsappBtn');
    window.addEventListener('scroll', () => {
        if (whatsappBtn) {
            // Show after scrolling past half of the viewport height (~ past hero section)
            if (window.scrollY > window.innerHeight * 0.5) {
                whatsappBtn.classList.add('show-btn');
            } else {
                whatsappBtn.classList.remove('show-btn');
            }
        }
    });
});
