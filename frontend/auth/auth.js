/* ============================================================
   AUTH PAGE — front-end only. No backend/database calls.
   Validates email + phone formats and shows inline UI states.
   ============================================================ */
(() => {
  "use strict";

  const easeOut = "power3.out";

  function bootIcons() {
    window.lucide && window.lucide.createIcons();
  }

  /* ---------------- Validators ---------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^\+?[0-9][0-9\s\-]{6,14}$/; // 7–15 digits, optional leading +

  function isValidEmail(value) {
    return EMAIL_RE.test(value.trim());
  }
  function isValidPhone(value) {
    const digits = value.replace(/[^\d]/g, "");
    return (
      PHONE_RE.test(value.trim()) && digits.length >= 7 && digits.length <= 15
    );
  }

  /* ---------------- Field validation engine ---------------- */
  // Each entry: fieldSelector -> validate fn returning true/false
  function setFieldState(fieldEl, state) {
    // state: 'valid' | 'invalid' | 'neutral'
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

  function validateField(fieldEl, validatorFn, { required = true } = {}) {
    const input = fieldEl.querySelector("input");
    const value = input.value;
    if (!value.trim()) {
      setFieldState(fieldEl, required ? "invalid" : "neutral");
      if (required) shake(fieldEl.querySelector(".input-wrap"));
      return !required;
    }
    const ok = validatorFn(value);
    setFieldState(fieldEl, ok ? "valid" : "invalid");
    if (!ok) shake(fieldEl.querySelector(".input-wrap"));
    return ok;
  }

  /* Wire live validation: validate on blur, clear error state while typing */
  function wireLiveValidation(fieldEl, validatorFn, opts) {
    const input = fieldEl.querySelector("input");
    input.addEventListener("blur", () =>
      validateField(fieldEl, validatorFn, opts),
    );
    input.addEventListener("input", () => {
      if (
        fieldEl.classList.contains("is-invalid") &&
        input.value.trim() &&
        validatorFn(input.value)
      ) {
        setFieldState(fieldEl, "valid");
      } else if (
        fieldEl.classList.contains("is-invalid") === false &&
        fieldEl.classList.contains("is-valid") === false
      ) {
        /* neutral while typing first time — no-op */
      }
    });
  }

  /* ---------------- Password visibility toggles ---------------- */
  document.querySelectorAll(".visibility-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".input-wrap").querySelector("input");
      const isPw = input.type === "password";
      input.type = isPw ? "text" : "password";
      btn.innerHTML = `<i data-lucide="${isPw ? "eye-off" : "eye"}"></i>`;
      bootIcons();
    });
  });

  /* ---------------- Password strength meter ---------------- */
  const signupPassword = document.getElementById("signupPassword");
  const pwFill = document.getElementById("pwStrengthFill");
  const pwLabel = document.getElementById("pwStrengthLabel");

  function scorePassword(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score; // 0–5
  }

  signupPassword &&
    signupPassword.addEventListener("input", () => {
      const score = scorePassword(signupPassword.value);
      const pct = signupPassword.value ? Math.min(100, (score / 5) * 100) : 0;
      const labels = [
        "Too short",
        "Weak",
        "Fair",
        "Good",
        "Strong",
        "Very strong",
      ];
      const colors = [
        "var(--color-danger)",
        "var(--color-danger)",
        "var(--color-warning)",
        "var(--color-warning)",
        "var(--color-success)",
        "var(--color-success)",
      ];
      if (window.gsap) {
        gsap.to(pwFill, {
          width: pct + "%",
          backgroundColor: colors[score],
          duration: 0.3,
          ease: easeOut,
        });
      } else {
        pwFill.style.width = pct + "%";
        pwFill.style.background = colors[score];
      }
      pwLabel.textContent =
        signupPassword.value ? labels[score] : "Password strength";
    });

  /* ---------------- Role switch (Admin / Teacher) ---------------- */
  document.querySelectorAll(".role-switch").forEach((group) => {
    const pill = group.querySelector(".role-switch-pill");
    const options = [...group.querySelectorAll(".role-option")];

    function movePill(target, animate = true) {
      const groupRect = group.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      const x = rect.left - groupRect.left - 4;
      if (window.gsap && animate) {
        gsap.to(pill, { x, duration: 0.28, ease: easeOut });
      } else {
        pill.style.transform = `translateX(${x}px)`;
      }
    }

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        options.forEach((o) => o.classList.remove("is-active"));
        opt.classList.add("is-active");
        movePill(opt);
      });
    });

    // Init position once layout is ready
    requestAnimationFrame(() =>
      movePill(group.querySelector(".role-option.is-active"), false),
    );
    window.addEventListener("resize", () =>
      movePill(group.querySelector(".role-option.is-active"), false),
    );
  });

  /* ---------------- Tabs: Login / Sign up ---------------- */
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");
  const tabIndicator = document.getElementById("tabIndicator");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const authCard = document.getElementById("authCard");

  function switchTab(target) {
    const toLogin = target === "login";
    tabLogin.classList.toggle("is-active", toLogin);
    tabSignup.classList.toggle("is-active", !toLogin);
    tabLogin.setAttribute("aria-selected", String(toLogin));
    tabSignup.setAttribute("aria-selected", String(!toLogin));

    if (window.gsap) {
      gsap.to(tabIndicator, {
        x: toLogin ? 0 : "100%",
        duration: 0.3,
        ease: easeOut,
      });
    } else {
      tabIndicator.style.transform = `translateX(${toLogin ? "0%" : "100%"})`;
    }

    const showEl = toLogin ? loginForm : signupForm;
    const hideEl = toLogin ? signupForm : loginForm;

    if (window.gsap) {
      gsap.to(hideEl, {
        opacity: 0,
        y: -8,
        duration: 0.16,
        ease: "power2.in",
        onComplete: () => {
          hideEl.classList.remove("is-active");
          showEl.classList.add("is-active");
          gsap.fromTo(
            showEl,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.28, ease: easeOut },
          );
        },
      });
    } else {
      hideEl.classList.remove("is-active");
      showEl.classList.add("is-active");
    }
  }

  tabLogin.addEventListener("click", () => switchTab("login"));
  tabSignup.addEventListener("click", () => switchTab("signup"));
  document
    .getElementById("goSignup")
    .addEventListener("click", () => switchTab("signup"));
  document
    .getElementById("goLogin")
    .addEventListener("click", () => switchTab("login"));

  /* ---------------- Wire field validators ---------------- */
  const loginEmailField = document.querySelector('[data-field="loginEmail"]');
  const loginPasswordField = document.querySelector(
    '[data-field="loginPassword"]',
  );
  const signupNameField = document.querySelector('[data-field="signupName"]');
  const signupEmailField = document.querySelector('[data-field="signupEmail"]');
  const signupPhoneField = document.querySelector('[data-field="signupPhone"]');
  const signupPasswordField = document.querySelector(
    '[data-field="signupPassword"]',
  );
  const signupConfirmField = document.querySelector(
    '[data-field="signupConfirm"]',
  );

  wireLiveValidation(loginEmailField, isValidEmail);
  wireLiveValidation(loginPasswordField, (v) => v.trim().length > 0);
  wireLiveValidation(signupNameField, (v) => v.trim().length >= 2);
  wireLiveValidation(signupEmailField, isValidEmail);
  wireLiveValidation(signupPhoneField, isValidPhone);
  wireLiveValidation(signupPasswordField, (v) => v.length >= 8);
  wireLiveValidation(
    signupConfirmField,
    (v) =>
      v === document.getElementById("signupPassword").value && v.length >= 8,
  );

  /* Re-check confirm-password when the main password changes */
  document.getElementById("signupPassword").addEventListener("input", () => {
    const confirmInput = document.getElementById("signupConfirm");
    if (confirmInput.value) {
      const ok =
        confirmInput.value === document.getElementById("signupPassword").value;
      setFieldState(signupConfirmField, ok ? "valid" : "invalid");
    }
  });

  /* ---------------- Loading / submit helpers ---------------- */
  function setLoading(btn, isLoading) {
    btn.classList.toggle("is-loading", isLoading);
    btn.disabled = isLoading;
  }

  const toastEl = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  let toastTimer = null;

  function showToast(message, icon = "check-circle-2") {
    toastMsg.textContent = message;
    toastEl.querySelector("svg")?.remove();
    const iconEl = document.createElement("i");
    iconEl.setAttribute("data-lucide", icon);
    toastEl.prepend(iconEl);
    bootIcons();

    clearTimeout(toastTimer);
    if (window.gsap) {
      gsap.killTweensOf(toastEl);
      gsap.fromTo(
        toastEl,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.32, ease: "back.out(1.6)" },
      );
    } else {
      toastEl.style.opacity = 1;
    }
    toastTimer = setTimeout(() => {
      if (window.gsap) {
        gsap.to(toastEl, {
          y: 24,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        });
      } else {
        toastEl.style.opacity = 0;
      }
    }, 2600);
  }

  /* ---------------- Login submit ---------------- */
  const loginSubmit = document.getElementById("loginSubmit");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailOk = validateField(loginEmailField, isValidEmail);
    const pwOk = validateField(loginPasswordField, (v) => v.trim().length > 0);
    if (!emailOk || !pwOk) return;

    const password = document.getElementById("loginPassword").value;
    const email = document.getElementById("loginEmail").value;

    const loginData = {
      log_email: email,
      log_password: password,
    };
    setLoading(loginSubmit, true);

    try {
      const result = await handleLogin(loginData);
      if (result.success) {
        showToast("Logged in successfully", "check-circle-2");
        window.location.href = "../dashboard/index.html";
      } else {
        showToast(result?.message || "Login failed. Please try again!");
        setLoading(loginSubmit, false);
      }
    } catch (error) {
      showToast(error.message || "Login failed. Please try again!");
      console.error(error);
    } finally {
      setLoading(loginSubmit, false);
    }
    // setTimeout(() => {
    //   showToast("Logged in successfully");
    // }, 900);
  });

  /* ---------------- Signup submit ---------------- */
  const signupSubmit = document.getElementById("signupSubmit");
  const termsCheckbox = document.getElementById("agreeTerms");
  const termsError = document.getElementById("termsError");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameOk = validateField(signupNameField, (v) => v.trim().length >= 2);
    const emailOk = validateField(signupEmailField, isValidEmail);
    const phoneOk = validateField(signupPhoneField, isValidPhone);
    const pwOk = validateField(signupPasswordField, (v) => v.length >= 8);
    const confirmOk = validateField(
      signupConfirmField,
      (v) =>
        v === document.getElementById("signupPassword").value && v.length >= 8,
    );

    const termsOk = termsCheckbox.checked;
    termsError.classList.toggle("is-visible", !termsOk);
    if (!termsOk && window.gsap)
      shake(termsCheckbox.closest(".checkbox-field--terms"));

    if (!(nameOk && emailOk && phoneOk && pwOk && confirmOk && termsOk)) return;

    const password = document.getElementById("signupPassword").value;
    const email = document.getElementById("signupEmail").value;
    const name = document.getElementById("signupName").value;
    const phone = document.getElementById("signupPhone").value;

    const signupData = {
      user_name: name,
      email,
      user_password: password,
      phone,
    };

    try {
      const result = await handleSignup(signupData);

      window.location.href = "../otps/otp.html";

      if (result.success) {
        setLoading(signupSubmit, true);
        showToast("Account created", "check-circle-2");
      } else {
        showToast(result.message || "Cannot create account");
      }
    } catch (error) {
      showToast("Cannot create account");
      console.error(error.message);
    } finally {
      setLoading(signupSubmit, false);
    }
  });

  /* ---------------- Button hover micro-interactions ---------------- */
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
          window.gsap &&
          gsap.to(el, { scale: 1, duration: 0.18, ease: easeOut }),
      );
    });
  }
  wireHoverScale(".btn-block", 1.015);
  wireHoverScale(".visibility-toggle", 1.12);
  wireHoverScale(".role-option", 1.0); // pill provides the visual feestudentDBack

  /* ---------------- Entrance animation ---------------- */
  function pageLoadAnimation() {
    if (!window.gsap) return;
    const tl = gsap.timeline({ defaults: { ease: easeOut } });
    tl.fromTo(
      authCard,
      { opacity: 0, y: 24, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5 },
    )
      .fromTo(
        ".auth-visual-top, .auth-mobile-brand",
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.35 },
        "-=0.35",
      )
      .fromTo(
        ".auth-visual-body h2, .auth-visual-body p",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
        "-=0.2",
      )
      .fromTo(
        ".auth-visual-card",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.15",
      )
      .fromTo(
        ".auth-panel.is-active .field, .auth-panel.is-active .role-switch, .auth-panel.is-active .auth-row, .auth-panel.is-active .checkbox-field--terms",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.32, stagger: 0.05 },
        "-=0.25",
      );
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    bootIcons();
    pageLoadAnimation();
  });

  const base_URL = "http://localhost:3000";

  async function handleLogin(loginData) {
    const res = await fetch(base_URL + "/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (res.ok) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  }
  async function handleSignup(signupData) {
    const res = await fetch(base_URL + "/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    const data = await res.json();
    const mailContent = {
      user: signupData.email,
    };
    if (!res.ok) {
      showToast(data.message, "info");
      return;
    } else {
      // await handleSendVerifyCode(mailContent);
      showToast(data.message, "check-circle-2");
    }
    return {
      success: res.ok,
      message: data.message,
    };
  }
})();
