// 🔁 Funzione principale che si attiva quando il contenuto della pagina è completamente caricato
document.addEventListener('DOMContentLoaded', () => {
    setupImageClickAnimation(); // Imposta l'animazione di clic sulle immagini della galleria
    setupScrollEffect(); // Imposta l'effetto di fade-in e scorrimento per gli elementi
    setupHorizontalScroll('.gallery'); // Abilita lo scroll orizzontale nella galleria
    setupGalleryNavigation('.gallery', '.button-left', '.button-right'); // Configura la navigazione a sinistra e a destra nella galleria
    setupModalWithNavigation(); // Configura la modale con la navigazione tra le immagini
});

// 🔄 Funzione per mostrare/nascondere i pulsanti di navigazione della galleria
function toggleGalleryButtons(show) {
    const display = show ? 'block' : 'none'; // Se 'show' è true, mostra i pulsanti, altrimenti nascondili
    document.querySelectorAll('.button-left, .button-right').forEach(btn => {
        btn.style.display = display; // Imposta la visibilità dei pulsanti
    });
}

// 🔍 Funzione per aggiungere l'animazione di ingrandimento al clic su un'immagine
function setupImageClickAnimation() {
    document.querySelectorAll('.gallery-item').forEach(img => {
        img.addEventListener('click', () => {
            // Animazione per ingrandire l'immagine
            img.style.transition = 'transform 0.3s ease';
            img.style.transform = 'scale(1.5)';
            // Ritorna all'ingrandimento normale dopo 500 ms
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 500);
        });
    });
}

// ⚡ Funzione per aggiungere un effetto di scorrimento sui componenti visibili nella pagina
function setupScrollEffect() {
    window.addEventListener('scroll', () => {
        // Applica un effetto di fade-in e movimento verticale agli elementi visibili
        document.querySelectorAll('.contacts, .gallery-item').forEach(el => {
            const isVisible = el.getBoundingClientRect().top < window.innerHeight; // Verifica se l'elemento è visibile
            // Modifica opacità e posizione per creare l'effetto
            el.style.opacity = isVisible ? 1 : 0;
            el.style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
            el.style.transition = 'opacity 1s ease, transform 1s ease'; // Transizioni fluide
        });
    });
}

// 🖱️ Funzione per abilitare lo scroll orizzontale tramite il mouse
function setupHorizontalScroll(gallerySelector) {
    const gallery = document.querySelector(gallerySelector);
    if (!gallery) return; // Se la galleria non esiste, esci dalla funzione

    let isDragging = false, startX = 0, scrollLeft = 0;

    // Inizia il drag (trascinamento) quando l'utente preme il mouse
    gallery.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.pageX - gallery.offsetLeft; // Calcola la posizione iniziale del mouse
        scrollLeft = gallery.scrollLeft; // Salva la posizione di scroll iniziale
        gallery.style.cursor = 'grabbing'; // Cambia il cursore quando si sta trascinando
    });

    // Ferma il drag quando l'utente rilascia il mouse
    gallery.addEventListener('mouseup', () => {
        isDragging = false;
        gallery.style.cursor = 'default'; // Ripristina il cursore
    });

    // Ferma il drag quando il mouse esce dalla galleria
    gallery.addEventListener('mouseleave', () => {
        isDragging = false;
        gallery.style.cursor = 'default'; // Ripristina il cursore
    });

    // Muove la galleria durante il drag
    gallery.addEventListener('mousemove', e => {
        if (!isDragging) return; // Se non si sta trascinando, non fare nulla
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 1.5; // Calcola la distanza percorsa
        gallery.scrollLeft = scrollLeft - walk; // Scorre la galleria orizzontalmente
    });

    // Abilita lo scroll con la rotella del mouse
    gallery.addEventListener('wheel', e => {
        e.preventDefault();
        gallery.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' }); // Scorre la galleria in modo fluido
    });
}

// ⬅️➡️ Funzione per la navigazione a sinistra e destra nella galleria
function setupGalleryNavigation(gallerySelector, leftButtonSelector, rightButtonSelector) {
    const gallery = document.querySelector(gallerySelector),
          leftButton = document.querySelector(leftButtonSelector),
          rightButton = document.querySelector(rightButtonSelector);

    if (!gallery || !leftButton || !rightButton) return; // Se gli elementi non esistono, esci dalla funzione

    // Calcola la distanza da scorrere per ogni clic (40% della larghezza della galleria)
    const scrollAmount = () => gallery.clientWidth * 0.4;

    // Funzione per aggiornare la visibilità dei pulsanti
    const updateButtonVisibility = () => {
        leftButton.style.visibility = gallery.scrollLeft <= 0 ? 'hidden' : 'visible'; // Nasconde il pulsante sinistro se all'inizio
        rightButton.style.visibility = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth ? 'hidden' : 'visible'; // Nasconde il pulsante destro se alla fine
    };

    // Eventi per navigare a sinistra e destra
    leftButton.addEventListener('click', () => {
        gallery.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }); // Scorre a sinistra
    });

    rightButton.addEventListener('click', () => {
        gallery.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); // Scorre a destra
    });

    gallery.addEventListener('scroll', updateButtonVisibility); // Aggiunge l'evento di scroll per aggiornare la visibilità dei pulsanti
    updateButtonVisibility(); // Inizializza la visibilità dei pulsanti
}

// 🖼️ Funzione per gestire la modale di visualizzazione immagine con navigazione
function setupModalWithNavigation() {
    const images = Array.from(document.querySelectorAll('.gallery-item')); // Ottieni tutte le immagini della galleria
    const modal = document.getElementById('image-modal'); // Ottieni l'elemento modale
    const modalImg = document.getElementById('modal-img'); // Ottieni l'immagine all'interno della modale
    const closeModal = document.getElementById('close-modal'); // Ottieni il pulsante di chiusura
    const prevBtn = document.getElementById('modal-prev'); // Ottieni il pulsante "precedente"
    const nextBtn = document.getElementById('modal-next'); // Ottieni il pulsante "successivo"
    let currentIndex = 0; // Indice per la gestione della navigazione nelle immagini

    if (!modal || !modalImg || !closeModal || !prevBtn || !nextBtn || images.length === 0) return; // Se uno degli elementi non esiste, esci dalla funzione

    // Funzione per mostrare l'immagine nella modale in base all'indice
    function showImage(index) {
        if (images[index]) {
            modalImg.src = images[index].src; // Imposta l'immagine nella modale
            currentIndex = index; // Aggiorna l'indice
        }
    }

    // Mostra la modale al doppio clic su un'immagine e carica l'immagine
    images.forEach((img, index) => {
        img.addEventListener('dblclick', () => {
            modal.style.display = 'flex'; // Mostra la modale
            showImage(index); // Mostra l'immagine cliccata
            toggleGalleryButtons(false); // Nascondi i pulsanti di navigazione della galleria
        });
    });

    // Gestione della navigazione tra le immagini (previ e successivi)
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length; // Naviga verso l'immagine precedente
        showImage(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length; // Naviga verso l'immagine successiva
        showImage(currentIndex);
    });

    // Chiusura della modale quando si clicca sul pulsante di chiusura
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none'; // Nascondi la modale
        toggleGalleryButtons(true); // Mostra i pulsanti della galleria
    });

    // Chiusura della modale se si clicca all'esterno della modale
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none'; // Nascondi la modale
            toggleGalleryButtons(true); // Mostra i pulsanti della galleria
        }
    });

    // Gestione della navigazione tramite tasti freccia o Escape
    window.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowRight') nextBtn.click(); // Freccia destra
            if (e.key === 'ArrowLeft') prevBtn.click(); // Freccia sinistra
            if (e.key === 'Escape') {
                modal.style.display = 'none'; // Chiudi la modale con il tasto Escape
                toggleGalleryButtons(true); // Mostra i pulsanti della galleria
            }
        }
    });
}