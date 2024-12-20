window.setTimeout(function() {
    var alert = document.querySelector(".alert");
    if (alert) {
      alert.classList.add("fade-out");
      setTimeout(function() { alert.remove(); }, 500);
    }
  }, 5000);