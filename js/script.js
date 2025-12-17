// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// ===== Mobile Navigation =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// ===== Typing Effect =====
const typingText = document.querySelector('.typing-text');
const words = ['Full Stack Developer', 'Web Dasturchi', 'Frontend Developer', 'Backend Developer', 'UI/UX Designer'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
}

// Start typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});

// ===== Navbar Background on Scroll =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 14, 26, 1)';
        navbar.style.boxShadow = '0 2px 20px rgba(99, 102, 241, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 14, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    }
});

// ===== Skills Progress Animation =====
const skillsSection = document.querySelector('.skills');
let skillsAnimated = false;

function animateSkills() {
    const skillProgresses = document.querySelectorAll('.skill-progress');
    
    skillProgresses.forEach(progress => {
        const targetWidth = progress.getAttribute('data-progress');
        progress.style.width = targetWidth + '%';
    });
    
    skillsAnimated = true;
}

// Intersection Observer for skills animation
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            animateSkills();
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.8s ease';
    revealObserver.observe(element);
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Form Submission with Telegram Bot =====
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formInputs = contactForm.querySelectorAll('input, textarea');
    const name = formInputs[0].value;
    const email = formInputs[1].value;
    const subject = formInputs[2].value;
    const message = formInputs[3].value;
    
    // Telegram Bot Configuration
    const TELEGRAM_BOT_TOKEN = '5112077016:AAEdoRqCXob8zhMb84v_G_rs23xPNBkKMDE';
    const TELEGRAM_CHAT_ID = '5213009659';
    
    // Format message for Telegram
    const telegramMessage = `
🔔 <b>Yangi Xabar - Portfolio</b>

👤 <b>Ism:</b> ${name}
📧 <b>Email:</b> ${email}
📌 <b>Mavzu:</b> ${subject || 'Mavzu ko\'rsatilmagan'}

💬 <b>Xabar:</b>
${message}

⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
    `.trim();
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Yuborilmoqda...';
    submitBtn.disabled = true;
    
    try {
        // Send message to Telegram
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            // Show success message with animation
            const successAlert = document.createElement('div');
            successAlert.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 30px 50px;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);
                z-index: 10000;
                text-align: center;
                animation: successPop 0.5s ease-out forwards;
            `;
            successAlert.innerHTML = `
                <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 15px;"></i>
                <h3 style="margin: 10px 0;">Muvaffaqiyatli!</h3>
                <p style="margin: 0;">Xabaringiz yuborildi. Tez orada siz bilan bog'lanamiz.</p>
            `;
            document.body.appendChild(successAlert);
            
            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes successPop {
                    0% { transform: translate(-50%, -50%) scale(0); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
            
            // Remove alert after 3 seconds
            setTimeout(() => {
                successAlert.style.animation = 'successPop 0.3s ease-in reverse forwards';
                setTimeout(() => successAlert.remove(), 300);
            }, 3000);
            
            // Reset form
            contactForm.reset();
        } else {
            throw new Error('Telegram API xatosi');
        }
    } catch (error) {
        console.error('Xato:', error);
        
        // Show error message
        const errorAlert = document.createElement('div');
        errorAlert.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(239, 68, 68, 0.4);
            z-index: 10000;
            text-align: center;
        `;
        errorAlert.innerHTML = `
            <i class="fas fa-exclamation-circle" style="font-size: 48px; margin-bottom: 15px;"></i>
            <h3 style="margin: 10px 0;">Xatolik!</h3>
            <p style="margin: 0;">Xabar yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.</p>
        `;
        document.body.appendChild(errorAlert);
        
        setTimeout(() => errorAlert.remove(), 3000);
    } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ===== Scroll to Top Button (Optional) =====
const createScrollTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-top-btn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
        button.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
    });
};

// Initialize scroll to top button
createScrollTopButton();

// ===== Parallax Effect for Hero Section =====
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (heroSection && scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== Cursor Effect (Optional) =====
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #6366f1;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        display: none;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
};

// Uncomment to enable custom cursor effect
// createCursorEffect();

// ===== Project Card Tilt Effect =====
{
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
    });
}

// ===== Snow Effect =====
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
    snowflake.style.opacity = Math.random() * 0.6 + 0.4;
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
    
    document.body.appendChild(snowflake);
    
    setTimeout(() => {
        snowflake.remove();
    }, 8000);
}

// Create snowflakes periodically
setInterval(createSnowflake, 200);

// Create initial snowflakes
for (let i = 0; i < 50; i++) {
    setTimeout(createSnowflake, i * 100);
}

// ===== Mobile Touch Interactions =====
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Swipe gesture detection
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
            console.log('Swipe Right');
        } else {
            console.log('Swipe Left');
        }
    }
}

// Parallax effect on mobile
if (window.innerWidth <= 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const parallaxElements = document.querySelectorAll('.hero-image, .image-placeholder');
        
        parallaxElements.forEach(element => {
            if (element) {
                const speed = 0.3;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
    });
}

// Vibration feedback for touch interactions (if supported)
function vibrateOnTouch(element) {
    if ('vibrate' in navigator) {
        element.addEventListener('touchstart', () => {
            navigator.vibrate(10);
        });
    }
}

// Add vibration to buttons and cards
document.querySelectorAll('.btn, .project-card, .skill-card').forEach(element => {
    vibrateOnTouch(element);
});

// Pull-to-refresh indicator
let pullStartY = 0;
let isPulling = false;

window.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
        pullStartY = e.touches[0].clientY;
        isPulling = true;
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (isPulling && window.scrollY === 0) {
        const pullDistance = e.touches[0].clientY - pullStartY;
        if (pullDistance > 100) {
            // Show refresh indicator
            document.body.style.transform = `translateY(${Math.min(pullDistance - 100, 50)}px)`;
        }
    }
}, { passive: true });

window.addEventListener('touchend', () => {
    if (isPulling) {
        document.body.style.transform = 'translateY(0)';
        document.body.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
        isPulling = false;
    }
});

// Smooth counter animation for stats on scroll
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
};

// Intersection Observer for counters
{
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.textContent);
                if (!isNaN(target)) {
                    animateCounter(entry.target, target);
                }
            }
        });
    }, observerOptions);

    // Observe stat boxes
    document.querySelectorAll('.stat-box h4, .metric-value').forEach(stat => {
        counterObserver.observe(stat);
    });
}

// Card shake on long press
let longPressTimer;
document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('touchstart', () => {
        longPressTimer = setTimeout(() => {
            card.style.animation = 'shake 0.5s';
            if ('vibrate' in navigator) {
                navigator.vibrate([50, 100, 50]);
            }
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        }, 800);
    });
    
    card.addEventListener('touchend', () => {
        clearTimeout(longPressTimer);
    });
});

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Mobile menu smooth toggle
const mobileMenuToggle = () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    }
};

mobileMenuToggle();

// Scroll progress indicator
const createScrollIndicator = () => {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #4338ca, #6d28d9);
        z-index: 10001;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(67, 56, 202, 0.8);
    `;
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        indicator.style.width = scrollPercentage + '%';
    });
};

if (window.innerWidth <= 768) {
    createScrollIndicator();
}

// Touch ripple effect
const createTouchRipple = (e) => {
    const ripple = document.createElement('div');
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.touches[0].clientX - rect.left - size / 2;
    const y = e.touches[0].clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
    `;
    
    e.currentTarget.style.position = 'relative';
    e.currentTarget.style.overflow = 'hidden';
    e.currentTarget.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
};

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

document.querySelectorAll('.btn, .tab-btn, .suggestion-btn').forEach(element => {
    element.addEventListener('touchstart', createTouchRipple);
});

// ===== Console Message =====
console.log('%c❄️ Salom, dasturchi!', 'font-size: 20px; color: #4338ca; font-weight: bold;');
console.log('%c🚀 Bu portfolio sayti ochiq manbali!', 'font-size: 14px; color: #6d28d9;');
console.log('%c💼 Menga bog\'lanish: info@portfolio.uz', 'font-size: 12px; color: #94a3b8;');
