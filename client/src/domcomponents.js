import { state } from "./state";

function InstructionComponent() {
    this.component;
    this.isDisplaying = true;
}
InstructionComponent.prototype.mountComponent = function() {
    const rootDiv = document.getElementById('root');
    const instructionComponent = document.createElement('div');
    instructionComponent.id = 'instructionComponent';
    instructionComponent.innerHTML =
        '<h1>cs_assault.map</h1>' +
        '<ul>' +
        '<li>I: Open / close this window</li>' +
        '<li>W: Move Forward</li>' +
        '<li>S: Move Back</li>' +
        '<li>A: Turn Left</li>' +
        '<li>D: Turn Right</li>' +
        '<li>R: Reload</li>' +
        '<li>M: Toggle Map Zooming</li>' +
        '<li>Enter: Fire</li>' +
        '<li>Space: Jump</li>' +
        '<li>Tab: Score Board</li>' +
        '</ul>' +
        '<h1>Many thanks to these tutorials:</h1>' +
        '<ul>' +
        '<li><a href="http://www.playfuljs.com/a-first-person-engine-in-265-lines/" target="_blank">PlayfulJS.com</a></li>' +
        '<li><a href="http://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/" target="_blank">Permadi.com</a></li>' +
        '<li><a href="http://lodev.org/cgtutor/raycasting.html" target="_blank">Lodev.org</a></li>' +
        '</ul>' +
        '<h2><a href="https://www.xiaoxihome.com" target="_blank"><span>&copy; XIAOXIHOME.COM 2018~2019</span></a><h2>';
    rootDiv.appendChild(instructionComponent);
    this.component = instructionComponent;
    this.attachEventListener();
    this.toggleDisplay();
};
InstructionComponent.prototype.attachEventListener = function() {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 73) {
            // button I
            this.toggleDisplay()
        }
    });
};
InstructionComponent.prototype.toggleDisplay = function() {
    if (this.isDisplaying) {
        this.component.style.opacity = 0;
        this.component.style.visibility = 'hidden';
    } else {
        this.component.style.opacity = 1;
        this.component.style.visibility = 'visible';
    }
    this.isDisplaying = !this.isDisplaying;
};
function ToolBarComponent() {
    const createDiv = (id) => {
        const div = document.createElement('div');
        div.id = id;
        return div;
    };
    const settingItems = [];
    const createSettingItem = (settingItemsArray, text, statePropertyString, initiateIsON) => {
        const number = settingItemsArray.length;
        const item = createDiv('settingDropdownItem' + number);
        item.className = 'settingDropdownItem';
        const onHandler = () => {
            item.innerHTML = '<span>' + text + ' <i class="fas fa-toggle-on" style="color: green; font-size: 24px; top: .125em; position: relative""></i></span>';
            state[statePropertyString] = true;
        };
        const offHandler = () => {
            item.innerHTML = '<span>' + text + ' <i class="fas fa-toggle-off" style="color: rgba(0,0,0,0.5); font-size: 24px; top: .125em; position: relative"></i></span>';
            state[statePropertyString] = false;
        }
        initiateIsON ? onHandler() : offHandler();
        item.onclick = (e) => {
            e.stopPropagation();
            state[statePropertyString] ? offHandler() : onHandler();
        };
        settingItemsArray.push(item);
    };
    const
        toolBarComponent = createDiv('toolBarComponent'),
        info = createDiv('info'),
        setting = createDiv('setting'),
        settingDropdown = createDiv('settingDropdown');
    createSettingItem(settingItems, 'Lower graphic quality', 'isLowerGraphicQuality', false);
    createSettingItem(settingItems, 'Display latency', 'isDisplayingLatency', true);
    info.innerHTML = '<span><i class="fas fa-info-circle"></i></span>';
    setting.innerHTML = '<span><i class="fas fa-cog"></i></span>';

    info.onclick = () => {
        const event = new Event('keydown');
        event.keyCode = 73;
        document.dispatchEvent(event);
    };
    setting.onclick = () => {
        this.isSettingDropdownActive ? this.closeSettingDropdown() : this.openSettingDropdown();
    };
    settingDropdown.onmouseleave = () => {
        this.closeSettingDropdown()
    };

    setting.appendChild(settingDropdown);
    toolBarComponent.appendChild(info);
    toolBarComponent.appendChild(setting);
    settingItems.map(item => settingDropdown.appendChild(item));

    this.component = toolBarComponent;
    this.settingDropdownComponent = settingDropdown;
    this.isSettingDropdownActive = false;
}
ToolBarComponent.prototype.mountComponent = function() {
    const rootDiv = document.getElementById('root');
    rootDiv.appendChild(this.component);
};
ToolBarComponent.prototype.closeSettingDropdown = function() {
    if (this.isSettingDropdownActive) {
        const dropdown = this.settingDropdownComponent;
        dropdown.style.opacity = 0;
        dropdown.style.visibility = 'hidden'
        this.isSettingDropdownActive = false;
    }
};
ToolBarComponent.prototype.openSettingDropdown = function() {
    if (!this.isSettingDropdownActive) {
        const dropdown = this.settingDropdownComponent;
        dropdown.style.opacity = 1;
        dropdown.style.visibility = 'visible'
        this.isSettingDropdownActive = true;
    }
};

function PlayerStatusComponent() {

}
PlayerStatusComponent.prototype.mountComponent = function() {
    const rootDiv = document.getElementById('root');
    const playerStatusComponent = document.createElement('div');
    playerStatusComponent.id = 'playerStatusComponent';
    playerStatusComponent.innerHTML =
        '<div class="playerStatusGroupWrapper">' +
        '<div class="playerStatusIcon" style="position: relative; top: -0.1em;">' +
        '<i class="fas fa-times-circle"></i>' +
        '</div>' +
        '<div class="playerStatusValue">' +
        '<span id="playerStatusHealthPoint">' + state.healthPoint + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="playerStatusGroupWrapper">' +
        '<div class="playerStatusIcon" style="position: relative; top: -0.4em;">' +
        '<i class="fas fa-joint"></i>' +
        '</div>' +
        '<div class="playerStatusValue">' +
        '<span id="playerStatusCurrentMagzine">' + state.currentMagzine + '</span>' + '|' + '<span id="playerStatusTotalMagzine">' + state.totalMagzine + '</span>' +
        '</div>' +
        '</div>';
    rootDiv.appendChild(playerStatusComponent);
};

function ServerMessageComponent() {
    this.component;
    this.itemWrapperClass = 'serverMessageItemWrapper';
}
ServerMessageComponent.prototype.mountComponent = function() {
    const rootDiv = document.getElementById('root');
    const serverMessageComponent = document.createElement('div');
    serverMessageComponent.id = 'serverMessageComponent';
    rootDiv.appendChild(serverMessageComponent);
    this.component = serverMessageComponent;
};

function ScoreBoardComponent() {
    this.component;
    this.isDisplaying = false;
    this.rowClassName = 'scoreBoardRow';
    this.rowTitleClassName = 'scoreBoardRowTitle scoreBoardRow';
    this.rowHighlightClassName = 'scoreBoardRow scoreBoardRowHighlight';
    this.rowItemClassName = 'scoreBoardRowItem';

    this.timeInterval;
}
ScoreBoardComponent.prototype.mountComponent = function() {
    const rootDiv = document.getElementById('root');
    const scoreBoardComponent = document.createElement('div');
    scoreBoardComponent.id = 'scoreBoardComponent';
    rootDiv.appendChild(scoreBoardComponent);
    this.component = scoreBoardComponent;
    this.attachEventListener();
};
ScoreBoardComponent.prototype.attachEventListener = function() {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 9) {
            // button Tab
            e.preventDefault();
            this.toggleDisplay();
        }
    });
};
ScoreBoardComponent.prototype.toggleDisplay = function() {
    if (this.isDisplaying) {
        this.isDisplaying = false;
        clearInterval(this.timeInterval);
        this.timeInterval = null;
        this.component.style.opacity = 0;
        this.component.style.visibility = 'hidden';
        while(this.component.lastChild) {
            this.component.removeChild(this.component.lastChild);
        }
    } else {
        this.isDisplaying = true;
        this.updateData();
        this.updateData = this.updateData.bind(this);
        this.timeInterval = setInterval(this.updateData, 1000);
        this.component.style.opacity = 1;
        this.component.style.visibility = 'visible';
    }
};
ScoreBoardComponent.prototype.updateData = function() {
    if (this.isDisplaying) {
        // sort state.playersArray
        const playersArray = state.playersArray.slice();
        playersArray.sort((a, b) => b.kill - a.kill)

        // components
        const playerId = state.playerId;

        const createRow = (isHightLighted) => {
            const row = document.createElement('div');
            row.className = isHightLighted ? this.rowHighlightClassName : this.rowClassName;
            return row
        };
        const createRowItem = (itemContent) => {
            const item = document.createElement('div');
            item.className = this.rowItemClassName;
            item.innerHTML = itemContent;
            return item
        };

        // innerHtml = '' doesn't remove node, lastChild is faster than firstChild
        while(this.component.lastChild) {
            this.component.removeChild(this.component.lastChild);
        }
        const title = document.createElement('div');
        title.className = this.rowTitleClassName;
        const id = createRowItem('Player ID');
        const kill = createRowItem('Kill');
        const death = createRowItem('Death');
        const latency = createRowItem('Ping');
        title.appendChild(id);
        title.appendChild(kill);
        title.appendChild(death);
        title.appendChild(latency);
        this.component.appendChild(title);

        playersArray.map(obj => {
            const row = obj.playerId === playerId ? createRow(true) : createRow(false);
            const id = createRowItem(obj.playerId);
            const kill = createRowItem(obj.kill);
            const death = createRowItem(obj.death);
            const latency = createRowItem(obj.latency + 'ms');
            row.appendChild(id);
            row.appendChild(kill);
            row.appendChild(death);
            row.appendChild(latency);
            this.component.appendChild(row);
        })
    }
};

export { InstructionComponent, ToolBarComponent, PlayerStatusComponent, ServerMessageComponent, ScoreBoardComponent };