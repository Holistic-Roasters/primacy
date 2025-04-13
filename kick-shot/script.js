/**
 * Kick Shot Coffee E-commerce Website
 * JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Product Image Gallery
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainProductImage = document.querySelector('.main-product-image img');
    
    if (thumbnails.length > 0 && mainProductImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image
                mainProductImage.src = this.src;
                
                // Update active thumbnail
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentTestimonial = 0;
    
    if (testimonials.length > 0 && sliderDots.length > 0) {
        // Function to show testimonial by index
        function showTestimonial(index) {
            // Hide all testimonials
            testimonials.forEach(testimonial => {
                testimonial.style.transform = `translateX(-${index * 100}%)`;
            });
            
            // Update active dot
            sliderDots.forEach(dot => dot.classList.remove('active'));
            sliderDots[index].classList.add('active');
            
            currentTestimonial = index;
        }
        
        // Add click event to dots
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
    
    // Scroll Animation
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Add fade-in class to elements
    document.querySelectorAll('section:not(.hero) h2, .value-column, .product-card').forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Check fade on load
    checkFade();
    
    // Check fade on scroll
    window.addEventListener('scroll', checkFade);
    
    // Add glitch effect to headings
    document.querySelectorAll('h1, h2').forEach(heading => {
        heading.classList.add('glitch');
        heading.setAttribute('data-text', heading.textContent);
    });
    
    // Shopping Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button, .quick-add');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;
    
    if (addToCartButtons.length > 0 && cartCount) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Increment cart count
                cartItems++;
                cartCount.textContent = cartItems;
                
                // Add animation effect
                button.classList.add('added');
                setTimeout(() => {
                    button.classList.remove('added');
                }, 1000);
                
                // Show notification
                showNotification('Product added to cart!');
            });
        });
    }
    
    // Notification System
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                    mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Simulate form submission
                emailInput.value = '';
                showNotification('Thanks for subscribing to our newsletter!');
            }
        });
    }
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Add CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--neuro-yellow);
            color: var(--blackout-black);
            padding: 15px 30px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 1000;
            transition: bottom 0.3s ease;
        }
        
        .notification.show {
            bottom: 30px;
        }
        
        .add-to-cart-button.added, .quick-add.added {
            background-color: var(--toxic-cyan);
        }
        
        .header.scrolled {
            background-color: rgba(0, 0, 0, 0.95);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .header.header-hidden {
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }
        
        .header {
            transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the page with some animations
    setTimeout(() => {
        document.querySelector('.hero-text h1').classList.add('animate');
        document.querySelector('.hero-text h2').classList.add('animate');
    }, 500);
});
