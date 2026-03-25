// Loader
window.addEventListener("load", () => {
  document.getElementById("loader").style.display = "none";
});

// Scroll Reveal
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
});

reveals.forEach(el => observer.observe(el));

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle(
    "scrolled",
    window.scrollY > 50
  );
});
