// =============================================
//  FAVOUR RESTORATION WORD OF GOD MINISTRIES — script.js
// =============================================

/* ── PAGE LOADER ─────────────────────────────── */
const loader = document.getElementById("loader");
let loaderHidden = false;

function hideLoader() {
  if (!loader || loaderHidden) return;
  loaderHidden = true;
  loader.classList.add("hidden");
  document.body.style.overflow = "visible";
  startCounters();
}

// Do not wait for every remote image or font. The page is usable while those finish loading.
window.addEventListener("DOMContentLoaded", () => setTimeout(hideLoader, 450), { once: true });
window.addEventListener("load", () => setTimeout(hideLoader, 150), { once: true });

/* ── CUSTOM CURSOR ───────────────────────────── */
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + "px";
  follower.style.top = followerY + "px";
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Scale cursor on hover of interactive elements
document.querySelectorAll("a, button, input, select, textarea").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
    follower.style.transform = "translate(-50%, -50%) scale(0.5)";
    follower.style.opacity = "0.3";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    follower.style.transform = "translate(-50%, -50%) scale(1)";
    follower.style.opacity = "0.6";
  });
});

/* ── NAVBAR ──────────────────────────────────── */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  updateActiveNav();
  toggleBackTop();
});

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile menu when a link is clicked
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

/* ── ACTIVE NAV HIGHLIGHT ────────────────────── */
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) link.classList.add("active");
  });
}

/* ── SMOOTH SCROLL ───────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const topic = this.dataset.contactTopic;
      if (topic) {
        const subject = document.getElementById("subject");
        if (subject) subject.value = topic;
      }
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ── SCROLL ANIMATIONS (Intersection Observer) ─ */
const fadeEls = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same parent grid
        const siblings = entry.target.parentElement.querySelectorAll(".fade-in");
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 0.12;
        });
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay * 1000);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
fadeEls.forEach((el) => observer.observe(el));

/* ── ANIMATED COUNTERS ───────────────────────── */
function animateCounter(element, target, suffix = "") {
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(ease * target);
    element.textContent = value.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function startCounters() {
  const counters = document.querySelectorAll(".stat-num[data-count]");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-count"), 10);
    animateCounter(counter, target, target >= 100 ? "+" : "");
  });

  const impactCounters = document.querySelectorAll(".metric-number[data-target]");
  impactCounters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    animateCounter(counter, target);
  });
}

/* ── SERMON CHANNEL ──────────────────────────── */
const sermonsUrl = "https://youtube.com/@favourrestorationministrie5146?si=BQVLKWd8tYjKjgIQ";

function openSermons() {
  window.open(sermonsUrl, "_blank", "noopener,noreferrer");
}

function openSermonVideo(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ── CONTACT FORM ────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.querySelector(".form-submit");
  const form = document.getElementById("contactForm");
  btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
  btn.disabled = true;
  const payload = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value
  };
  fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    .then(async (response) => {
      const result = await readApiResponse(response);
      if (!response.ok) throw new Error(result.error || "Message could not be sent.");
      form.reset();
      btn.textContent = "Message Sent!";
      const successEl = document.getElementById("formSuccess");
      successEl.textContent = result.message;
      successEl.style.display = "flex";
      successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    })
    .catch((error) => {
      alert(error.message.includes("Failed to fetch") ? "Start the website with npm start before sending messages." : error.message);
    })
    .finally(() => {
      btn.disabled = false;
      if (document.getElementById("formSuccess").style.display === "none") btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    });
}

/* ── BACK TO TOP ─────────────────────────────── */
const backTop = document.getElementById("backTop");
function toggleBackTop() {
  backTop.classList.toggle("visible", window.scrollY > 400);
}

/* ── BACKGROUND MUSIC ───────────────────────── */
const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicVolume = document.getElementById("musicVolume");

if (backgroundMusic && musicToggle && musicVolume) {
  backgroundMusic.volume = Number(musicVolume.value);

  musicToggle.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
      } catch {
        musicToggle.querySelector("span").textContent = "Music unavailable";
        return;
      }
    } else {
      backgroundMusic.pause();
    }
  });

  backgroundMusic.addEventListener("play", () => {
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.setAttribute("aria-label", "Pause worship instrumental");
    musicToggle.querySelector("i").className = "fa-solid fa-pause";
    musicToggle.querySelector("span").textContent = "Pause music";
  });

  backgroundMusic.addEventListener("pause", () => {
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "Play worship instrumental");
    musicToggle.querySelector("i").className = "fa-solid fa-play";
    musicToggle.querySelector("span").textContent = "Play music";
  });

  backgroundMusic.addEventListener("error", () => {
    musicToggle.disabled = true;
    musicToggle.querySelector("span").textContent = "Music unavailable";
  });

  musicVolume.addEventListener("input", () => {
    backgroundMusic.volume = Number(musicVolume.value);
  });
}

/* ── PARALLAX HERO ORBS ──────────────────────── */
const orbs = document.querySelectorAll(".orb");
document.addEventListener("mousemove", (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 10;
    orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});

/* ── SCROLL HINT FADE ────────────────────────── */
const scrollHint = document.querySelector(".scroll-hint");
if (scrollHint) {
  window.addEventListener("scroll", () => {
    scrollHint.style.opacity = Math.max(0, 1 - window.scrollY / 200);
  });
}

/* ── KEYBOARD ACCESSIBILITY ──────────────────── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }
});

/* ── NEXT SERVICE COUNTDOWN ──────────────────── */
const countdownElements = {
  days: document.getElementById("cdDays"),
  hours: document.getElementById("cdHours"),
  minutes: document.getElementById("cdMins"),
  seconds: document.getElementById("cdSecs")
};

function nextServiceDate(now) {
  const schedule = [
    { day: 0, hour: 8, minute: 30 },
    { day: 0, hour: 10, minute: 30 },
    { day: 4, hour: 17, minute: 30 }
  ];
  return schedule.map((service) => {
    const date = new Date(now);
    const daysAhead = (service.day + 7 - date.getDay()) % 7;
    date.setDate(date.getDate() + daysAhead);
    date.setHours(service.hour, service.minute, 0, 0);
    if (date <= now) date.setDate(date.getDate() + 7);
    return date;
  }).sort((a, b) => a - b)[0];
}

function updateCountdown() {
  if (!countdownElements.days) return;
  const difference = Math.max(0, nextServiceDate(new Date()) - Date.now());
  const pad = (value) => String(value).padStart(2, "0");
  countdownElements.days.textContent = pad(Math.floor(difference / 86400000));
  countdownElements.hours.textContent = pad(Math.floor((difference % 86400000) / 3600000));
  countdownElements.minutes.textContent = pad(Math.floor((difference % 3600000) / 60000));
  countdownElements.seconds.textContent = pad(Math.floor((difference % 60000) / 1000));
}
if (countdownElements.days) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ── TESTIMONIAL CAROUSEL ────────────────────── */
const testimonialTrack = document.getElementById("testimonialTrack");
if (testimonialTrack) {
  const slides = [...testimonialTrack.querySelectorAll(".testimonial-slide")];
  const dotsWrap = document.getElementById("testimonialDots");
  let currentTestimonial = 0;
  let testimonialTimer;
  const renderTestimonial = () => {
    slides.forEach((slide, index) => slide.classList.toggle("active", index === currentTestimonial));
    [...dotsWrap.children].forEach((dot, index) => dot.classList.toggle("active", index === currentTestimonial));
  };
  const goToTestimonial = (index) => {
    currentTestimonial = (index + slides.length) % slides.length;
    renderTestimonial();
  };
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.setAttribute("role", "button");
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
    dot.addEventListener("click", () => goToTestimonial(index));
    dotsWrap.appendChild(dot);
  });
  document.getElementById("testimonialPrev").addEventListener("click", () => goToTestimonial(currentTestimonial - 1));
  document.getElementById("testimonialNext").addEventListener("click", () => goToTestimonial(currentTestimonial + 1));
  renderTestimonial();
  testimonialTimer = setInterval(() => goToTestimonial(currentTestimonial + 1), 6000);
}

/* ── FAQ ACCORDION ──────────────────────────── */
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqItems.forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      other.querySelector(".faq-answer").style.maxHeight = "";
    });
    if (!isOpen) {
      item.classList.add("open");
      question.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

