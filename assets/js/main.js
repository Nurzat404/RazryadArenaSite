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

});
