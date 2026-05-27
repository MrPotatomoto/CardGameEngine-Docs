/* ============================================================
   Card Game Engine Docs — app.js
   ============================================================ */

(function () {
  'use strict';

  // ── Mobile sidebar toggle ─────────────────────────────────────────────────

  const menuBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar && sidebar.classList.add('open');
    overlay && overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar && sidebar.classList.remove('open');
    overlay && overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
  });

  // ── Active sidebar link ───────────────────────────────────────────────────

  (function highlightActiveLink() {
    const links = document.querySelectorAll('.sidebar-nav a');
    const current = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      if (linkFile === current) {
        link.classList.add('active');
        // Expand parent group if nested
        const group = link.closest('.nav-group');
        if (group) group.classList.add('open');
      }
    });
  })();

  // ── Copy-to-clipboard ─────────────────────────────────────────────────────

  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const codeBlock = btn.closest('.code-block');
        const pre = codeBlock && codeBlock.querySelector('pre');
        const text = pre ? pre.innerText : '';

        navigator.clipboard.writeText(text).then(function () {
          const icon = btn.querySelector('.copy-icon');
          const label = btn.querySelector('.copy-label');
          if (icon) icon.innerHTML = checkIcon();
          if (label) label.textContent = 'Copied!';
          btn.classList.add('copied');

          setTimeout(function () {
            if (icon) icon.innerHTML = copyIcon();
            if (label) label.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          // Fallback for older browsers
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        });
      });
    });
  }

  function copyIcon() {
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  }

  function checkIcon() {
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  }

  initCopyButtons();

  // ── TOC scroll spy ────────────────────────────────────────────────────────

  (function initScrollSpy() {
    const toc = document.querySelector('.toc-nav');
    if (!toc) return;

    const headings = Array.from(
      document.querySelectorAll('.doc-content h2[id], .doc-content h3[id]')
    );
    if (!headings.length) return;

    const tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));

    function getActiveHeading() {
      const scrollY = window.scrollY + 90; // offset for sticky nav
      let active = headings[0];
      for (const h of headings) {
        if (h.getBoundingClientRect().top + window.scrollY <= scrollY) {
          active = h;
        }
      }
      return active;
    }

    function updateToc() {
      const active = getActiveHeading();
      if (!active) return;
      tocLinks.forEach(function (link) {
        const href = link.getAttribute('href').slice(1);
        if (href === active.id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    let raf;
    window.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        updateToc();
        raf = null;
      });
    }, { passive: true });

    updateToc();
  })();

  // ── Smooth scroll for anchor links ────────────────────────────────────────

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    // Update URL without jump
    history.pushState(null, '', '#' + id);
  });

  // ── Nav group toggle (sidebar sections) ──────────────────────────────────

  document.querySelectorAll('.nav-group-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const group = toggle.closest('.nav-group');
      if (group) group.classList.toggle('open');
    });
  });

  // ── Version badge / search placeholder ───────────────────────────────────

  const searchInput = document.getElementById('doc-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        clearSearch();
        return;
      }
      runSearch(query);
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        clearSearch();
        searchInput.blur();
      }
    });
  }

  function runSearch(query) {
    const links = document.querySelectorAll('.sidebar-nav a');
    links.forEach(function (link) {
      const text = link.textContent.toLowerCase();
      const parent = link.closest('li');
      if (parent) {
        parent.style.display = text.includes(query) ? '' : 'none';
      }
    });
  }

  function clearSearch() {
    const links = document.querySelectorAll('.sidebar-nav a');
    links.forEach(function (link) {
      const parent = link.closest('li');
      if (parent) parent.style.display = '';
    });
  }

  // ── Code block language badges auto-insert ────────────────────────────────

  document.querySelectorAll('.code-block pre code').forEach(function (code) {
    const classes = Array.from(code.classList);
    const langClass = classes.find(c => c.startsWith('language-'));
    if (!langClass) return;
    const lang = langClass.replace('language-', '').toUpperCase();
    const header = code.closest('.code-block') && code.closest('.code-block').querySelector('.code-header .code-lang');
    if (header && !header.textContent.trim()) header.textContent = lang;
  });

  // ── Hero animation: stagger feature cards ────────────────────────────────

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .stat-card').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Keyboard shortcut: / to focus search ──────────────────────────────────

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      const search = document.getElementById('doc-search');
      if (search) {
        e.preventDefault();
        search.focus();
        search.select();
      }
    }
  });

})();
