(function () {
  "use strict";

  /* Animated heading: splits data-heading ("|" = line break) into
     per-character spans and staggers their entrance transition. */
  var heading = document.getElementById("heroHeading");
  if (heading) {
    var raw = heading.getAttribute("data-heading") || "";
    var lines = raw.split("|");
    var charDelay = 30;
    var initialDelay = 200;
    var frag = document.createDocumentFragment();
    lines.forEach(function (line, lineIndex) {
      var lineEl = document.createElement("span");
      lineEl.className = "heading-line";
      var wordEl = null;
      line.split("").forEach(function (ch, charIndex) {
        var charEl = document.createElement("span");
        charEl.className = "heading-char";
        var delay = lineIndex * line.length * charDelay + charIndex * charDelay;
        charEl.style.transitionDelay = delay + "ms";
        if (ch === " ") {
          charEl.textContent = "\u00A0";
          lineEl.appendChild(charEl);
          wordEl = null;
        } else {
          charEl.textContent = ch;
          if (!wordEl) {
            wordEl = document.createElement("span");
            wordEl.className = "heading-word";
            lineEl.appendChild(wordEl);
          }
          wordEl.appendChild(charEl);
        }
      });
      frag.appendChild(lineEl);
    });
    heading.appendChild(frag);
    window.setTimeout(function () {
      heading.querySelectorAll(".heading-char").forEach(function (c) {
        c.classList.add("is-in");
      });
    }, initialDelay);
  }

  /* Generic fade-in: elements with class "fade-target" fade to opacity 1
     after their data-delay (ms), transitioning over data-duration (ms). */
  document.querySelectorAll(".fade-target").forEach(function (el) {
    var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
    var duration = parseInt(el.getAttribute("data-duration") || "600", 10);
    el.style.transitionDuration = duration + "ms";
    window.setTimeout(function () {
      el.classList.add("is-visible");
    }, delay);
  });

  /* Mobile nav toggle */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          openItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          openItem.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("is-open");
        q.setAttribute("aria-expanded", "false");
        a.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* Reveal-on-scroll animation */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Lead form: front-end only — wire up to a backend/CRM before going live */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector("button[type=submit]");
      var originalText = submitBtn.textContent;
      submitBtn.textContent = "Verzonden — bedankt!";
      submitBtn.disabled = true;
      window.setTimeout(function () {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2600);
    });
  }
})();
