async function loadBanner() {
    try {
        const res = await fetch("js/banner.json");
        const banner = await res.json();

        const container = document.getElementById("dynamic-banner");
        if (!container) return;

        container.innerHTML = `
            <div class="image-banner">
                <img src="${banner.image}" alt="Banner Image">
                <div class="image-banner-text">
                    <h2>${banner.title}</h2>
                    <p>${banner.subtitle}</p>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Banner failed to load:", err);
    }
}

loadBanner();
