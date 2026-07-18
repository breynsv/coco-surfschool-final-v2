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
})();
