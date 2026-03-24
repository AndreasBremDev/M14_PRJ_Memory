import './scss/main.scss';

let settingIsChecked = [0, 0, 0];
init();

function init() {
    registerEventListener_TitlePageStartBtn();
    registerEventListener_SectionSetting();
    registerEventListener_SectionSetting_StartGame();
    flipCard();
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
            setText(event, sourceIdName);
            setIsChecked(event, sourceIdName);
            settingsValidation();
                (sourceIdName === 'theme') && updateImgSrc(sourceIdNr);
        })
    })
}

function retrieveElementIdentifiers(event: Event) {
    let sourceElem = event.target as HTMLInputElement;
    let sourceIdName: string = sourceElem.id.slice(0, -1);
    let sourceIdNr: string = sourceElem.id.slice(-1);
    return { sourceIdName, sourceIdNr };
}

function setText(event: Event, sourceIdName: string): void {
    let sourceElem = event.target as HTMLInputElement;
    let sourceValue: string = sourceElem.value;
    let targetElem = document.querySelector(`div.settings__start-section > [id^=${sourceIdName}`) as HTMLElement;
    targetElem.innerText = sourceValue;
}

function updateImgSrc(sourceIdNr: string): void {
    let targetElem = document.getElementById('settingThemeExample') as HTMLImageElement;
    targetElem.src = targetElem.src.slice(0, -5) + sourceIdNr + targetElem.src.slice(-4, targetElem.src.length);
}

function setIsChecked(event: Event, sourceIdName: string): void {
    switch (sourceIdName) {
        case 'theme':
            settingIsChecked[0] = 1;
            break;
        case 'player':
            settingIsChecked[1] = 1;
            break;
        case 'board':
            settingIsChecked[2] = 1;
            break;
        default:
            break;
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

function registerEventListener_SectionSetting_StartGame(): void{
    let settingsStartGameBtn = document.getElementById('settingsStartGameBtn') as HTMLButtonElement;
    if (settingsStartGameBtn) {
        settingsStartGameBtn.addEventListener('click', startGame)
    }
}

function startGame() {
    if (settingIsChecked.every(el => el === 1)){
        // settingIsChecked = [0, 0, 0];
        showSection(2)
    }
}

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
