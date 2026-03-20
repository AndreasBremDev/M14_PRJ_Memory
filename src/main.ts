import './scss/main.scss';
    
flipCard();

function flipCard():void {
    const fieldRef = document.getElementById('field');
    if (fieldRef) {
        fieldRef.addEventListener('click', e => {
            const card = (e.target as HTMLElement).closest('.card') as HTMLButtonElement;
            if(card) {
                card.classList.toggle('is-flipped')
            }
        })
    }
}

function settingsSelection() {
    
}