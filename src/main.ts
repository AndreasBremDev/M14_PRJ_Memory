import './scss/main.scss';
import { renderCardsHTML } from './template';

interface PlayerUpdate {
    idRef: string;
    htmlIdRef: string[];
}

let settingIsChecked: (0 | 1)[] = [0, 0, 0];
let themeId: number = 1;
let startPlayer: number = 1;
let selectedPlayer: number = 1;
let selectedCards: number = 4;
let cardsArr: number[] = [];
let cardsFlipped: number = 0;
let openCardElements: HTMLElement[] = [];
let player1Count: number = 0;
let player2Count: number = 0;
let playerUpdates: PlayerUpdate[] = [
    { 
        idRef: '1',
        htmlIdRef: ['gamePlayer1Count', 'winPlayer1Count', 'losePlayer1Count']
    },
    {
        idRef: '2',
        htmlIdRef: ['gamePlayer2Count', 'winPlayer2Count', 'losePlayer2Count']
    }
]

init();

function init() {
    applyThemeToSectionScreenGame('theme' + themeId);
    registerEventListener_TitlePageStartBtn();
    registerEventListener_SectionSetting();
    registerEventListener_SectionSetting_StartGame();
    registerEventListener_popoverBtn()
}

function registerEventListener_TitlePageStartBtn(): void {
    const titleBtnPlay = document.getElementById('titleBtnPlay') as HTMLButtonElement;
    if (titleBtnPlay) {
        titleBtnPlay.addEventListener('click', () => showSection(1))
    }
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

function registerEventListener_SectionSetting_StartGame(): void {
    let settingsStartGameBtn = document.getElementById('settingsStartGameBtn') as HTMLButtonElement;
    if (settingsStartGameBtn) {
        settingsStartGameBtn.addEventListener('click', startGame)
    }
}

function registerEventListener_popoverBtn(): void {
    const buttonRef = document.querySelectorAll('#exitGamePopoverCancel, #exitGamePopoverAction, .win__restart-btn') as NodeListOf<HTMLElement>;
    if (buttonRef) {
        buttonRef[0].addEventListener('click',closePopup);
        for (let i = 1; i < buttonRef.length; i++) {
            buttonRef[i].addEventListener('click', restartGame);
        }
    }
}

function showSection(sectionNr: number): void {
    let htmlSection = document.querySelectorAll('body > section, body > main > section') as NodeListOf<HTMLElement>;
    htmlSection.forEach(elem => elem.style.display = 'none');
    htmlSection[sectionNr].style.display = 'flex';
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

function actionBasedOnSelection_theme(sourceIdNr: string) {
    themeId = parseInt(sourceIdNr);
    updateImgPlayerSrc(sourceIdNr, 'settingThemeExample');
    applyThemeToSectionScreenGame('theme' + sourceIdNr);
    settingIsChecked[0] = 1;
}

function actionBasedOnSelection_player(sourceIdNr: string) {
    selectedPlayer = startPlayer = parseInt(sourceIdNr);
    updateImgPlayerSrc(sourceIdNr, 'gameImgPlayerCurrent');
    settingIsChecked[1] = 1;
}

function actionBasedOnSelection_board(sourceIdNr: string) {
    settingIsChecked[2] = 1;
    if (sourceIdNr === '1') {
        return selectedCards = 16;
    } else if (sourceIdNr === '2') {
        return selectedCards = 24;
    } else if (sourceIdNr === '3') {
        return selectedCards = 36;
    } else {
        return selectedCards = 4;
    }
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

function updateImgPlayerSrc(sourceIdNr: string, htmlElem: string): void {
    let targetElem = document.getElementById(htmlElem) as HTMLImageElement;
    if (htmlElem == 'settingThemeExample') {
        targetElem.src = `./assets/img/2_theme_example${sourceIdNr}.png`;
    } else if (htmlElem == 'winningPlayerImg') {
        targetElem.src = `./assets/img/4_theme${themeId}_win_${sourceIdNr}.svg`;
    } else {
        targetElem.src = `./assets/img/3_theme${themeId}_player_${sourceIdNr}.svg`;
    }
}

function applyThemeToSectionScreenGame(themeName: string): void {
    const mainHtmlTag = document.querySelector('main') as HTMLElement | null;
    if (mainHtmlTag) {
        mainHtmlTag.dataset.theme = themeName;
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

function startGame(): void {
    if (settingIsChecked.every(el => el === 1)) {
        showSection(2);
        uncheckRadioButtons();
        setCardsArray(selectedCards)
        shuffleArray(cardsArr);
        renderCards(cardsArr);
        updateImgPlayerSrc('1', 'gameImgPlayer1')
        updateImgPlayerSrc('2', 'gameImgPlayer2')
        registerEventListener_flipCard();
    }
}

function uncheckRadioButtons(): void{
    let elemArray = document.querySelectorAll('input[type="radio"]:checked') as NodeListOf<HTMLInputElement>;
    console.log(elemArray);
    if (elemArray){
        for (let i = 0; i < elemArray.length; i++) {
            elemArray[i].checked = false;
        }
    }
}

function renderCards(arr: number[]): void {
    let gameField = document.getElementById('gameField') as HTMLElement;
    if (gameField) {
        gameField.innerHTML = '';
        if (arr.length === 0) return;
        for (let i = 0; i < arr.length; i++) {
            gameField.innerHTML += renderCardsHTML(arr[i], themeId);
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
    /* Fisher-Yates algorithm */
    for (let i = cardsArr.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        [cardsArr[i], cardsArr[random]] = [cardsArr[random], cardsArr[i]];
    }
    return cardsArr;
}

function registerEventListener_flipCard(): void {
    const fieldRef = document.querySelectorAll('.game__field__article') as NodeListOf<HTMLElement>;
    if (fieldRef) {
        fieldRef.forEach(item => item.addEventListener('click', (event: Event) => flipCard(event)))
    }
}

function flipCard(event: Event): void {
    if (cardsFlipped >= 2) return;
    const card = (event.target as HTMLElement).closest('.game__field__card') as HTMLButtonElement;
    if (!card || card.classList.contains('is-flipped')) return;
    let { id1, id2 } = actionsStandard_flipCard(card);
    if (cardsFlipped == 2) {
        if (checkIfFlippedCardsEqual(id1, id2)) {
            handleCardsEqualActions_flipCard();
        } else {
            handeCardsDifferentActions_flipCard();
        }
    }
}

function handeCardsDifferentActions_flipCard(): void {
    setTimeout(() => {
        openCardElements.forEach(item => item.classList.toggle('is-flipped'));
        cardsFlipped = 0;
        openCardElements = [];
        (selectedPlayer == 1) ? selectedPlayer = 2 : selectedPlayer = 1;
        updateImgPlayerSrc(`${selectedPlayer}`, 'gameImgPlayerCurrent');
    }, 1250);
}

function handleCardsEqualActions_flipCard(): void {
    (selectedPlayer == 1) ? player1Count += 1 : player2Count += 1;
    setTimeout(() => {
        openCardElements.forEach(item => item.classList.toggle('is-matching'));
        cardsFlipped = 0;
        openCardElements = [];
        updatePlayerScoresAll();
        checkGameEnd();
    }, 125);
}

function updatePlayerScoresAll(reset?:'reset'): void {
    playerUpdates.forEach(idNr => {
        idNr.htmlIdRef.forEach(htmlId => {
            updatePlayerScores(idNr.idRef, htmlId, reset)
        })
    })
}

function updatePlayerScores(idRef:string, htmlIdRef:string, reset?:'reset'): void {
    let htmlElem = document.getElementById(htmlIdRef) as HTMLElement;
        if (htmlElem) {
            if (reset) {
                htmlElem.innerText = '0'; 
            } else {
                htmlElem.innerText = (idRef == '1') ? player1Count.toString() : player2Count.toString(); 
            }
    }
}

function checkIfFlippedCardsEqual(id1: string | undefined, id2: string | undefined): boolean {
    return id1 == id2;
}

function actionsStandard_flipCard(card: HTMLButtonElement): { id1: string | undefined; id2: string | undefined } {
    card.classList.toggle('is-flipped');
    cardsFlipped++;
    openCardElements.push(card);
    let id1 = openCardElements[0].dataset.id;
    let id2 = openCardElements[1]?.dataset.id;
    return { id1, id2 };
}

function closePopup(): void {
    let popover = document.getElementById('exitGamePopover') as HTMLElement;
    popover.hidePopover()
}

function checkGameEnd(): void {
    if (checkAllCardsTurned()) {
        registerEventListener_restartBtn()
        if (checkStartPlayerWins()) {
            updateImgPlayerSrc(`${startPlayer}`, 'winningPlayerImg')
            updateImgPlayerSrc('1', 'winImgPlayer1')
            updateImgPlayerSrc('2', 'winImgPlayer2')
            showSection(3);
            updateWinPlayerText()
        } else if (checkStartPlayerLose()) {
            updateImgPlayerSrc('1', 'loseImgPlayer1')
            updateImgPlayerSrc('2', 'loseImgPlayer2')
            showSection(4);
        } else if (player1Count === player2Count) {
            //draw
            console.log(`DRAW: player1Count ${player1Count} = player2Count ${player2Count}`);

        } else {
            // fall back (i.e. manipulation of playerCounts)
        }
    }
}

function registerEventListener_restartBtn(): void {
    const restartBtn = document.querySelectorAll('.win__restart-btn') as NodeListOf<HTMLButtonElement>;
    if (restartBtn) {
        restartBtn.forEach(item => item.addEventListener('click', () => restartGame()))
    }
}

function updateWinPlayerText(): void {
    const winPlayerTextRef = document.getElementById('winPlayerText') as HTMLElement;
    if (winPlayerTextRef) {
        winPlayerTextRef.classList.add(`color-player${startPlayer}`)
        winPlayerTextRef.innerHTML = startPlayer == 1 ? "BLUE PLAYER" : "ORANGE PLAYER";
    }
}

function checkAllCardsTurned(): boolean {
    return player1Count + player2Count == selectedCards / 2
}

function checkStartPlayerWins(): boolean {
    return (startPlayer == 1 && player1Count > player2Count) || (startPlayer == 2 && player1Count < player2Count)
}

function checkStartPlayerLose(): boolean {
    return (startPlayer == 1 && player1Count < player2Count) || (startPlayer == 2 && player1Count > player2Count)
}

function restartGame(): void {
    showSection(0);
    player1Count = player2Count = 0;
    updatePlayerScoresAll('reset');
    document.getElementById('winPlayerText')?.classList.remove(`color-player${startPlayer}`);
    let gameField = document.getElementById('gameField') as HTMLElement;
    gameField && (gameField.innerHTML = '');
}