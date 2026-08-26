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

/* ---------------- Greeting + live date ---------------- */
function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning"
    : hour < 18 ? "Good afternoon"
    : "Good evening";
  document.getElementById("greetingTitle").textContent =
    `${greeting}, Priscilla`;

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("greetingDate").textContent =
    `${dateStr} · ${timeStr}`;
}

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

/* ---------------- Quick lists ---------------- */
function renderQuickLists() {
  const absentees = [
    {
      name: "Marcus Lee",
      meta: "Class 04 · 5 days absent",
      avatar: 18,
      tag: "5",
      tagType: "danger",
    },
    {
      name: "Guy Hawkins",
      meta: "Class 02 · 4 days absent",
      avatar: 12,
      tag: "4",
      tagType: "danger",
    },
    {
      name: "Aiden Brooks",
      meta: "Class 03 · 3 days absent",
      avatar: 60,
      tag: "3",
      tagType: "warning",
    },
  ];
  const defaulters = [
    {
      name: "Jane Cooper",
      meta: "Term 3 tuition",
      avatar: 25,
      tag: "$420",
      tagType: "danger",
    },
    {
      name: "Floyd Miles",
      meta: "Transport fee",
      avatar: 51,
      tag: "$95",
      tagType: "warning",
    },
    {
      name: "Priya Shah",
      meta: "Library fee",
      avatar: 47,
      tag: "$40",
      tagType: "warning",
    },
  ];
  const birthdays = [
    {
      name: "Eleanor Pena",
      meta: "Class 01 · Aug 14",
      avatar: 5,
      tag: "in 2d",
      tagType: "primary",
    },
    {
      name: "Jenny Wilson",
      meta: "Class 01 · Aug 19",
      avatar: 32,
      tag: "in 7d",
      tagType: "primary",
    },
    {
      name: "Jacob Jones",
      meta: "Class 04 · Aug 27",
      avatar: 15,
      tag: "in 15d",
      tagType: "primary",
    },
  ];

  function renderList(elId, items) {
    document.getElementById(elId).innerHTML = items
      .map(
        (item) => `
        <li class="quicklist-item">
          <img class="quicklist-avatar" src="https://i.pravatar.cc/64?img=${item.avatar}" alt="">
          <div class="quicklist-info">
            <div class="quicklist-name">${item.name}</div>
            <div class="quicklist-meta">${item.meta}</div>
          </div>
          <span class="quicklist-tag quicklist-tag--${item.tagType}">${item.tag}</span>
        </li>`,
      )
      .join("");
  }
  renderList("absenteesList", absentees);
  renderList("defaultersList", defaulters);
  renderList("birthdaysList", birthdays);
}

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

/* ================= NOTICE MODAL — validation ================= */
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
  const input = fieldEl.querySelector("input, textarea");
  const ok = validatorFn(input.value);
  setFieldState(fieldEl, ok ? "valid" : "invalid");
  if (!ok) shake(input);
  return ok;
}
function wireLiveValidation(fieldEl, validatorFn) {
  const input = fieldEl.querySelector("input, textarea");
  input.addEventListener("blur", () => validateField(fieldEl, validatorFn));
  input.addEventListener("input", () => {
    if (fieldEl.classList.contains("is-invalid") && validatorFn(input.value))
      setFieldState(fieldEl, "valid");
  });
}

const noticeTitleField = document.querySelector('[data-field="noticeTitle"]');
const noticeMessageField = document.querySelector(
  '[data-field="noticeMessage"]',
);
wireLiveValidation(noticeTitleField, (v) => v.trim().length >= 4);
wireLiveValidation(noticeMessageField, (v) => v.trim().length >= 10);

/* ---------------- Notice modal open/close ---------------- */
const modalOverlay = document.getElementById("modalOverlay");
const noticeModal = document.getElementById("noticeModal");
const createNoticeBtn = document.getElementById("createNoticeBtn");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const modalPublishBtn = document.getElementById("modalPublishBtn");
const noticeForm = document.getElementById("noticeForm");

function openModal() {
  modalOverlay.style.visibility = "visible";
  if (window.gsap) {
    gsap.to(modalOverlay, { opacity: 1, duration: 0.2 });
    gsap.fromTo(
      noticeModal,
      { y: 24, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.32, ease: easeOut },
    );
  } else {
    modalOverlay.style.opacity = 1;
  }
  document.body.style.overflow = "hidden";
  document.getElementById("noticeDate").valueAsDate = new Date();
}
function closeModal() {
  if (window.gsap) {
    gsap.to(noticeModal, {
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
        noticeForm.reset();
        [noticeTitleField, noticeMessageField].forEach((f) =>
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
createNoticeBtn.addEventListener("click", openModal);
modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

modalPublishBtn.addEventListener("click", () => {
  const titleOk = validateField(noticeTitleField, (v) => v.trim().length >= 4);
  const messageOk = validateField(
    noticeMessageField,
    (v) => v.trim().length >= 10,
  );
  if (!titleOk || !messageOk) return;

  modalPublishBtn.classList.add("is-loading");
  modalPublishBtn.disabled = true;

  setTimeout(() => {
    modalPublishBtn.classList.remove("is-loading");
    modalPublishBtn.disabled = false;
    closeModal();
    showToast("Notice published successfully");
  }, 900);
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
