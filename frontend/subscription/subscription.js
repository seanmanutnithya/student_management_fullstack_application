/* ============================================================
   SUBSCRIPTION PAGE — front-end only. No backend/database calls.

   Stripe integration note:
   This mounts a real Stripe Elements Card field for an authentic
   payment UI/UX (formatting, brand icons, built-in validation).
   Replace STRIPE_PUBLISHABLE_KEY below with your own publishable
   key (pk_live_... / pk_test_...) before using this anywhere real.
   Actually charging a card requires a backend that creates a
   PaymentIntent with your Stripe secret key — that's intentionally
   NOT included here. The "Pay" button below only simulates success.
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
  wireHoverScale(".btn-block", 1.012);
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

  /* ---------------- Field validation helpers ---------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function isValidEmail(v) {
    return EMAIL_RE.test(v.trim());
  }
  function isValidZip(v) {
    return /^[A-Za-z0-9\- ]{3,10}$/.test(v.trim());
  }

  function setFieldState(fieldEl, state) {
    fieldEl.classList.remove("is-valid", "is-invalid");
    if (state === "valid") fieldEl.classList.add("is-valid");
    if (state === "invalid") fieldEl.classList.add("is-invalid");
  }
  function shake(el) {
    if (!window.gsap) return;
    gsap.fromTo(
      el,
      { x: 0 },
      {
        x: 8,
        duration: 0.06,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => gsap.set(el, { x: 0 }),
      },
    );
  }
  function validateField(fieldEl, validatorFn) {
    const input = fieldEl.querySelector("input, select");
    const ok = validatorFn(input.value);
    setFieldState(fieldEl, ok ? "valid" : "invalid");
    if (!ok) shake(input.closest(".input-wrap") || input);
    return ok;
  }
  function wireLiveValidation(fieldEl, validatorFn) {
    const input = fieldEl.querySelector("input, select");
    const evt = input.tagName === "SELECT" ? "change" : "blur";
    input.addEventListener(evt, () => validateField(fieldEl, validatorFn));
    input.addEventListener("input", () => {
      if (fieldEl.classList.contains("is-invalid") && validatorFn(input.value))
        setFieldState(fieldEl, "valid");
    });
  }

  const billNameField = document.querySelector('[data-field="billName"]');
  const billEmailField = document.querySelector('[data-field="billEmail"]');
  const billCountryField = document.querySelector('[data-field="billCountry"]');
  const billZipField = document.querySelector('[data-field="billZip"]');
  const cardElementField = document.querySelector(
    '[data-field="cardElementField"]',
  );

  wireLiveValidation(billNameField, (v) => v.trim().length >= 2);
  wireLiveValidation(billEmailField, isValidEmail);
  wireLiveValidation(billCountryField, (v) => v.trim().length > 0);
  wireLiveValidation(billZipField, isValidZip);

  /* ---------------- Stripe Elements (card field) ---------------- */
  const STRIPE_PUBLISHABLE_KEY = "pk_test_REPLACE_WITH_YOUR_OWN_KEY";
  let stripe = null;
  let cardElement = null;
  let cardComplete = false; // set true if Stripe fails to load, so the UI demo still works end-to-end

  function initStripe() {
    const fallback = document.getElementById("stripeFallback");
    const cardError = document.getElementById("cardError");

    try {
      if (!window.Stripe) throw new Error("Stripe.js did not load");

      stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
      const elements = stripe.elements();

      const style = {
        base: {
          fontFamily: "Inter, -apple-system, sans-serif",
          fontSize: "14px",
          color: "#211A2E",
          "::placeholder": { color: "#A29AB3" },
        },
        invalid: { color: "#E5484D" },
      };

      cardElement = elements.create("card", { style, hidePostalCode: true });
      fallback.remove();
      cardElement.mount("#cardElement");

      cardElement.on("change", (event) => {
        cardComplete = event.complete;
        if (event.error) {
          cardError.textContent = event.error.message;
          setFieldState(cardElementField, "invalid");
        } else if (event.complete) {
          setFieldState(cardElementField, "valid");
        } else {
          setFieldState(cardElementField, null);
        }
      });

      cardElement.on("focus", () =>
        document
          .getElementById("cardElement")
          .classList.add("StripeElement--focus"),
      );
      cardElement.on("blur", () =>
        document
          .getElementById("cardElement")
          .classList.remove("StripeElement--focus"),
      );
    } catch (err) {
      // Stripe.js failed to load (blocked network, ad blocker, offline preview, etc.)
      // Fall back to a UI-only demo so the rest of the flow still works.
      cardComplete = true;
      fallback.innerHTML = `<i data-lucide="info"></i><span>Stripe.js unavailable in this preview — continuing in UI-only demo mode.</span>`;
      bootIcons();
      console.warn("Stripe.js could not initialize:", err.message);
    }
  }

  /* ---------------- Submit / simulated checkout ---------------- */
  const paymentForm = document.getElementById("paymentForm");
  const paySubmit = document.getElementById("paySubmit");
  const successOverlay = document.getElementById("successOverlay");
  const successCloseBtn = document.getElementById("successCloseBtn");

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameOk = validateField(billNameField, (v) => v.trim().length >= 2);
    const emailOk = validateField(billEmailField, isValidEmail);
    const countryOk = validateField(
      billCountryField,
      (v) => v.trim().length > 0,
    );
    const zipOk = validateField(billZipField, isValidZip);

    if (!cardComplete) {
      setFieldState(cardElementField, "invalid");
      shake(document.getElementById("cardElement"));
    }

    if (!(nameOk && emailOk && countryOk && zipOk && cardComplete)) return;

    paySubmit.classList.add("is-loading");
    paySubmit.disabled = true;

    // Optional: demonstrate real client-side tokenization if Stripe loaded.
    // This produces a PaymentMethod id but there is no backend here to
    // actually charge it — it's just proof the Elements integration works.
    if (stripe && cardElement) {
      try {
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: document.getElementById("billName").value,
            email: document.getElementById("billEmail").value,
          },
        });
      } catch (err) {
        console.warn(
          "createPaymentMethod demo call did not complete:",
          err.message,
        );
      }
    }

    setTimeout(() => {
      paySubmit.classList.remove("is-loading");
      paySubmit.disabled = false;
      openSuccess();
    }, 1200);
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
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.45 },
        "-=0.15",
      )
      .fromTo(
        ".pay-card",
        { opacity: 0, x: 16 },
        { opacity: 1, x: 0, duration: 0.45 },
        "-=0.35",
      )
      .fromTo(
        ".plan-features li",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 },
        "-=0.3",
      );
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    bootIcons();
    initStripe();
    animatePrice();
    pageLoadAnimation();
  });
})();
