import { CONST } from "./globalvar";
import { param } from "./param";

function State() {
    // states
    this.currentJumpVelocity = 0;
    this.accumulatedJumpHeight = 0;
    //
    this.isTogglingMiniMap /* 1: enlarging, 0: false, -1: shrinking */ = 0;
    //
    this.gunPositionOffsetX = 0;
    this.gunPositionOffsetY = 0;
    this.gunPositionOffsetXIncrementSign = 1;
    this.gunPositionOffsetYIncrementSign = 1;
    this.isGunPositionFiringOffset = false;
    this.gunPositionFiringOffsetX = 0;
    this.gunPositionFiringOffsetY = 0;
    this.gunPositionFiringOffsetXIncrementSign = 1;
    this.gunPositionFiringOffsetYIncrementSign = 1;
    this.isFiring = false;
    this.isFireRequested = false;
    this.isReloadRequested = false;
    this.isReloading = false;
    this.muzzleRotate = Math.random() * Math.PI * 2;
    this.thisRoundFiringFinished = true;
    //
    this.bulletHitX;
    this.bulletHitY;
    this.bulletHitZ;
    this.bulletHitConfirmed; /* used to change crater color */
    this.bulletHitSparks = [];
    //
    this.canvasCenterTextOpacity = 1;
    this.canvasCenterTextOpacitySign = -1;
    this.isShowingNoAmmoText = false;
    //
    this.healthPoint = param.healthPointMax;
    this.currentMagzine = param.currentMagzineMax;
    this.totalMagzine = param.totalMagzineMax;
    this.isMagzineEmpty = false;
    //
    this.emptyBullets = [];
    // server message
    this.serverMessage = [];
    this.serverMessageTimeout = null;
    // _id for this player
    this.playerId;
    //
    this.latency = 0;
    this.isDisplayingLatency = true;
    this.isLowerGraphicQuality = false;
    //
    this.playersArray = [];
    //
    this.isConnectedToServer = false;
    // hitZone will only be push into array if it was drawn (guaranteed in sight) on frame, this array is cleared on the beginning of draw other players.
    this.hitZone = [];
    this.hitPlayerArray /* the id of the other players being hit by this player in a frame */ = [];
    //
    this.isRespawning = false;
    this.isRepawnProtected = false;
    //
    this.damageIndicator = [];
    //
    this.kill = 0;
    this.death = 0;
}
State.prototype.updateServerMessage = function(newMessage) {
    if (this.serverMessageTimeout) clearTimeout(this.serverMessageTimeout);
    //
    const
        array = this.serverMessage.slice(),
        serverMessageComponent = document.getElementById('serverMessageComponent');
    serverMessageComponent.style.opacity = 1;
    let
        innerComponent = '',
        date = new Date(),
        hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (array.length === 5) {
        array.shift()
    }

    date = hour + ':' + minute + ':' + second;
    newMessage = date + ' ' + '-' + ' ' + newMessage;
    array.push(newMessage);
    array.map(msg => {
        innerComponent += '<div class="serverMessageItemWrapper">' + msg + '</div>';
    });
    // innerHtml = '' doesn't remove node, lastChild is faster than firstChild
    while(serverMessageComponent.lastChild) {
        serverMessageComponent.removeChild(serverMessageComponent.lastChild);
    };
    serverMessageComponent.innerHTML = innerComponent;
    this.serverMessage = array;

    this.serverMessageTimeout = setTimeout(() => {
        serverMessageComponent.style.opacity = 0;
        this.serverMessageTimeout = null;
    }, 15000)
};
State.prototype.updateGunPostion = function(isFiring=false) {
    if (!isFiring) {
        // when moving
        let
            incrementX = Math.random(),
            incrementY = Math.random(),
            nextOffsetX = this.gunPositionOffsetX + incrementX * this.gunPositionOffsetXIncrementSign,
            nextOffsetY = this.gunPositionOffsetY + incrementY * this.gunPositionOffsetYIncrementSign;
        if (Math.abs(nextOffsetX) > param.gunPositionOffsetMax) {
            this.gunPositionOffsetXIncrementSign *= -1;
            nextOffsetX = this.gunPositionOffsetX + incrementX * this.gunPositionOffsetXIncrementSign;
        }
        if (Math.abs(nextOffsetY) > param.gunPositionOffsetMax) {
            this.gunPositionOffsetYIncrementSign *= -1;
            nextOffsetY = this.gunPositionOffsetY + incrementY * this.gunPositionOffsetYIncrementSign;
        }
        this.gunPositionOffsetX = nextOffsetX;
        this.gunPositionOffsetY = nextOffsetY;
    } else {
        // when firing (recoil)
        if (this.isGunPositionFiringOffset) {
            this.gunPositionFiringOffsetX = 0;
            this.gunPositionFiringOffsetY = 0;
            this.isGunPositionFiringOffset = false;
        } else {
            let
                gunPositionFiringOffsetMax = param.gunPositionFiringOffsetMax,
                offsetX = gunPositionFiringOffsetMax * 0.5 + Math.random() * gunPositionFiringOffsetMax * 0.5,
                offsetY = gunPositionFiringOffsetMax * 0.5 + Math.random() * gunPositionFiringOffsetMax * 0.5,
                nextOffsetX = this.gunPositionFiringOffsetX + offsetX * this.gunPositionFiringOffsetXIncrementSign,
                nextOffsetY = this.gunPositionFiringOffsetY + offsetY * this.gunPositionFiringOffsetYIncrementSign;
            this.gunPositionFiringOffsetXIncrementSign *= -1;
            this.gunPositionFiringOffsetYIncrementSign *= -1;
            this.gunPositionFiringOffsetX = nextOffsetX;
            this.gunPositionFiringOffsetY = nextOffsetY;
            this.isGunPositionFiringOffset = true;
        }
    }
};
State.prototype.getGunPostion = function() {
    const
        width = CONST.getWindowWidth(),
        height = CONST.getWindowHeight(),
        gunPosStartX = 0.5*width + this.gunPositionOffsetX + this.gunPositionFiringOffsetX,
        gunPosStartY = 0.6*height + this.gunPositionOffsetY + param.gunPositionOffsetMax + this.gunPositionFiringOffsetY + param.gunPositionFiringOffsetMax,
        gunWidth = 0.4*width,
        gunHeight = 0.4*height;
    return [gunPosStartX, gunPosStartY, gunWidth, gunHeight]
};
State.prototype.updateText = function(elId, updatedText) {
    let
        el = document.getElementById(elId),
        textNode = document.createTextNode(updatedText);
    for (let c = el.firstChild; c !== null; c = el.firstChild) {
        el.removeChild(c)
    }
    el.appendChild(textNode);
};

const state = new State();

export { state };