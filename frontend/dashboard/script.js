/* ============================================================
   STUDENT MANAGEMENT DASHBOARD — front-end only
   CRUD buttons are wired for UI/animation only; no real
   create/update/delete logic or persistence is implemented.
   ============================================================ */
(async () => {
  "use strict";

  /* ---------------- Seed data ---------------- */
  const base_URL = "http://localhost:3000";
  async function getAllData() {
    const res = await fetch(base_URL + "/api/v1/student/get/all");

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }
    const data = await res.json();

    return data.students;
  }

  const tbody = document.getElementById("studentsTbody");
  const cardsWrap = document.getElementById("studentCards");
  const selectAllBox = document.getElementById("selectAll");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const toastEl = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");

  const easeOut = "power3.out";

  /* ---------------- Icon boot ---------------- */
  function bootIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* ---------------- Render: table rows ---------------- */
  // <img class="student-avatar" src="${s.image_url}" alt="" loading="lazy">
  function rowMarkup(s, i) {
    return `
      <tr data-index="${i}">
        <td class="col-check"><input type="checkbox" class="row-check" aria-label="Select ${s.name}"></td>
        <td>
          <div class="student-name-cell">
            <span class="student-name">${s.name}</span>
          </div>
        </td>
        <td>${s.id}</td>
        <td>${s.gender}</td>
        <td>${s.std_class}</td>
        <td>${s.phone}</td>
        <td>${s.remark == null ? "" : s.remark}</td>
        <td class="col-action">
          <div class="row-actions">
            <button class="row-action-btn edit" title="Edit ${s.name}" aria-label="Edit ${s.name}">
              <i data-lucide="pencil"></i>
            </button>
            <button class="row-action-btn delete" title="Delete ${s.name}" aria-label="Delete ${s.name}" >
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>`;
  }
  // <img class="student-avatar" src="${s.image_url}" alt="" loading="lazy">
  function cardMarkup(s, i) {
    return `
      <div class="student-card" data-index="${i}">
        <div class="student-card-top">
          <input type="checkbox" class="row-check" aria-label="Select ${s.name}">
          <div>
            <div class="student-card-name">${s.name}</div>
            <div class="student-card-roll">Roll ${s.std_class} · Class ${s.std_class}</div>
          </div>
          <div class="row-actions">
            <button class="row-action-btn edit" title="Edit ${s.name}" aria-label="Edit ${s.name}">
              <i data-lucide="pencil"></i>
            </button>
            <button class="row-action-btn delete" title="Delete ${s.name}" aria-label="Delete ${s.name}">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
        <dl class="student-card-grid">
          <div><dt>Address</dt><dd>${s.gender}</dd></div>
          <div><dt>Date of birth</dt><dd>${s.phone}</dd></div>
          <div><dt>Phone</dt><dd>${s.remark}</dd></div>
        </dl>
      </div>`;
  }

  function render() {
    tbody.innerHTML = STUDENTS.map(rowMarkup).join("");
    cardsWrap.innerHTML = STUDENTS.map(cardMarkup).join("");
    bootIcons();
    wireRowSelection();
    wireRowActions();
    animateRowsIn();
  }

  /* ---------------- Row selection ---------------- */
  function wireRowSelection() {
    document.querySelectorAll(".row-check").forEach((box) => {
      box.addEventListener("change", () => {
        const tr = box.closest("tr, .student-card");
        tr && tr.classList.toggle("is-selected", box.checked);
        syncSelectAll();
      });
    });
  }

  function syncSelectAll() {
    const boxes = document.querySelectorAll("#studentsTbody .row-check");
    if (!boxes.length) return;
    const allChecked = [...boxes].every((b) => b.checked);
    selectAllBox.checked = allChecked;
  }

  selectAllBox.addEventListener("change", () => {
    document.querySelectorAll(".row-check").forEach((box) => {
      box.checked = selectAllBox.checked;
      const tr = box.closest("tr, .student-card");
      tr && tr.classList.toggle("is-selected", box.checked);
    });
  });

  /* ---------------- Row actions (UI + animation only) ---------------- */
  let pendingDeleteEl = null;
  let pendingEditEle = null;

  function wireRowActions() {
    document.querySelectorAll(".row-action-btn.edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        pendingEditEle = btn.closest("tr , .student-card");
        currentMode = "update";
        const index = pendingEditEle.dataset.index;
        const student = STUDENTS[index];
        document.getElementById("studentName").value = student.name;
        document.getElementById("studentId").value = student.id;
        document.getElementById("studentGender").value = student.gender;
        document.getElementById("studentClass").value = student.std_class;
        document.getElementById("studentPhone").value = student.phone;
        document.getElementById("studentRemark").value = student.remark ?? "";

        openModal("Edit Student");
      });
    });
    document.querySelectorAll(".row-action-btn.delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentMode = "edit";
        pendingDeleteEl = btn.closest("tr, .student-card");
        openConfirm();
      });
    });
  }

  function animateRowsIn() {
    if (!window.gsap) return;
    const rows = document.querySelectorAll("#studentsTbody tr, .student-card");
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

  /* ---------------- Sidebar submenu toggle ---------------- */
  document.querySelectorAll(".nav-parent").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".nav-group");
      if (!group) return;
      const isOpen = group.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.querySelectorAll(".nav-item, .nav-subitem").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.classList.contains("nav-parent")) return;
      document
        .querySelectorAll(".nav-subitem.is-active")
        .forEach((a) => a.classList.remove("is-active"));
      if (item.classList.contains("nav-subitem"))
        item.classList.add("is-active");
    });
  });

  /* ---------------- Button hover micro-interactions ---------------- */
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
      el.addEventListener(
        "mousedown",
        () =>
          window.gsap && gsap.to(el, { scale: scale * 0.94, duration: 0.1 }),
      );
      el.addEventListener(
        "mouseup",
        () => window.gsap && gsap.to(el, { scale, duration: 0.1 }),
      );
    });
  }
  wireHoverScale(".btn", 1.035);
  wireHoverScale(".icon-btn", 1.08);
  wireHoverScale(".row-action-btn", 1.12);
  wireHoverScale(".page-btn", 1.08);

  /* ---------------- Input focus animation ---------------- */
  document
    .querySelectorAll(".search-field, .field input, .field select")
    .forEach((el) => {
      const target = el.classList.contains("search-field") ? el : el;
      el.addEventListener(
        "focus",
        () =>
          window.gsap &&
          gsap.fromTo(
            target,
            { y: 0 },
            { y: -1, duration: 0.15, ease: easeOut },
          ),
      );
    });

  /* ---------------- Modal: Add / Edit Student ---------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const studentModal = document.getElementById("studentModal");
  const modalTitle = document.getElementById("modalTitle");
  const addStudentBtn = document.getElementById("addStudentBtn");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalCancelBtn = document.getElementById("modalCancelBtn");
  const modalSaveBtn = document.getElementById("modalSaveBtn");
  const studentForm = document.getElementById("studentForm");

  function openModal(title = "Add Student") {
    modalTitle.textContent = title;
    modalOverlay.style.visibility = "visible";
    if (window.gsap) {
      gsap.to(modalOverlay, { opacity: 1, duration: 0.2 });
      gsap.fromTo(
        studentModal,
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
      gsap.to(studentModal, {
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
          studentForm.reset();
          // resetUploadPreview();
        },
      });
    } else {
      modalOverlay.style.opacity = 0;
      modalOverlay.style.visibility = "hidden";
    }
    document.body.style.overflow = "";
  }

  // add student button
  let currentMode = null;

  addStudentBtn.addEventListener("click", () => {
    currentMode = "add";
    pendingEditEle = null;
    studentForm.reset();
    openModal("Add Student");
  });

  modalCloseBtn.addEventListener("click", closeModal);
  modalCancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  // save student button
  modalSaveBtn.addEventListener("click", async () => {
    const name = document.getElementById("studentName").value;
    const id = document.getElementById("studentId").value;
    const gender = document.getElementById("studentGender").value;
    const std_class = document.getElementById("studentClass").value;
    const phone = document.getElementById("studentPhone").value;
    const remark = document.getElementById("studentRemark").value;

    const studentData = { name, id, gender, std_class, phone };
    if (currentMode === "update") {
      const el = pendingEditEle;
      const index = el.dataset.index;

      STUDENTS[index] = { ...STUDENTS[index], ...studentData };
      const targetId = STUDENTS[index].id;
      await handleUpdateStudent(targetId, studentData);

      render();
      closeModal();
      runLoading(() =>
        showToast("Student saved successfully", "check-circle-2"),
      );
    } else if (currentMode === "add") {
      try {
        await handleAddNewStudent(studentData);
        STUDENTS.push(studentData);
        render();
        closeModal();
        runLoading(() =>
          showToast("Student added successfully", "check-circle-2"),
        );
      } catch (error) {
        runLoading(() => showToast("Missing information", "info"));
        throw new Error(`Internal server error ${error.message}`);
        return;
      }
    }

    // showToast("Failed to update", "info");
    // throw new Error("Failed to update!");
  });

  /* ---------------- Photo upload preview ---------------- */
  // const photoInput = document.getElementById("studentPhoto");
  // const uploadPreview = document.getElementById("uploadPreview");

  // function resetUploadPreview() {
  //   uploadPreview.innerHTML = '<i data-lucide="image-plus"></i>';
  //   bootIcons();
  // }

  // photoInput.addEventListener("change", () => {
  //   const file = photoInput.files && photoInput.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Student photo preview">`;
  //     if (window.gsap)
  //       gsap.fromTo(
  //         uploadPreview,
  //         { scale: 0.8, opacity: 0 },
  //         { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
  //       );
  //   };
  //   reader.readAsDataURL(file);
  // });

  /* ---------------- Confirm delete dialog ---------------- */
  const confirmOverlay = document.getElementById("confirmOverlay");
  const confirmCancelBtn = document.getElementById("confirmCancelBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const deleteSelectestudnetIDBtn = document.getElementById(
    "deleteSelectestudnetIDBtn",
  );

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

  confirmDeleteBtn.addEventListener("click", async () => {
    const el = pendingDeleteEl;
    confirmOverlay.style.visibility = "hidden";
    confirmOverlay.style.opacity = 0;

    try {
      if (!el) return;
      const index = el.dataset.index;
      const student = STUDENTS[index];
      await handleDeleteStudent(student.id);

      if (window.gsap) {
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
          onComplete: () => {
            el.remove();
          },
        });
      } else if (el) {
        el.remove();
      }
    } catch (error) {
      console.error(error);
      showToast("Select students to delete first", "info");
    }
    pendingDeleteEl = null;
    showToast("Student removed", "trash-2");
  });

  deleteSelectestudnetIDBtn.addEventListener("click", () => {
    const checked = document.querySelectorAll(
      "#studentsTbody .row-check:checked",
    );
    if (!checked.length) {
      showToast("Select students to delete first", "info");
      return;
    }
    pendingDeleteEl = null;
    openConfirm();

    confirmDeleteBtn.onclick = async () => {
      confirmOverlay.style.visibility = "hidden";
      confirmOverlay.style.opacity = 0;

      const idsToDelete = [];
      checked.forEach((box) => {
        const tr = box.closest("tr");
        const index = tr.dataset.index;
        idsToDelete.push(STUDENTS[index].id);
      });

      try {
        await Promise.all(idsToDelete.map((id) => handleDeleteStudent(id)));
        STUDENTS = STUDENTS.filter((s) => !idsToDelete.includes(s.id));
        render();
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

          showToast(`${checked.length} student(s) removed`, "trash-2");
        });
      } catch (error) {
        console.error(error);
        showToast("Failed to delete selected students", "info");
      }
    };
  });

  /* ---------------- Loading overlay ---------------- */
  function runLoading(callback, duration = 550) {
    loadingOverlay.style.visibility = "visible";
    if (window.gsap) {
      gsap.fromTo(
        loadingOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.18 },
      );
      gsap.fromTo(
        ".spinner",
        { rotate: 0 },
        { rotate: 360, duration: 0.7, repeat: 1, ease: "none" },
      );
    } else {
      loadingOverlay.style.opacity = 1;
    }
    setTimeout(() => {
      if (window.gsap) {
        gsap.to(loadingOverlay, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            loadingOverlay.style.visibility = "hidden";
            callback && callback();
          },
        });
      } else {
        loadingOverlay.style.opacity = 0;
        loadingOverlay.style.visibility = "hidden";
        callback && callback();
      }
    }, duration);
  }

  /* ---------------- Toast ---------------- */
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
      gsap.set(toastEl, { pointerEvents: "auto" });
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
          onComplete: () => gsap.set(toastEl, { pointerEvents: "none" }),
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
      ".sidebar-brand",
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.4 },
    )
      .fromTo(
        ".sidebar-nav .nav-item, .sidebar-nav .nav-group",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.035 },
        "-=0.2",
      )
      .fromTo(
        ".topbar, .mobile-topbar",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.35 },
        "-=0.35",
      )
      .fromTo(
        ".page-head",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.15",
      )
      .fromTo(
        ".card",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45 },
        "-=0.2",
      );
  }

  /* ---------------- Init ---------------- */
  let STUDENTS = [];
  async function init() {
    STUDENTS = await getAllData();
    bootIcons();
    render();
    pageLoadAnimation();
  }

  document.addEventListener("DOMContentLoaded", init);

  // intergrate with backend
  async function handleDeleteStudent(targetId) {
    const res = await fetch(base_URL + `/api/v1/student/delete/${targetId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Delete failed with status ${res.status}`);
    }
    return res.json();
  }

  async function handleUpdateStudent(targetId, updateData) {
    const res = await fetch(base_URL + `/api/v1/student/update/${targetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      throw new Error(`Update failed with status ${res.status}`);
    }
    return res.json();
  }

  async function handleAddNewStudent(student) {
    const res = await fetch(base_URL + "/api/v1/student/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    if (!res.ok) {
      throw new Error(`Create failed with status ${res.status}`);
    }
    return res.json();
  }
})();
