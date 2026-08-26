/* ============================================================
   HOME PAGE — front-end only. No backend/database calls.
   ============================================================ */

const easeOut = "power3.out";
function bootIcons() {
  window.lucide && window.lucide.createIcons();
}

/* ---------------- Sidebar (mobile) ---------------- */
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const menuBtn = document.getElementById("mobileMenuBtn");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");

function openSidebar() {
  if (window.gsap) {
    gsap.set(overlay, { display: "block" });
    gsap.to(overlay, { opacity: 1, pointerEvents: "auto", duration: 0.25 });
    gsap.fromTo(
      sidebar,
      { x: "-100%" },
      { x: "0%", duration: 0.35, ease: easeOut },
    );
  } else {
    sidebar.style.transform = "translateX(0)";
    overlay.style.display = "block";
  }
}
function closeSidebar() {
  if (window.gsap) {
    gsap.to(sidebar, { x: "-100%", duration: 0.3, ease: "power2.in" });
    gsap.to(overlay, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.25,
      onComplete: () => gsap.set(overlay, { display: "none" }),
    });
  } else {
    sidebar.style.transform = "translateX(-100%)";
    overlay.style.display = "none";
  }
}
menuBtn && menuBtn.addEventListener("click", openSidebar);
sidebarCloseBtn && sidebarCloseBtn.addEventListener("click", closeSidebar);
overlay && overlay.addEventListener("click", closeSidebar);

document.querySelectorAll(".nav-parent").forEach((btn) => {
  btn.addEventListener("click", () => {
    const group = btn.closest(".nav-group");
    if (!group) return;
    const isOpen = group.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });
});

function wireHoverScale(selector, scale = 1.03) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener(
      "mouseenter",
      () =>
        window.gsap && gsap.to(el, { scale, duration: 0.18, ease: easeOut }),
    );
    el.addEventListener(
      "mouseleave",
      () =>
        window.gsap && gsap.to(el, { scale: 1, duration: 0.18, ease: easeOut }),
    );
  });
}
wireHoverScale(".btn", 1.03);
wireHoverScale(".icon-btn", 1.08);
wireHoverScale(".stat-card", 1.015);

/* ---------------- Stat card count-up ---------------- */
function animateCounters() {
  document.querySelectorAll(".stat-card-value[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (window.gsap) {
      gsap.to(
        { val: 0 },
        {
          val: target,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.15,
          onUpdate: function () {
            const v = Math.round(this.targets()[0].val);
            el.textContent = prefix + v.toLocaleString() + suffix;
          },
        },
      );
    } else {
      el.textContent = prefix + target.toLocaleString() + suffix;
    }
  });
}

/* ---------------- Line chart (SVG, hand-drawn path) ---------------- */

/* ---------------- Activity feed ---------------- */

document.getElementById("refreshActivityBtn").addEventListener("click", (e) => {
  if (window.gsap)
    gsap.to(e.currentTarget.querySelector("svg"), {
      rotate: "+=360",
      duration: 0.5,
      ease: "power2.out",
    });
  renderActivityFeed();
  showToast("Activity feed refreshed");
});

/* ---------------- Upcoming events ---------------- */

/* ---------------- Page load orchestration ---------------- */
function pageLoadAnimation() {
  if (!window.gsap) return;
  const tl = gsap.timeline({ defaults: { ease: easeOut } });
  tl.fromTo(
    ".sidebar-brand, .sidebar-nav .nav-item, .sidebar-nav .nav-group",
    { opacity: 0, x: -10 },
    { opacity: 1, x: 0, duration: 0.3, stagger: 0.03 },
  )
    .fromTo(
      ".topbar, .mobile-topbar",
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.3 },
      "-=0.2",
    )
    .fromTo(
      ".greeting-bar",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4 },
      "-=0.1",
    )
    .fromTo(
      ".stat-card",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
      "-=0.2",
    )
    .fromTo(
      ".chart-card",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
      "-=0.15",
    )
    .fromTo(
      ".quicklist-card",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
      "-=0.2",
    )
    .fromTo(
      ".activity-card, .events-card",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
      "-=0.5",
    );
}

/* ---------------- Init ---------------- */
function loadingContent() {
  document.addEventListener("DOMContentLoaded", () => {
    bootIcons();
    updateGreeting();
    setInterval(updateGreeting, 60000);
    renderLineChart();
    renderDonutChart();
    renderQuickLists();
    renderActivityFeed();
    renderEvents();
    animateCounters();
    pageLoadAnimation();
  });
}

export default loadingContent;
