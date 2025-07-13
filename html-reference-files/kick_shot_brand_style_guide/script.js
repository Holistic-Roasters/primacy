// Main JavaScript for Kick Shot Brand Style Guide

document.addEventListener('DOMContentLoaded', function() {
    // Initialize expandable sections
    initExpandableSections();
    
    // Initialize color swatch copy functionality
    initColorSwatchCopy();
});

// Function to initialize expandable sections
function initExpandableSections() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    // Set the first section to be expanded by default
    const firstSectionContent = document.querySelector('.section-content');
    const firstExpandBtn = document.querySelector('.expand-btn');
    if (firstSectionContent && firstExpandBtn) {
        firstSectionContent.classList.add('active');
        firstExpandBtn.classList.add('active');
    }
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active class on button
            this.classList.toggle('active');
            
            // Find the parent section
            const section = this.closest('.section');
            
            // Find the content div within this section
            const content = section.querySelector('.section-content');
            
            // Toggle the active class on the content
            content.classList.toggle('active');
            
            // Smooth scroll to section if it's being opened
            if (content.classList.contains('active')) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    });
}

// Function to initialize color swatch copy functionality
function initColorSwatchCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    const notification = document.getElementById('notification');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the color code from the data attribute
            const colorCode = this.getAttribute('data-clipboard');
            
            // Copy to clipboard
            navigator.clipboard.writeText(colorCode)
                .then(() => {
                    // Show notification
                    notification.classList.add('show');
                    
                    // Hide notification after 2 seconds
                    setTimeout(() => {
                        notification.classList.remove('show');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                    alert('Failed to copy color code. Please try again.');
                });
        });
    });
}

// Add smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Scroll to the target section
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Expand the section if it's collapsed
            const sectionContent = targetElement.querySelector('.section-content');
            const expandBtn = targetElement.querySelector('.expand-btn');
            
            if (sectionContent && !sectionContent.classList.contains('active')) {
                sectionContent.classList.add('active');
                if (expandBtn) {
                    expandBtn.classList.add('active');
                }
            }
        }
    });
});

// Add hover effects for color swatches
document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
    });
    
    swatch.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
});

// Add responsive navigation toggle for mobile
const createMobileNav = () => {
    const nav = document.querySelector('nav');
    const navList = nav.querySelector('ul');
    
    // Create mobile menu toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.classList.add('mobile-nav-toggle');
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    nav.insertBefore(mobileToggle, navList);
    
    // Add toggle functionality
    mobileToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.innerHTML = navList.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when a link is clicked
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navList.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
};

// Initialize mobile navigation on small screens
if (window.innerWidth <= 768) {
    createMobileNav();
}

// Handle window resize for responsive features
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-nav-toggle')) {
            createMobileNav();
        }
    }
});

// Add animation for page load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate sections as they come into view
    const animateSections = () => {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('animate');
            }
        });
    };
    
    // Run once on load
    animateSections();
    
    // Run on scroll
    window.addEventListener('scroll', animateSections);
});
