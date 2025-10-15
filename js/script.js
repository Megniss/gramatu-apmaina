document.addEventListener("DOMContentLoaded", () => {
  const servicesBtn = document.getElementById("services-btn");
  const servicesLi = document.querySelector(".has-dropdown");
  const navUl = document.querySelector(".main-nav ul");
  const hamburger = document.getElementById("hamburger");
  const darkToggle = document.getElementById("darkToggle");
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalClose = document.querySelector(".modal .close");

  // Dark mode
  if (localStorage.getItem("darkMode") === "true") document.body.classList.add("dark");
  darkToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  });

  // Hamburger
  hamburger?.addEventListener("click", (e) => {
    e.stopPropagation();
    navUl.classList.toggle("show");
    hamburger.setAttribute("aria-expanded", navUl.classList.contains("show"));
  });
  navUl?.addEventListener("click", e => e.stopPropagation());

  // Services dropdown
  servicesBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    servicesLi.classList.toggle("active");
    servicesBtn.setAttribute("aria-expanded", servicesLi.classList.contains("active"));
  });

  // Modal
  function openModal(d) {
    if (!modal) return;
    modalImg.src = d.img || "";
    modalImg.alt = d.title || "";
    modalTitle.textContent = d.title || "Informācija";
    modalDesc.textContent = d.desc || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose?.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  document.querySelectorAll(".card-btn").forEach(btn =>
    btn.addEventListener("click", e => { e.stopPropagation(); openModal(btn.dataset); })
  );
  modalClose?.addEventListener("click", e => { e.stopPropagation(); closeModal(); });
  modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });

  // Global click & Escape
  document.addEventListener("click", e => {
    if (servicesLi && !e.target.closest(".has-dropdown")) {
      servicesLi.classList.remove("active");
      servicesBtn?.setAttribute("aria-expanded", "false");
    }
    if (navUl && !e.target.closest(".main-nav")) {
      navUl.classList.remove("show");
      hamburger?.setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      servicesLi?.classList.remove("active");
      servicesBtn?.setAttribute("aria-expanded", "false");
      navUl?.classList.remove("show");
      hamburger?.setAttribute("aria-expanded", "false");
      closeModal();
    }
  });

  // Resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) navUl?.classList.remove("show");
    if (window.innerWidth <= 800) {
      servicesLi?.classList.remove("active");
      servicesBtn?.setAttribute("aria-expanded", "false");
    }
  });
// ===== MODAL POPUP =====

// Funkcija atvērt modālo logu
function openModal(d) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");

  modalImg.src = d.img || "";
  modalTitle.textContent = d.title || "Informācija";
  modalDesc.textContent = d.desc || "Papildu informācija par šo grāmatu.";
  modal.classList.add("open");
  document.body.style.overflow = "hidden"; // bloķē scroll fonā
}

// Funkcija aizvērt modālo logu
function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

// Pievieno notikumus "Uzzināt vairāk" pogām
document.querySelectorAll(".card-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();
    openModal(btn.dataset);
  });
});

// Aizvēršanas poga
document.querySelector(".modal .close")?.addEventListener("click", closeModal);

// Klikšķis ārpus loga
document.getElementById("modal")?.addEventListener("click", e => {
  if (e.target.id === "modal") closeModal();
});

// Escape taustiņš
window.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

});
