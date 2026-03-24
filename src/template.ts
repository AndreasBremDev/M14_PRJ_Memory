export function renderCardsHTML(i:number) {
    console.log('test renderCardsHTML');
    
    return /* html */`
    <article class="field">
        <button class="card">
            <div class="card__inner">
                <div class="card__face">
                    <img src="./assets/img/3_card_front_DA_icon.svg" alt="Developer Academy logo">
                </div>
                <div class="card__face card__face--back">
                    <img src="./assets/img/3_theme1_card_1.png" alt="image github">
                </div>
            </div>
        </button>
    </article>`
}