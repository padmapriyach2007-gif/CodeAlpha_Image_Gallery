/* ================================
   CAROUSEL FOR ALL CUISINES
================================ */

const carousels = document.querySelectorAll(".food-carousel");

carousels.forEach(function (carousel) {

    let currentPosition = 0;

    const foodImages = carousel.querySelector(".food-images");
    const images = carousel.querySelectorAll("img");

    const leftButton = carousel.querySelector(".arrow.left");
    const rightButton = carousel.querySelector(".arrow.right");

    const imageWidth = 295; // 275px image + 20px gap
    const visibleImages = 4;

    const maxPosition = Math.max(
        0,
        images.length - visibleImages
    );


    function moveCarousel(direction) {

        currentPosition += direction;

        /* Stop at first image */
        if (currentPosition < 0) {
            currentPosition = 0;
        }

        /* Stop at last image */
        if (currentPosition > maxPosition) {
            currentPosition = maxPosition;
        }

        /* Move images */
        if (foodImages) {
            foodImages.style.transform =
                `translateX(-${currentPosition * imageWidth}px)`;
        }

        updateButtons();
    }


    function updateButtons() {

        /* Left button */
        if (leftButton) {
            leftButton.disabled = currentPosition === 0;
        }

        /* Right button */
        if (rightButton) {
            rightButton.disabled = currentPosition >= maxPosition;
        }
    }


    /* Button actions */
    if (leftButton) {
        leftButton.addEventListener("click", function () {
            moveCarousel(-1);
        });
    }

    if (rightButton) {
        rightButton.addEventListener("click", function () {
            moveCarousel(1);
        });
    }


    /* Initial button state */
    updateButtons();

});


/* ================================
   CUISINE FILTER BUTTONS & TABS
================================ */

const filterButtons = Array.from(
    document.querySelectorAll(".button_css, .filter-btn")
);

const galleryItems =
    document.querySelectorAll(".gallery_item, .gallery-item");


// Function to switch active tab by index
function setActiveTab(index) {
    if (filterButtons.length === 0) return;

    // Loop bounds protection
    let targetIndex = (index + filterButtons.length) % filterButtons.length;
    const button = filterButtons[targetIndex];

    /* Remove active from all buttons */
    filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
    });

    /* Add active to target button */
    button.classList.add("active");

    const filter =
        button.getAttribute("button_filter") || button.getAttribute("data-filter");

    /* Show / hide cuisines */
    galleryItems.forEach(function (item) {

        const category = item.getAttribute("data-category");

        if (filter === "all" || category === filter) {
            item.style.display = "block";
            item.classList.remove("hide");
        } else {
            item.style.display = "none";
            item.classList.add("hide");
        }

    });
}


/* Tab Click Listeners */
filterButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
        setActiveTab(index);
    });
});


/* ================================
   TAB SWITCHING NEXT / PREV CONTROLS
================================ */

const tabPrevBtn = document.getElementById("tab-prev-btn");
const tabNextBtn = document.getElementById("tab-next-btn");

function getActiveTabIndex() {
    return filterButtons.findIndex(btn => btn.classList.contains("active"));
}

if (tabPrevBtn) {
    tabPrevBtn.addEventListener("click", function () {
        let currentIndex = getActiveTabIndex();
        if (currentIndex === -1) currentIndex = 0;
        setActiveTab(currentIndex - 1);
    });
}

if (tabNextBtn) {
    tabNextBtn.addEventListener("click", function () {
        let currentIndex = getActiveTabIndex();
        if (currentIndex === -1) currentIndex = 0;
        setActiveTab(currentIndex + 1);
    });
}


/* ================================
   LIGHTBOX & NEXT / PREV NAVIGATION
================================ */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeBtn = document.getElementById("close-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let activeGalleryItems = [];
let currentLightboxIndex = 0;

function updateLightboxContent(index) {
    if (activeGalleryItems.length === 0) return;

    const item = activeGalleryItems[index];
    const img = item.querySelector("img");
    const captionText = item.querySelector(".overlay span") 
        ? item.querySelector(".overlay span").textContent 
        : img.alt || "";

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = captionText;
}

function openLightbox(item) {
    activeGalleryItems = Array.from(galleryItems).filter(el => {
        return el.style.display !== "none" && !el.classList.contains("hide");
    });

    currentLightboxIndex = activeGalleryItems.indexOf(item);

    if (currentLightboxIndex !== -1) {
        updateLightboxContent(currentLightboxIndex);
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
    }
}

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
}

function showPrevImage() {
    if (activeGalleryItems.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
    updateLightboxContent(currentLightboxIndex);
}

function showNextImage() {
    if (activeGalleryItems.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % activeGalleryItems.length;
    updateLightboxContent(currentLightboxIndex);
}

galleryItems.forEach(item => {
    item.addEventListener("click", function () {
        openLightbox(this);
    });
});

if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
if (prevBtn) prevBtn.addEventListener("click", showPrevImage);
if (nextBtn) nextBtn.addEventListener("click", showNextImage);

if (lightbox) {
    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener("keydown", function (e) {
    if (!lightbox || !lightbox.classList.contains("active")) return;

    if (e.key === "ArrowLeft") {
        showPrevImage();
    } else if (e.key === "ArrowRight") {
        showNextImage();
    } else if (e.key === "Escape") {
        closeLightbox();
    }
});
