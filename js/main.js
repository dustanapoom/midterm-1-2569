/* Amazing Thailand — interactions and province journal */
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("nav-links");
const menuToggle = document.getElementById("menu-toggle");
const backToTop = document.getElementById("back-to-top");
const grid = document.getElementById("province-grid");
const filters = document.getElementById("region-filters");
const detail = document.getElementById("province-detail");
let activeRegion = "ทั้งหมด";

const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

function handleScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 45);
  backToTop.classList.toggle("visible", window.scrollY > 650);
}
window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

function closeMenu() {
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "เปิดเมนู");
  menuToggle.innerHTML = '<i class="bi bi-list"></i>';
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "ปิดเมนู" : "เปิดเมนู");
  menuToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

function renderFilters() {
  const regions = ["ทั้งหมด", ...new Set(destinations.map(place => place.region))];
  filters.innerHTML = regions.map(region =>
    '<button class="filter-btn ' + (region === activeRegion ? "active" : "") +
    '" type="button" data-region="' + escapeHTML(region) +
    '" aria-pressed="' + (region === activeRegion) + '">' +
    escapeHTML(region) + '</button>'
  ).join("");
}

function renderProvinces() {
  const visible = activeRegion === "ทั้งหมด" ? destinations : destinations.filter(place => place.region === activeRegion);
  grid.innerHTML = visible.map(place => {
    const number = String(destinations.indexOf(place) + 1).padStart(2, "0");
    return '<article class="destination-card" style="--card-accent:' + escapeHTML(place.accent) + '">' +
      '<img src="' + escapeHTML(place.image) + '" alt="ภาพบรรยากาศจังหวัด' + escapeHTML(place.name) + '" loading="lazy">' +
      '<div class="card-shade"></div><div class="card-top"><span>' + number + ' / 06</span><span>' + escapeHTML(place.region) + '</span></div>' +
      '<div class="card-content"><small>' + escapeHTML(place.mood) + '</small><h3>' + escapeHTML(place.name) + '</h3>' +
      '<p>' + escapeHTML(place.tagline) + '</p><span class="card-link">เปิดบันทึกการเดินทาง <i class="bi bi-arrow-up-right"></i></span></div>' +
      '<button class="card-click" type="button" data-id="' + escapeHTML(place.id) + '" aria-label="เปิดคู่มือท่องเที่ยวจังหวัด' +
      escapeHTML(place.name) + '"></button></article>';
  }).join("");
}

function mapLink(place, location) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(location + " " + place.name);
}

function renderDetail(place) {
  const index = destinations.indexOf(place) + 1;
  const attractions = place.attractions.map((item, itemIndex) =>
    '<article class="journal-card"><div class="journal-icon"><i class="bi ' + escapeHTML(item[2]) + '"></i></div>' +
    '<span>0' + (itemIndex + 1) + '</span><h4>' + escapeHTML(item[0]) + '</h4><p>' + escapeHTML(item[1]) + '</p>' +
    '<a href="' + mapLink(place, item[0]) + '" target="_blank" rel="noopener noreferrer">ดูแผนที่ <i class="bi bi-arrow-up-right"></i></a></article>'
  ).join("");
  const foods = place.foods.map((item, itemIndex) =>
    '<article class="food-card"><span>0' + (itemIndex + 1) + '</span><div><h4>' + escapeHTML(item[0]) +
    '</h4><p>' + escapeHTML(item[1]) + '</p></div></article>'
  ).join("");
  const stays = place.stays.map(item =>
    '<article class="stay-card"><i class="bi bi-house-heart"></i><div><h4>' + escapeHTML(item[0]) +
    '</h4><p>' + escapeHTML(item[1]) + '</p></div></article>'
  ).join("");
  const itinerary = place.itinerary.map(day =>
    '<article class="day-card"><span>' + escapeHTML(day[0]) + '</span><h4>' + escapeHTML(day[1]) + '</h4><ol>' +
    day[2].map(item => '<li>' + escapeHTML(item) + '</li>').join("") + '</ol></article>'
  ).join("");
  const tips = place.tips.map(tip => '<li><i class="bi bi-check2"></i>' + escapeHTML(tip) + '</li>').join("");
  const nextPlace = destinations[index % destinations.length];

  detail.style.setProperty("--detail-accent", place.accent);
  detail.innerHTML =
    '<div class="detail-hero"><img src="' + escapeHTML(place.image) + '" alt="ภาพท่องเที่ยวจังหวัด' + escapeHTML(place.name) + '">' +
    '<div class="detail-overlay"></div><button id="close-detail" class="detail-close" type="button"><i class="bi bi-x-lg"></i><span>ปิด</span></button>' +
    '<div class="detail-hero-content"><p>DESTINATION 0' + index + ' · ' + escapeHTML(place.region) + '</p><h2>' + escapeHTML(place.name) +
    '</h2><span>' + escapeHTML(place.english) + '</span><strong>' + escapeHTML(place.tagline) + '</strong></div></div>' +
    '<nav class="detail-nav" aria-label="เมนูคู่มือจังหวัด"><a href="#detail-overview">ภาพรวม</a><a href="#detail-attractions">เที่ยว</a>' +
    '<a href="#detail-food">กิน</a><a href="#detail-stay">พัก</a><a href="#detail-itinerary">แผน 2 วัน</a></nav>' +
    '<div class="detail-body"><section id="detail-overview" class="detail-overview"><div><p class="detail-label">WHY ' +
    escapeHTML(place.english).toUpperCase() + '</p><h3>' + escapeHTML(place.description) + '</h3></div>' +
    '<div class="quick-facts"><div><i class="bi bi-calendar3"></i><span>ช่วงน่าเที่ยว</span><strong>' + escapeHTML(place.bestTime) +
    '</strong></div><div><i class="bi bi-hourglass-split"></i><span>ระยะเวลาแนะนำ</span><strong>' + escapeHTML(place.duration) +
    '</strong></div><div><i class="bi bi-signpost-2"></i><span>การเดินทาง</span><strong>' + escapeHTML(place.transport) +
    '</strong></div></div></section>' +
    '<section id="detail-attractions" class="journal-section"><header class="journal-heading"><div><p class="detail-label">PLACES TO VISIT</p>' +
    '<h3>3 จุดที่ไม่ควรพลาด</h3></div><p>ทำความรู้จักจังหวัดผ่านภูมิประเทศ ประวัติศาสตร์ และวิถีชุมชน</p></header>' +
    '<div class="journal-grid">' + attractions + '</div></section>' +
    '<section id="detail-food" class="taste-section"><div class="taste-heading"><p class="detail-label">LOCAL TASTE</p>' +
    '<h3>ชิมเรื่องราว<br>ผ่านอาหาร</h3><p>อาหารท้องถิ่นสะท้อนภูมิอากาศ วัตถุดิบ และความทรงจำของผู้คนในพื้นที่</p></div>' +
    '<div class="food-list">' + foods + '</div></section>' +
    '<section id="detail-stay" class="stay-section"><header><p class="detail-label">WHERE TO STAY</p><h3>เลือกย่านพักให้เข้ากับทริป</h3></header>' +
    '<div class="stay-grid">' + stays + '</div></section>' +
    '<section id="detail-itinerary" class="itinerary-section"><header><p class="detail-label">48 HOURS IN ' +
    escapeHTML(place.english).toUpperCase() + '</p><h3>ตัวอย่างแผนเที่ยว 2 วัน</h3></header><div class="itinerary-grid">' + itinerary + '</div></section>' +
    '<section class="travel-notes"><div><p class="detail-label">TRAVEL NOTES</p><h3>รู้ไว้ก่อนออกเดินทาง</h3></div><ul>' + tips + '</ul></section>' +
    '<div class="detail-actions"><a href="' + mapLink(place, place.name) + '" target="_blank" rel="noopener noreferrer" class="btn-primary">' +
    'เปิดจังหวัดใน Google Maps <i class="bi bi-geo-alt"></i></a><button type="button" class="next-place" data-next="' +
    escapeHTML(nextPlace.id) + '">จุดหมายถัดไป · ' + escapeHTML(nextPlace.name) + ' <i class="bi bi-arrow-right"></i></button></div></div>';
}

function showProvince(id, shouldScroll = true) {
  const place = destinations.find(item => item.id === id);
  if (!place) return;
  renderDetail(place);
  detail.hidden = false;
  if (shouldScroll) requestAnimationFrame(() => detail.scrollIntoView({ behavior: "smooth", block: "start" }));
}

filters.addEventListener("click", event => {
  const button = event.target.closest("[data-region]");
  if (!button) return;
  activeRegion = button.dataset.region;
  detail.hidden = true;
  renderFilters();
  renderProvinces();
});
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-id]");
  if (button) showProvince(button.dataset.id);
});
detail.addEventListener("click", event => {
  if (event.target.closest("#close-detail")) {
    detail.hidden = true;
    document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const next = event.target.closest("[data-next]");
  if (next) showProvince(next.dataset.next, false);
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -35px" });
document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const trackedSections = document.querySelectorAll("#home, #story, #destinations, #experience, #plan");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
    });
  });
}, { rootMargin: "-28% 0px -62% 0px" });
trackedSections.forEach(section => sectionObserver.observe(section));

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (navLinks.classList.contains("open")) closeMenu();
  else if (!detail.hidden) {
    detail.hidden = true;
    document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
  }
});

renderFilters();
renderProvinces();
