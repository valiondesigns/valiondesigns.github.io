// ========== VALION DSIGNS - COMPLETE JAVASCRIPT ==========
// This file handles: scroll animations, form submissions, and navigation highlighting

// ---------- SCROLL REVEAL ANIMATION ----------
// This makes sections fade in as you scroll down
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, { threshold: 0.2 });

fadeElements.forEach(el => observer.observe(el));

// Also check for elements already visible when page loads
fadeElements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add('revealed');
        observer.unobserve(el);
    }
});

// ---------- CONTACT FORM HANDLER ----------
// When someone clicks "Send message", show a success message
const sendContactBtn = document.getElementById('sendContactBtn');
if (sendContactBtn) {
    sendContactBtn.addEventListener('click', function() {
        const name = document.getElementById('contactName')?.value.trim() || '';
        const email = document.getElementById('contactEmail')?.value.trim() || '';
        const msg = document.getElementById('contactMsg')?.value.trim() || '';
        const statusDiv = document.getElementById('contactStatus');
        
        if (!name || !email || !msg) {
            if (statusDiv) {
                statusDiv.innerHTML = '❌ Please fill all fields.';
                statusDiv.style.color = '#ff9b8e';
            }
            return;
        }
        
        if (statusDiv) {
            statusDiv.innerHTML = '✅ Thanks! We’ll reply within 24 hours.';
            statusDiv.style.color = '#a3f5ff';
        }
        
        // Clear the form
        const contactName = document.getElementById('contactName');
        const contactEmail = document.getElementById('contactEmail');
        const contactMsg = document.getElementById('contactMsg');
        if (contactName) contactName.value = '';
        if (contactEmail) contactEmail.value = '';
        if (contactMsg) contactMsg.value = '';
        
        setTimeout(() => {
            if (statusDiv) statusDiv.innerHTML = '';
        }, 5000);
    });
}

// ---------- SUBSCRIBE FORM (Google Sheets email list) ----------
// 🔧 IMPORTANT: Replace this URL with your Google Apps Script Web App URL
// To set this up: 
// 1. Create a Google Sheet with columns: Name, Email, Timestamp
// 2. Create a Google Apps Script (script.google.com)
// 3. Deploy as Web App and copy the URL here
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXAhUNz4g_7aDuUxoxLf84kQyRhMy6DUz2Gdnrryu131J8hN-VLHdtOTI9yuNcccMznA/exec"; // <-- PASTE YOUR URL HERE

const subscribeForm = document.getElementById('subscribeForm');
const formStatusDiv = document.getElementById('formStatus');

function setFormMessage(msg, isError = false) {
    if (formStatusDiv) {
        formStatusDiv.innerHTML = msg;
        formStatusDiv.style.color = isError ? '#ff9b8e' : '#a3f5ff';
    }
}

if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('subName')?.value.trim() || '';
        const email = document.getElementById('subEmail')?.value.trim() || '';

        if (!name || !email) {
            setFormMessage('❌ Please fill both name and email.', true);
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setFormMessage('⚠️ Enter a valid email address.', true);
            return;
        }

        const submitBtn = subscribeForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        setFormMessage('Sending...', false);

        try {
            // If user hasn't set up Google Script yet, show helpful message
            if (SCRIPT_URL === "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec") {
                setFormMessage('⚙️ [Setup needed] Replace the Google Script URL in script.js with your own Web App URL. For now, demo mode.', false);
                if (submitBtn) submitBtn.disabled = false;
                return;
            }

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ name, email })
            });
            setFormMessage('✅ Subscribed successfully! Welcome to Valion Dsigns.', false);
            const subName = document.getElementById('subName');
            const subEmail = document.getElementById('subEmail');
            if (subName) subName.value = '';
            if (subEmail) subEmail.value = '';
        } catch (err) {
            setFormMessage('❌ Network error. Please try again later.', true);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// ---------- ACTIVE NAVIGATION HIGHLIGHTING ----------
// Changes the color of the nav link when you scroll to that section
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '#eef5ff';
        link.style.textShadow = 'none';
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.style.color = '#00f2ff';
            link.style.textShadow = '0 0 5px #00f2ff';
        }
    });
});
