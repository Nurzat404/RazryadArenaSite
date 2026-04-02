document.addEventListener("DOMContentLoaded", function () {
  // Footer year helper
  document.querySelectorAll("[data-current-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  // Active nav links by page marker
  var pageName = document.body.getAttribute("data-page");
  if (pageName) {
    document
      .querySelectorAll('[data-nav-page="' + pageName + '"]')
      .forEach(function (link) {
        link.classList.add("is-active");
      });
  }

  // Active state for authenticated top navigation
  var userNavName = document.body.getAttribute("data-user-nav");
  if (userNavName) {
    document
      .querySelectorAll('[data-user-nav-link="' + userNavName + '"]')
      .forEach(function (link) {
        link.classList.add("is-active");
      });
  }

  // Filter chips (visual only)
  document.querySelectorAll("[data-filter-chip]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var group = chip.closest("[data-filter-group]");
      if (!group) return;

      group.querySelectorAll("[data-filter-chip]").forEach(function (item) {
        item.classList.remove("is-active");
      });
      chip.classList.add("is-active");
    });
  });

  // Pseudo-interactive bracket tabs
  document.querySelectorAll("[data-bracket-switch]").forEach(function (wrapper) {
    var buttons = wrapper.querySelectorAll("[data-bracket-tab]");
    var targetSelector = wrapper.getAttribute("data-target");
    var board = document.querySelector(targetSelector);
    if (!board) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var tab = button.getAttribute("data-bracket-tab");

        buttons.forEach(function (btn) {
          btn.classList.remove("is-active");
        });
        button.classList.add("is-active");

        board.querySelectorAll("[data-bracket-panel]").forEach(function (panel) {
          panel.classList.remove("is-active");
          if (panel.getAttribute("data-bracket-panel") === tab) {
            panel.classList.add("is-active");
          }
        });
      });
    });
  });
  // Local mobile navigation toggle for static pages
  document.querySelectorAll(".navbar-toggler[data-nav-target]").forEach(function (button) {
    var targetSelector = button.getAttribute("data-nav-target");
    var target = targetSelector ? document.querySelector(targetSelector) : null;
    if (!target) return;

    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", expanded ? "false" : "true");
      target.classList.toggle("show", !expanded);
    });
  });

  // Local accordion logic keeps FAQ usable without external JS dependencies
  document.querySelectorAll(".accordion-button[data-accordion-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      var targetSelector = button.getAttribute("data-accordion-target");
      var target = targetSelector ? document.querySelector(targetSelector) : null;
      if (!target) return;

      var parentSelector = target.getAttribute("data-accordion-parent");
      var parent = parentSelector ? document.querySelector(parentSelector) : null;
      var willExpand = !target.classList.contains("show");

      if (parent) {
        parent.querySelectorAll(".accordion-collapse.show").forEach(function (panel) {
          if (panel !== target) {
            panel.classList.remove("show");
          }
        });
        parent.querySelectorAll(".accordion-button").forEach(function (item) {
          if (item !== button) {
            item.classList.add("collapsed");
            item.setAttribute("aria-expanded", "false");
          }
        });
      }

      target.classList.toggle("show", willExpand);
      button.classList.toggle("collapsed", !willExpand);
      button.setAttribute("aria-expanded", willExpand ? "true" : "false");
    });
  });

  // Scroll reveal animations for visually important homepage sections
  var animatedNodes = Array.prototype.slice.call(document.querySelectorAll("[data-animate]"));
  if (animatedNodes.length) {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("motion-ready");

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      animatedNodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
    } else {
      var revealNode = function (node) {
        var animationName = node.getAttribute("data-animate");
        var animationDelay = node.getAttribute("data-animate-delay");

        node.classList.add("is-visible", "animate__animated");
        if (animationName) {
          node.classList.add(animationName);
        }
        node.style.setProperty("--animate-duration", "0.72s");
        if (animationDelay) {
          node.style.animationDelay = animationDelay + "ms";
        }
      };

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            revealNode(entry.target);
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -8% 0px",
        }
      );

      animatedNodes.forEach(function (node) {
        observer.observe(node);
      });
    }
  }
});
