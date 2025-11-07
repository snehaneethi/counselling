// ============================================
// Navigation & Mobile Menu
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeForms();
    initializeSmoothScroll();
    initializeHeaderScroll();
    setMinDateForBooking();
    loadTestimonials();
    initializeFeedbackForm();
});

// Mobile menu toggle
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Smooth scroll for navigation links
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
function initializeHeaderScroll() {
    const header = document.getElementById('main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// Form Handling
// ============================================

function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    const bookingForm = document.getElementById('booking-form');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingForm);
    }
}

// Initialize Feedback Form
function initializeFeedbackForm() {
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackForm);
    }
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };

    // Validation
    if (!validateContactForm(data)) {
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Save to localStorage
    saveContactSubmission(data);

    // Send email via EmailJS
    sendContactEmail(data)
        .then(() => {
            showFormMessage('contact-form-message', 'Thank you! Your message has been sent. We will get back to you soon.', 'success');
            form.reset();
        })
        .catch((error) => {
            console.error('Email error:', error);
            // Still show success since it's saved locally
            showFormMessage('contact-form-message', 'Thank you! Your message has been received. We will get back to you soon.', 'success');
            form.reset();
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Booking Form Handler
function handleBookingForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        message: formData.get('message'),
        status: 'pending', // Initial status
        createdAt: new Date().toISOString()
    };

    // Validation
    if (!validateBookingForm(data)) {
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;

    // Save to localStorage
    saveBookingSubmission(data);

    // Send booking confirmation email
    sendBookingEmail(data)
        .then(() => {
            // Show booking confirmation modal
            showBookingModal(data);
            form.reset();
            setMinDateForBooking();
        })
        .catch((error) => {
            console.error('Email error:', error);
            // Still show modal since booking is saved
            showBookingModal(data);
            form.reset();
            setMinDateForBooking();
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Feedback Form Handler
function handleFeedbackForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        location: formData.get('location'),
        type: formData.get('type'),
        message: formData.get('message'),
        approved: false, // Requires admin approval
        timestamp: new Date().toISOString()
    };

    // Validation
    if (!data.name || data.name.trim().length < 2) {
        showFormMessage('feedback-form-message', 'Please enter a valid name.', 'error');
        return;
    }

    if (!data.message || data.message.trim().length < 10) {
        showFormMessage('feedback-form-message', 'Please enter feedback (at least 10 characters).', 'error');
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Save feedback
    saveFeedback(data);

    // Show success message
    showFormMessage('feedback-form-message', 'Thank you for your feedback! It will be reviewed and may be added to our testimonials.', 'success');
    
    // Reset form
    form.reset();
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

// ============================================
// Form Validation
// ============================================

function validateContactForm(data) {
    const messageEl = document.getElementById('contact-form-message');
    
    if (!data.name || data.name.trim().length < 2) {
        showFormMessage('contact-form-message', 'Please enter a valid name.', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showFormMessage('contact-form-message', 'Please enter a valid email address.', 'error');
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showFormMessage('contact-form-message', 'Please enter a message (at least 10 characters).', 'error');
        return false;
    }

    return true;
}

function validateBookingForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        showFormMessage('booking-form-message', 'Please enter a valid name.', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showFormMessage('booking-form-message', 'Please enter a valid email address.', 'error');
        return false;
    }

    if (!data.phone || data.phone.trim().length < 10) {
        showFormMessage('booking-form-message', 'Please enter a valid phone number.', 'error');
        return false;
    }

    if (!data.service) {
        showFormMessage('booking-form-message', 'Please select a service type.', 'error');
        return false;
    }

    if (!data.date) {
        showFormMessage('booking-form-message', 'Please select a preferred date.', 'error');
        return false;
    }

    if (!data.time) {
        showFormMessage('booking-form-message', 'Please select a preferred time.', 'error');
        return false;
    }

    // Check if date is in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showFormMessage('booking-form-message', 'Please select a future date.', 'error');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// Form Messages
// ============================================

function showFormMessage(messageId, text, type) {
    const messageEl = document.getElementById(messageId);
    if (!messageEl) return;

    messageEl.textContent = text;
    messageEl.className = `form-message ${type}`;
    
    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageEl.className = 'form-message';
        messageEl.textContent = '';
    }, 5000);
}

// ============================================
// Booking Modal
// ============================================

function showBookingModal(data) {
    const modal = document.getElementById('booking-modal');
    const modalMessage = document.getElementById('modal-message');
    
    if (!modal || !modalMessage) return;

    // Format service name
    const serviceNames = {
        'individual': 'Individual Counselling',
        'couples': 'Couples & Family Therapy',
        'student': 'Student Counselling',
        'behaviour': 'Behaviour Modification',
        'speech': 'Speech & Stuttering Therapy',
        'professional': 'Professional Support'
    };

    const serviceName = serviceNames[data.service] || data.service;
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    modalMessage.innerHTML = `
        <p><strong>Thank you, ${data.name}!</strong></p>
        <p>Your booking request has been received:</p>
        <ul style="text-align: left; margin: 20px 0; padding-left: 20px;">
            <li><strong>Service:</strong> ${serviceName}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${formatTime(data.time)}</li>
            <li><strong>Contact:</strong> ${data.email}</li>
        </ul>
        <p>We will contact you shortly to confirm your appointment.</p>
    `;

    modal.classList.add('active');

    // Close modal handlers
    const closeBtn = document.getElementById('modal-close');
    const okBtn = document.getElementById('modal-ok');

    const closeModal = () => {
        modal.classList.remove('active');
    };

    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }

    if (okBtn) {
        okBtn.onclick = closeModal;
    }

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// ============================================
// Local Storage (for demo purposes)
// ============================================

function saveContactSubmission(data) {
    try {
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    } catch (e) {
        console.error('Error saving contact submission:', e);
    }
}

function saveBookingSubmission(data) {
    try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));
    } catch (e) {
        console.error('Error saving booking:', e);
    }
}

// ============================================
// Email Integration (EmailJS)
// ============================================

// Initialize EmailJS (Replace with your EmailJS Public Key)
// Get your keys from https://www.emailjs.com/
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID_CONTACT = 'YOUR_CONTACT_TEMPLATE_ID'; // Replace with your template ID
const EMAILJS_TEMPLATE_ID_BOOKING = 'YOUR_BOOKING_TEMPLATE_ID'; // Replace with your template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key

// Load EmailJS SDK
function loadEmailJS() {
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                emailjs.init(EMAILJS_PUBLIC_KEY);
            }
        };
        document.head.appendChild(script);
    }
}

// Send Contact Email
function sendContactEmail(data) {
    return new Promise((resolve, reject) => {
        // If EmailJS is not configured, just resolve (for demo purposes)
        if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
            console.log('EmailJS not configured. Email would be sent with:', data);
            resolve();
            return;
        }

        loadEmailJS();

        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            phone: data.phone || 'Not provided',
            message: data.message,
            to_email: 'snehaneethi@gmail.com' // Your email
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_CONTACT, templateParams)
            .then(() => resolve())
            .catch((error) => reject(error));
    });
}

// Send Booking Confirmation Email
function sendBookingEmail(data) {
    return new Promise((resolve, reject) => {
        // If EmailJS is not configured, just resolve (for demo purposes)
        if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
            console.log('EmailJS not configured. Booking email would be sent with:', data);
            resolve();
            return;
        }

        loadEmailJS();

        const serviceNames = {
            'individual': 'Individual Counselling',
            'couples': 'Couples & Family Therapy',
            'student': 'Student Counselling',
            'behaviour': 'Behaviour Modification',
            'speech': 'Speech & Stuttering Therapy',
            'professional': 'Professional Support'
        };

        const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const templateParams = {
            client_name: data.name,
            client_email: data.email,
            client_phone: data.phone,
            service: serviceNames[data.service] || data.service,
            date: formattedDate,
            time: formatTime(data.time),
            message: data.message || 'No additional message',
            to_email: 'snehaneethi@gmail.com' // Your email
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_BOOKING, templateParams)
            .then(() => resolve())
            .catch((error) => reject(error));
    });
}

// ============================================
// Feedback Storage
// ============================================

function saveFeedback(data) {
    try {
        const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        feedback.push(data);
        localStorage.setItem('feedback', JSON.stringify(feedback));
    } catch (e) {
        console.error('Error saving feedback:', e);
    }
}

// ============================================
// Testimonials Management
// ============================================

function loadTestimonials() {
    const testimonialsContainer = document.querySelector('.testimonials-grid');
    if (!testimonialsContainer) return;

    // Get approved feedback
    const allFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    const approvedFeedback = allFeedback.filter(f => f.approved);

    // If no approved feedback, keep default testimonials
    if (approvedFeedback.length === 0) {
        return;
    }

    // Clear existing testimonials
    testimonialsContainer.innerHTML = '';

    // Display approved feedback as testimonials (limit to 6 most recent)
    const recentFeedback = approvedFeedback
        .sort((a, b) => new Date(b.approvedAt || b.timestamp) - new Date(a.approvedAt || a.timestamp))
        .slice(0, 6);

    recentFeedback.forEach(feedback => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        testimonialCard.innerHTML = `
            <div class="testimonial-quote">&quot;</div>
            <p class="testimonial-text">${feedback.message}</p>
            <p class="testimonial-author">— ${feedback.type}, ${feedback.location}</p>
        `;
        testimonialsContainer.appendChild(testimonialCard);
    });
}

// ============================================
// Date/Time Helpers
// ============================================

function setMinDateForBooking() {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
    }
}

// ============================================
// Utility Functions
// ============================================

// Add fade-in animation on scroll
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

// Observe service cards, step cards, and testimonials
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .step-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
