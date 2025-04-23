// 🎉 Attende che il contenuto della pagina sia completamente caricato
document.addEventListener('DOMContentLoaded', () => {
    // Ottieni il bottone con l'ID 'entrata-btn'
    const entrataBtn = document.getElementById('entrata-btn');

    // Verifica se il bottone esiste nella pagina
    if (entrataBtn) {
        // Aggiungi un evento di click al bottone
        entrataBtn.addEventListener('click', () => {
            // Log del click per debug
            console.log("Bottone cliccato!");
            
            // Cambia la posizione della finestra al file 'Gallery.html' quando il bottone viene cliccato
            window.location.href = 'Gallery.html';
        });
    } else {
        // Se il bottone non è stato trovato, mostra un avviso in console
        console.warn("❌ Bottone non trovato!");
    }
});