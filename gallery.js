const galleryImages = [
    { src: "images/gallery/sunset.JPG", alt: "At sunset", description: "Beautiful sunset view from the beach." },
    { src: "images/gallery/ourcottages.jpg", alt: "Our Cottages", description: "Our cozy cottages just steps from the shoreline." },
    { src: "images/gallery/wasaga1.JPG", alt: "Wasaga" },
    { src: "images/gallery/wasaga2.JPG", alt: "Wasaga" }
];
/*
function renderGallery(containerId = "gallery-grid") {
    const container = document.getElementById(containerId);
    if (!container) return;

    galleryImages.forEach((img, index) => {
        const el = document.createElement("img");
        el.src = img.src;
        el.alt = img.alt || "";
        el.loading = "lazy"; // LAZY LOADING
        el.dataset.index = index; // for swipe navigation
        el.addEventListener("click", openLightbox);
        container.appendChild(el);
    });
}
*/

function renderGallery(containerId = "gallery-grid") {

    const container = document.getElementById(containerId);
    if (!container) return;

    galleryImages.forEach((img, index) => {

        const card = document.createElement("div");
        card.className = "gallery-card";

        const image = document.createElement("img");
        image.src = img.src;
        image.alt = img.alt || "";
        image.loading = "lazy";
        image.dataset.index = index;
        image.addEventListener("click", openLightbox);

        const caption = document.createElement("p");
        caption.className = "gallery-caption";
        caption.textContent = img.description || "";

        card.appendChild(image);
        card.appendChild(caption);

        container.appendChild(card);

    });

}
/* ------------------------------
   LIGHTBOX
--------------------------------*/
function openLightbox(e) {
    const index = parseInt(e.target.dataset.index);
    showImage(index);
    document.getElementById("lightbox").classList.add("active");
}

function showImage(index) {
    const img = galleryImages[index];
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = img.src;
    lightboxImg.dataset.index = index;
}

document.getElementById("lightbox").addEventListener("click", () => {
    document.getElementById("lightbox").classList.remove("active");
});

/* ------------------------------
   MOBILE SWIPE
--------------------------------*/
let startX = 0;

document.getElementById("lightbox-img").addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

document.getElementById("lightbox-img").addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    const currentIndex = parseInt(document.getElementById("lightbox-img").dataset.index);

    if (diff > 50 && currentIndex > 0) {
        showImage(currentIndex - 1); // swipe left → previous
    } else if (diff < -50 && currentIndex < galleryImages.length - 1) {
        showImage(currentIndex + 1); // swipe right → next
    }
});
