import { param } from "./param";
import { CONST } from "./globalvar";
import { InstructionComponent, ToolBarComponent, PlayerStatusComponent, ServerMessageComponent, ScoreBoardComponent } from "./domcomponents";
import { state } from "./state";
import { Player } from "./player";
import { serverConnection } from "./serverconnection";
import { raycaster } from "./tools/raycaster";
import { remapAngleToZeroToTwoPI } from "./tools/ptopcalc";

function Game() {
    this.mainPlayer = null;
    this.otherPlayers = [];
    //
    this.wallArray = [];
    this.rayAngleArray = [];
    this.dAlpha = null; /* angle between rays */
    //
    this.drawDamageIndicatorArray = [];
    //
    this.deathTimeStamp = null; // used in respawn frame
    this.respawnFramethrottler = 1;
    //
    this.miniMapSizeMax = param.getMiniMapSizeMax();
    this.miniMapSizeMin = param.getMiniMapSizeMin();
    this.miniMapSize = this.miniMapSizeMin;
    this.miniMapMargin = param.getMiniMapMargin();
    this.miniMapToggleSpeed = param.getMiniMapToggleSpeed();
}
Game.prototype.initiateCanvas = function() {
    const rootDiv = document.getElementById('root');
    const container = document.createElement('div');
    rootDiv.appendChild(container);
    const width = CONST.getWindowWidth();
    const height = CONST.getWindowHeight();
    container.innerHTML = `<canvas id="mainCanvas" width=${width} height=${height}>Your Browser Does Not Support Html5 Canvas</canvas>`;

    // instructionComponent
    const instructionComponent = new InstructionComponent();
    instructionComponent.mountComponent();
    // toolbar
    const toolBarComponent = new ToolBarComponent();
    toolBarComponent.mountComponent();
    // player status
    const playerStatusComponent = new PlayerStatusComponent();
    playerStatusComponent.mountComponent();
    // server message
    const serverMessageComponent = new ServerMessageComponent();
    serverMessageComponent.mountComponent();
    state.updateServerMessage('Establishing connection to server');
    // scoreboard
    const scoreBoardComponent = new ScoreBoardComponent();
    scoreBoardComponent.mountComponent();
};
Game.prototype.createMainPlayer = function() {
    this.mainPlayer = new Player();
    this.mainPlayer.respawn();
};
Game.prototype.ray = function() {
    //Prepare rayArray
    const
        rayAngleArray = [],
        wallArray = [],
        width = CONST.getWindowWidth(),
        resolution = param.resolution,
        dAlpha = (param.fovX / (width / resolution));
    this.dAlpha = dAlpha;
    let rayAngle /* init first ray */ = this.mainPlayer.alpha - 0.5 * param.fovX;
    //
    for (let i = 0; i < width; i += resolution) {
        rayAngleArray.push(rayAngle += dAlpha);
    }
    this.rayAngleArray = rayAngleArray;
    //
    rayAngleArray.map((i, index) => {
        const result = raycaster(this.mainPlayer.x, this.mainPlayer.y, rayAngleArray[index], this.mainPlayer.alpha, state.accumulatedJumpHeight);
        wallArray.push(result);
    });
    this.wallArray = wallArray;
};
Game.prototype.drawFrame = function() {
    const
        width = CONST.getWindowWidth(),
        height = CONST.getWindowHeight(),
        ctx = document.getElementById('mainCanvas').getContext('2d');
    ctx.clearRect(0, 0, width, height);
// resolution
    param.resolution = state.isLowerGraphicQuality ? param.resolutionLow : param.resolutionHigh;
// sky
//     const
        // sky = document.getElementById("sky"),
        // skyWidth = sky.width,
        // skyHeight = sky.height,
        // playerAlpha =  this.mainPlayer.alpha,
        // twoPI = Math.PI * 2,
        // cameraAngle = playerAlpha % twoPI,
        // direction = cameraAngle > 0 ?
        //     cameraAngle / twoPI :
        //     (twoPI + cameraAngle) / twoPI;
    ctx.beginPath();
    ctx.fillStyle = 'rgb(0, 172, 237)';
    ctx.fillRect(0, 0, width, 0.5 * height);
    ctx.fill();
    // if (5/6*twoPI <= direction && direction <= twoPI) {
    //     const overlay = direction - 5/6*twoPI;
    //     ctx.drawImage(sky, direction*skyWidth, 0, skyWidth, skyHeight, 0, 0, width, 0.6*height);
    // } else {
    //     ctx.drawImage(sky, direction*skyWidth, 0, 1/6*skyWidth, skyHeight, 0, 0, width, 0.6*height);
    // }
    // if (direction >= 0.75) {
    //     ctx.drawImage(sky, 0, 0, 0.25*skyWidth, skyHeight, (1-direction)/0.25*width, 0, width, 0.6*height);
    // }
// floor
    ctx.beginPath();
    ctx.fillStyle = 'rgba(50,50,50,1)';
    ctx.fillRect(0, 0.5 * height, width, 0.5 * height);
    ctx.fill();
// wall
    this.wallArray.map((arr, index) => {
        arr.map(obj => {
            const
                resolution = param.resolution,
                wallStart = obj.wallStartYOnScreenPercent * height,
                wallEnd = obj.wallEndYOnScreenPercent * height;
            ctx.fillStyle = obj.hitDirection === 0 ? param.getWallTypeInfo()[obj.hitWallType].color : param.getWallTypeInfo()[obj.hitWallType].shade;
            ctx.beginPath();
            ctx.fillRect(index * resolution, wallStart, resolution, wallEnd - wallStart);
            ctx.fill();
            // const
            //     brickWall = document.getElementById('greyWall'),
            //     offset = obj.hitDirection === 0 ? obj.x - Math.floor(obj.x) : obj.y - Math.floor(obj.y),
            //     sourceX = offset * brickWall.width,
            //     sourceWidthInOneColumn = resolution / CONST.getWindowWidth() * brickWall.width,
            //     sourceWidth = sourceX + sourceWidthInOneColumn > brickWall.width ? brickWall.width - sourceX : sourceWidthInOneColumn;
            //
            // ctx.drawImage(
            //     brickWall,
            //     sourceX,
            //     obj.textureYOffset * brickWall.height,
            //     sourceWidth,
            //     (1 - obj.textureYOffset) * brickWall.height,
            //     index * resolution,
            //     wallStart,
            //     resolution,
            //     wallEnd - wallStart);
            // // shade
            // if (obj.hitDirection === 1) {
            //     ctx.fillStyle = 'rgba(0,0,0,0.3)';
            //     ctx.beginPath();
            //     ctx.fillRect(index * resolution, wallStart, resolution, wallEnd - wallStart);
            //     ctx.fill();
            // }
        });
    });

    // otherplayer
    this.otherPlayers.map(otherplayer => {
        this.drawOtherPlayers(otherplayer, otherplayer.anotherPlayersAngleToMainPlayer, otherplayer.distance)
    });

    // crosshair
    const isMoving = this.mainPlayer.forward || this.mainPlayer.backward || state.currentJumpVelocity;
    const crosshairSize = isMoving ? 15 : 0;

    ctx.strokeStyle = "rgba(0,255,0,0.8)";
    ctx.beginPath();
    ctx.moveTo(0.5*width-20-crosshairSize,0.5*height);
    ctx.lineTo(0.5*width-5-crosshairSize,0.5*height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.5*width+5+crosshairSize,0.5*height);
    ctx.lineTo(0.5*width+20+crosshairSize,0.5*height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.5*width,0.5*height-20-crosshairSize);
    ctx.lineTo(0.5*width,0.5*height-5-crosshairSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.5*width,0.5*height+5+crosshairSize);
    ctx.lineTo(0.5*width,0.5*height+20+crosshairSize);
    ctx.stroke();

    // bullet sparks: move all sparks already existed, move is here because there are more than 1 move-draw cycle in one frame;
    // before gun due to layer priority
    const prepareBulletSparksBeforeMove = () => {
        const now = new Date();
        const newArray = [];
        const playerAlphaNow = this.mainPlayer.alpha;
        const screenWidth = CONST.getWindowWidth();
        const screenHeight = CONST.getWindowHeight();
        state.bulletHit.sparks.map((obj) => {
            if (now - obj.timeStamp < 500) {
                const shiftAlpha = playerAlphaNow - obj.playerAlpha;
                const jumpD = state.accumulatedJumpHeight - obj.accumulatedJumpHeight;
                const shiftY = jumpD / (obj.z * Math.tan(param.fovY * 0.5) * 2) * screenHeight;
                if (shiftAlpha) {
                    // let shiftX = Math.tan(shiftAlpha) * obj.z; /* shift on map grid */
                    // shiftX =  Math.min(screenWidth * shiftX / obj.z, screenWidth); /* shift on screen */
                    const shiftX = Math.min(screenWidth * Math.tan(shiftAlpha), screenWidth);
                    obj.screenX -= shiftX;
                    obj.playerAlpha = playerAlphaNow;
                }
                //
                obj.screenY += shiftY;
                obj.accumulatedJumpHeight = state.accumulatedJumpHeight;
                newArray.push(obj);
            }
        });
        state.bulletHit.sparks = newArray;
    };
    const moveBulletSparks = () => {
        const gravity = CONST.getWindowWidth() * 0.000005;
        state.bulletHit.sparks.map((obj) => {
            const gravityToZ = Math.min(gravity, gravity * 2 / obj.z);
            if (obj.type === 'dirt') {
                obj.screenX += obj.speedX;
                obj.speedX *= 0.9;
                obj.speedY += gravityToZ;
                obj.screenY += obj.speedY;
                obj.opacity -= 0.003;
                obj.radius *= 0.99;
            } else if (obj.type === 'spark' || obj.type === 'blood') {
                // sparks and blood
                obj.screenX += obj.speedX;
                obj.speedX *= 0.999;
                obj.speedY += gravityToZ;
                obj.screenY += obj.speedY;
                obj.opacity -= 0.001;
                obj.radius *= 0.99;
            } else if (obj.type === 'crater') {
                obj.opacity -= 0.003;
            }
        });

        state.bulletHit.sparks.map((obj) => {
            ctx.fillStyle = obj.type === 'spark' ? 'rgba(255,255,0,'+obj.opacity+')' :
                obj.type === 'blood' ? 'rgba(255,0,0,'+obj.opacity+')' :
                    obj.type === 'dirt' ? 'rgba(50,50,50,'+obj.opacity+')' :
                        'rgba(0,0,0,'+obj.opacity+')';
            ctx.beginPath();
            ctx.arc(obj.screenX, obj.screenY, obj.radius, 0, 2 * Math.PI);
            ctx.fill();
        })
    };
    // bullet sparks: before gun due to layer priority
    if (state.bulletHit.sparks.length !== 0) {
        prepareBulletSparksBeforeMove();
        for (let i=0; i<10; i++) {
            moveBulletSparks()
        }
    }
    // gun
    const
        gunPosition = state.getGunPostion(),
        gunPosStartX = gunPosition[0],
        gunPosStartY = gunPosition[1],
        gunWidth = gunPosition[2],
        gunHeight = gunPosition[3],
        gun = document.getElementById("gun"),
        gunWidthSource = gun.width,
        gunHeightSource = gun.height;
    if (state.isFiring) {
        const
            muzzle = document.getElementById("muzzle"),
            muzzleWidthSource = muzzle.width,
            muzzleHeightSource = muzzle.height,
            muzzleHeight = 0.2 * gunWidth,
            muzzleWidth = muzzleHeight,
            muzzleCenterX = gunPosStartX + gunWidth * (5.4 / 20.7),
            muzzleCenterY = gunPosStartY + gunHeight * (1.7 / 13.2),
            muzzlePosStartX = 0 - 0.5 * muzzleWidth, /* after translate, muzzle center is 0,0 */
            muzzlePosStartY = 0 - 0.5 * muzzleHeight;
        // draw muzzle
        ctx.translate(muzzleCenterX, muzzleCenterY);
        ctx.rotate(state.muzzelRotate);
        ctx.drawImage(muzzle, 0, 0, muzzleWidthSource, muzzleHeightSource, muzzlePosStartX, muzzlePosStartY, muzzleWidth, muzzleHeight);
        ctx.rotate(-state.muzzelRotate);
        ctx.translate(-muzzleCenterX, -muzzleCenterY);
        // draw crater
        const radius = Math.min(4, 20 / state.bulletHit.z);
        ctx.fillStyle = state.bulletHit.isHitConfirmed ? 'rgb(255,0,0)' : 'rgb(0,0,0)';
        ctx.beginPath();
        ctx.arc(state.bulletHit.screenX, state.bulletHit.screenY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.drawImage(gun, 0, 0, gunWidthSource, gunHeightSource, gunPosStartX, gunPosStartY, gunWidth, gunHeight);
    // empty bullet
    const
        emptyBullet = document.getElementById("emptyBullet"),
        emptyBulletWidth = emptyBullet.width,
        emptyBulletHeight = emptyBullet.height,
        bulletDimension = gunWidth * 0.05;
    state.emptyBullets.map((i) => {
        ctx.drawImage(emptyBullet, 0, 0, emptyBulletWidth, emptyBulletHeight, i[0], i[1], bulletDimension, bulletDimension);
    });

    // reloading text
    const flasingText = (messageString) => {
        ctx.font = "36px csFont";
        if (state.canvasCenterTextOpacity >= 0.5 && state.canvasCenterTextOpacity <= 1) {
            state.canvasCenterTextOpacity = state.canvasCenterTextOpacity + 0.1 * state.canvasCenterTextOpacitySign
        }
        if (state.canvasCenterTextOpacity < 0.5) {
            state.canvasCenterTextOpacity = 0.5;
            state.canvasCenterTextOpacitySign = 1;
        } else if (state.canvasCenterTextOpacity > 1) {
            state.canvasCenterTextOpacity = 1;
            state.canvasCenterTextOpacitySign = -1;
        }
        ctx.fillStyle = "rgba(255, 0, 0, " + state.canvasCenterTextOpacity + ")";
        ctx.textAlign = "center";
        ctx.fillText(messageString, width * 0.5, height * 0.6);
    };
    if (state.isReloading) {
        flasingText('RELOADING')
    }
    // no ammo text
    if (state.isShowingNoAmmoText) {
        flasingText('RAN OUT OF AMMO')
    }
    // latency text
    if (state.isDisplayingLatency) {
        ctx.font = "300 10px Roboto";
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.textAlign = "right";
        ctx.fillText('ping: ' + state.latency + ' ms', width, 10);
    }
    // damage indicator
    if(state.damageIndicator.length !== 0) {
        //
        const otherPlayerAngleArray = [];
        const otherPlayersArray = this.otherPlayers.slice();
        otherPlayersArray.map(obj => {
            if (state.damageIndicator.indexOf(obj.playerId) !== -1) {
                otherPlayerAngleArray.push(obj.anotherPlayersAngleToMainPlayer)
            }
        });
        let mainPlayerFacing = this.mainPlayer.alpha;
        mainPlayerFacing = remapAngleToZeroToTwoPI(mainPlayerFacing);
        let diff = mainPlayerFacing - otherPlayerAngleArray[0];
        diff = remapAngleToZeroToTwoPI(diff);

        const calcDirection = (diff, fov) => {
            const twoPI = Math.PI * 2;
            const halfFov = 0.5 * fov;
            if ((-halfFov + twoPI < diff && diff <= twoPI) || (0 <= diff && diff <= halfFov)) {
                return 'front'
            } else if (halfFov < diff && diff <= 0.375 * twoPI) {
                return 'left'
            } else if (0.375 * twoPI < diff && diff <= 0.625 * twoPI) {
                return 'back'
            } else if (0.625 * twoPI < diff && diff <= -halfFov + twoPI) {
                return 'right'
            }
        };

        otherPlayerAngleArray.map(otherPlayerAngle => {
            let diff = mainPlayerFacing - otherPlayerAngle;
            diff = remapAngleToZeroToTwoPI(diff);
            const obj = {
                direction: calcDirection(diff, param.fovX),
                date: new Date()
            };
            this.drawDamageIndicatorArray.push(obj)
        });
        //
        state.damageIndicator = [];
    }
    if (this.drawDamageIndicatorArray.length !== 0) {
        ctx.strokeStyle = 'rgba(255,0,0,0.3)';
        ctx.lineWidth = 0.05 * height;
        let start, end;
        this.drawDamageIndicatorArray.map(obj => {
            const direction = obj.direction;
            const twoPI = Math.PI * 2;
            ctx.beginPath();
            if (direction === 'front') {
                start = -0.375 * twoPI;
            } else if (direction === 'right') {
                start = -0.125 * twoPI;
            } else if (direction === 'back') {
                start = 0.125 * twoPI;
            } else if (direction === 'left') {
                start = 0.375 * twoPI;
            }
            end = start + 0.25 * twoPI;
            ctx.arc(0.5 * width, 0.5 * height, 0.2 * height, start, end);
            ctx.stroke();
        });
        ctx.lineWidth = 1;

        // filter out old damage indicator
        const now = new Date();
        this.drawDamageIndicatorArray = this.drawDamageIndicatorArray.filter(obj => {
            const start = new Date(obj.date);
            return now - start < 1000
        });
    }
    // Minimap
    this.drawMinimap();
};
Game.prototype.updateOtherPlayers = function() {
    const array = [];
    state.playersArray.map(obj => {
        if (obj.playerId !== state.playerId) array.push(obj)
    });
    this.otherPlayers = array;
    // clear hit zone
    state.hitZone = [];
// modify the object, add property anotherPlayersAngleToMainPlayer, isInSight, distance
    const appendProperties = (otherPlayer) => {
        const
            x1 = this.mainPlayer.x,
            y1 = this.mainPlayer.y,
            x2 = otherPlayer.x,
            y2 = otherPlayer.y,
            dx = x2 - x1,
            dy = y2 - y1,
            z = Math.pow(dx*dx + dy*dy, 0.5),
            twoPI = Math.PI * 2,
            rayAngleArray = this.rayAngleArray.slice();
        let anotherPlayersAngleToMainPlayer;
        // dy is reversed in canvas cordinate, and our 0 deg is x-positive !!
        if (dx === 0 && dy === 0) {
            anotherPlayersAngleToMainPlayer = 0;
        } else if (dx === 0) {
            if (dy > 0) {
                anotherPlayersAngleToMainPlayer = 0.25 * twoPI
            } else if (dy < 0) {
                anotherPlayersAngleToMainPlayer = 0.75 * twoPI
            }
        } else if (dy === 0) {
            if (dx > 0) {
                anotherPlayersAngleToMainPlayer = 0
            } else if (dx < 0){
                anotherPlayersAngleToMainPlayer = 0.5 * twoPI
            }
        } else if (dx > 0 && dy > 0) {
            anotherPlayersAngleToMainPlayer = Math.atan(dy / dx);
        } else if (dx < 0 && dy > 0) {
            anotherPlayersAngleToMainPlayer = twoPI * 0.5 - Math.atan(dy / -dx);
        } else if (dx < 0 && dy < 0) {
            anotherPlayersAngleToMainPlayer = Math.atan(-dy / -dx) + twoPI * 0.5;
        } else if (dx > 0 && dy < 0) {
            anotherPlayersAngleToMainPlayer = twoPI - Math.atan(-dy / dx);
        }
        anotherPlayersAngleToMainPlayer = remapAngleToZeroToTwoPI(anotherPlayersAngleToMainPlayer);
        otherPlayer.anotherPlayersAngleToMainPlayer = anotherPlayersAngleToMainPlayer;
        otherPlayer.distance = z;
    };
    //
    this.otherPlayers.map(obj => {
        appendProperties(obj)
    });
    // sort, draw from far to close
    this.otherPlayers.sort((a, b) => b.distance - a.distance);
};
Game.prototype.drawOtherPlayers = function(otherPlayer, anotherPlayersAngleToMainPlayer, z) {
    const diff = remapAngleToZeroToTwoPI(anotherPlayersAngleToMainPlayer - this.rayAngleArray[0]);
    if (0 < diff && diff < param.fovX) {
        const screenWidth = CONST.getWindowWidth();
        const screenHeight = CONST.getWindowHeight();
        const otherPlayerXOnScreen = Math.floor((diff / param.fovX) * screenWidth);
        const index = Math.floor((diff / param.fovX) * this.wallArray.length);
        const array = this.wallArray[index];
        const wallDistAtThisPos = array[array.length - 1].dist;

        if (z <= wallDistAtThisPos) {
            const
                playerActualHeight = 1.5, /* my height is 1, otherplayer in my sight is a bit taller so crosshair won't aim head */
                jumpHeightOffset = otherPlayer.accumulatedJumpHeight - state.accumulatedJumpHeight,
                playerActualWidth = playerActualHeight / 24 * 13.6, /* ratio as per actual image ratio */
                //zCorrected = z * Math.cos(anotherPlayersAngleToMainPlayer - this.mainPlayer.alpha - Math.PI * 0.5),
                //distance = z * Math.cos(anotherPlayersAngleToMainPlayer),
                cameraPlaneHeight = z * Math.tan(param.fovY * 0.5) * 2,
                cameraPlaneWidth = z * Math.tan(param.nonDistortionFovX / 1.2  * 0.5) * 2,
                playerDrawStartYPercent = ((1.5 - 1) + jumpHeightOffset) / (cameraPlaneHeight * 0.5),/* zero is top */
                playerDrawStartYScreen = (1 - playerDrawStartYPercent) * screenHeight * 0.5,
                playerHeightOnScreen = (playerActualHeight / cameraPlaneHeight) * screenHeight,
                playerWidthOnScreen = (playerActualWidth / cameraPlaneWidth) * screenWidth;
            // check if another player is blocked by wall is HERE!!
            // draw other player if insight
            const ctx = document.getElementById('mainCanvas').getContext('2d');
            const soldierEl = document.getElementById('soldier');
            ctx.globalAlpha = otherPlayer.isRespawning ? 0.5 : 1;
            ctx.drawImage(soldierEl, 0, 0, soldierEl.width, soldierEl.height, otherPlayerXOnScreen, playerDrawStartYScreen, playerWidthOnScreen, playerHeightOnScreen);
            ctx.globalAlpha = 1;
            // other player's id
            const fontSize = Math.min(18, 8 + 20 / z);
            ctx.font = '500 ' + fontSize + 'px Roboto';
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.textAlign = "center";
            ctx.fillText(otherPlayer.playerId, otherPlayerXOnScreen + 0.5 * playerWidthOnScreen, playerDrawStartYScreen - 10);
            // update hitZone
            if (!otherPlayer.isRespawning) {
                const hitZone = {
                    playerId: otherPlayer.playerId,
                    x: otherPlayerXOnScreen,
                    y: playerDrawStartYScreen,
                    width: playerWidthOnScreen,
                    height: playerHeightOnScreen,
                    z: z
                };
                state.hitZone.push(hitZone);
            }
        }
    }
};
Game.prototype.drawMinimap = function() {
    // variables
    const
        ctx = document.getElementById('mainCanvas').getContext('2d'),
        miniMapMargin /* eg: top =left = 10px */= this.miniMapMargin,
        mapGrid = param.getMapGrid(),
        mapGridSize /* it's a square */ = mapGrid.length,
        miniMapSize /* it's a square */ = this.miniMapSize,
        pixel /* unit pixel for one grid, eg: 200/40=5px */ = miniMapSize / mapGridSize,
        playerXOnMinimap = this.mainPlayer.x * pixel + miniMapMargin,
        playerYOnMinimap = this.mainPlayer.y * pixel + miniMapMargin,
        isTogglingMiniMap /* 1: enlarging, 0: false, -1: shrinking */ = state.isTogglingMiniMap,
        miniMapSizeInNextFrame = miniMapSize + isTogglingMiniMap * this.miniMapToggleSpeed;

    // toggling minimap
    if (isTogglingMiniMap) {
        // indeed is toggling
        if (miniMapSizeInNextFrame >= this.miniMapSizeMax || miniMapSizeInNextFrame <= this.miniMapSizeMin) {
            // last frame
            this.miniMapSize = isTogglingMiniMap === 1 ? this.miniMapSizeMax : this.miniMapSizeMin
        } else {
            this.miniMapSize = miniMapSizeInNextFrame
        }
    }

    // wall
    for (let y=0; y<mapGridSize; y++) {
        for (let x=0; x<mapGridSize; x++){
            if (mapGrid[y][x]) {
                ctx.fillStyle = "rgba(0,150,0,0.5)";
                ctx.fillRect(x * pixel + miniMapMargin, y * pixel + miniMapMargin, pixel, pixel);
            }
        }
    }
    // player
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(playerXOnMinimap, playerYOnMinimap, miniMapSize / 100, 0 , 2 * Math.PI);
    ctx.fill();
    // rays
    this.rayAngleArray.map((i, index) => {
        const thisRayLength = this.wallArray[index][this.wallArray[index].length - 1].dist;
        ctx.strokeStyle = "rgba(0,255,0,0.01)";
        ctx.beginPath();
        ctx.moveTo(playerXOnMinimap, playerYOnMinimap);
        ctx.lineTo(playerXOnMinimap + pixel * thisRayLength * Math.cos(i), playerYOnMinimap + pixel * thisRayLength * Math.sin(i));
        ctx.stroke();
    });
    // direction pointer
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(playerXOnMinimap, playerYOnMinimap);
    ctx.lineTo(playerXOnMinimap + pixel * Math.cos(this.mainPlayer.alpha), playerYOnMinimap + pixel * Math.sin(this.mainPlayer.alpha));
    ctx.stroke();
    // grid
    for (let i = 0; i <= mapGridSize; i++) {
        const
            start = i * pixel + miniMapMargin,
            end = mapGridSize * pixel + miniMapMargin;
        ctx.strokeStyle = "rgba(0,150,0,0.1)";
        ctx.beginPath();
        ctx.moveTo(miniMapMargin, start);
        ctx.lineTo(end, start);
        ctx.moveTo(start, miniMapMargin);
        ctx.lineTo(start, end);
        ctx.stroke();
    }
};
Game.prototype.attachEventListeners = function() {
    const player = this.mainPlayer;
    document.addEventListener('keydown', function(e) {
        switch(e.keyCode){
            case 65:
                player.counterClockwise = true;
                break;
            case 87:
                player.forward = true;
                break;
            case 68:
                player.clockwise = true;
                break;
            case 83:
                player.backward = true;
                break;
            case 32:
                if(!state.accumulatedJumpHeight) state.currentJumpVelocity = param.getInitialJumpVelocity();
                break;
            case 77:
                const isTogglingMiniMap = state.isTogglingMiniMap;
                state.isTogglingMiniMap = !isTogglingMiniMap ?
                    1 :
                    isTogglingMiniMap === 1 ?
                        -1 :
                        1;

                break;
            case 13:
                if(!state.isFireRequested) state.isFireRequested = true;
                break;
            case 82:
                if(!state.isReloadRequested) state.isReloadRequested = true;
                break;
        }
    });
    document.addEventListener('keyup', function(e) {
        switch(e.keyCode){
            case 65:
                player.counterClockwise = false;
                break;
            case 87:
                player.forward = false;
                break;
            case 68:
                player.clockwise = false;
                break;
            case 83:
                player.backward = false;
                break;
            case 13:
                state.isFireRequested = false;
                break;
        }
    })
};
Game.prototype.respawnFrame = function() {
    const now = new Date();
    const timeDiff = now - new Date(this.deathTimeStamp);
    if (timeDiff > 5000) {
        this.mainPlayer.respawn();
    }
    //
    if (state.isConnectedToServer) {
        serverConnection.upLinkUpdatePosition();
    }

    // animation
    if (this.respawnFramethrottler % 4 === 0) {
        const ctx = document.getElementById('mainCanvas').getContext('2d');
        const width = CONST.getWindowWidth();
        const height = CONST.getWindowHeight();
        if (timeDiff < 2500) {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, width, height);
            ctx.fill();
            //
            ctx.font = '700 36px Roboto';
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.textAlign = "center";
            ctx.fillText('RESPAWNING', 0.5 * width, 0.5 * height);
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, width, height);
            ctx.fill();
            //
            ctx.font = '700 36px Roboto';
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.textAlign = "center";
            ctx.fillText('HOLD ON', 0.5 * width, 0.5 * height);
        }
    }
    this.respawnFramethrottler++;


    //
    if (state.isRespawning) {
        requestAnimationFrame(this.respawnFrame);
    } else {
        this.respawnFramethrottler = 1;
        requestAnimationFrame(this.frame);
    }
};
Game.prototype.frame = function() {
    this.mainPlayer.move();
    if (state.isConnectedToServer) {
        serverConnection.upLinkUpdatePosition();
    }
    this.updateOtherPlayers();
    this.ray();
    this.drawFrame();

    if (!state.isRespawning) {
        requestAnimationFrame(this.frame);
    } else {
        // state.isRespawning changed in serverconnection handledownlinkhitby
        this.deathTimeStamp = new Date();
        requestAnimationFrame(this.respawnFrame);
    }
};
Game.prototype.play = function() {
    game.initiateCanvas();
    game.createMainPlayer();
    game.attachEventListeners();
    serverConnection.initiateConnection();

    this.respawnFrame = this.respawnFrame.bind(this);
    this.frame = this.frame.bind(this);
    requestAnimationFrame(this.frame);
};

const game = new Game();

export { game };