// script.js - pilns saturs
document.addEventListener("DOMContentLoaded", () => {
  // ----- Elementu references -----
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

  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  const showBtn = document.getElementById("show-messages-btn");
  const sentContainer = document.getElementById("sent-messages");
  const messagesList = document.getElementById("messages-list");

  const searchInput = document.getElementById("search");
  const cards = document.querySelectorAll(".card");

  // ----- Dark mode -----
  try {
    if (localStorage.getItem("darkMode") === "true") document.body.classList.add("dark");
  } catch (e) {
    // localStorage var var būt bloķēts; ignorē kļūdu
    console.warn("LocalStorage nav pieejams:", e);
  }

  darkToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    try {
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    } catch (e) {}
  });

  // ----- Hamburger (mobilai navigācijai) -----
  hamburger?.addEventListener("click", (e) => {
    e.stopPropagation();
    navUl?.classList.toggle("show");
    hamburger.setAttribute("aria-expanded", navUl?.classList.contains("show"));
  });

  navUl?.addEventListener("click", (e) => e.stopPropagation());

  // ----- Services dropdown -----
  servicesBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    servicesLi?.classList.toggle("active");
    servicesBtn.setAttribute("aria-expanded", servicesLi?.classList.contains("active"));
  });

  // ----- Modal funkcijas -----
  function openModal(data = {}) {
    if (!modal) return;
    modalImg.src = data.img || "";
    modalImg.alt = data.title || "";
    modalTitle.textContent = data.title || "Informācija";
    modalDesc.textContent = data.desc || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // move focus to close button for accessibility
    setTimeout(() => {
      modalClose?.focus();
    }, 50);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Pievieno notikumus pogām "Uzzināt vairāk"
  document.querySelectorAll(".card-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // btn.dataset satur data-title, data-desc, data-img
      openModal(btn.dataset || {});
    });
  });

  modalClose?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ----- Globālie notikumi (klikšķi, Escape, resize) -----
  document.addEventListener("click", (e) => {
    if (servicesLi && !e.target.closest(".has-dropdown")) {
      servicesLi.classList.remove("active");
      servicesBtn?.setAttribute("aria-expanded", "false");
    }
    if (navUl && !e.target.closest(".main-nav")) {
      navUl.classList.remove("show");
      hamburger?.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      servicesLi?.classList.remove("active");
      servicesBtn?.setAttribute("aria-expanded", "false");
      navUl?.classList.remove("show");
      hamburger?.setAttribute("aria-expanded", "false");
      closeModal();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) navUl?.classList.remove("show");
    if (window.innerWidth <= 800) {
      servicesLi?.classList.remove("active");
      servicesBtn?.setAttribute("aria-expanded", "false");
    }
  });

  // ----- Formas validācija un saglabāšana (localStorage) -----
  function saveMessage(name, email, message) {
    try {
      const messages = JSON.parse(localStorage.getItem("sentMessages") || "[]");
      messages.push({
        name,
        email,
        message,
        time: new Date().toLocaleString()
      });
      localStorage.setItem("sentMessages", JSON.stringify(messages));
    } catch (e) {
      console.warn("Neizdevās saglabāt ziņojumu:", e);
    }
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      if (formMessage) {
        formMessage.textContent = "Lūdzu aizpildi visus laukus!";
        formMessage.className = "form-message error";
        // neliels vizuāls efekts (shake) - CSS animācija tiek piešķirta caur klasi .error
      }
      return;
    }

    if (!emailPattern.test(email)) {
      if (formMessage) {
        formMessage.textContent = "Lūdzu ievadi derīgu e-pastu!";
        formMessage.className = "form-message error";
      }
      return;
    }

    // Ja ok — saglabā un paziņo
    saveMessage(name, email, message);

    if (formMessage) {
      formMessage.textContent = "Forma veiksmīgi iesniegta!";
      formMessage.className = "form-message success";
    }

    form.reset();
  });

  // ----- Rādīt visus nosūtītos ziņojumus -----
  function renderMessagesList() {
    try {
      const messages = JSON.parse(localStorage.getItem("sentMessages") || "[]");
      if (!messages || messages.length === 0) {
        messagesList.innerHTML = "<li>Nav neviena nosūtīta ziņojuma.</li>";
        return;
      }

      // Rādām pēdējos augšā (ja vajag)
      const reversed = messages.slice().reverse();

      messagesList.innerHTML = reversed.map(m => {
        // sanitizē vienkārši (bez innerHTML injection)
        const name = String(m.name || "").replace(/</g, "&lt;");
        const email = String(m.email || "").replace(/</g, "&lt;");
        const text = String(m.message || "").replace(/</g, "&lt;");
        const time = String(m.time || "");
        return `<li><strong>${name}</strong> (${email})<br>${text}<br><small>${time}</small></li>`;
      }).join("");
    } catch (e) {
      messagesList.innerHTML = "<li>Kļūda ielādējot ziņojumus.</li>";
      console.warn("Neizdevās ielādēt ziņojumus:", e);
    }
  }

  showBtn?.addEventListener("click", () => {
    // ja rāda pirmo reizi, uzpildām saturu
    if (sentContainer.style.display === "none" || sentContainer.style.display === "") {
      renderMessagesList();
    }
    sentContainer.style.display = sentContainer.style.display === "block" ? "none" : "block";
  });

  // Opcija: kad lapa ielādējas, ja sentContainer redzams pēc CSS, atjaunojam sarakstu
  if (sentContainer && sentContainer.style.display === "block") {
    renderMessagesList();
  }

  // ----- Meklēšanas filtrs kartītēm -----
  searchInput?.addEventListener("input", () => {
    const term = (searchInput.value || "").toLowerCase().trim();
    cards.forEach(card => {
      const titleEl = card.querySelector("h4");
      const textEl = card.querySelector("p");
      const title = titleEl ? titleEl.textContent.toLowerCase() : "";
      const text = textEl ? textEl.textContent.toLowerCase() : "";
      const matches = title.includes(term) || text.includes(term);
      // Izmanto display "" lai atgrieztu default block/inline ja vajag
      card.style.display = matches ? "block" : "none";
    });
  });

  // ----- Pieejamības/backup funkcijas -----
  // Ja modal or close poga nav pieejama, pievienojam klaviatūras Escape apstrādi (augstāk).
  // Ja nepieciešams, var pievienot arī "Clear messages" pogu šeit (papildus funkcionalitātei).

}); // DOMContentLoaded end
