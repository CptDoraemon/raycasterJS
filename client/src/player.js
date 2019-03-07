import { param } from "./param";
import { state } from "./state";
import { CONST } from "./globalvar";
//import { game } from "./game";

function Player() {
    this.isCT = (Math.random() > 0.5);
    this.x /* init coordinate x */ ;
    this.y /* init coordinate y */ ;
    this.alpha /* init direction angle, relative to positive x axis */ ;
    this.forward = false;
    this.backward = false;
    this.clockwise = false;
    this.counterClockwise = false;
    this.moveSpeed = 0.05;
    this.rotateSpeed = 0.01;
    this.mapGrid = param.getMapGrid();
    // related to jump function
    this.gravity = param.getGravity();
}
Player.prototype.respawn = function() {
    state.healthPoint = param.healthPointMax;
    const hpEl = document.getElementById('playerStatusHealthPoint');
    hpEl.innerHTML = state.healthPoint;

    const CTRespawn = [[3, 10], [3, 15], [3, 20], [3, 25], [3, 30]];
    const TRespawn = [[25, 16], [25, 27], [26, 17], [34, 16], [34, 17]];
    const respawnPos = Math.floor(Math.random() * 5);
    this.x = this.isCT ? CTRespawn[respawnPos][0] : TRespawn[respawnPos][0];
    this.y = this.isCT ? CTRespawn[respawnPos][1] : TRespawn[respawnPos][1];
    this.alpha = Math.random() > 0.5 ? (-0.75 * Math.PI * 2) /* up */: (0.25 * Math.PI * 2) /* down */;
    this.forward = false;
    this.backward = false;
    this.clockwise = false;
    this.counterClockwise = false;

    // respawned
    if (state.isRespawning) state.isRespawning = false;
    state.isRepawnProtected = true;
    setTimeout(() => state.isRepawnProtected = false, 3000);
};
Player.prototype.move = function() {
    // update player coordinate
    let moveState = this.forward ? 1 : this.backward ? -1 : 0;
    let rotateState = this.clockwise ? 1 : this.counterClockwise ? -1 : 0;

    if (moveState) {
        const nextX = this.x + this.moveSpeed * Math.cos(this.alpha) * moveState;
        const nextY = this.y + this.moveSpeed * Math.sin(this.alpha) * moveState;
        if (this.mapGrid[Math.floor(this.y)][Math.floor(nextX)] === 0) {
            this.x = nextX;
        }
        if (this.mapGrid[Math.floor(nextY)][Math.floor(this.x)] === 0) {
            this.y = nextY;
        }

        // update gun position when walking
        state.updateGunPostion(false);
    }

    if (rotateState) {
        this.alpha = this.rotateSpeed * rotateState + this.alpha;
    }

    //jump
    let currentJumpVelocity = state.currentJumpVelocity;
    const
        gravity = this.gravity,
        jumpHeihtInThisFrame /* vt, t=1 here */ = currentJumpVelocity,
        accumulatedJumpHeightAfterThisJump = state.accumulatedJumpHeight + jumpHeihtInThisFrame;

    if (accumulatedJumpHeightAfterThisJump > 0) {
        // still jumping
        state.currentJumpVelocity = currentJumpVelocity - gravity;
        state.accumulatedJumpHeight += jumpHeihtInThisFrame;
    } else {
        // returned ground
        state.currentJumpVelocity = 0;
        state.accumulatedJumpHeight = 0;
    }
    // firing
    const reload = () => {
        const
            currentMagzineTextEl  = document.getElementById('playerStatusCurrentMagzine'),
            totalMagzineTextEl  = document.getElementById('playerStatusTotalMagzine');

        if (state.currentMagzine === param.currentMagzineMax) {
            // full mag, no need to reload
            state.isReloadRequested = false;
            return;
        }
        state.isReloading = true;
        state.isFiring = false;
        state.thisRoundFiringFinished = true;
        setTimeout(() => {
            const roundRequired = param.currentMagzineMax - state.currentMagzine;
            if (roundRequired <= state.totalMagzine) {
                // normal reloading
                state.currentMagzine = param.currentMagzineMax;
                state.totalMagzine -= roundRequired;
            } else {
                // last mag not enough for full reload
                state.currentMagzine += state.totalMagzine;
                state.totalMagzine = 0;
            }

            if (state.totalMagzine === 0) {
                // mag empty
                const red = 'rgba(255, 69, 0, 1)';
                state.isMagzineEmpty = true;
                currentMagzineTextEl.style.color = red;
                totalMagzineTextEl.style.color = red;
            }
            // update text
            currentMagzineTextEl.firstChild.nodeValue = state.currentMagzine;
            totalMagzineTextEl.firstChild.nodeValue = state.totalMagzine;
            state.isReloading = false;
            state.isReloadRequested = false;
        }, 1000)
    };
    const fireNewRound = () => {
        const currentMagzine = state.currentMagzine;
        if (currentMagzine) {
            // do fire
            state.isFiring = true;
            state.thisRoundFiringFinished = false;
            state.muzzelRotate = Math.random() * Math.PI * 2;
            state.currentMagzine--;
            // bullet hit position
            const isMoving = this.forward || this.backward || state.currentJumpVelocity;
            const recoil = isMoving ? 100 : 10;
            const bulletHitX = CONST.getWindowWidth() * 0.5 + (Math.random() - 0.5) * recoil;
            const bulletHitY = CONST.getWindowHeight() * 0.5 + (Math.random() - 0.5) * recoil;
            const wallsOnTrajectory = game.wallArray[Math.floor(bulletHitX / param.resolution)];
            state.bulletHit.z = wallsOnTrajectory[wallsOnTrajectory.length - 1].distFishEyeCorrected;
            state.bulletHit.screenX = bulletHitX;
            state.bulletHit.screenY = bulletHitY - state.accumulatedJumpHeight;
            state.bulletHit.isHitConfirmed = false;
            // check hit
            if (state.hitZone.length) {
                state.hitZone.map(obj => {
                    // [otherplayer.playerId, drawX. drawY, drawWidth, drawHeight]
                    const isHit = (obj.x < bulletHitX) && (bulletHitX < (obj.x + obj.width)) && (obj.y < bulletHitY) && (bulletHitY < (obj.y + obj.height));
                    if (isHit) {
                        state.hitPlayerArray.push(obj.playerId);
                        state.bulletHit.isHitConfirmed = true;
                        state.bulletHit.z = obj.z;
                    }
                });
            }
            // bullet sparks: create new sparks; move existed is above
            const now = new Date();
            const baseWidth = CONST.getWindowWidth() * 0.01;
            const baseWidthToZ = Math.min(baseWidth, baseWidth * 2 / state.bulletHit.z);
            const radius = Math.min(5, 20 / state.bulletHit.z);
            if (!state.bulletHit.isHitConfirmed) {
                const crater = {
                    type: 'crater',
                    timeStamp: now,
                    screenX: state.bulletHit.screenX,
                    screenY: state.bulletHit.screenY,
                    z: state.bulletHit.z,
                    radius: 0.8 * radius,
                    playerAlpha: this.alpha,
                    playerX: this.x,
                    playerY: this.y,
                    opacity: 1,
                    accumulatedJumpHeight: state.accumulatedJumpHeight
                };
                state.bulletHit.sparks.push(crater);
                for (let i=0; i<5; i++) {
                    let sparkSpeedX = (Math.random() - 0.5) * baseWidthToZ * 0.1;
                    let sparkSpeedY = (Math.random() - 0.5) * baseWidthToZ * 0.05;
                    const dirt = {
                        type: 'dirt',
                        speedX: sparkSpeedX,
                        speedY: sparkSpeedY,
                        timeStamp: now,
                        screenX: state.bulletHit.screenX,
                        screenY: state.bulletHit.screenY,
                        z: state.bulletHit.z,
                        radius: radius * 0.5,
                        opacity: 0.8,
                        playerAlpha: this.alpha,
                        playerX: this.x,
                        playerY: this.y,
                        accumulatedJumpHeight: state.accumulatedJumpHeight,
                    };
                    sparkSpeedX = (Math.random() - 0.5) * baseWidthToZ * 0.5;
                    sparkSpeedY = (Math.random() - 0.5) * baseWidthToZ * 0.5;
                    const spark = {
                        type: 'spark',
                        speedX: sparkSpeedX,
                        speedY: sparkSpeedY,
                        timeStamp: now,
                        screenX: state.bulletHit.screenX,
                        screenY: state.bulletHit.screenY,
                        z: state.bulletHit.z,
                        radius: radius,
                        opacity: 1,
                        playerAlpha: this.alpha,
                        playerX: this.x,
                        playerY: this.y,
                        accumulatedJumpHeight: state.accumulatedJumpHeight,
                    };
                    state.bulletHit.sparks.push(dirt, spark);
                }
            } else {
                for (let i=0; i<10; i++) {
                    const sparkSpeedX = (Math.random() - 0.5) * baseWidthToZ * 0.5;
                    const sparkSpeedY = (Math.random() - 0.5) * baseWidthToZ * 0.5;
                    const blood = {
                        type: 'blood',
                        speedX: sparkSpeedX,
                        speedY: sparkSpeedY,
                        timeStamp: now,
                        screenX: state.bulletHit.screenX,
                        screenY: state.bulletHit.screenY,
                        z: state.bulletHit.z,
                        radius: radius,
                        opacity: 1,
                        playerAlpha: this.alpha,
                        playerX: this.x,
                        playerY: this.y,
                        accumulatedJumpHeight: state.accumulatedJumpHeight,
                    };
                    state.bulletHit.sparks.push(blood);
                }
            }
            // update text
            document.getElementById('playerStatusCurrentMagzine').firstChild.nodeValue = state.currentMagzine;
            setTimeout(() => {
                state.thisRoundFiringFinished = true;
            }, 100);
            // recoil
            state.updateGunPostion(true);
            // eject bullet shell
            const
                gunPosition = state.getGunPostion(),
                gunPosStartX = gunPosition[0],
                gunPosStartY = gunPosition[1],
                gunWidth = gunPosition[2],
                gunHeight = gunPosition[3],
                emptyBulletX = gunPosStartX + (10 / 20.8) * gunWidth,
                emptyBulletY = gunPosStartY + (3.6 / 13.2) * gunHeight,
                baseSpeed = gunWidth /* 0.4width */ * 0.05,
                speedX = Math.random() * baseSpeed + baseSpeed,
                speedY = Math.random() * -baseSpeed - baseSpeed,
                thisRound = [emptyBulletX, emptyBulletY, speedX, speedY];
            state.emptyBullets.push(thisRound);
        } else if (state.isMagzineEmpty) {
            // empty mag, not fire
            state.isFireRequested = false;
            if (!state.isShowingNoAmmoText) {
                state.isShowingNoAmmoText = true;
                setTimeout(() => {
                    state.isShowingNoAmmoText = false;
                }, 1000)
            }
        } else if (!state.isMagzineEmpty) {
            // reload, not fire
            state.isReloadRequested = true;
        }
    };

    if (state.isReloading) {

    } else if (state.isReloadRequested && !state.isMagzineEmpty) {
        reload()
    } else if (state.isFireRequested && state.thisRoundFiringFinished) {
        fireNewRound()
    } else if (!state.isFireRequested && state.isFiring) {
        // enter key released
        state.isFiring = false;
    }
    // firing ends

    // bullet shells, move all items in state.bullets
    if (state.emptyBullets.length) {
        const
            width = CONST.getWindowWidth(),
            height = CONST.getWindowHeight(),
            emptyBulletGravity = width * 0.005;
        state.emptyBullets.map((i) => {
            i[0] += i[2];	/* update X */
            i[1] += i[3];	/* update Y */
            i[3] += emptyBulletGravity; /* update speedY */
        });
        state.emptyBullets = state.emptyBullets.filter(i => {
            // filter bullets out of border
            const outOfBorder = i[0] > width || i[0] < 0 || i[1] > height || i[1] < 0;
            return !outOfBorder
        })
    }
};

export { Player };