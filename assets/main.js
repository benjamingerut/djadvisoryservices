/* ============================================
   DJ Advisory Services — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close nav when clicking a link
        mainNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Contact form handling (basic validation + Netlify/fallback)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            const required = ['name', 'email', 'message'];
            let valid = true;
            required.forEach(function(field) {
                const el = contactForm.querySelector('[name="' + field + '"]');
                if (!el || !el.value.trim()) {
                    valid = false;
                    if (el) el.style.borderColor = '#ef4444';
                } else if (el) {
                    el.style.borderColor = '';
                }
            });

            // Email format check
            const emailEl = contactForm.querySelector('[name="email"]');
            if (emailEl && emailEl.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailEl.value)) {
                    valid = false;
                    emailEl.style.borderColor = '#ef4444';
                }
            }

            if (!valid) {
                showFormStatus('Please fill in all required fields correctly.', 'error');
                return;
            }

            // If Netlify form (data-netlify attribute), let it submit natively
            if (contactForm.hasAttribute('data-netlify')) {
                contactForm.submit();
                return;
            }

            // Fallback: open mailto
            const subject = encodeURIComponent('New inquiry from ' + (data.name || 'Website'));
            const body = encodeURIComponent(
                'Name: ' + (data.name || '') + '\n' +
                'Email: ' + (data.email || '') + '\n' +
                'Company: ' + (data.company || '') + '\n' +
                'Message:\n' + (data.message || '')
            );
            window.location.href = 'mailto:david@djadvisoryservices.com?subject=' + subject + '&body=' + body;
            showFormStatus('Opening your email client... Please send the message.', 'info');
        });
    }

    function showFormStatus(msg, type) {
        let statusEl = document.getElementById('formStatus');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'formStatus';
            contactForm.appendChild(statusEl);
        }
        statusEl.textContent = msg;
        statusEl.style.cssText = 'margin-top:1rem;padding:0.75rem 1rem;border-radius:4px;font-size:0.875rem;';
        if (type === 'error') {
            statusEl.style.background = '#fef2f2';
            statusEl.style.color = '#dc2626';
            statusEl.style.border = '1px solid #fecaca';
        } else if (type === 'success') {
            statusEl.style.background = '#f0fdf4';
            statusEl.style.color = '#16a34a';
            statusEl.style.border = '1px solid #bbf7d0';
        } else {
            statusEl.style.background = '#eff6ff';
            statusEl.style.color = '#2563eb';
            statusEl.style.border = '1px solid #bfdbfe';
        }
    }

    // Intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.service-card, .trust-item, .value-item').forEach(function(el) {
            observer.observe(el);
        });
    }
});
