/* ============================================================
   OTP VERIFICATION — front-end only. No backend/database calls.
   Demo rule: code "1234" simulates success, anything else errors.
   ============================================================ */
(() => {
  "use strict";

  const easeOut = "power3.out";

  function bootIcons() {
    window.lucide && window.lucide.createIcons();
  }

  const boxes = [...document.querySelectorAll(".otp-box")];
  const otpForm = document.getElementById("otpForm");
  const otpError = document.getElementById("otpError");
  const otpSubmit = document.getElementById("otpSubmit");
  const otpBack = document.getElementById("otpBack");
  const authCard = document.getElementById("authCard");

  /* ---------------- Digit input behavior ---------------- */
  function setBoxState(box, state) {
    // 'filled' | 'invalid' | 'valid' | null
    box.classList.remove("is-filled", "is-invalid", "is-valid");
    if (state) box.classList.add(`is-${state}`);
  }

  function clearErrorState() {
    otpError.classList.remove("is-visible");
    boxes.forEach((b) => {
      if (b.classList.contains("is-invalid"))
        setBoxState(b, b.value ? "filled" : null);
    });
  }
  const signupEmail = sessionStorage.getItem("pendingSignupEmail");
  if (!signupEmail) {
    window.location.href = "../auth/auth.html";
    return;
  }
  document.getElementById("otpTarget").textContent = signupEmail;
  boxes.forEach((box, i) => {
    box.addEventListener("input", () => {
      const digitsOnly = box.value.replace(/[^0-9]/g, "");
      box.value = digitsOnly.slice(-1);

      if (box.value) {
        setBoxState(box, "filled");
        clearErrorState();
        if (i < boxes.length - 1) {
          boxes[i + 1].focus();
        } else {
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
          boxes[i - 1].focus();
          boxes[i - 1].value = "";
          setBoxState(boxes[i - 1], null);
          e.preventDefault();
        } else {
          setBoxState(box, null);
        }
        clearErrorState();
      } else if (e.key === "ArrowLeft" && i > 0) {
        e.preventDefault();
        boxes[i - 1].focus();
      } else if (e.key === "ArrowRight" && i < boxes.length - 1) {
        e.preventDefault();
        boxes[i + 1].focus();
      }
    });

    box.addEventListener("focus", () => box.select());

    box.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/[^0-9]/g, "");
      if (!pasted) return;
      const chars = pasted.slice(0, boxes.length).split("");
      chars.forEach((ch, idx) => {
        boxes[idx].value = ch;
        setBoxState(boxes[idx], "filled");
      });
      clearErrorState();
      const nextEmpty = boxes.findIndex((b) => !b.value);
      (nextEmpty === -1 ? boxes[boxes.length - 1] : boxes[nextEmpty]).focus();
      if (chars.length === boxes.length) maybeAutoSubmit();
    });
  });

  function getCode() {
    return boxes.map((b) => b.value).join("");
  }

  function maybeAutoSubmit() {
    if (getCode().length === boxes.length) {
      otpForm.requestSubmit ?
        otpForm.requestSubmit()
      : otpForm.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  }

  /* ---------------- Shake on invalid ---------------- */
  function shakeBoxes() {
    if (!window.gsap) return;
    gsap.fromTo(
      ".otp-input-group",
      { x: 0 },
      {
        x: 9,
        duration: 0.06,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => gsap.set(".otp-input-group", { x: 0 }),
      },
    );
  }

  /* ---------------- Loading / toast helpers ---------------- */
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

  /* ---------------- Submit  ---------------- */
  otpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = getCode();

    if (code.length < boxes.length) {
      otpError.querySelector("span").textContent = "Please enter all 4 digits.";
      otpError.classList.add("is-visible");
      boxes.forEach((b) => setBoxState(b, b.value ? "filled" : "invalid"));
      shakeBoxes();
      boxes.find((b) => !b.value)?.focus();
      return;
    }

    setLoading(otpSubmit, true);

    setTimeout(async () => {
      setLoading(otpSubmit, false);

      const result = await handleValidateVerifyCode({
        email: signupEmail,
        verifyCode: code,
      });

      if (result.status) {
        boxes.forEach((b) => setBoxState(b, "valid"));
        showToast("Identity verified — redirecting…");
        window.location.href = "../dashboard/index.html";
        if (window.gsap) {
          gsap.to(authCard, {
            opacity: 0,
            y: -16,
            duration: 0.35,
            delay: 0.5,
            ease: "power2.in",
          });
        }
      } else {
        otpError.querySelector("span").textContent =
          result.message || "That code isn't right. Please try again.";
        otpError.classList.add("is-visible");
        boxes.forEach((b) => setBoxState(b, "invalid"));
        shakeBoxes();
        showToast("Verification failed", "alert-circle");
        setTimeout(() => {
          boxes.forEach((b) => {
            b.value = "";
            setBoxState(b, null);
          });
          boxes[0].focus();
        }, 400);
      }
    }, 900);
  });

  /* ---------------- Resend countdown ---------------- */
  const resendIdle = document.getElementById("resendIdle");
  const resendTimerEl = document.getElementById("resendTimer");
  const resendBtn = document.getElementById("resendBtn");
  const timerValue = document.getElementById("timerValue");
  let secondsLeft = 60;
  let countdownId = null;

  function startCountdown() {
    secondsLeft = 60;
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
    boxes.forEach((b) => {
      b.value = "";
      setBoxState(b, null);
    });
    otpError.classList.remove("is-visible");
    boxes[0].focus();
    showToast("A new code has been sent");
    startCountdown();
  });

  /* ---------------- Back / edit-target (UI only) ---------------- */
  otpBack.addEventListener("click", () => {
    if (window.gsap) {
      gsap.to(authCard, {
        opacity: 0,
        x: -16,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          window.location.href = "auth.html";
        },
      });
    } else {
      window.location.href = "auth.html";
    }
  });
  document
    .getElementById("otpEditTarget")
    .addEventListener("click", () => otpBack.click());

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
        boxes,
        { opacity: 0, y: 14, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06 },
        "-=0.2",
      )
      .fromTo(
        ".otp-resend, .otp-hint",
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
        "-=0.1",
      )
      .add(() => boxes[0].focus());
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    bootIcons();
    pageLoadAnimation();
    startCountdown();
  });
  const base_URL = "http://localhost:3000";
  async function handleValidateVerifyCode(verifyContent) {
    const res = await fetch(base_URL + "/api/v1/auth/signup/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyContent),
    });

    return res.json();
  }
})();
