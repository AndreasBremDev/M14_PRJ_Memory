import './scss/main.scss';

// flipCard();

function flipCard(): void {
    const fieldRef = document.getElementById('field');
    if (fieldRef) {
        fieldRef.addEventListener('click', e => {
            const card = (e.target as HTMLElement).closest('.card') as HTMLButtonElement;
            if (card) {
                card.classList.toggle('is-flipped')
            }
        })
    }
}

function updateSettingsSelectionToStartText(input: string): void {
    const source = document.getElementById(input) as HTMLInputElement;
    source?.addEventListener('onchange', () => {
        let index: number = parseInt(input.substring(input.length - 1)) - 1;
        let id: string = input.slice(0, input.length - 1)
        const target = document.getElementById(id + 'Text') as HTMLElement;
        target.innerText = source.value;
    })
}

function settingsSelection(id: string) {
    const elemRef = document.getElementById(id);
}