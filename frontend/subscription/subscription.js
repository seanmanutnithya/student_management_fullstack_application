/* ============================================================
   SUBSCRIPTION PAGE — front-end only. No backend/database calls.
   No payment form or Stripe integration — "Subscribe" just
   simulates a successful subscription for UI/demo purposes.
   ============================================================ */
(() => {
  "use strict";

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

  function wireHoverScale(selector, scale = 1.02) {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener(
        "mouseenter",
        () =>
          window.gsap && gsap.to(el, { scale, duration: 0.18, ease: easeOut }),
      );
      el.addEventListener(
        "mouseleave",
        () =>
          window.gsap &&
          gsap.to(el, { scale: 1, duration: 0.18, ease: easeOut }),
      );
    });
  }
  wireHoverScale(".btn-block", 1.015);
  wireHoverScale(".icon-btn", 1.08);
  wireHoverScale(".plan-features li", 1.015);

  /* ---------------- Price count-up ---------------- */
  function animatePrice() {
    const el = document.querySelector(".plan-price-value");
    const target = Number(el.dataset.count);
    if (window.gsap) {
      gsap.to(
        { val: 0 },
        {
          val: target,
          duration: 1,
          ease: "power2.out",
          delay: 0.3,
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val);
          },
        },
      );
    } else {
      el.textContent = target;
    }
  }

  /* ---------------- Subscribe (simulated, no backend/payment) ---------------- */
  const subscribeBtn = document.getElementById("subscribeBtn");
  const successOverlay = document.getElementById("successOverlay");
  const successCloseBtn = document.getElementById("successCloseBtn");

  subscribeBtn.addEventListener("click", async () => {
    subscribeBtn.classList.add("is-loading");
    const data = await handlePaymentWithKhqr();
    console.log(data);
    window.location.href = data.url;
    subscribeBtn.disabled = true;
    setTimeout(() => {
      subscribeBtn.classList.remove("is-loading");
      subscribeBtn.disabled = false;
      openSuccess();
    }, 1000);
  });

  function openSuccess() {
    successOverlay.style.visibility = "visible";
    if (window.gsap) {
      gsap.to(successOverlay, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        ".success-card",
        { y: 24, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" },
      );
      gsap.fromTo(
        ".success-icon",
        { scale: 0 },
        { scale: 1, duration: 0.4, delay: 0.15, ease: "back.out(2.2)" },
      );
    } else {
      successOverlay.style.opacity = 1;
    }
  }
  successCloseBtn.addEventListener("click", () => {
    window.location.href = "home.html";
  });

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
        ".page-head",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35 },
        "-=0.1",
      )
      .fromTo(
        ".plan-card",
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 },
        "-=0.15",
      )
      .fromTo(
        ".plan-features li",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 },
        "-=0.25",
      );
  }

  const baseUrl = "http://localhost:3000";
  async function handlePaymentWithKhqr() {
    const content = { price: 120 };
    const res = await fetch(baseUrl + "/api/v1/cardpayway/stripe", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const data = res.json();
    return data;
  }
  const buyingEle = document.getElementById("plan-price-value");

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    bootIcons();
    animatePrice();
    pageLoadAnimation();
  });
})();
