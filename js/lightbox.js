
const galleryImages = document.querySelectorAll(".gallery-image");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

let currentIndex = 0;

function showImage(index) {
    currentIndex = index;
    lightboxImg.src = galleryImages[index].src;
}

galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => {
        lightbox.classList.add("active");
        showImage(index);
    });
});

document.querySelector(".lightbox-next").addEventListener("click", (e) => {
    e.stopPropagation();

    currentIndex++;

    if (currentIndex >= galleryImages.length) {
        currentIndex = 0;
    }

    showImage(currentIndex);
});

document.querySelector(".lightbox-prev").addEventListener("click", (e) => {
    e.stopPropagation();

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = galleryImages.length - 1;
    }

    showImage(currentIndex);
});

lightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
});

document.addEventListener("keydown", (e) => {

    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
        lightbox.classList.remove("active");
    }

    if (e.key === "ArrowRight") {
        document.querySelector(".lightbox-next").click();
    }

    if (e.key === "ArrowLeft") {
        document.querySelector(".lightbox-prev").click();
    }
});
