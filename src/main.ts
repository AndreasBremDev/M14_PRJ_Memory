import './scss/main.scss';
import { renderCardsHTML } from './template';
import {registerEventListener_SectionSetting, updateImgPlayerSrc, applyThemeToSectionScreenGame} from './game-settings';
import {themeId, selectedCards, startPlayer, settingIsChecked} from './game-settings'
import { gameState } from './state';

interface PlayerUpdate {
    idRef: string;
    htmlIdRef: string[];
}

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
let startSectionText: string[] = ['Theme', 'Player', 'Board size']

init();

/**
 * Sets up the initial state and registers all necessary event listeners.
 */
function init() {
    showSection(0);
    applyThemeToSectionScreenGame('theme' + themeId);
    document.getElementById('gameField')?.setAttribute('data-board','');
    registerEventListener_TitlePageStartBtn();
    registerEventListener_SectionSetting();
    registerEventListener_SectionSetting_StartGame();
    registerEventListener_popoverBtn()
}

/**
 * Registers the event listener for the Play button on the title page.
 */
function registerEventListener_TitlePageStartBtn(): void {
    const titleBtnPlay = document.getElementById('titleBtnPlay') as HTMLButtonElement;
    if (titleBtnPlay) {
        titleBtnPlay.addEventListener('click', () => showSection(1))
    }
}

/**
 * Registers the event listener for the Start Game button in the settings section.
 */
function registerEventListener_SectionSetting_StartGame(): void {
    let settingsStartGameBtn = document.getElementById('settingsStartGameBtn') as HTMLButtonElement;
    if (settingsStartGameBtn) {
        settingsStartGameBtn.addEventListener('click', startGame)
    }
}

/**
 * Registers event listeners for popover and restart buttons.
 */
function registerEventListener_popoverBtn(): void {
    const buttonRef = document.querySelectorAll('#exitGamePopoverCancel, #exitGamePopoverAction, .win__restart-btn') as NodeListOf<HTMLElement>;
    if (buttonRef) {
        buttonRef[0].addEventListener('click', closePopup);
        for (let i = 1; i < buttonRef.length; i++) {
            buttonRef[i].addEventListener('click', restartGame);
        }
    }
}

/**
 * Shows the section with the given index and hides all others.
 * @param sectionNr - The index of the section to display.
 */
function showSection(sectionNr: number): void {
    let htmlSection = document.querySelectorAll('body > section, body > main > section') as NodeListOf<HTMLElement>;
    htmlSection.forEach(elem => elem.style.display = 'none');
    htmlSection[sectionNr].style.display = 'flex';
}


/**
 * Starts the game if all settings are selected, sets up the board, and registers event listeners.
 */
function startGame(): void {
    if (settingIsChecked.every(el => el === 1)) {
        showSection(2);
        uncheckRadioButtons();
        unsetStartSection();
        setCardsArray(selectedCards)
        shuffleArray(cardsArr);
        renderCards(cardsArr);
        updateImgPlayerSrc('1', 'gameImgPlayer1')
        updateImgPlayerSrc('2', 'gameImgPlayer2')
        registerEventListener_flipCard();
    }
}

/**
 * Unchecks all checked radio buttons in the settings section.
 */
function uncheckRadioButtons(): void {
    let elemArray = document.querySelectorAll('input[type="radio"]:checked') as NodeListOf<HTMLInputElement>;
    if (elemArray) {
        for (let i = 0; i < elemArray.length; i++) {
            elemArray[i].checked = false;
        }
    }
}

function unsetStartSection(): void {
    let elemArray = document.querySelectorAll('.settings__start-section > p') as NodeListOf<HTMLElement>;
    console.log(elemArray);
    if (elemArray) {
        for (let i = 0; i < elemArray.length; i++) {
            elemArray[i].innerText = startSectionText[i];
        }
    }
    
}

/**
 * Renders the cards on the game field based on the provided array.
 * @param arr - Array of card values to render.
 */
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

/**
 * Initializes the cardsArr array with pairs based on the selected number of cards.
 * @param selectedCards - The number of cards to set up.
 * @returns The initialized cardsArr array.
 */
function setCardsArray(selectedCards: number): number[] {
    for (let i = 0; i < selectedCards; i++) {
        cardsArr[i] = i % (selectedCards / 2)
    }
    return cardsArr;
}

/**
 * Shuffles the cardsArr array using the Fisher-Yates algorithm.
 * @param cardsArr - The array of cards to shuffle.
 * @returns The shuffled array.
 */
function shuffleArray(cardsArr: number[]): number[] {
    /* Fisher-Yates algorithm */
    for (let i = cardsArr.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        [cardsArr[i], cardsArr[random]] = [cardsArr[random], cardsArr[i]];
    }
    return cardsArr;
}

/**
 * Registers event listeners for flipping cards on the game field.
 */
function registerEventListener_flipCard(): void {
    const fieldRef = document.querySelectorAll('.game__field__article') as NodeListOf<HTMLElement>;
    if (fieldRef) {
        fieldRef.forEach(item => item.addEventListener('click', (event: Event) => flipCard(event)))
    }
}

/**
 * Handles the logic for flipping a card, checking for matches, and updating the game state.
 * @param event - The click event triggered by a card.
 */
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

/**
 * Handles the actions when two flipped cards do not match.
 */
function handeCardsDifferentActions_flipCard(): void {
    setTimeout(() => {
        openCardElements.forEach(item => item.classList.toggle('is-flipped'));
        cardsFlipped = 0;
        openCardElements = [];
        (gameState.selectedPlayer == 1) ? gameState.selectedPlayer = 2 : gameState.selectedPlayer = 1;
        updateImgPlayerSrc(`${gameState.selectedPlayer}`, 'gameImgPlayerCurrent');
    }, 1250);
}

/**
 * Handles the actions when two flipped cards match.
 */
function handleCardsEqualActions_flipCard(): void {
    (gameState.selectedPlayer == 1) ? player1Count += 1 : player2Count += 1;
    setTimeout(() => {
        openCardElements.forEach(item => item.classList.toggle('is-matching'));
        cardsFlipped = 0;
        openCardElements = [];
        updatePlayerScoresAll();
        checkGameEnd();
    }, 125);
}

/**
 * Updates the scores for all players in the UI.
 * @param reset - Optional flag to reset scores to zero.
 */
function updatePlayerScoresAll(reset?: 'reset'): void {
    playerUpdates.forEach(idNr => {
        idNr.htmlIdRef.forEach(htmlId => {
            updatePlayerScores(idNr.idRef, htmlId, reset)
        })
    })
}

/**
 * Updates the score for a specific player in the UI.
 * @param idRef - The player's id as a string.
 * @param htmlIdRef - The HTML element id to update.
 * @param reset - Optional flag to reset the score to zero.
 */
function updatePlayerScores(idRef: string, htmlIdRef: string, reset?: 'reset'): void {
    let htmlElem = document.getElementById(htmlIdRef) as HTMLElement;
    if (htmlElem) {
        if (reset) {
            htmlElem.innerText = '0';
        } else {
            htmlElem.innerText = (idRef == '1') ? player1Count.toString() : player2Count.toString();
        }
    }
}

/**
 * Checks if the two flipped cards have the same id.
 * @param id1 - The id of the first card.
 * @param id2 - The id of the second card.
 * @returns True if the ids are equal, false otherwise.
 */
function checkIfFlippedCardsEqual(id1: string | undefined, id2: string | undefined): boolean {
    return id1 == id2;
}

/**
 * Flips the given card, tracks flipped cards, and returns their ids.
 * @param card - The card element to flip.
 * @returns An object containing the ids of the first and second flipped cards.
 */
function actionsStandard_flipCard(card: HTMLButtonElement): { id1: string | undefined; id2: string | undefined } {
    card.classList.toggle('is-flipped');
    cardsFlipped++;
    openCardElements.push(card);
    let id1 = openCardElements[0].dataset.id;
    let id2 = openCardElements[1]?.dataset.id;
    return { id1, id2 };
}

/**
 * Closes the exit game popover dialog.
 */
function closePopup(): void {
    let popover = document.getElementById('exitGamePopover') as HTMLElement;
    popover.hidePopover()
}

/**
 * Checks if the game has ended and handles win/lose/draw logic.
 */
function checkGameEnd(): void {
    if (checkAllCardsTurned()) {
        registerEventListener_restartBtn()
        document.getElementById('gameField')?.setAttribute('data-board','');
        if (checkStartPlayerWins()) {
            updateImgPlayerSrc(`${startPlayer}`, 'winningPlayerImg')
            updateImgPlayerSrc('1', 'winImgPlayer1')
            updateImgPlayerSrc('2', 'winImgPlayer2')
            updateWinPlayerText();
            showSection(3);
        } else if (checkStartPlayerLose()) {
            updateImgPlayerSrc('1', 'loseImgPlayer1')
            updateImgPlayerSrc('2', 'loseImgPlayer2')
            showSection(4);
        } else if (player1Count === player2Count) {
            updateImgPlayerSrc('1', 'loseImgPlayer1')
            updateImgPlayerSrc('2', 'loseImgPlayer2')
            updateLoseTextToDraw();
            showSection(4);
        } else {
            console.log('Error: manipulation of playerCounts detected');
        }
    }
}

/**
 * Registers event listeners for the restart buttons on win/lose screens.
 */
function registerEventListener_restartBtn(): void {
    const restartBtn = document.querySelectorAll('.win__restart-btn') as NodeListOf<HTMLButtonElement>;
    if (restartBtn) {
        restartBtn.forEach(item => item.addEventListener('click', () => restartGame()))
    }
}

/**
 * Updates the win player text and color in the UI.
 */
function updateWinPlayerText(): void {
    const winPlayerTextRef = document.getElementById('winPlayerText') as HTMLElement;
    if (winPlayerTextRef) {
        winPlayerTextRef.classList.add(`color-player${startPlayer}`)
        winPlayerTextRef.innerHTML = startPlayer == 1 ? "BLUE PLAYER" : "ORANGE PLAYER";
    }
}

function updateLoseTextToDraw():void {
    const loseText = document.getElementById('loseTextH2') as HTMLElement;
    if (loseText) {
        loseText.innerHTML = 'DRAW';
    }
}

/**
 * Checks if all cards have been turned (matched).
 * @returns True if all cards are matched, false otherwise.
 */
function checkAllCardsTurned(): boolean {
    return player1Count + player2Count == selectedCards / 2
}

/**
 * Checks if the start player has won the game.
 * @returns True if the start player wins, false otherwise.
 */
function checkStartPlayerWins(): boolean {
    return (startPlayer == 1 && player1Count > player2Count) || (startPlayer == 2 && player1Count < player2Count)
}

/**
 * Checks if the start player has lost the game.
 * @returns True if the start player loses, false otherwise.
 */
function checkStartPlayerLose(): boolean {
    return (startPlayer == 1 && player1Count < player2Count) || (startPlayer == 2 && player1Count > player2Count)
}

/**
 * Restarts the game, resets scores, and updates the UI.
 */
function restartGame(): void {
    player1Count = player2Count = 0;
    updatePlayerScoresAll('reset');
    let winPlayerText = document.getElementById('winPlayerText') as HTMLElement;
    winPlayerText && winPlayerText.classList.remove(`color-player${startPlayer}`);
    let loseText = document.getElementById('loseTextH2') as HTMLElement;
    loseText && (loseText.innerHTML = 'You LOSE');
    let gameField = document.getElementById('gameField') as HTMLElement;
    gameField && (gameField.innerHTML = '');
    showSection(0);
}