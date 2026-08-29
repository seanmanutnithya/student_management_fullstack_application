/* ============================================================
   STUDENT MANAGEMENT DASHBOARD — front-end only
   CRUD buttons are wired for UI/animation only; no real
   create/update/delete logic or persistence is implemented.
   ============================================================ */
(async () => {
  "use strict";

  /* ---------------- Seed data ---------------- */

  const tbody = document.getElementById("studentsTbody");
  const cardsWrap = document.getElementById("studentCards");
  const selectAllBox = document.getElementById("selectAll");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const toastEl = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");

  const easeOut = "power3.out";

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

    if (currentMode === "update") {
      const studentData = { name, id, gender, std_class, phone, remark };
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
      const studentData = { name, id, gender, std_class, phone };

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

  /* ---------------- Toast ---------------- */

  /* ---------------- Init ---------------- */
  let STUDENTS = [];
  async function init() {
    STUDENTS = await getAllData();
    bootIcons();
    render();
    // usePageLoadAnimation();
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
