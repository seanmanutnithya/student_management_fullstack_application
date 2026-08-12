/* ============================================================
   HOME PAGE — front-end only. No backend/database calls.
   ============================================================ */
(() => {
  'use strict';

  const easeOut = 'power3.out';
  function bootIcons(){ window.lucide && window.lucide.createIcons(); }

  /* ---------------- Sidebar (mobile) ---------------- */
  const sidebar        = document.getElementById('sidebar');
  const overlay         = document.getElementById('sidebarOverlay');
  const menuBtn         = document.getElementById('mobileMenuBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function openSidebar(){
    if (window.gsap){
      gsap.set(overlay, { display: 'block' });
      gsap.to(overlay, { opacity: 1, pointerEvents: 'auto', duration: 0.25 });
      gsap.fromTo(sidebar, { x: '-100%' }, { x: '0%', duration: 0.35, ease: easeOut });
    } else { sidebar.style.transform = 'translateX(0)'; overlay.style.display = 'block'; }
  }
  function closeSidebar(){
    if (window.gsap){
      gsap.to(sidebar, { x: '-100%', duration: 0.3, ease: 'power2.in' });
      gsap.to(overlay, { opacity: 0, pointerEvents: 'none', duration: 0.25, onComplete: () => gsap.set(overlay, { display: 'none' }) });
    } else { sidebar.style.transform = 'translateX(-100%)'; overlay.style.display = 'none'; }
  }
  menuBtn && menuBtn.addEventListener('click', openSidebar);
  sidebarCloseBtn && sidebarCloseBtn.addEventListener('click', closeSidebar);
  overlay && overlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('.nav-parent').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.nav-group');
      if (!group) return;
      const isOpen = group.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  function wireHoverScale(selector, scale = 1.03){
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => window.gsap && gsap.to(el, { scale, duration: 0.18, ease: easeOut }));
      el.addEventListener('mouseleave', () => window.gsap && gsap.to(el, { scale: 1, duration: 0.18, ease: easeOut }));
    });
  }
  wireHoverScale('.btn', 1.03);
  wireHoverScale('.icon-btn', 1.08);
  wireHoverScale('.stat-card', 1.015);

  /* ---------------- Greeting + live date ---------------- */
  function updateGreeting(){
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    document.getElementById('greetingTitle').textContent = `${greeting}, Priscilla`;

    const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    document.getElementById('greetingDate').textContent = `${dateStr} · ${timeStr}`;
  }

  /* ---------------- Stat card count-up ---------------- */
  function animateCounters(){
    document.querySelectorAll('.stat-card-value[data-count]').forEach(el => {
      const target = Number(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      if (window.gsap){
        gsap.to({ val: 0 }, {
          val: target, duration: 1.2, ease: 'power2.out', delay: 0.15,
          onUpdate: function(){
            const v = Math.round(this.targets()[0].val);
            el.textContent = prefix + v.toLocaleString() + suffix;
          }
        });
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    });
  }

  /* ---------------- Line chart (SVG, hand-drawn path) ---------------- */
  function renderLineChart(){
    const data = [
      { label: 'Mar', value: 1120 }, { label: 'Apr', value: 1160 }, { label: 'May', value: 1145 },
      { label: 'Jun', value: 1190 }, { label: 'Jul', value: 1210 }, { label: 'Aug', value: 1248 },
    ];
    const W = 560, H = 220, padX = 16, padTop = 16, padBottom = 16;
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const range = max - min || 1;
    const stepX = (W - padX * 2) / (data.length - 1);

    const points = data.map((d, i) => {
      const x = padX + i * stepX;
      const y = padTop + (H - padTop - padBottom) * (1 - (d.value - min) / range);
      return { x, y };
    });

    const linePath = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
    const areaPath = `${linePath} L${points[points.length - 1].x},${H - padBottom} L${points[0].x},${H - padBottom} Z`;

    document.getElementById('linePath').setAttribute('d', linePath);
    document.getElementById('areaPath').setAttribute('d', areaPath);

    // Grid lines
    const gridGroup = document.getElementById('gridLines');
    gridGroup.innerHTML = '';
    for (let i = 0; i <= 3; i++){
      const y = padTop + ((H - padTop - padBottom) / 3) * i;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padX); line.setAttribute('x2', W - padX);
      line.setAttribute('y1', y); line.setAttribute('y2', y);
      line.setAttribute('class', 'grid-line');
      gridGroup.appendChild(line);
    }

    // Dots
    const dotsGroup = document.getElementById('dotsGroup');
    dotsGroup.innerHTML = '';
    points.forEach(p => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', p.x); circle.setAttribute('cy', p.y);
      circle.setAttribute('r', 4.5);
      circle.setAttribute('class', 'chart-dot');
      dotsGroup.appendChild(circle);
    });

    // Labels
    document.getElementById('lineChartLabels').innerHTML = data.map(d => `<span>${d.label}</span>`).join('');

    // Draw-in animation
    const linePathEl = document.getElementById('linePath');
    const areaPathEl = document.getElementById('areaPath');
    const length = linePathEl.getTotalLength();

    if (window.gsap){
      gsap.set(linePathEl, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(areaPathEl, { opacity: 0 });
      gsap.to(linePathEl, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', delay: 0.2 });
      gsap.to(areaPathEl, { opacity: 1, duration: 0.8, delay: 0.6 });
      gsap.fromTo(dotsGroup.children, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.08, ease: 'back.out(2)', delay: 0.9, transformOrigin: 'center' });
    }
  }

  /* ---------------- Donut chart ---------------- */
  function renderDonutChart(){
    const segments = [
      { name: 'Class 01', value: 320, color: 'var(--color-primary)' },
      { name: 'Class 02', value: 280, color: '#3B82F6' },
      { name: 'Class 03', value: 260, color: '#1FAA59' },
      { name: 'Class 04', value: 388, color: '#F5A524' },
    ];
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    const r = 60, cx = 80, cy = 80;
    const circumference = 2 * Math.PI * r;
    const svg = document.getElementById('donutChart');
    svg.innerHTML = '';

    let cumulative = 0;
    segments.forEach((seg) => {
      const pct = seg.value / total;
      const dash = pct * circumference;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx); circle.setAttribute('cy', cy); circle.setAttribute('r', r);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', seg.color);
      circle.setAttribute('stroke-width', '18');
      circle.setAttribute('stroke-dasharray', `${dash} ${circumference - dash}`);
      circle.setAttribute('stroke-dashoffset', -cumulative);
      circle.style.transformOrigin = `${cx}px ${cy}px`;
      circle.dataset.dash = dash;
      circle.dataset.gap = circumference - dash;
      svg.appendChild(circle);

      if (window.gsap){
        gsap.fromTo(circle,
          { strokeDasharray: `0 ${circumference}` },
          { strokeDasharray: `${dash} ${circumference - dash}`, duration: 0.9, ease: 'power2.out', delay: 0.2 }
        );
      }
      cumulative += dash;
    });

    document.getElementById('donutLegend').innerHTML = segments.map(seg => `
      <li>
        <span class="legend-swatch" style="background:${seg.color}"></span>
        <span class="legend-name">${seg.name}</span>
        <span class="legend-pct">${Math.round((seg.value / total) * 100)}%</span>
      </li>`).join('');
  }

  /* ---------------- Quick lists ---------------- */
  function renderQuickLists(){
    const absentees = [
      { name: 'Marcus Lee', meta: 'Class 04 · 5 days absent', avatar: 18, tag: '5', tagType: 'danger' },
      { name: 'Guy Hawkins', meta: 'Class 02 · 4 days absent', avatar: 12, tag: '4', tagType: 'danger' },
      { name: 'Aiden Brooks', meta: 'Class 03 · 3 days absent', avatar: 60, tag: '3', tagType: 'warning' },
    ];
    const defaulters = [
      { name: 'Jane Cooper', meta: 'Term 3 tuition', avatar: 25, tag: '$420', tagType: 'danger' },
      { name: 'Floyd Miles', meta: 'Transport fee', avatar: 51, tag: '$95', tagType: 'warning' },
      { name: 'Priya Shah', meta: 'Library fee', avatar: 47, tag: '$40', tagType: 'warning' },
    ];
    const birthdays = [
      { name: 'Eleanor Pena', meta: 'Class 01 · Aug 14', avatar: 5, tag: 'in 2d', tagType: 'primary' },
      { name: 'Jenny Wilson', meta: 'Class 01 · Aug 19', avatar: 32, tag: 'in 7d', tagType: 'primary' },
      { name: 'Jacob Jones', meta: 'Class 04 · Aug 27', avatar: 15, tag: 'in 15d', tagType: 'primary' },
    ];

    function renderList(elId, items){
      document.getElementById(elId).innerHTML = items.map(item => `
        <li class="quicklist-item">
          <img class="quicklist-avatar" src="https://i.pravatar.cc/64?img=${item.avatar}" alt="">
          <div class="quicklist-info">
            <div class="quicklist-name">${item.name}</div>
            <div class="quicklist-meta">${item.meta}</div>
          </div>
          <span class="quicklist-tag quicklist-tag--${item.tagType}">${item.tag}</span>
        </li>`).join('');
    }
    renderList('absenteesList', absentees);
    renderList('defaultersList', defaulters);
    renderList('birthdaysList', birthdays);
  }

  /* ---------------- Activity feed ---------------- */
  function renderActivityFeed(){
    const activities = [
      { type: 'student', icon: 'user-plus', text: '<strong>Eleanor Pena</strong> was admitted to Class 01', time: '10 minutes ago' },
      { type: 'fee', icon: 'wallet', text: '<strong>Robert Rose</strong> paid Term 2 tuition — $420.00', time: '42 minutes ago' },
      { type: 'notice', icon: 'megaphone', text: 'Notice <strong>"Sports Day Schedule"</strong> was published', time: '1 hour ago' },
      { type: 'attendance', icon: 'clipboard-check', text: 'Attendance submitted for <strong>Class 03</strong>', time: '2 hours ago' },
      { type: 'student', icon: 'user-check', text: '<strong>Guy Hawkins</strong>\' profile was updated', time: '3 hours ago' },
      { type: 'fee', icon: 'circle-dollar-sign', text: 'Fee reminder sent to <strong>4 guardians</strong>', time: '5 hours ago' },
      { type: 'notice', icon: 'bell-ring', text: 'Notice <strong>"Term 3 Fee Due Date"</strong> was published', time: 'Yesterday' },
    ];
    document.getElementById('activityFeed').innerHTML = activities.map(a => `
      <li class="activity-item">
        <div class="activity-icon activity-icon--${a.type}"><i data-lucide="${a.icon}"></i></div>
        <div>
          <div class="activity-text">${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </li>`).join('');
    bootIcons();
  }

  document.getElementById('refreshActivityBtn').addEventListener('click', (e) => {
    if (window.gsap) gsap.to(e.currentTarget.querySelector('svg'), { rotate: '+=360', duration: 0.5, ease: 'power2.out' });
    renderActivityFeed();
    showToast('Activity feed refreshed');
  });

  /* ---------------- Upcoming events ---------------- */
  function renderEvents(){
    const events = [
      { day: '18', month: 'Aug', title: 'Mid-term Exams begin', meta: 'All classes' },
      { day: '22', month: 'Aug', title: 'Parent-Teacher Meeting', meta: '3:00 PM · Main hall' },
      { day: '29', month: 'Aug', title: 'Sports Day', meta: 'Full day event' },
      { day: '02', month: 'Sep', title: 'Term 3 fees due', meta: 'All students' },
    ];
    document.getElementById('eventsList').innerHTML = events.map(e => `
      <li class="event-item">
        <div class="event-date"><span class="event-date-day">${e.day}</span><span class="event-date-month">${e.month}</span></div>
        <div class="event-info">
          <div class="event-title">${e.title}</div>
          <div class="event-meta">${e.meta}</div>
        </div>
      </li>`).join('');
  }

  /* ================= NOTICE MODAL — validation ================= */
  function setFieldState(fieldEl, state){
    fieldEl.classList.remove('is-valid', 'is-invalid');
    if (state === 'valid') fieldEl.classList.add('is-valid');
    if (state === 'invalid') fieldEl.classList.add('is-invalid');
  }
  function shake(el){
    if (!window.gsap) return;
    gsap.fromTo(el, { x: 0 }, { x: 8, duration: 0.06, repeat: 5, yoyo: true, ease: 'power1.inOut', onComplete: () => gsap.set(el, { x: 0 }) });
  }
  function validateField(fieldEl, validatorFn){
    const input = fieldEl.querySelector('input, textarea');
    const ok = validatorFn(input.value);
    setFieldState(fieldEl, ok ? 'valid' : 'invalid');
    if (!ok) shake(input);
    return ok;
  }
  function wireLiveValidation(fieldEl, validatorFn){
    const input = fieldEl.querySelector('input, textarea');
    input.addEventListener('blur', () => validateField(fieldEl, validatorFn));
    input.addEventListener('input', () => {
      if (fieldEl.classList.contains('is-invalid') && validatorFn(input.value)) setFieldState(fieldEl, 'valid');
    });
  }

  const noticeTitleField   = document.querySelector('[data-field="noticeTitle"]');
  const noticeMessageField = document.querySelector('[data-field="noticeMessage"]');
  wireLiveValidation(noticeTitleField, v => v.trim().length >= 4);
  wireLiveValidation(noticeMessageField, v => v.trim().length >= 10);

  /* ---------------- Notice modal open/close ---------------- */
  const modalOverlay    = document.getElementById('modalOverlay');
  const noticeModal      = document.getElementById('noticeModal');
  const createNoticeBtn = document.getElementById('createNoticeBtn');
  const modalCloseBtn   = document.getElementById('modalCloseBtn');
  const modalCancelBtn  = document.getElementById('modalCancelBtn');
  const modalPublishBtn = document.getElementById('modalPublishBtn');
  const noticeForm       = document.getElementById('noticeForm');

  function openModal(){
    modalOverlay.style.visibility = 'visible';
    if (window.gsap){
      gsap.to(modalOverlay, { opacity: 1, duration: 0.2 });
      gsap.fromTo(noticeModal, { y: 24, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.32, ease: easeOut });
    } else { modalOverlay.style.opacity = 1; }
    document.body.style.overflow = 'hidden';
    document.getElementById('noticeDate').valueAsDate = new Date();
  }
  function closeModal(){
    if (window.gsap){
      gsap.to(noticeModal, { y: 16, opacity: 0, scale: 0.98, duration: 0.2, ease: 'power2.in' });
      gsap.to(modalOverlay, { opacity: 0, duration: 0.22, delay: 0.03, onComplete: () => {
        modalOverlay.style.visibility = 'hidden';
        noticeForm.reset();
        [noticeTitleField, noticeMessageField].forEach(f => setFieldState(f, null));
      }});
    } else { modalOverlay.style.opacity = 0; modalOverlay.style.visibility = 'hidden'; }
    document.body.style.overflow = '';
  }
  createNoticeBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalCancelBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

  modalPublishBtn.addEventListener('click', () => {
    const titleOk   = validateField(noticeTitleField, v => v.trim().length >= 4);
    const messageOk = validateField(noticeMessageField, v => v.trim().length >= 10);
    if (!titleOk || !messageOk) return;

    modalPublishBtn.classList.add('is-loading');
    modalPublishBtn.disabled = true;

    setTimeout(() => {
      modalPublishBtn.classList.remove('is-loading');
      modalPublishBtn.disabled = false;
      closeModal();
      showToast('Notice published successfully');
    }, 900);
  });

  /* ---------------- Toast ---------------- */
  const toastEl  = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;
  function showToast(message, icon = 'check-circle-2'){
    toastMsg.textContent = message;
    toastEl.querySelector('svg')?.remove();
    const iconEl = document.createElement('i');
    iconEl.setAttribute('data-lucide', icon);
    toastEl.prepend(iconEl);
    bootIcons();
    clearTimeout(toastTimer);
    if (window.gsap){
      gsap.killTweensOf(toastEl);
      gsap.fromTo(toastEl, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, ease: 'back.out(1.6)' });
    } else { toastEl.style.opacity = 1; }
    toastTimer = setTimeout(() => {
      if (window.gsap){ gsap.to(toastEl, { y: 24, opacity: 0, duration: 0.25, ease: 'power2.in' }); }
      else { toastEl.style.opacity = 0; }
    }, 2600);
  }

  /* ---------------- Page load orchestration ---------------- */
  function pageLoadAnimation(){
    if (!window.gsap) return;
    const tl = gsap.timeline({ defaults: { ease: easeOut } });
    tl.fromTo('.sidebar-brand, .sidebar-nav .nav-item, .sidebar-nav .nav-group', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.03 })
      .fromTo('.topbar, .mobile-topbar', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')
      .fromTo('.greeting-bar', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
      .fromTo('.stat-card', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 }, '-=0.2')
      .fromTo('.chart-card', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.15')
      .fromTo('.quicklist-card', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 }, '-=0.2')
      .fromTo('.activity-card, .events-card', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.5');
  }

  /* ---------------- Init ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
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
})();
