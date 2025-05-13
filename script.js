const pages = document.querySelectorAll('.page');
let currentPageIndex = 0;

function showPage(index, direction = 'next') {
    if (index < 0 || index >= pages.length) return;

    const oldPage = pages[currentPageIndex];
    const newPage = pages[index];

    oldPage.classList.remove('active');
    if (direction === 'next') {
        oldPage.classList.add('prev-exit'); // Anima l'uscita a sinistra
        newPage.style.transform = 'translateX(100%)'; // Posiziona la nuova a destra
    } else { // direction === 'prev'
        oldPage.style.transform = 'translateX(100%)'; // Anima l'uscita a destra
        newPage.style.transform = 'translateX(-100%)'; // Posiziona la nuova a sinistra
    }
    
    // Forza reflow per applicare le transform iniziali prima della transizione
    void newPage.offsetWidth; 

    newPage.classList.add('active');
    newPage.style.transform = 'translateX(0)';


    // Pulisci le classi di animazione dopo che la transizione è completata
    // per la pagina che esce
    setTimeout(() => {
        oldPage.classList.remove('prev-exit');
        if (currentPageIndex !== index) { // Evita di reimpostare la transform se è la stessa pagina
             if (direction === 'next') {
                oldPage.style.transform = 'translateX(100%)';
            } else {
                oldPage.style.transform = 'translateX(-100%)';
            }
        }
    }, 600); // Deve corrispondere alla durata della transizione CSS

    currentPageIndex = index;
}


function nextPage() {
    if (currentPageIndex < pages.length - 1) {
        showPage(currentPageIndex + 1, 'next');
    }
}

function prevPage() {
    if (currentPageIndex > 0) {
        showPage(currentPageIndex - 1, 'prev');
    }
}

function goToPage(pageIndex) {
    const direction = pageIndex > currentPageIndex ? 'next' : 'prev';
    showPage(pageIndex, direction);
}

// Inizializza la prima pagina (non serve animazione iniziale)
document.addEventListener('DOMContentLoaded', () => {
    if (pages.length > 0) {
        pages[0].style.transform = 'translateX(0)'; // Assicura che la prima pagina sia visibile senza animazione
        // Non è necessario chiamare showPage(0) qui perché la prima pagina ha già 'active'
    }
});