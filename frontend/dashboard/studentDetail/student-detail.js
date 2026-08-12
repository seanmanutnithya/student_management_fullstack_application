/* ============================================================
   STUDENT DETAIL PAGE — front-end only. No backend/database calls.
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

  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  /* ---------------- Hover micro-interactions ---------------- */
  function wireHoverScale(selector, scale = 1.035) {
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
  wireHoverScale(".btn", 1.03);
  wireHoverScale(".icon-btn", 1.08);
  wireHoverScale(".document-card", 1.015);

  /* ---------------- Tabs ---------------- */
  const tabs = [...document.querySelectorAll(".detail-tab")];
  const panels = [...document.querySelectorAll(".detail-panel")];
  const tabIndicator = document.getElementById("tabIndicator");

  function moveIndicator(tabEl, animate = true) {
    const parentRect = tabEl.parentElement.getBoundingClientRect();
    const rect = tabEl.getBoundingClientRect();
    const x = rect.left - parentRect.left;
    const width = rect.width;
    if (window.gsap && animate) {
      gsap.to(tabIndicator, { x, width, duration: 0.32, ease: easeOut });
    } else {
      tabIndicator.style.transform = `translateX(${x}px)`;
      tabIndicator.style.width = width + "px";
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      moveIndicator(tab);

      const targetPanel = panels.find(
        (p) => p.dataset.panel === tab.dataset.tab,
      );
      const activePanel = panels.find((p) => p.classList.contains("is-active"));
      if (targetPanel === activePanel) return;

      if (window.gsap) {
        gsap.to(activePanel, {
          opacity: 0,
          y: 6,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            activePanel.classList.remove("is-active");
            targetPanel.classList.add("is-active");
            gsap.fromTo(
              targetPanel,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.3, ease: easeOut },
            );
            bootIcons();
          },
        });
      } else {
        activePanel.classList.remove("is-active");
        targetPanel.classList.add("is-active");
      }
    });
  });

  /* ---------------- Attendance ring ---------------- */
  function animateRing(pct) {
    const ring = document.getElementById("attendanceRing");
    const valueEl = document.getElementById("attendanceValue");
    const circumference = 2 * Math.PI * 34; // r=34
    const offset = circumference - (pct / 100) * circumference;

    if (window.gsap) {
      gsap.to(ring, {
        strokeDashoffset: offset,
        duration: 1.1,
        ease: "power2.out",
        delay: 0.3,
      });
      gsap.to(
        { val: 0 },
        {
          val: pct,
          duration: 1.1,
          delay: 0.3,
          ease: "power2.out",
          onUpdate: function () {
            valueEl.textContent = Math.round(this.targets()[0].val) + "%";
          },
        },
      );
    } else {
      ring.style.strokeDashoffset = offset;
      valueEl.textContent = pct + "%";
    }
  }

  /* ---------------- Attendance calendar + bar chart ---------------- */
  function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    const daysInMonth = 30;
    const startOffset = 3; // month starts on a Thursday, for visual variety
    const statuses = [];
    for (let i = 0; i < daysInMonth; i++) {
      const r = Math.random();
      statuses.push(
        r > 0.9 ? "absent"
        : r > 0.8 ? "late"
        : "present",
      );
    }

    let html = "";
    for (let i = 0; i < startOffset; i++)
      html += `<span class="calendar-cell is-empty"></span>`;
    statuses.forEach((status, i) => {
      html += `<span class="calendar-cell is-${status}" title="Day ${i + 1}: ${status}">${i + 1}</span>`;
    });
    grid.innerHTML = html;

    if (window.gsap) {
      gsap.fromTo(
        grid.children,
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: 0.012,
          ease: "back.out(2)",
          delay: 0.2,
        },
      );
    }
  }

  function renderAttendanceBars() {
    const wrap = document.getElementById("attendanceBars");
    const months = [
      { label: "Mar", pct: 88 },
      { label: "Apr", pct: 94 },
      { label: "May", pct: 79 },
      { label: "Jun", pct: 97 },
      { label: "Jul", pct: 91 },
      { label: "Aug", pct: 96 },
    ];
    wrap.innerHTML = months
      .map(
        (m) => `
      <div class="attendance-bar-col">
        <div class="attendance-bar" data-pct="${m.pct}"></div>
        <span class="attendance-bar-label">${m.label}</span>
      </div>`,
      )
      .join("");

    const bars = [...wrap.querySelectorAll(".attendance-bar")];
    if (window.gsap) {
      gsap.to(bars, {
        height: (i, el) => el.dataset.pct + "%",
        duration: 0.8,
        stagger: 0.08,
        ease: easeOut,
        delay: 0.2,
      });
    } else {
      bars.forEach((b) => (b.style.height = b.dataset.pct + "%"));
    }
  }

  /* ---------------- Results table ---------------- */
  function renderResults() {
    const data = [
      {
        subject: "Mathematics",
        term: "Term 2",
        marks: "88 / 100",
        grade: "A",
        pct: 88,
      },
      {
        subject: "English",
        term: "Term 2",
        marks: "76 / 100",
        grade: "B+",
        pct: 76,
      },
      {
        subject: "Science",
        term: "Term 2",
        marks: "91 / 100",
        grade: "A+",
        pct: 91,
      },
      {
        subject: "History",
        term: "Term 2",
        marks: "69 / 100",
        grade: "B-",
        pct: 69,
      },
      {
        subject: "Computer Studies",
        term: "Term 2",
        marks: "95 / 100",
        grade: "A+",
        pct: 95,
      },
    ];
    const tbody = document.getElementById("resultsBody");
    tbody.innerHTML = data
      .map(
        (row) => `
      <tr>
        <td>${row.subject}</td>
        <td>${row.term}</td>
        <td>${row.marks}</td>
        <td><span class="grade-pill">${row.grade}</span></td>
        <td class="col-progress">
          <div class="progress-bar-track"><span class="progress-bar-fill" data-pct="${row.pct}"></span></div>
        </td>
      </tr>`,
      )
      .join("");

    const fills = [...tbody.querySelectorAll(".progress-bar-fill")];
    if (window.gsap) {
      gsap.to(fills, {
        width: (i, el) => el.dataset.pct + "%",
        duration: 0.7,
        stagger: 0.06,
        ease: easeOut,
        delay: 0.15,
      });
    } else {
      fills.forEach((f) => (f.style.width = f.dataset.pct + "%"));
    }
  }

  /* ---------------- Fees table ---------------- */
  function renderFees() {
    const data = [
      {
        invoice: "#INV-1042",
        desc: "Term 2 tuition fee",
        date: "02 Jun 2026",
        amount: "$420.00",
        status: "paid",
      },
      {
        invoice: "#INV-1039",
        desc: "Library & lab fee",
        date: "15 May 2026",
        amount: "$60.00",
        status: "paid",
      },
      {
        invoice: "#INV-1045",
        desc: "Term 3 tuition fee",
        date: "01 Sep 2026",
        amount: "$420.00",
        status: "due",
      },
      {
        invoice: "#INV-1030",
        desc: "Transport fee — Q2",
        date: "10 Apr 2026",
        amount: "$95.00",
        status: "pending",
      },
    ];
    const icons = {
      paid: "check-circle-2",
      due: "alert-circle",
      pending: "clock",
    };
    const labels = { paid: "Paid", due: "Due", pending: "Pending" };

    document.getElementById("feesBody").innerHTML = data
      .map(
        (row) => `
      <tr>
        <td>${row.invoice}</td>
        <td>${row.desc}</td>
        <td>${row.date}</td>
        <td>${row.amount}</td>
        <td><span class="fee-status fee-status--${row.status}"><i data-lucide="${icons[row.status]}"></i>${labels[row.status]}</span></td>
      </tr>`,
      )
      .join("");
    bootIcons();
  }

  /* ---------------- Documents ---------------- */
  function renderDocuments() {
    const docs = [
      { name: "Birth Certificate.pdf", size: "1.2 MB", icon: "file-text" },
      { name: "Admission Form.pdf", size: "840 KB", icon: "file-text" },
      {
        name: "Report Card - Term 1.pdf",
        size: "540 KB",
        icon: "file-bar-chart",
      },
      { name: "ID Photo.jpg", size: "210 KB", icon: "image" },
      { name: "Medical Record.pdf", size: "1.8 MB", icon: "file-heart" },
      { name: "Transfer Certificate.pdf", size: "670 KB", icon: "file-text" },
    ];
    document.getElementById("documentGrid").innerHTML = docs
      .map(
        (d) => `
      <div class="document-card">
        <div class="document-icon"><i data-lucide="${d.icon}"></i></div>
        <div class="document-info">
          <div class="document-name">${d.name}</div>
          <div class="document-meta">${d.size}</div>
        </div>
        <div class="document-actions">
          <button class="row-action-btn edit" title="View" aria-label="View ${d.name}"><i data-lucide="eye"></i></button>
          <button class="row-action-btn edit" title="Download" aria-label="Download ${d.name}"><i data-lucide="download"></i></button>
        </div>
      </div>`,
      )
      .join("");
    bootIcons();
  }

  /* ================= EDIT MODAL — validation ================= */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^\+?[0-9][0-9\s\-]{6,14}$/;
  function isValidEmail(v) {
    return EMAIL_RE.test(v.trim());
  }
  function isValidPhone(v) {
    const digits = v.replace(/[^\d]/g, "");
    return PHONE_RE.test(v.trim()) && digits.length >= 7 && digits.length <= 15;
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
  function validateField(fieldEl, validatorFn, { required = true } = {}) {
    const input = fieldEl.querySelector("input");
    const value = input.value;
    if (!value.trim()) {
      setFieldState(fieldEl, required ? "invalid" : "neutral");
      if (required) shake(input.closest(".input-wrap") || input);
      return !required;
    }
    const ok = validatorFn(value);
    setFieldState(fieldEl, ok ? "valid" : "invalid");
    if (!ok) shake(input.closest(".input-wrap") || input);
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

  const editNameField = document.querySelector('[data-field="editName"]');
  const editEmailField = document.querySelector('[data-field="editEmail"]');
  const editPhoneField = document.querySelector('[data-field="editPhone"]');
  const editAddressField = document.querySelector('[data-field="editAddress"]');
  const editGuardianPhoneField = document.querySelector(
    '[data-field="editGuardianPhone"]',
  );

  wireLiveValidation(editNameField, (v) => v.trim().length >= 2);
  wireLiveValidation(editEmailField, isValidEmail);
  wireLiveValidation(editPhoneField, isValidPhone);
  wireLiveValidation(editAddressField, (v) => v.trim().length >= 3);
  wireLiveValidation(editGuardianPhoneField, isValidPhone);

  /* ---------------- Modal open/close ---------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const editModal = document.getElementById("editModal");
  const editStudentBtn = document.getElementById("editStudentBtn");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalCancelBtn = document.getElementById("modalCancelBtn");
  const modalSaveBtn = document.getElementById("modalSaveBtn");

  function openModal() {
    modalOverlay.style.visibility = "visible";
    if (window.gsap) {
      gsap.to(modalOverlay, { opacity: 1, duration: 0.2 });
      gsap.fromTo(
        editModal,
        { y: 24, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.32, ease: easeOut },
      );
    } else {
      modalOverlay.style.opacity = 1;
    }
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (window.gsap) {
      gsap.to(editModal, {
        y: 16,
        opacity: 0,
        scale: 0.98,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(modalOverlay, {
        opacity: 0,
        duration: 0.22,
        delay: 0.03,
        onComplete: () => {
          modalOverlay.style.visibility = "hidden";
        },
      });
    } else {
      modalOverlay.style.opacity = 0;
      modalOverlay.style.visibility = "hidden";
    }
    document.body.style.overflow = "";
  }
  editStudentBtn.addEventListener("click", openModal);
  modalCloseBtn.addEventListener("click", closeModal);
  modalCancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  /* Photo upload preview */
  const editPhoto = document.getElementById("editPhoto");
  const uploadPreview = document.getElementById("uploadPreview");
  editPhoto.addEventListener("change", () => {
    const file = editPhoto.files && editPhoto.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadPreview.innerHTML = `<img src="${e.target.result}" alt="">`;
      if (window.gsap)
        gsap.fromTo(
          uploadPreview,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        );
    };
    reader.readAsDataURL(file);
  });

  modalSaveBtn.addEventListener("click", () => {
    const nameOk = validateField(editNameField, (v) => v.trim().length >= 2);
    const emailOk = validateField(editEmailField, isValidEmail);
    const phoneOk = validateField(editPhoneField, isValidPhone);
    const addressOk = validateField(
      editAddressField,
      (v) => v.trim().length >= 3,
    );
    const guardianOk = validateField(editGuardianPhoneField, isValidPhone);

    if (!(nameOk && emailOk && phoneOk && addressOk && guardianOk)) return;

    modalSaveBtn.classList.add("is-loading");
    modalSaveBtn.disabled = true;

    setTimeout(() => {
      modalSaveBtn.classList.remove("is-loading");
      modalSaveBtn.disabled = false;

      // Reflect the (unsaved / UI-only) changes onto the profile header for visual feedback
      document.querySelector(".profile-name").textContent =
        document.getElementById("editName").value;
      document.querySelector(
        ".profile-contact-row .profile-contact:nth-child(1)",
      ).lastChild.textContent = document.getElementById("editEmail").value;
      document.querySelector(
        ".profile-contact-row .profile-contact:nth-child(2)",
      ).lastChild.textContent = document.getElementById("editPhone").value;
      const newPhotoSrc = uploadPreview.querySelector("img")?.src;
      if (newPhotoSrc)
        document.getElementById("profileAvatar").src = newPhotoSrc;

      closeModal();
      showToast("Student details updated");
    }, 900);
  });

  /* ---------------- Delete confirm ---------------- */
  const confirmOverlay = document.getElementById("confirmOverlay");
  const confirmCancelBtn = document.getElementById("confirmCancelBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const deleteStudentBtn = document.getElementById("deleteStudentBtn");

  function openConfirm() {
    confirmOverlay.style.visibility = "visible";
    const dialog = confirmOverlay.querySelector(".modal");
    if (window.gsap) {
      gsap.to(confirmOverlay, { opacity: 1, duration: 0.2 });
      gsap.fromTo(
        dialog,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(1.6)" },
      );
    } else {
      confirmOverlay.style.opacity = 1;
    }
  }
  function closeConfirm() {
    if (window.gsap) {
      gsap.to(confirmOverlay, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => (confirmOverlay.style.visibility = "hidden"),
      });
    } else {
      confirmOverlay.style.opacity = 0;
      confirmOverlay.style.visibility = "hidden";
    }
  }
  deleteStudentBtn.addEventListener("click", openConfirm);
  confirmCancelBtn.addEventListener("click", closeConfirm);
  confirmOverlay.addEventListener("click", (e) => {
    if (e.target === confirmOverlay) closeConfirm();
  });
  confirmDeleteBtn.addEventListener("click", () => {
    closeConfirm();
    showToast("Student removed (UI demo only)", "trash-2");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 900);
  });

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
        "#profileHeader",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.15",
      )
      .fromTo(
        ".stat-card",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
        "-=0.2",
      )
      .fromTo(
        ".tab-card",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.15",
      );
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    bootIcons();
    renderCalendar();
    renderAttendanceBars();
    renderResults();
    renderFees();
    renderDocuments();
    animateRing(92);
    requestAnimationFrame(() =>
      moveIndicator(document.querySelector(".detail-tab.is-active"), false),
    );
    pageLoadAnimation();
    window.addEventListener("resize", () =>
      moveIndicator(document.querySelector(".detail-tab.is-active"), false),
    );
  });
})();
