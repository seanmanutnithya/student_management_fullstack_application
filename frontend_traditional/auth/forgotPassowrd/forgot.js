/* ============================================================
   FORGOT PASSWORD FLOW — front-end only. No backend/database calls.
   Step 1: email  ->  Step 2: OTP (demo code "1234")  ->  Step 3: new password  ->  Step 4: success
   ============================================================ */
(() => {
  "use strict";

  const easeOut = "power3.out";

  function bootIcons() {
    window.lucide && window.lucide.createIcons();
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function isValidEmail(value) {
    return EMAIL_RE.test(value.trim());
  }

  const authCard = document.getElementById("authCard");
  const panels = [...document.querySelectorAll(".flow-panel")];
  const stepDots = [...document.querySelectorAll(".flow-step")];
  const stepLines = [...document.querySelectorAll(".flow-step-line")];

  /* ---------------- Toast ---------------- */
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

  /* ---------------- Field validation helpers ---------------- */
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
  function wireLiveValidation(fieldEl, validatorFn) {
    const input = fieldEl.querySelector("input");
    input.addEventListener("blur", () => validateField(fieldEl, validatorFn));
    input.addEventListener("input", () => {
      if (
        fieldEl.classList.contains("is-invalid") &&
        input.value.trim() &&
        validatorFn(input.value)
      ) {
        setFieldState(fieldEl, "valid");
      }
    });
  }

  function setLoading(btn, isLoading) {
    btn.classList.toggle("is-loading", isLoading);
    btn.disabled = isLoading;
  }

  /* ---------------- Step navigation ---------------- */
  let currentStep = 1;

  function goToStep(step) {
    const fromPanel = panels.find(
      (p) => p.dataset.panel === String(currentStep),
    );
    const toPanel = panels.find((p) => p.dataset.panel === String(step));

    // Update step indicator (steps 1–3 only; step 4 is the success screen)
    stepDots.forEach((dot) => {
      const n = Number(dot.dataset.step);
      dot.classList.remove("is-active", "is-done");
      if (n < step) dot.classList.add("is-done");
      else if (n === step) dot.classList.add("is-active");
    });
    stepLines.forEach((line, i) =>
      line.classList.toggle("is-filled", step > i + 1),
    );

    const direction = step > currentStep ? 1 : -1;

    if (window.gsap) {
      gsap.to(fromPanel, {
        opacity: 0,
        x: -16 * direction,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          fromPanel.classList.remove("is-active");
          toPanel.classList.add("is-active");
          gsap.fromTo(
            toPanel,
            { opacity: 0, x: 16 * direction },
            { opacity: 1, x: 0, duration: 0.32, ease: easeOut },
          );
          bootIcons();
        },
      });
    } else {
      fromPanel.classList.remove("is-active");
      toPanel.classList.add("is-active");
    }

    currentStep = step;
  }

  /* ================= STEP 1 — EMAIL ================= */
  let globalEmail = null;
  const emailForm = document.getElementById("emailForm");
  const emailField = document.querySelector('[data-field="resetEmail"]');
  const emailSubmit = document.getElementById("emailSubmit");
  const otpTargetEl = document.getElementById("otpTarget");

  wireLiveValidation(emailField, isValidEmail);

  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ok = validateField(emailField, isValidEmail);
    if (!ok) return;

    setLoading(emailSubmit, true);
    setTimeout(async () => {
      setLoading(emailSubmit, false);
      const email = document.getElementById("resetEmail").value.trim();
      globalEmail = email;
      const sendContent = {
        email,
        user: email,
      };
      await handleSendOTP(sendContent);
      otpTargetEl.textContent = maskEmail(email);
      showToast("Verification code sent");
      goToStep(2);
      startCountdown();
      setTimeout(() => otpBoxes[0]?.focus(), 400);
    }, 800);
  });

  function maskEmail(email) {
    const [user, domain] = email.split("@");
    if (!domain) return email;
    const visible = user.slice(0, Math.min(2, user.length));
    return `${visible}${"*".repeat(Math.max(1, user.length - visible.length))}@${domain}`;
  }

  document.getElementById("backToLogin").addEventListener("click", () => {
    window.location.href = "../auth.html";
  });

  /* ================= STEP 2 — OTP ================= */
  const otpBoxes = [...document.querySelectorAll(".otp-box")];
  const otpForm = document.getElementById("otpForm");
  const otpError = document.getElementById("otpError");
  const otpSubmit = document.getElementById("otpSubmit");

  function setBoxState(box, state) {
    box.classList.remove("is-filled", "is-invalid", "is-valid");
    if (state) box.classList.add(`is-${state}`);
  }
  function clearOtpErrorState() {
    otpError.classList.remove("is-visible");
    otpBoxes.forEach((b) => {
      if (b.classList.contains("is-invalid"))
        setBoxState(b, b.value ? "filled" : null);
    });
  }
  function getCode() {
    return otpBoxes.map((b) => b.value).join("");
  }
  function shakeBoxes() {
    if (!window.gsap) return;
    gsap.fromTo(
      "#otpInputGroup",
      { x: 0 },
      {
        x: 9,
        duration: 0.06,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => gsap.set("#otpInputGroup", { x: 0 }),
      },
    );
  }

  otpBoxes.forEach((box, i) => {
    box.addEventListener("input", () => {
      box.value = box.value.replace(/[^0-9]/g, "").slice(-1);
      if (box.value) {
        setBoxState(box, "filled");
        clearOtpErrorState();
        if (i < otpBoxes.length - 1) otpBoxes[i + 1].focus();
        else {
          box.blur();
          maybeAutoSubmit();
        }
      } else {
        setBoxState(box, null);
      }
    });
    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        if (!box.value && i > 0) {
          otpBoxes[i - 1].focus();
          otpBoxes[i - 1].value = "";
          setBoxState(otpBoxes[i - 1], null);
          e.preventDefault();
        } else setBoxState(box, null);
        clearOtpErrorState();
      } else if (e.key === "ArrowLeft" && i > 0) {
        e.preventDefault();
        otpBoxes[i - 1].focus();
      } else if (e.key === "ArrowRight" && i < otpBoxes.length - 1) {
        e.preventDefault();
        otpBoxes[i + 1].focus();
      }
    });
    box.addEventListener("focus", () => box.select());
    box.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/[^0-9]/g, "");
      if (!pasted) return;
      const chars = pasted.slice(0, otpBoxes.length).split("");
      chars.forEach((ch, idx) => {
        otpBoxes[idx].value = ch;
        setBoxState(otpBoxes[idx], "filled");
      });
      clearOtpErrorState();
      const nextEmpty = otpBoxes.findIndex((b) => !b.value);
      (nextEmpty === -1 ?
        otpBoxes[otpBoxes.length - 1]
      : otpBoxes[nextEmpty]
      ).focus();
      if (chars.length === otpBoxes.length) maybeAutoSubmit();
    });
  });

  function maybeAutoSubmit() {
    if (getCode().length === otpBoxes.length) {
      otpForm.requestSubmit ?
        otpForm.requestSubmit()
      : otpForm.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  }

  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = getCode();
    if (code.length < otpBoxes.length) {
      otpError.querySelector("span").textContent = "Please enter all 4 digits.";
      otpError.classList.add("is-visible");
      otpBoxes.forEach((b) => setBoxState(b, b.value ? "filled" : "invalid"));
      shakeBoxes();
      otpBoxes.find((b) => !b.value)?.focus();

      return;
    }
    setLoading(otpSubmit, true);
    const content = {
      email: globalEmail,
      verifyCode: code,
    };
    const data = await handleValidateOTP(content);

    setTimeout(() => {
      setLoading(otpSubmit, false);
      if (data.status) {
        otpBoxes.forEach((b) => setBoxState(b, "valid"));
        showToast("Code verified");
        clearInterval(countdownId);
        setTimeout(() => goToStep(3), 350);
      } else {
        otpError.querySelector("span").textContent =
          "That code isn't right. Please try again.";
        otpError.classList.add("is-visible");
        otpBoxes.forEach((b) => setBoxState(b, "invalid"));
        shakeBoxes();
        showToast("Verification failed", "alert-circle");
        setTimeout(() => {
          otpBoxes.forEach((b) => {
            b.value = "";
            setBoxState(b, null);
          });
          otpBoxes[0].focus();
        }, 400);
      }
    }, 900);
  });

  /* Resend countdown */
  const resendIdle = document.getElementById("resendIdle");
  const resendTimerEl = document.getElementById("resendTimer");
  const resendBtn = document.getElementById("resendBtn");
  const timerValue = document.getElementById("timerValue");
  let secondsLeft = 300;
  let countdownId = null;

  function startCountdown() {
    secondsLeft = 300;
    resendBtn.disabled = true;
    resendTimerEl.style.display = "inline";
    resendIdle.style.display = "none";
    timerValue.textContent = secondsLeft;
    clearInterval(countdownId);
    countdownId = setInterval(() => {
      secondsLeft -= 1;
      timerValue.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        clearInterval(countdownId);
        resendTimerEl.style.display = "none";
        resendIdle.style.display = "inline";
        resendBtn.disabled = false;
      }
    }, 1000);
  }
  resendBtn.addEventListener("click", () => {
    if (resendBtn.disabled) return;
    otpBoxes.forEach((b) => {
      b.value = "";
      setBoxState(b, null);
    });
    otpError.classList.remove("is-visible");
    otpBoxes[0].focus();
    showToast("A new code has been sent");
    startCountdown();
  });

  document.getElementById("backToEmail").addEventListener("click", () => {
    clearInterval(countdownId);
    goToStep(1);
  });

  /* ================= STEP 3 — RESET PASSWORD ================= */
  const resetForm = document.getElementById("resetForm");
  const newPasswordField = document.querySelector('[data-field="newPassword"]');
  const confirmField = document.querySelector('[data-field="confirmPassword"]');
  const resetSubmit = document.getElementById("resetSubmit");
  const pwFill = document.getElementById("pwStrengthFill");
  const pwLabel = document.getElementById("pwStrengthLabel");

  document.querySelectorAll(".visibility-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".input-wrap").querySelector("input");
      const isPw = input.type === "password";
      input.type = isPw ? "text" : "password";
      btn.innerHTML = `<i data-lucide="${isPw ? "eye-off" : "eye"}"></i>`;
      bootIcons();
    });
  });

  function scorePassword(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  }

  const newPasswordInput = document.getElementById("newPassword");
  newPasswordInput.addEventListener("input", () => {
    const score = scorePassword(newPasswordInput.value);
    const pct = newPasswordInput.value ? Math.min(100, (score / 5) * 100) : 0;
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
      newPasswordInput.value ? labels[score] : "Password strength";

    const confirmInput = document.getElementById("confirmPassword");
    if (confirmInput.value) {
      setFieldState(
        confirmField,
        confirmInput.value === newPasswordInput.value ? "valid" : "invalid",
      );
    }
  });

  wireLiveValidation(newPasswordField, (v) => v.length >= 8);
  wireLiveValidation(
    confirmField,
    (v) => v === newPasswordInput.value && v.length >= 8,
  );

  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pwOk = validateField(newPasswordField, (v) => v.length >= 8);
    const confirmOk = validateField(
      confirmField,
      (v) => v === newPasswordInput.value && v.length >= 8,
    );
    if (!pwOk || !confirmOk) return;
    const newPassword = newPasswordInput.value;
    const email = globalEmail;
    const content = {
      email,
      newPassword,
    };
    await handleResetPassword(content);
    setLoading(resetSubmit, true);
    setTimeout(() => {
      setLoading(resetSubmit, false);
      goToStep(4);
      stepDots.forEach((d) => d.classList.add("is-done"));
      stepLines.forEach((l) => l.classList.add("is-filled"));
    }, 900);
  });

  /* ---------------- Button hover micro-interactions ---------------- */
  document.querySelectorAll(".btn-block").forEach((el) => {
    el.addEventListener(
      "mouseenter",
      () =>
        window.gsap &&
        gsap.to(el, { scale: 1.015, duration: 0.18, ease: easeOut }),
    );
    el.addEventListener(
      "mouseleave",
      () =>
        window.gsap && gsap.to(el, { scale: 1, duration: 0.18, ease: easeOut }),
    );
  });

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
        ".flow-steps",
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.2",
      )
      .fromTo(
        ".flow-panel.is-active > *",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.32, stagger: 0.04 },
        "-=0.15",
      );
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    bootIcons();
    pageLoadAnimation();
  });
  const base_URL = "http://localhost:3000";
  // handle send OTP
  async function handleSendOTP(sendContent) {
    const res = await fetch(base_URL + "/api/v1/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendContent),
    });
  }
  async function handleValidateOTP(content) {
    const res = await fetch(base_URL + "/api/v1/auth/otp/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

    return res.json();
  }
  async function handleResetPassword(content) {
    const res = await fetch(base_URL + "/api/v1/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });
  }
})();
