
export function renderCardsHTML(i:number) {
    return /* html */`
    <article class="game__field__article">
        <button class="game__field__card">
            <div class="game__field__card__inner">
                <div class="game__field__card__face">
                    <img src="./assets/img/3_card_front_DA_icon.svg" alt="Developer Academy logo">
                </div>
                <div class="game__field__card__face game__field__card__face--back">
                    <img src="./assets/img/3_theme1_card_${i+1}.png" alt="image github">
                </div>
            </div>
        </button>
    </article>`
}