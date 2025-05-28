// 🔁 Funzione principale che si attiva quando il contenuto della pagina è completamente caricato
document.addEventListener('DOMContentLoaded', () => {
    setupImageClickAnimation(); // Imposta animazione di clic sulle immagini
    setupScrollEffect(); // Imposta effetto fade-in e scroll sugli elementi
    setupHorizontalScroll('.gallery'); // Abilita scroll orizzontale della galleria

    handleResponsiveGallery(); // Imposta navigazione o solo scroll in base al dispositivo

    setupModalWithNavigation(); // Configura la modale con navigazione tra immagini

    // Riadatta se la finestra viene ridimensionata
    window.addEventListener('resize', handleResponsiveGallery);
});

// 📱 Funzione per rilevare se il dispositivo è mobile (smartphone o tablet)
function isMobileDevice() {
    return window.innerWidth <= 768; // Considera mobile sotto i 768px di larghezza
}

// 🔄 Funzione per gestire i pulsanti della galleria in base al dispositivo
function handleResponsiveGallery() {
    if (isMobileDevice()) {
        toggleGalleryButtons(false); // Su mobile nascondi i pulsanti
    } else {
        toggleGalleryButtons(true); // Su desktop mostra i pulsanti
        setupGalleryNavigation('.gallery', '.button-left', '.button-right'); // Imposta navigazione solo su desktop
    }
}

// 🔄 Funzione per mostrare o nascondere i pulsanti di navigazione della galleria
function toggleGalleryButtons(show) {
    const display = show ? 'block' : 'none'; // Se 'show' è true mostra, altrimenti nascondi
    document.querySelectorAll('.button-left, .button-right').forEach(btn => {
        btn.style.display = display;
    });
}

// 🔍 Funzione per aggiungere animazione di ingrandimento cliccando su un'immagine
function setupImageClickAnimation() {
    document.querySelectorAll('.gallery-item').forEach(img => {
        img.addEventListener('click', () => {
            img.style.transition = 'transform 0.3s ease';
            img.style.transform = 'scale(1.5)'; // Ingrandisci
            setTimeout(() => {
                img.style.transform = 'scale(1)'; // Torna alla dimensione originale
            }, 500);
        });
    });
}

// ⚡ Funzione per aggiungere un effetto di fade-in durante lo scroll della pagina
function setupScrollEffect() {
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.contacts, .gallery-item').forEach(el => {
            const isVisible = el.getBoundingClientRect().top < window.innerHeight;
            el.style.opacity = isVisible ? 1 : 0;
            el.style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
            el.style.transition = 'opacity 1s ease, transform 1s ease';
        });
    });
}

// 🖱️ Funzione per abilitare lo scroll orizzontale tramite drag e rotella del mouse
function setupHorizontalScroll(gallerySelector) {
    const gallery = document.querySelector(gallerySelector);
    if (!gallery) return;

    let isDragging = false, startX = 0, scrollLeft = 0;

    // Inizia il trascinamento
    gallery.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
        gallery.style.cursor = 'grabbing';
    });

    // Fine trascinamento
    gallery.addEventListener('mouseup', () => {
        isDragging = false;
        gallery.style.cursor = 'default';
    });

    // Se il mouse esce dalla galleria, interrompe il trascinamento
    gallery.addEventListener('mouseleave', () => {
        isDragging = false;
        gallery.style.cursor = 'default';
    });

    // Durante il trascinamento, muove la galleria
    gallery.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 1.5; // Quanto muovere
        gallery.scrollLeft = scrollLeft - walk;
    });

    // Scroll orizzontale anche usando la rotella del mouse
    gallery.addEventListener('wheel', e => {
        e.preventDefault();
        gallery.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' });
    });
}

// ⬅️➡️ Funzione per la navigazione della galleria tramite pulsanti
function setupGalleryNavigation(gallerySelector, leftButtonSelector, rightButtonSelector) {
    const gallery = document.querySelector(gallerySelector),
          leftButton = document.querySelector(leftButtonSelector),
          rightButton = document.querySelector(rightButtonSelector);

    if (!gallery || !leftButton || !rightButton) return;

    const scrollAmount = () => gallery.clientWidth * 0.4; // 40% della larghezza per ogni click

    // Aggiorna la visibilità dei pulsanti in base alla posizione
    const updateButtonVisibility = () => {
        leftButton.style.visibility = gallery.scrollLeft <= 0 ? 'hidden' : 'visible';
        rightButton.style.visibility = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth ? 'hidden' : 'visible';
    };

    leftButton.addEventListener('click', () => {
        gallery.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    rightButton.addEventListener('click', () => {
        gallery.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    gallery.addEventListener('scroll', updateButtonVisibility);

    updateButtonVisibility(); // Inizializza la visibilità
}

// 🖼️ Funzione per gestire la modale di visualizzazione immagini con navigazione interna
function setupModalWithNavigation() {
    const images = Array.from(document.querySelectorAll('.gallery-item'));
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.getElementById('close-modal');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    let currentIndex = 0;

    if (!modal || !modalImg || !closeModal || !prevBtn || !nextBtn || images.length === 0) return;

    // Mostra immagine nella modale
    function showImage(index) {
        if (images[index]) {
            modalImg.src = images[index].src;
            currentIndex = index;
        }
    }

    // Doppio clic sull'immagine per aprire la modale
    images.forEach((img, index) => {
        img.addEventListener('dblclick', () => {
            modal.style.display = 'flex';
            showImage(index);
            toggleGalleryButtons(false); // Nasconde i pulsanti quando la modale è aperta
        });
    });

    // Naviga tra le immagini
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    // Chiude la modale
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        toggleGalleryButtons(true); // Mostra nuovamente i pulsanti
    });

    // Chiude la modale cliccando fuori
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            toggleGalleryButtons(true);
        }
    });

    // Gestisce i tasti della tastiera nella modale
    window.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                toggleGalleryButtons(true);
            }
        }
    });
}
