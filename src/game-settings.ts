import { gameState } from './state';

export let themeId: number = 1;
export let selectedCards: number = 4;
export let startPlayer: number = 1;
export let settingIsChecked: (0 | 1)[] = [0, 0, 0];

/**
 * Registers event listeners for the settings section radio buttons.
 */
export function registerEventListener_SectionSetting(): void {
    const sourceArr = document.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    sourceArr.forEach(source => {
        source.addEventListener('click', (event: Event) => selectSettings(event));
    })
    const hoverArr = document.querySelectorAll('input[name="theme"], label[for^="theme"]') as NodeList;
    hoverArr.forEach(element => {
        element.addEventListener('mouseover', (event: Event) => {
            let target = event.target as HTMLElement;
            let sourceIdNr = target.dataset.themeId;
            sourceIdNr && updateImgPlayerSrc(sourceIdNr, 'settingThemeExample');
        })
    });
}

/**
 * Handles the selection of a setting input, updates the UI, and validates settings.
 * @param event - The click event triggered by a settings input.
 */
export function selectSettings(event: Event): void {
    let { sourceIdName, sourceIdNr }: { sourceIdName: string; sourceIdNr: string; } = retrieveElementIdentifiers(event);
    setText_SectionSetting(event, sourceIdName);
    actionBasedOnSelection_SectionSetting(sourceIdNr, sourceIdName);
    settingsValidation();
}

/**
 * Retrieves the name and number from the event target's id.
 * @param event - The event triggered by the input element.
 * @returns An object containing sourceIdName and sourceIdNr.
 */
function retrieveElementIdentifiers(event: Event) {
    let sourceElem = event.target as HTMLInputElement;
    let sourceIdName: string = sourceElem.id.slice(0, -1);
    let sourceIdNr: string = sourceElem.id.slice(-1);
    return { sourceIdName, sourceIdNr };
}

/**
 * Sets the text in the settings section based on the selected input value.
 * @param event - The event triggered by the input element.
 * @param sourceIdName - The name of the source input element.
 */
function setText_SectionSetting(event: Event, sourceIdName: string): void {
    let sourceElem = event.target as HTMLInputElement;
    let sourceValue: string = sourceElem.value;
    let targetElem = document.querySelector(`.settings__start-section > [id^=${sourceIdName}`) as HTMLElement;
    targetElem.innerText = sourceValue;
}

/**
 * Handles the logic based on the selected setting (theme, player, board).
 * @param sourceIdNr - The selected option's number as a string.
 * @param sourceIdName - The selected option's name as a string.
 */
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

/**
 * Handles theme selection logic and updates the UI accordingly.
 * @param sourceIdNr - The selected theme's number as a string.
 */
function actionBasedOnSelection_theme(sourceIdNr: string) {
    themeId = parseInt(sourceIdNr);
    updateImgPlayerSrc(sourceIdNr, 'settingThemeExample');
    applyThemeToSectionScreenGame('theme' + sourceIdNr);
    settingIsChecked[0] = 1;
}

/**
 * Applies the selected theme to the main game section.
 * @param themeName - The name of the theme to apply.
 */
export function applyThemeToSectionScreenGame(themeName: string): void {
    const mainHtmlTag = document.querySelector('main') as HTMLElement | null;
    if (mainHtmlTag) {
        mainHtmlTag.dataset.theme = themeName;
    }
}

/**
 * Handles player selection logic and updates the UI accordingly.
 * @param sourceIdNr - The selected player's number as a string.
 */
function actionBasedOnSelection_player(sourceIdNr: string) {
    gameState.selectedPlayer = startPlayer = parseInt(sourceIdNr);
    updateImgPlayerSrc(sourceIdNr, 'gameImgPlayerCurrent');
    settingIsChecked[1] = 1;
}

/**
 * Handles board size selection logic and updates the selectedCards variable.
 * @param sourceIdNr - The selected board's number as a string.
 * @returns The number of selected cards.
 */
function actionBasedOnSelection_board(sourceIdNr: string) {
    settingIsChecked[2] = 1;
    if (sourceIdNr === '1') {
        return selectedCards = 16;
    } else if (sourceIdNr === '2') {
        document.getElementById('gameField')?.setAttribute('data-board', 'large');
        return selectedCards = 24;
    } else if (sourceIdNr === '3') {
        document.getElementById('gameField')?.setAttribute('data-board', 'large');
        return selectedCards = 36;
    } else {
        return selectedCards = 4;
    }
}

/**
 * Validates if all settings are selected and enables/disables the Start Game button accordingly.
 */
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

/**
 * Enables or disables the Start Game button and updates its aria-disabled attribute.
 * @param elem - The Start Game button element.
 * @param bool - Whether to disable (true) or enable (false) the button.
 */
function toggleDisableStartGameBtn(elem: HTMLButtonElement, bool: boolean): void {
    elem.disabled = bool;
    elem.setAttribute('aria-disabled', `${bool}`);
}

/**
 * Updates the image source for player or theme images based on selection.
 * @param sourceIdNr - The selected player's or theme's number as a string.
 * @param htmlElem - The id of the HTML image element to update.
 */
export function updateImgPlayerSrc(sourceIdNr: string, htmlElem: string): void {
    let targetElem = document.getElementById(htmlElem) as HTMLImageElement;
    if (htmlElem == 'settingThemeExample') {
        targetElem.src = `./assets/img/2_theme_example${sourceIdNr}.png`;
    } else if (htmlElem == 'winningPlayerImg') {
        if (themeId >= 2) {
            targetElem.src = `./assets/img/4_theme${themeId}_win_${sourceIdNr}.png`;
        } else {
            targetElem.src = `./assets/img/4_theme${themeId}_win_${sourceIdNr}.svg`;
        }
    } else {
        targetElem.src = `./assets/img/3_theme${themeId}_player_${sourceIdNr}.svg`;
    }
}