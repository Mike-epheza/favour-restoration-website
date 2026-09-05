// =============================================
//  FAVOUR RESTORATION WORD OF GOD MINISTRIES — script.js
// =============================================

/* ── PAGE LOADER ─────────────────────────────── */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.style.overflow = "visible";
    startCounters();
  }, 1200);
});

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
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

// Close mobile menu when a link is clicked
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
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
function startCounters() {
  const counters = document.querySelectorAll(".stat-num[data-count]");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-count"));
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease out cubic
      counter.textContent = Math.floor(ease * target).toLocaleString() + (target >= 100 ? "+" : "");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
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

/* ── GIVE — AMOUNT SELECTOR ──────────────────── */
const amountBtns = document.querySelectorAll(".amount-btn");
const customInputWrap = document.getElementById("customInputWrap");
const giveTabs = document.querySelectorAll(".give-tab");

amountBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    amountBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    if (btn.dataset.amount === "custom") {
      customInputWrap.classList.add("visible");
      document.getElementById("customAmount").focus();
    } else {
      customInputWrap.classList.remove("visible");
    }
  });
});

giveTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    giveTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

// Give button click
document.querySelector(".give-btn").addEventListener("click", () => {
  const activeBtn = document.querySelector(".amount-btn.active");
  let amount = activeBtn?.dataset.amount;
  if (amount === "custom") {
    amount = document.getElementById("customAmount").value;
    if (!amount) { alert("Please enter a custom amount."); return; }
  }
  const freq = document.querySelector(".give-tab.active")?.dataset.freq || "one-time";
  alert(`Thank you for your generosity!\n\nAmount: KES ${Number(amount).toLocaleString()}\nFrequency: ${freq}\n\nYou will be redirected to our secure payment portal.\n\nMay God bless you abundantly! 🙏`);
});

/* ── CONTACT FORM ────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.querySelector(".form-submit");
  btn.textContent = "Sending…";
  btn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    document.getElementById("contactForm").reset();
    btn.textContent = "Message Sent!";
    const successEl = document.getElementById("formSuccess");
    successEl.style.display = "flex";
    successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      btn.disabled = false;
      successEl.style.display = "none";
    }, 5000);
  }, 1600);
}

/* ── BACK TO TOP ─────────────────────────────── */
const backTop = document.getElementById("backTop");
function toggleBackTop() {
  backTop.classList.toggle("visible", window.scrollY > 400);
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
  }
});