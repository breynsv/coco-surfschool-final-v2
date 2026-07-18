/* Coco Surf School — tiny vanilla enhancements */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var scrim = document.querySelector(".nav-scrim");
  function setMenu(open) {
    if (!nav) return;
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    if (scrim) scrim.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { if (window.innerWidth <= 780) setMenu(false); });
    });
  }

  // Scroll reveal (respects reduced motion)
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Reviews carousel (vanilla, scroll-snap based)
  document.querySelectorAll(".reviews-carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".reviews-track");
    var prev = carousel.querySelector('[data-dir="prev"]');
    var next = carousel.querySelector('[data-dir="next"]');
    var dotsWrap = carousel.querySelector(".review-dots");
    if (!track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll(".review-card"));
    if (!cards.length) return;

    function step() {
      // one card width incl. gap
      if (cards.length > 1) return cards[1].offsetLeft - cards[0].offsetLeft;
      return cards[0].offsetWidth;
    }
    function pages() { return Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth)); }
    function currentPage() { return Math.round(track.scrollLeft / track.clientWidth); }

    // Build page dots
    var dots = [];
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      dots = [];
      var n = pages();
      for (var i = 0; i < n; i++) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "review-dot";
        d.setAttribute("role", "tab");
        d.setAttribute("aria-label", "Go to review group " + (i + 1));
        d.dataset.page = i;
        d.addEventListener("click", (function (idx) {
          return function () { track.scrollTo({ left: idx * track.clientWidth, behavior: "smooth" }); };
        })(i));
        dotsWrap.appendChild(d);
        dots.push(d);
      }
    }

    function sync() {
      var p = currentPage();
      dots.forEach(function (d, i) { d.setAttribute("aria-selected", i === p ? "true" : "false"); });
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }

    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });

    var raf;
    track.addEventListener("scroll", function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    }, { passive: true });

    // Arrow-key support when track focused
    track.setAttribute("tabindex", "0");
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); track.scrollBy({ left: step(), behavior: "smooth" }); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); track.scrollBy({ left: -step(), behavior: "smooth" }); }
    });

    buildDots();
    sync();

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { buildDots(); sync(); }, 180);
    });

    // Gentle autoplay — off under reduced motion; pause on hover/focus
    if (!reduce) {
      var timer = null;
      function advance() {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
          track.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          track.scrollBy({ left: step(), behavior: "smooth" });
        }
      }
      function play() { if (!timer) timer = setInterval(advance, 5000); }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", play);
      carousel.addEventListener("focusin", stop);
      carousel.addEventListener("focusout", play);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { en.isIntersecting ? play() : stop(); });
        }, { threshold: 0.25 }).observe(carousel);
      } else { play(); }
    }
  });

  // Contact form -> POST /api/contact (Cloudflare Pages Function -> Resend)
  var form = document.querySelector(".contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector("button[type=submit]");
    var setStatus = function (msg, state) {
      if (!status) return;
      status.textContent = msg;
      status.hidden = !msg;
      status.className = "form-status" + (state ? " form-status--" + state : "");
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var payload = {
        name: form.name.value || "",
        email: form.email.value || "",
        message: form.message.value || "",
        company: form.company ? form.company.value || "" : "",
      };
      if (btn) btn.disabled = true;
      setStatus(form.getAttribute("data-sending") || "Sending…", "pending");
      fetch(form.getAttribute("action") || "/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (r) { return r.ok; })
        .catch(function () { return false; })
        .then(function (ok) {
          if (ok) {
            form.reset();
            setStatus(form.getAttribute("data-ok") || "Thanks! We'll be in touch soon.", "ok");
          } else {
            setStatus(form.getAttribute("data-err") || "Something went wrong. Please email us directly.", "err");
          }
          if (btn) btn.disabled = false;
        });
    });
  }

  // Surf booking page -> CRM booking API (draft page, coco.membrero.test)
  var bookForm = document.querySelector(".surf-book-form");
  if (bookForm) {
    var sessionsBox = document.getElementById("surf-sessions");
    var api = (sessionsBox && sessionsBox.getAttribute("data-api")) || bookForm.getAttribute("data-api") || "";
    var emptyMsg = (sessionsBox && sessionsBox.getAttribute("data-empty")) || "No sessions available.";
    var chooseLabel = (sessionsBox && sessionsBox.getAttribute("data-choose")) || "Choose";
    var selectedLabel = (sessionsBox && sessionsBox.getAttribute("data-selected")) || "Selected ✓";
    var weekLabel = (sessionsBox && sessionsBox.getAttribute("data-week")) || "Week of";
    var spotsWord = (sessionsBox && sessionsBox.getAttribute("data-spots")) || "left";

    var elSessionId = bookForm.querySelector('input[name="session_id"]');
    var elFormula = bookForm.querySelector('input[name="formula"]');
    var elSummary = bookForm.querySelector(".surf-book-summary");
    var elParty = bookForm.querySelector('input[name="party_size"]');
    var elPack = bookForm.querySelector('select[name="pack_size"]');
    var elSubmitBtn = bookForm.querySelector('button[type="submit"]');
    var elTs = bookForm.querySelector('input[name="_ts"]');
    var elStatus = bookForm.querySelector(".form-status");

    if (elTs) elTs.value = Math.floor(Date.now() / 1000);

    var setBookStatus = function (msg, state) {
      if (!elStatus) return;
      elStatus.textContent = msg;
      elStatus.hidden = !msg;
      elStatus.className = "form-status" + (state ? " form-status--" + state : "");
    };

    var formulas = [];
    var sessions = [];

    function formulaByKey(key) {
      for (var i = 0; i < formulas.length; i++) if (formulas[i].key === key) return formulas[i];
      return null;
    }

    function fmtDate(s) {
      try {
        var d = new Date(s.local_date + "T00:00:00");
        return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
      } catch (e) { return s.local_date; }
    }

    function selectSession(session) {
      var f = formulaByKey(session.formula);
      if (elSessionId) elSessionId.value = session.id;
      if (elFormula) elFormula.value = session.formula;
      if (elSummary) {
        elSummary.textContent =
          fmtDate(session) + " · " + session.local_time + " · " + session.formula_label +
          " · " + (session.spots_left) + " spot(s) left";
      }
      var maxParty = f ? Math.min(session.spots_left, f.max_party) : session.spots_left;
      var minParty = f ? f.min_party : 1;
      if (elParty) {
        elParty.min = minParty;
        elParty.max = Math.max(minParty, maxParty);
        elParty.value = minParty;
        elParty.disabled = false;
      }
      if (elPack) {
        elPack.innerHTML = "";
        var packs = (f && f.packs) || [1];
        packs.forEach(function (p) {
          var opt = document.createElement("option");
          opt.value = p;
          opt.textContent = p;
          elPack.appendChild(opt);
        });
        elPack.disabled = false;
      }
      if (elSubmitBtn) elSubmitBtn.disabled = false;
      var slots = (sessionsBox || document).querySelectorAll(".surf-slot");
      slots.forEach(function (slot) {
        slot.classList.toggle("is-selected", slot.getAttribute("data-session-id") === String(session.id));
      });
      // bring the form into view so the customer sees their next step
      if (bookForm.scrollIntoView) bookForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // --- calendar helpers ---
    function pad2(n) { return (n < 10 ? "0" : "") + n; }
    function ymd(d) { return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
    function mondayOf(dateStr) {
      var d = new Date(dateStr + "T00:00:00");
      var wd = (d.getDay() + 6) % 7; // 0 = Monday … 6 = Sunday
      d.setDate(d.getDate() - wd);
      return d;
    }
    function weekRange(monday) {
      var sun = new Date(monday); sun.setDate(sun.getDate() + 6);
      var mMon = monday.toLocaleDateString(undefined, { month: "short" });
      var mSun = sun.toLocaleDateString(undefined, { month: "short" });
      if (monday.getMonth() === sun.getMonth()) {
        return monday.getDate() + "–" + sun.getDate() + " " + mMon;
      }
      return monday.getDate() + " " + mMon + " – " + sun.getDate() + " " + mSun;
    }

    function renderSessions() {
      if (!sessionsBox) return;
      if (!sessions.length) {
        sessionsBox.innerHTML = '<p class="surf-sessions-empty">' + emptyMsg + "</p>";
        return;
      }

      // Group sessions: week (Monday) -> day (local_date) -> [sessions]
      var weeks = {}, order = [], byId = {};
      sessions.forEach(function (s) {
        byId[s.id] = s;
        var mon = mondayOf(s.local_date), key = ymd(mon);
        if (!weeks[key]) { weeks[key] = { monday: mon, byDay: {} }; order.push(key); }
        (weeks[key].byDay[s.local_date] = weeks[key].byDay[s.local_date] || []).push(s);
      });
      order.sort();

      var html = '<div class="surf-cal">';
      order.forEach(function (key) {
        var wk = weeks[key];
        html += '<div class="surf-week">' +
          '<div class="surf-week-head"><span class="sw-tag">' + weekLabel + '</span> ' + weekRange(wk.monday) + '</div>' +
          '<div class="surf-week-grid">';
        for (var i = 0; i < 7; i++) {
          var day = new Date(wk.monday); day.setDate(day.getDate() + i);
          var dk = ymd(day);
          var wdName = day.toLocaleDateString(undefined, { weekday: "short" });
          var list = wk.byDay[dk] || [];
          html += '<div class="surf-day' + (list.length ? " has-slots" : " is-empty") + '">' +
            '<div class="surf-day-head"><span class="sd-wd">' + wdName + '</span><span class="sd-num">' + day.getDate() + '</span></div>' +
            '<div class="surf-day-body">';
          if (list.length) {
            list.forEach(function (s) {
              var low = s.spots_left <= 2;
              html += '<button type="button" class="surf-slot' + (low ? " is-low" : "") + '" data-session-id="' + s.id + '">' +
                '<span class="slot-time">' + s.local_time + '</span>' +
                '<span class="slot-spots">' + s.spots_left + " " + spotsWord + '</span>' +
                '</button>';
            });
          } else {
            html += '<span class="surf-day-none" aria-hidden="true">·</span>';
          }
          html += '</div></div>';
        }
        html += '</div></div>';
      });
      html += '</div>';
      sessionsBox.innerHTML = html;

      sessionsBox.querySelectorAll(".surf-slot").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var s = byId[btn.getAttribute("data-session-id")];
          if (s) selectSession(s);
        });
      });
    }

    if (api) {
      Promise.all([
        fetch(api + "/api/v1/surf/formulas").then(function (r) { return r.json(); }).catch(function () { return { data: [] }; }),
        fetch(api + "/api/v1/surf/sessions").then(function (r) { return r.json(); }).catch(function () { return { data: [] }; }),
      ]).then(function (results) {
        formulas = (results[0] && results[0].data) || [];
        sessions = (results[1] && results[1].data) || [];
        renderSessions();
      });
    } else if (sessionsBox) {
      sessionsBox.innerHTML = '<p class="surf-sessions-empty">' + emptyMsg + "</p>";
    }

    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!elSessionId || !elSessionId.value) {
        setBookStatus(bookForm.getAttribute("data-err") || "Please choose a session first.", "err");
        return;
      }
      if (!bookForm.reportValidity()) return;

      var fullName = (bookForm.querySelector('input[name="full_name"]') || {}).value || "";
      var parts = fullName.trim().split(/\s+/);
      var firstName = parts.shift() || fullName;
      var lastName = parts.join(" ") || firstName;

      var payload = {
        session_id: Number(elSessionId.value),
        formula: elFormula ? elFormula.value : "",
        party_size: elParty ? Number(elParty.value) : 1,
        pack_size: elPack ? Number(elPack.value) : 1,
        contact: {
          first_name: firstName,
          last_name: lastName,
          email: (bookForm.querySelector('input[name="email"]') || {}).value || "",
          phone: (bookForm.querySelector('input[name="phone"]') || {}).value || "",
          language: (bookForm.querySelector('select[name="language"]') || {}).value || "EN",
        },
        marketing_consent: !!(bookForm.querySelector('input[name="marketing_consent"]') || {}).checked,
        remarks: (bookForm.querySelector('textarea[name="remarks"]') || {}).value || "",
        _honey: (bookForm.querySelector('input[name="_honey"]') || {}).value || "",
        _ts: elTs ? Number(elTs.value) : Math.floor(Date.now() / 1000),
      };

      if (elSubmitBtn) elSubmitBtn.disabled = true;
      setBookStatus(bookForm.getAttribute("data-sending") || "Sending…", "pending");

      fetch(api + "/api/v1/surf/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (r) { return r.json().then(function (json) { return { ok: r.ok, json: json }; }); })
        .catch(function () { return { ok: false, json: null }; })
        .then(function (res) {
          if (res.ok && res.json && res.json.success) {
            bookForm.reset();
            if (elSessionId) elSessionId.value = "";
            if (elFormula) elFormula.value = "";
            if (elParty) elParty.disabled = true;
            if (elPack) elPack.disabled = true;
            if (elSubmitBtn) elSubmitBtn.disabled = true;
            if (elSummary) elSummary.textContent = emptyMsg;
            var okMsg = (res.json && res.json.deposit_note) || bookForm.getAttribute("data-ok") || "Thanks! Your booking is confirmed.";
            setBookStatus(okMsg, "ok");
          } else {
            var errMsg = (res.json && res.json.message) || bookForm.getAttribute("data-err") || "Something went wrong.";
            setBookStatus(errMsg, "err");
            if (elSubmitBtn) elSubmitBtn.disabled = false;
          }
        });
    });
  }
})();
