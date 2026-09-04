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

  /* Service-area map. Real OpenStreetMap data through CARTO's dark basemap,
     which sits naturally in this dark section. Leaflet is vendored in
     /vendor, so the page depends on no third-party script — only the tile
     images come from the network, and the town list underneath stays put
     as a fallback when they do not arrive. */
  var mapEl = document.getElementById("areaMap");
  if (mapEl && window.L) {
    var HOME = [52.5606, 5.9331]; /* IJsselmuiden */
    /* "side" places the name around its dot, so that close neighbours
       (Kampen/IJsselmuiden, Genemuiden/Zwartsluis) do not write their
       labels over each other. The dot itself always stays on the real
       coordinate. */
    var TOWNS = [
      { name: "Kampen", at: [52.5551, 5.9111], side: "below" },
      { name: "Zwolle", at: [52.5168, 6.0830], side: "right" },
      { name: "Genemuiden", at: [52.6283, 6.0289], side: "left" },
      { name: "Zwartsluis", at: [52.6428, 6.0672], side: "right" },
      { name: "Hasselt", at: [52.5917, 6.1017], side: "right" },
      { name: "Dronten", at: [52.5250, 5.7167], side: "left" }
    ];

    var buildMap = function () {
      var map = L.map(mapEl, {
        center: HOME,
        zoom: 10,
        zoomControl: true,
        /* The page scrolls through this section, so the wheel must not be
           captured; pinch and the +/- buttons still zoom. */
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        attributionControl: true
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
            '&copy; <a href="https://carto.com/attributions">CARTO</a>'
        }
      ).addTo(map);
      map.attributionControl.setPrefix(false);

      /* Roughly the radius named in the copy next to the map. */
      L.circle(HOME, {
        radius: 30000,
        color: "#c1481d",
        weight: 1.5,
        dashArray: "6 6",
        fillColor: "#c1481d",
        fillOpacity: 0.07
      }).addTo(map);

      var label = function (text, modifier) {
        return L.divIcon({
          className: "area-pin " + modifier,
          html: '<span class="area-pin-dot"></span><span class="area-pin-name">' + text + "</span>",
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
      };

      var pins = [
        L.marker(HOME, { icon: label("IJsselmuiden", "is-home"), keyboard: false }).addTo(map)
      ];
      TOWNS.forEach(function (town) {
        pins.push(
          L.marker(town.at, {
            icon: label(town.name, town.side === "right" ? "" : "is-" + town.side),
            keyboard: false
          }).addTo(map)
        );
      });

      var frame = function () {
        map.fitBounds(L.featureGroup(pins).getBounds(), { padding: [50, 50] });
      };
      frame();
      mapEl.classList.add("is-ready");

      /* The card is still sliding in from its reveal animation when the map
         is built, so re-measure once that has settled. */
      window.setTimeout(function () {
        map.invalidateSize();
        frame();
      }, 900);

      /* The card is square and its size changes with the viewport. */
      window.addEventListener("resize", function () {
        map.invalidateSize();
      });
    };

    /* Build it the first time the section comes into view, so a visitor who
       never scrolls this far never requests a tile. */
    if ("IntersectionObserver" in window) {
      var mapIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              mapIo.disconnect();
              buildMap();
            }
          });
        },
        { rootMargin: "200px" }
      );
      mapIo.observe(mapEl);
    } else {
      buildMap();
    }
  }

  /* Hide the floating WhatsApp button while the contact form is on screen:
     the form's own green button does the same job, and two identical pills
     stacked on top of each other only clutter the card. */
  var fab = document.querySelector(".whatsapp-fab");
  var contact = document.getElementById("contact");
  if (fab && contact && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          fab.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    ).observe(contact);
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Lead form -> WhatsApp.
     The site is static, so there is no server to receive the form. Instead we
     compose the answers into a message and open a wa.me deep link, which lands
     the request in the WhatsApp inbox of the number below. Attachments cannot
     travel through a wa.me link, so the form asks for photos in the chat. */
  var WHATSAPP_NUMBER = "31634253000";

  var form = document.getElementById("leadForm");
  if (form) {
    var isEn =
      (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;

    var t = isEn
      ? {
          intro: "New quote request via the website",
          name: "Name",
          phone: "Phone",
          postcode: "Postcode",
          service: "Service",
          description: "Description",
          sending: "Opening WhatsApp\u2026"
        }
      : {
          intro: "Nieuwe offerteaanvraag via de website",
          name: "Naam",
          phone: "Telefoon",
          postcode: "Postcode",
          service: "Dienst",
          description: "Omschrijving",
          sending: "WhatsApp openen\u2026"
        };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var val = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };

      var message =
        t.intro +
        "\n\n" +
        t.name + ": " + val("fld-naam") +
        "\n" + t.phone + ": " + val("fld-tel") +
        "\n" + t.postcode + ": " + val("fld-postcode") +
        "\n" + t.service + ": " + val("fld-dienst") +
        "\n\n" + t.description + ":\n" + val("fld-omschrijving");

      var url =
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

      var submitBtn = form.querySelector("button[type=submit]");
      var originalText = submitBtn.textContent;
      submitBtn.textContent = t.sending;
      submitBtn.disabled = true;

      /* Open in a new tab so the visitor keeps the page; if the browser blocks
         the popup, navigate this tab instead so the request is never lost. */
      var win = window.open(url, "_blank", "noopener");
      if (!win) {
        window.location.href = url;
      }

      window.setTimeout(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2600);
    });
  }
})();
