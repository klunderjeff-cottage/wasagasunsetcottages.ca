document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger-btn");
    const nav = document.querySelector(".main-nav");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        nav.classList.toggle("open");
    });
});
