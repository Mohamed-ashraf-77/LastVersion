// Scroll Reveal logic
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

function refreshObservers() {
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

refreshObservers();

// Tab Switching Logic
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((section) => {
    section.classList.add("hidden");
  });
  document.getElementById("section-" + tabId).classList.remove("hidden");

  document.querySelectorAll("nav button").forEach((btn) => {
    btn.classList.remove("nav-active");
    btn.classList.add("text-gray-500");
  });
  document.getElementById("btn-" + tabId).classList.add("nav-active");
  document.getElementById("btn-" + tabId).classList.remove("text-gray-500");

  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(refreshObservers, 100);
}
