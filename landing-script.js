// Landing Page JavaScript for BrandPulse

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu event listeners
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close mobile menu when clicking a link
    closeMobileMenuOnLinkClick();
    
    // Setup keyboard accessibility
    setupMobileMenuKeyboardAccess();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect (optimized with throttling)
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let ticking = false;

    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .step, .pricing-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Animate hero stats
    animateCounters();

    // Add loading animation to CTA buttons
    addCTAAnimations();
});

// Animate counter numbers in hero section
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number based on original content
            if (counter.textContent.includes('%')) {
                counter.textContent = Math.floor(current) + '%';
            } else if (counter.textContent.includes('+')) {
                counter.textContent = Math.floor(current) + '+';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Add animations to CTA buttons
function addCTAAnimations() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Handle temporary signup form (for demonstration)
function handleTempSignup() {
    const emailInput = document.querySelector('.email-input');
    const signupBtn = document.querySelector('.signup-btn');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate signup process
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
    signupBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you! You\'ve been added to our beta waitlist.', 'success');
        emailInput.value = '';
        signupBtn.innerHTML = '<i class="fas fa-rocket"></i> Join Beta';
        signupBtn.disabled = false;
        
        // In a real implementation, you would send this data to your backend
        console.log('Beta signup:', { email, timestamp: new Date().toISOString() });
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add ripple effect CSS
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Mobile Menu Functionality
function toggleMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    
    const isOpen = navMenu.classList.contains('active');
    
    if (isOpen) {
        // Close menu
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    } else {
        // Open menu
        navMenu.classList.add('active');
        overlay.classList.add('active');
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden';
    }
}

// Close mobile menu when clicking overlay
function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
}

// Close mobile menu when clicking a link
function closeMobileMenuOnLinkClick() {
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Small delay to allow smooth scrolling
            setTimeout(closeMobileMenu, 100);
        });
    });
}

// Keyboard accessibility for mobile menu
function setupMobileMenuKeyboardAccess() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
    }
    
    // Trap focus within mobile menu when open
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Parallax effect for hero section (optimized for performance)
let parallaxTicking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-container');
    
    if (hero && scrolled < hero.offsetHeight) {
        // Use transform3d for hardware acceleration and prevent layout shifts
        heroContent.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
    }
    
    parallaxTicking = false;
}

window.addEventListener('scroll', function() {
    if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
    }
});

// Add will-change to hero container for better performance
document.addEventListener('DOMContentLoaded', function() {
    const heroContent = document.querySelector('.hero-container');
    if (heroContent) {
        heroContent.style.willChange = 'transform';
    }
});

// Add loading animation for dashboard preview
function animateDashboardPreview() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = 'growBar 1s ease-out forwards';
        }, index * 200);
    });
}

// Trigger dashboard animation when in view
const dashboardPreview = document.querySelector('.dashboard-preview');
if (dashboardPreview) {
    const dashboardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateDashboardPreview();
                dashboardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    dashboardObserver.observe(dashboardPreview);
}

// Console message for developers
console.log(`
🚀 BrandPulse Landing Page
📊 Ready for beta signups
💡 Replace the form placeholder with Google Forms

Setup Instructions:
1. Create a Google Form for beta signups
2. Replace the form placeholder with the embed code
3. Set up email automation with Mailchimp/MailerLite
4. Deploy to GitHub Pages or Netlify
`);

// Track page interactions (for analytics)
function trackInteraction(action, element) {
    // In a real implementation, you would send this to your analytics service
    console.log('User interaction:', { action, element, timestamp: new Date().toISOString() });
}

// Add interaction tracking to key elements
document.addEventListener('click', function(e) {
    if (e.target.matches('.cta-button')) {
        trackInteraction('cta_click', e.target.textContent.trim());
    }
    
    if (e.target.matches('.nav-link')) {
        trackInteraction('nav_click', e.target.textContent.trim());
    }
    
    if (e.target.matches('.pricing-cta')) {
        trackInteraction('pricing_click', e.target.closest('.pricing-card').querySelector('h3').textContent);
    }
});

