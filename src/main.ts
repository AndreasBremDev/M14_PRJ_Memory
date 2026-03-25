import './scss/main.scss';
import { renderCardsHTML } from './template';

let settingIsChecked: (0 | 1)[] = [0, 0, 0];
let selectedTheme: string = 'theme1';
let selectedPlayer: number = 1;
let selectedCards: number = 24;
let cardsArr: number[] = [];


init();

function init() {
    applyThemeToSectionScreenGame(selectedTheme);
    registerEventListener_TitlePageStartBtn();
    registerEventListener_SectionSetting();
    registerEventListener_SectionSetting_StartGame();
}

function registerEventListener_TitlePageStartBtn(): void {
    const titleBtnPlay = document.getElementById('titleBtnPlay') as HTMLButtonElement;
    if (titleBtnPlay) {
        titleBtnPlay.addEventListener('click', () => showSection(1))
    }
}

function showSection(sectionNr: number): void {
    let test = document.querySelectorAll('body > section') as NodeListOf<HTMLElement>;
    test.forEach(elem => elem.style.display = 'none');
    test[sectionNr].style.display = 'flex';
}

function registerEventListener_SectionSetting(): void {
    const sourceArr = document.querySelectorAll('input') as NodeList;
    sourceArr.forEach(source => {
        source.addEventListener('click', (event: Event) => {
            let { sourceIdName, sourceIdNr }: { sourceIdName: string; sourceIdNr: string; } = retrieveElementIdentifiers(event);
            setText_SectionSetting(event, sourceIdName);
            actionBasedOnSelection_SectionSetting(sourceIdNr, sourceIdName);
            settingsValidation();
        })
    })
}

function actionBasedOnSelection_SectionSetting(sourceIdNr: string, sourceIdName: string): void {
    switch (sourceIdName) {
        case 'theme':
            actionBasedOnSelection_theme(sourceIdNr);
            break;
        case 'player':
            actionBasedOnSelection_player(sourceIdNr);
            break;
        case 'board':
            actionBasedOnSelection_board(sourceIdNr);
            break;
        default:
            break;
    }
}

function actionBasedOnSelection_board(sourceIdNr: string) {
    if (sourceIdNr === '1') {
        selectedCards = 16;
    } else if (sourceIdNr === '2') {
        selectedCards = 24;
    } else if (sourceIdNr === '3') {
        selectedCards = 32;
    } else {
        selectedCards = 16;
    }
    settingIsChecked[2] = 1;
}

function actionBasedOnSelection_player(sourceIdNr: string) {
    selectedPlayer = parseInt(sourceIdNr);
    settingIsChecked[1] = 1;
}

function actionBasedOnSelection_theme(sourceIdNr: string) {
    selectedTheme = `theme${sourceIdNr}`;
    updateImgSrc(sourceIdNr);
    applyThemeToSectionScreenGame(selectedTheme);
    settingIsChecked[0] = 1;
}

function retrieveElementIdentifiers(event: Event) {
    let sourceElem = event.target as HTMLInputElement;
    let sourceIdName: string = sourceElem.id.slice(0, -1);
    let sourceIdNr: string = sourceElem.id.slice(-1);
    return { sourceIdName, sourceIdNr };
}

function setText_SectionSetting(event: Event, sourceIdName: string): void {
    let sourceElem = event.target as HTMLInputElement;
    let sourceValue: string = sourceElem.value;
    let targetElem = document.querySelector(`div.settings__start-section > [id^=${sourceIdName}`) as HTMLElement;
    targetElem.innerText = sourceValue;
}

function updateImgSrc(sourceIdNr: string): void {
    let targetElem = document.getElementById('settingThemeExample') as HTMLImageElement;
    targetElem.src = targetElem.src.slice(0, -5) + sourceIdNr + targetElem.src.slice(-4, targetElem.src.length);
}

function applyThemeToSectionScreenGame(themeName: string): void {
    const sectionScreenGame = document.querySelector('.screen-game') as HTMLElement | null;
    if (sectionScreenGame) {
        sectionScreenGame.dataset.theme = themeName;
    }

}

function settingsValidation(): void {
    let settingsStartGameBtn = document.getElementById('settingsStartGameBtn') as HTMLButtonElement;
    if (settingsStartGameBtn) {
        let settingAllChecked = settingIsChecked.every(el => el === 1)
        if (settingAllChecked) {
            toggleDisableStartGameBtn(settingsStartGameBtn, false);
        } else {
            toggleDisableStartGameBtn(settingsStartGameBtn, true);
        }
    }
}

function toggleDisableStartGameBtn(elem: HTMLButtonElement, bool: boolean): void {
    elem.disabled = bool;
    elem.setAttribute('aria-disabled', `${bool}`);
}

function registerEventListener_SectionSetting_StartGame(): void {
    let settingsStartGameBtn = document.getElementById('settingsStartGameBtn') as HTMLButtonElement;
    if (settingsStartGameBtn) {
        settingsStartGameBtn.addEventListener('click', startGame)
    }
}

function startGame() {
    if (settingIsChecked.every(el => el === 1)) {
        showSection(2);
        setCardsArray(selectedCards)
        shuffleArray(cardsArr);
        renderCards(cardsArr);
        registerEventListener_flipCard();
    }
}

intermediate();
function intermediate() {
    setCardsArray(selectedCards)
    shuffleArray(cardsArr);
    console.log(cardsArr);
    
    renderCards(cardsArr);
    
    registerEventListener_flipCard();
}

function renderCards(arr: number[]) {
    let gameField = document.getElementById('gameField') as HTMLElement;
    if (gameField) {
        gameField.innerHTML = '';
        if (arr.length === 0) return;
        for (let i = 0; i < arr.length; i++) {
            gameField.innerHTML += renderCardsHTML(arr[i]);
        }
    }
}

function setCardsArray(selectedCards: number): number[] {
    for (let i = 0; i < selectedCards; i++) {
        cardsArr[i] = i % (selectedCards / 2)
    }
    return cardsArr;
}

function shuffleArray(cardsArr: number[]): number[] {
    for (let i = cardsArr.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        [cardsArr[i], cardsArr[random]] = [cardsArr[random], cardsArr[i]];
    }
    return cardsArr;
}

function registerEventListener_flipCard(): void {
    const fieldRef = document.querySelectorAll('.game__field__article') as NodeListOf<HTMLElement>;
    if (fieldRef) {
        fieldRef.forEach(item => item.addEventListener('click', e => {
            const card = (e.target as HTMLElement).closest('.game__field__card') as HTMLButtonElement;
            if (card) {
                card.classList.toggle('is-flipped');
            }
        }))
    }
}

