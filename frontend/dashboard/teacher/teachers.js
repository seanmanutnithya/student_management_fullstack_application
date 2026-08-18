/* ============================================================
   TEACHERS PAGE — front-end only. No backend/database calls.
   ============================================================ */
(() => {
  "use strict";

  const easeOut = "power3.out";
  function bootIcons() {
    window.lucide && window.lucide.createIcons();
  }

  const TEACHERS = [
    {
      name: "Dr. Alan Turner",
      id: "#T-104",
      subject: "Mathematics",
      dept: "Science",
      exp: "8 yrs",
      phone: "+123 6988 567",
      avatar: "https://i.pravatar.cc/72?img=33",
    },
    {
      name: "Sarah Kim",
      id: "#T-092",
      subject: "English",
      dept: "Languages",
      exp: "5 yrs",
      phone: "+123 8988 569",
      avatar: "https://i.pravatar.cc/72?img=44",
    },
    {
      name: "Marcus Webb",
      id: "#T-071",
      subject: "Science",
      dept: "Science",
      exp: "11 yrs",
      phone: "+123 7988 566",
      avatar: "https://i.pravatar.cc/72?img=14",
    },
    {
      name: "Lena Ortiz",
      id: "#T-058",
      subject: "History",
      dept: "Humanities",
      exp: "3 yrs",
      phone: "+123 5988 565",
      avatar: "https://i.pravatar.cc/72?img=29",
    },
    {
      name: "David Chen",
      id: "#T-119",
      subject: "Computer Studies",
      dept: "Science",
      exp: "6 yrs",
      phone: "+123 9988 568",
      avatar: "https://i.pravatar.cc/72?img=52",
    },
    {
      name: "Priya Anand",
      id: "#T-063",
      subject: "Physical Education",
      dept: "Arts",
      exp: "4 yrs",
      phone: "+123 4433 221",
      avatar: "https://i.pravatar.cc/72?img=48",
    },
    {
      name: "Robert Hayes",
      id: "#T-085",
      subject: "Mathematics",
      dept: "Science",
      exp: "9 yrs",
      phone: "+123 6988 566",
      avatar: "https://i.pravatar.cc/72?img=61",
    },
    {
      name: "Nadia Farouk",
      id: "#T-102",
      subject: "English",
      dept: "Languages",
      exp: "2 yrs",
      phone: "+123 5988 569",
      avatar: "https://i.pravatar.cc/72?img=27",
    },
  ];

  const tbody = document.getElementById("teachersTbody");
  const cardsWrap = document.getElementById("teacherCards");
  const selectAllBox = document.getElementById("selectAll");

  function rowMarkup(t, i) {
    return `
      <tr data-index="${i}">
        <td class="col-check"><input type="checkbox" class="row-check" aria-label="Select ${t.name}"></td>
        <td>
          <div class="student-name-cell">
            <img class="student-avatar" src="${t.avatar}" alt="" loading="lazy">
            <span class="student-name">${t.name}</span>
          </div>
        </td>
        <td>${t.id}</td>
        <td><span class="subject-pill">${t.subject}</span></td>
        <td>${t.dept}</td>
        <td>${t.exp}</td>
        <td>${t.phone}</td>
        <td class="col-action">
          <div class="row-actions">
            <button class="row-action-btn edit" title="Edit ${t.name}" aria-label="Edit ${t.name}"><i data-lucide="pencil"></i></button>
            <button class="row-action-btn delete" title="Delete ${t.name}" aria-label="Delete ${t.name}"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      </tr>`;
  }

  function cardMarkup(t, i) {
    return `
      <div class="teacher-card" data-index="${i}">
        <div class="teacher-card-top">
          <input type="checkbox" class="row-check" aria-label="Select ${t.name}">
          <img class="student-avatar" src="${t.avatar}" alt="" loading="lazy">
          <div>
            <div class="teacher-card-name">${t.name}</div>
            <div class="teacher-card-id">${t.id} · ${t.dept}</div>
          </div>
          <div class="row-actions">
            <button class="row-action-btn edit" title="Edit ${t.name}" aria-label="Edit ${t.name}"><i data-lucide="pencil"></i></button>
            <button class="row-action-btn delete" title="Delete ${t.name}" aria-label="Delete ${t.name}"><i data-lucide="trash-2"></i></button>
          </div>
        </div>
        <dl class="teacher-card-grid">
          <div><dt>Subject</dt><dd>${t.subject}</dd></div>
          <div><dt>Experience</dt><dd>${t.exp}</dd></div>
          <div><dt>Phone</dt><dd>${t.phone}</dd></div>
        </dl>
      </div>`;
  }

  function render() {
    tbody.innerHTML = TEACHERS.map(rowMarkup).join("");
    cardsWrap.innerHTML = TEACHERS.map(cardMarkup).join("");
    bootIcons();
    wireRowSelection();
    wireRowActions();
    animateRowsIn();
  }

  function wireRowSelection() {
    document.querySelectorAll(".row-check").forEach((box) => {
      box.addEventListener("change", () => {
        const tr = box.closest("tr, .teacher-card");
        tr && tr.classList.toggle("is-selected", box.checked);
        syncSelectAll();
      });
    });
  }
  function syncSelectAll() {
    const boxes = document.querySelectorAll("#teachersTbody .row-check");
    if (!boxes.length) return;
    selectAllBox.checked = [...boxes].every((b) => b.checked);
  }
  selectAllBox.addEventListener("change", () => {
    document.querySelectorAll(".row-check").forEach((box) => {
      box.checked = selectAllBox.checked;
      const tr = box.closest("tr, .teacher-card");
      tr && tr.classList.toggle("is-selected", box.checked);
    });
  });

  let pendingDeleteEl = null;
  function wireRowActions() {
    document.querySelectorAll(".row-action-btn.edit").forEach((btn) => {
      btn.addEventListener("click", () => openModal("Edit Teacher"));
    });
    document.querySelectorAll(".row-action-btn.delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        pendingDeleteEl = btn.closest("tr, .teacher-card");
        openConfirm();
      });
    });
  }

  function animateRowsIn() {
    if (!window.gsap) return;
    const rows = document.querySelectorAll("#teachersTbody tr, .teacher-card");
    gsap.fromTo(
      rows,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: easeOut, stagger: 0.045 },
    );
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

  function wireHoverScale(selector, scale = 1.045) {
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
  wireHoverScale(".btn", 1.035);
  wireHoverScale(".icon-btn", 1.08);
  wireHoverScale(".row-action-btn", 1.12);
  wireHoverScale(".page-btn", 1.08);
  wireHoverScale(".summary-card", 1.015);

  /* ---------------- Summary counters ---------------- */
  function animateCounters() {
    document.querySelectorAll(".summary-value[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      if (window.gsap) {
        gsap.to(
          { val: 0 },
          {
            val: target,
            duration: 1,
            ease: "power2.out",
            delay: 0.15,
            onUpdate: function () {
              el.textContent = Math.round(
                this.targets()[0].val,
              ).toLocaleString();
            },
          },
        );
      } else {
        el.textContent = target.toLocaleString();
      }
    });
  }

  /* ================= FIELD VALIDATION ================= */
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
  function validateField(fieldEl, validatorFn) {
    const input = fieldEl.querySelector("input");
    const ok = validatorFn(input.value);
    setFieldState(fieldEl, ok ? "valid" : "invalid");
    if (!ok) shake(input.closest(".input-wrap") || input);
    return ok;
  }
  function wireLiveValidation(fieldEl, validatorFn) {
    const input = fieldEl.querySelector("input");
    input.addEventListener("blur", () => validateField(fieldEl, validatorFn));
    input.addEventListener("input", () => {
      if (fieldEl.classList.contains("is-invalid") && validatorFn(input.value))
        setFieldState(fieldEl, "valid");
    });
  }

  const nameField = document.querySelector('[data-field="fName"]');
  const emailField = document.querySelector('[data-field="fEmail"]');
  const phoneField = document.querySelector('[data-field="fPhone"]');
  wireLiveValidation(nameField, (v) => v.trim().length >= 2);
  wireLiveValidation(emailField, isValidEmail);
  wireLiveValidation(phoneField, isValidPhone);

  /* ---------------- Modal: Add / Edit Teacher ---------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const teacherModal = document.getElementById("teacherModal");
  const modalTitle = document.getElementById("modalTitle");
  const addTeacherBtn = document.getElementById("addTeacherBtn");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalCancelBtn = document.getElementById("modalCancelBtn");
  const modalSaveBtn = document.getElementById("modalSaveBtn");
  const teacherForm = document.getElementById("teacherForm");

  function openModal(title = "Add Teacher") {
    modalTitle.textContent = title;
    modalOverlay.style.visibility = "visible";
    if (window.gsap) {
      gsap.to(modalOverlay, { opacity: 1, duration: 0.2 });
      gsap.fromTo(
        teacherModal,
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
      gsap.to(teacherModal, {
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
          teacherForm.reset();
          resetUploadPreview();
          [nameField, emailField, phoneField].forEach((f) =>
            setFieldState(f, null),
          );
        },
      });
    } else {
      modalOverlay.style.opacity = 0;
      modalOverlay.style.visibility = "hidden";
    }
    document.body.style.overflow = "";
  }
  addTeacherBtn.addEventListener("click", () => openModal("Add Teacher"));
  modalCloseBtn.addEventListener("click", closeModal);
  modalCancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalSaveBtn.addEventListener("click", () => {
    const nameOk = validateField(nameField, (v) => v.trim().length >= 2);
    const emailOk = validateField(emailField, isValidEmail);
    const phoneOk = validateField(phoneField, isValidPhone);
    if (!(nameOk && emailOk && phoneOk)) return;

    modalSaveBtn.classList.add("is-loading");
    modalSaveBtn.disabled = true;
    setTimeout(() => {
      modalSaveBtn.classList.remove("is-loading");
      modalSaveBtn.disabled = false;
      closeModal();
      showToast("Teacher saved successfully");
    }, 900);
  });

  /* ---------------- Photo upload preview ---------------- */
  const photoInput = document.getElementById("teacherPhoto");
  const uploadPreview = document.getElementById("uploadPreview");
  function resetUploadPreview() {
    uploadPreview.innerHTML = '<i data-lucide="image-plus"></i>';
    bootIcons();
  }
  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Teacher photo preview">`;
      if (window.gsap)
        gsap.fromTo(
          uploadPreview,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        );
    };
    reader.readAsDataURL(file);
  });

  /* ---------------- Confirm delete dialog ---------------- */
  const confirmOverlay = document.getElementById("confirmOverlay");
  const confirmCancelBtn = document.getElementById("confirmCancelBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");

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
    pendingDeleteEl = null;
  }
  confirmCancelBtn.addEventListener("click", closeConfirm);
  confirmOverlay.addEventListener("click", (e) => {
    if (e.target === confirmOverlay) closeConfirm();
  });

  confirmDeleteBtn.addEventListener("click", () => {
    const el = pendingDeleteEl;
    confirmOverlay.style.visibility = "hidden";
    confirmOverlay.style.opacity = 0;
    if (el && window.gsap) {
      gsap.to(el, {
        opacity: 0,
        x: -16,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => el.remove(),
      });
    } else if (el) {
      el.remove();
    }
    pendingDeleteEl = null;
    showToast("Teacher removed", "trash-2");
  });

  deleteSelectedBtn.addEventListener("click", () => {
    const checked = document.querySelectorAll(
      "#teachersTbody .row-check:checked",
    );
    if (!checked.length) {
      showToast("Select teachers to delete first", "info");
      return;
    }
    pendingDeleteEl = null;
    openConfirm();
    confirmDeleteBtn.onclick = () => {
      confirmOverlay.style.visibility = "hidden";
      confirmOverlay.style.opacity = 0;
      checked.forEach((box) => {
        const tr = box.closest("tr");
        if (tr && window.gsap) {
          gsap.to(tr, {
            opacity: 0,
            x: -16,
            duration: 0.25,
            onComplete: () => tr.remove(),
          });
        } else if (tr) {
          tr.remove();
        }
      });
      showToast(`${checked.length} teacher(s) removed`, "trash-2");
    };
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
        ".summary-card",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
        "-=0.2",
      )
      .fromTo(
        ".card",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.15",
      );
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    bootIcons();
    render();
    animateCounters();
    pageLoadAnimation();
  });
})();
