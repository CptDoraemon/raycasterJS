import { param } from "./param";
import { CONST } from "./globalvar";
import { InstructionComponent, ToolBarComponent, PlayerStatusComponent, ServerMessageComponent, ScoreBoardComponent } from "./domcomponents";
import { state } from "./state";
import { Player } from "./player";
import { serverConnection } from "./serverconnection";

function Game() {
    this.mainPlayer;
    this.otherPlayers = [];
    //
    this.wallDistArray = [];
    this.hitWallTypeArray = [];
    this.hitDirectionArray = [];
    this.rayAngleArray = [];
    this.wallDistArrayBeforeFishEyeCorrection = []; // for drawing ray on minimap
    this.fov = Math.PI / 3; //60 degree
    this.dAlpha; /* angle between rays */
    // get vars from param
    this.mapGrid = param.getMapGrid();
    //
    this.drawDamageIndicatorArray = [];
    //
    this.deathTimeStamp; // used in respawn frame
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

    const mainCanvas = `<canvas id="mainCanvas" width=${width} height=${height}>Your Browser Does Not Support Html5 Canvas</canvas>`;
    container.innerHTML = mainCanvas;

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
        raydistArray = [],
        raydistArrayFishEyeCorrected = [],
        hitDirectionArray = [],
        hitWallTypeArray = [],
        mapGrid = this.mapGrid,
        width = CONST.getWindowWidth(),
        height = CONST.getWindowHeight(),
        resolution = param.resolution,
        dAlpha = (this.fov / (width / resolution));
    this.dAlpha = dAlpha;
    let rayAngle /* init first ray */ = this.mainPlayer.alpha - 0.5 * this.fov;
    //
    for (let i = 0; i < width; i += resolution) {
        rayAngleArray.push(rayAngle += dAlpha);
    }
    //
    rayAngleArray.map((i, index) => {
        const
            result = raycaster(this.mainPlayer.x, this.mainPlayer.y, rayAngleArray[index]),
            dist = result[0],
            hitDirection = result[1],
            hitWallType = result[2],
            fishEyeCorrection = Math.abs(Math.cos(rayAngleArray[index] - this.mainPlayer.alpha));

        raydistArray.push(dist);
        raydistArrayFishEyeCorrected.push(dist * fishEyeCorrection);
        hitDirectionArray.push(hitDirection);
        hitWallTypeArray.push(hitWallType);
    });
    // update arrays in properties
    this.wallDistArrayBeforeFishEyeCorrection = raydistArray;
    this.wallDistArray = raydistArrayFishEyeCorrected;
    this.hitWallTypeArray = hitWallTypeArray;
    this.hitDirectionArray = hitDirectionArray;
    this.rayAngleArray = rayAngleArray;

    // raycaster
    function raycaster(x, y, alpha) {
        //input origin x,y and angle alpha, return distance.
        function checkHit (x, y) {
            // hit if grid value is not 0
            return mapGrid[y][x] !== 0
        }
        const
            sin = Math.sin(alpha),
            cos = Math.cos(alpha),
            tan = Math.tan(alpha),
            result = [];
        // temp variables used for calculation
        let vx, vy, hx, hy, dist, distV, distH, hitDirection /* 0: horizontal, 1:vertical */, hitWallType;

        //2 tan>0 x++ y++
        if (sin >= 0 && cos > 0) {
            //vertical
            vx = Math.ceil(x);
            vy = Math.min(y + tan * (vx - x), 39);
            while (!checkHit(Math.floor(vx),Math.floor(vy))) {
                vx++;
                vy = Math.min(vy + tan, 39);
            }
            //horizontal
            hy = Math.ceil(y); //DO NOT REVERSE HY HX!
            hx = x + (hy - y)/tan;
            while (!checkHit(Math.floor(hx),Math.floor(hy))) {
                hx += 1/tan;
                hy++;
            }
            distV = Math.pow((vx-x)*(vx-x)+(vy-y)*(vy-y), 0.5);
            distH = Math.pow((hx-x)*(hx-x)+(hy-y)*(hy-y), 0.5);
            if (distV >= distH) {
                dist = distH;
                hitDirection = 0;
                hitWallType = mapGrid[Math.floor(hy)][Math.floor(hx)];
            } else {
                dist = distV;
                hitDirection = 1;
                hitWallType = mapGrid[Math.floor(vy)][Math.floor(vx)];
            }
        }

        //4 tan<0 x-- y++
        if (sin > 0 && cos <= 0) {
            //vertical
            vx = Math.floor(x);
            vy = Math.min(y + tan * (vx - x), 39);
            while (!checkHit(Math.floor(vx)-1,Math.floor(vy))) {
                vx--;
                vy = Math.min(vy - tan, 39);
            }
            //horizontal
            hy = Math.ceil(y); //DO NOT REVERSE HY HX!
            hx = x + (hy - y)/tan;
            while (!checkHit(Math.floor(hx),Math.floor(hy))) {
                hx += 1/tan;
                hy++;
            }
            distV = Math.pow((vx-x)*(vx-x)+(vy-y)*(vy-y),0.5);
            distH = Math.pow((hx-x)*(hx-x)+(hy-y)*(hy-y),0.5);
            if (distV >= distH) {
                dist = distH;
                hitDirection = 0;
                hitWallType = mapGrid[Math.floor(hy)][Math.floor(hx)];
            } else {
                dist = distV;
                hitDirection = 1;
                hitWallType = mapGrid[Math.floor(vy)][Math.floor(vx)-1];
            }
        }

        //6 tan>0 x-- y--
        if (sin <= 0 && cos < 0) {
            //vertical
            vx = Math.floor(x);
            vy = Math.max(y + tan * (vx - x), 1);
            while (!checkHit(Math.floor(vx)-1,Math.floor(vy))) {
                vx--;
                vy = Math.max(vy - tan, 1);
            }
            //horizontal
            hy = Math.floor(y); //DO NOT REVERSE HY HX!
            hx = x + (hy - y)/tan;
            while (!checkHit(Math.floor(hx),Math.floor(hy)-1)) {
                hx -= 1/tan;
                hy--;
            }
            distV = Math.pow((vx-x)*(vx-x)+(vy-y)*(vy-y),0.5);
            distH = Math.pow((hx-x)*(hx-x)+(hy-y)*(hy-y),0.5);
            if (distV >= distH) {
                dist = distH;
                hitDirection = 0;
                hitWallType = mapGrid[Math.floor(hy)-1][Math.floor(hx)];
            } else {
                dist = distV;
                hitDirection = 1;
                hitWallType = mapGrid[Math.floor(vy)][Math.floor(vx)-1];
            }
        }

        //8 tan<0 x++ y--
        if (sin < 0 && cos >= 0) {
            //vertical
            vx = Math.ceil(x);
            vy = Math.max(y + tan * (vx - x), 1);
            while (!checkHit(Math.floor(vx),Math.floor(vy))) {
                vx++;
                vy = Math.max(vy + tan, 1);
            }
            //horizontal
            hy = Math.floor(y); //DO NOT REVERSE HY HX!
            hx = x + (hy - y)/tan;
            while (!checkHit(Math.floor(hx),Math.floor(hy)-1)) {
                hx -= 1/tan;
                hy--;
            }
            distV = Math.pow((vx-x)*(vx-x)+(vy-y)*(vy-y),0.5);
            distH = Math.pow((hx-x)*(hx-x)+(hy-y)*(hy-y),0.5);
            if (distV >= distH) {
                dist = distH;
                hitDirection = 0;
                hitWallType = mapGrid[Math.floor(hy)-1][Math.floor(hx)];
            } else {
                dist = distV;
                hitDirection = 1;
                hitWallType = mapGrid[Math.floor(vy)][Math.floor(vx)];
            }
        }

        //
        result.push(dist);
        result.push(hitDirection);
        result.push(hitWallType);
        return result;
    }
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
    const
        sky = document.getElementById("sky"),
        skyWidth = sky.width,
        skyHeight = sky.height,
        playerAlpha =  this.mainPlayer.alpha,
        twoPI = Math.PI * 2,
        cameraAngle = playerAlpha % twoPI,
        direction = cameraAngle > 0 ?
            cameraAngle / twoPI :
            (twoPI + cameraAngle) / twoPI;

    ctx.drawImage(sky, direction*skyWidth, 0, 0.25*skyWidth, skyHeight, 0, 0, width, 0.6*height);
    if (direction >= 0.75) {
        ctx.drawImage(sky, 0, 0, 0.25*skyWidth, skyHeight, (1-direction)/0.25*width, 0, width, 0.6*height);
    }
// floor
    ctx.beginPath();
    ctx.fillStyle = 'rgba(150,150,150,1)';
    ctx.fillRect(0, 0.5 * height, width, 0.5 * height);
    ctx.fill();
// wall
    const wallDistArray = this.wallDistArray.slice();
    wallDistArray.map((i, index) => {
        const
            columnHeightPercent = Math.min(3 / i, 1.5),
            halfWallHeight = 0.5 * columnHeightPercent * height,
            mid = 0.5 * height,
            wallStart = mid - halfWallHeight,
            wallEnd = mid + halfWallHeight,
            hitWallType = this.hitWallTypeArray[index],
            hitDirection = this.hitDirectionArray[index],
            resolution = param.resolution;

        const wallColorArray = param.getWallColorArray();
        const wallColor = wallColorArray[hitWallType - 1][hitDirection];
        ctx.fillStyle = wallColor;
        ctx.beginPath();
        ctx.fillRect(index * resolution, wallStart + state.accumulatedJumpHeight, resolution, wallEnd - wallStart);
        ctx.fill();
    });

    // otherplayer
    this.otherPlayers.map(otherplayer => {
        if (otherplayer.isInSight) {
            this.drawOtherPlayers(otherplayer, otherplayer.anotherPlayersAngleToMainPlayer, otherplayer.distance, width, height)
        }
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
        state.bulletHitSparks.map((obj) => {
            if (now - obj.timeStamp < 500) {
                const shiftAlpha = playerAlphaNow - obj.playerAlpha;
                const shiftY = state.accumulatedJumpHeight - obj.accumulatedJumpHeight;
                if (shiftAlpha) {
                    // let shiftX = Math.tan(shiftAlpha) * obj.z; /* shift on map grid */
                    // shiftX =  Math.min(screenWidth * shiftX / obj.z, screenWidth); /* shift on screen */
                    const shiftX = Math.min(screenWidth * Math.tan(shiftAlpha), screenWidth);
                    obj.x -= shiftX;
                    obj.playerAlpha = playerAlphaNow;
                };
                if (shiftY) {
                    obj.y += shiftY;
                    obj.accumulatedJumpHeight = state.accumulatedJumpHeight;
                };
                newArray.push(obj);
            }
        });
        state.bulletHitSparks = newArray;
    }
    const moveBulletSparks = () => {
        const gravity = CONST.getWindowWidth() * 0.000005;
        state.bulletHitSparks.map((obj) => {
            const gravityToZ = Math.min(gravity, gravity * 2 / obj.z);
            if (obj.type === 'dirt') {
                obj.x += obj.speedX;
                obj.speedX *= 0.9;
                obj.speedY += gravityToZ;
                obj.y += obj.speedY;
                obj.opacity -= 0.003;
                obj.radius *= 0.99;
            } else if (obj.type === 'spark' || obj.type === 'blood') {
                // sparks and blood
                obj.x += obj.speedX;
                obj.speedX *= 0.999;
                obj.speedY += gravityToZ;
                obj.y += obj.speedY;
                obj.opacity -= 0.001;
                obj.radius *= 0.99;
            } else if (obj.type === 'crater') {
                obj.opacity -= 0.003;
            }
        });

        state.bulletHitSparks.map((obj) => {
            ctx.fillStyle = obj.type === 'spark' ? 'rgba(255,255,0,'+obj.opacity+')' :
                obj.type === 'blood' ? 'rgba(255,0,0,'+obj.opacity+')' :
                    obj.type === 'dirt' ? 'rgba(50,50,50,'+obj.opacity+')' :
                        'rgba(0,0,0,'+obj.opacity+')';
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
            ctx.fill();
        })
    }
    // bullet sparks: before gun due to layer priority
    if (state.bulletHitSparks.length !== 0) {
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
        const radius = Math.min(4, 20 / state.bulletHitZ);
        ctx.fillStyle = state.bulletHitConfirmed ? 'rgb(255,0,0)' : 'rgb(0,0,0)';
        ctx.beginPath();
        ctx.arc(state.bulletHitX, state.bulletHitY, radius, 0, 2 * Math.PI);
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
        mainPlayerFacing = CONST.remapAngleToZeroToTwoPI(mainPlayerFacing);
        let diff = mainPlayerFacing - otherPlayerAngleArray[0];
        diff = CONST.remapAngleToZeroToTwoPI(diff);

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
            diff = CONST.remapAngleToZeroToTwoPI(diff);
            const obj = {
                direction: calcDirection(diff, this.fov),
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
    })
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
            rayAngleArray = this.rayAngleArray.slice(),
            remapAngleToZeroToTwoPI = CONST.remapAngleToZeroToTwoPI;
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

        function checkIfAnotherPlayerIsInSight(sightStartAngle, sightEndAngle, fov, anotherPlayersAngleToMainPlayer) {
            const end = remapAngleToZeroToTwoPI(sightEndAngle);
            let start = remapAngleToZeroToTwoPI(sightStartAngle);
            //console.log(start * 360 / Math.PI / 2, end * 360 / Math.PI / 2, anotherPlayersAngleToMainPlayer* 360 / Math.PI / 2)
            if (end < fov) {
                if ((start < anotherPlayersAngleToMainPlayer && anotherPlayersAngleToMainPlayer < Math.PI * 2) || (0 < anotherPlayersAngleToMainPlayer && anotherPlayersAngleToMainPlayer < end)) {
                    return true
                } else {
                    return false
                }
            } else {
                if (start < anotherPlayersAngleToMainPlayer && anotherPlayersAngleToMainPlayer < end) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        const isOtherPlayerInSight = checkIfAnotherPlayerIsInSight(rayAngleArray[0], rayAngleArray[rayAngleArray.length - 1], this.fov, anotherPlayersAngleToMainPlayer);

        otherPlayer.isInSight = isOtherPlayerInSight;
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
Game.prototype.drawOtherPlayers = function(otherPlayer, anotherPlayersAngleToMainPlayer, z, screenWidth, screenHeight) {
    const
        otherPlayerId = otherPlayer.playerId,
        playerMaxWidth = 0.3 * CONST.getWindowWidth(),
        playerMaxHeight = playerMaxWidth * (24 / 13.6), /* ratio as per actual image ratio */
        //distance = z * Math.cos(anotherPlayersAngleToMainPlayer),
        distance = z,
        playerCurrentWidth = Math.min((3 * playerMaxWidth / z) * 0.8, playerMaxWidth),
        playerCurrentHeight = Math.min((3 * playerMaxHeight / z) * 0.8, playerMaxHeight),
        playerCurrentJumpHeight = Math.min(6 * otherPlayer.accumulatedJumpHeight / z, otherPlayer.accumulatedJumpHeight);

    const remapAngleToZeroToTwoPI = CONST.remapAngleToZeroToTwoPI;
    const end = remapAngleToZeroToTwoPI(rayAngleArray[rayAngleArray.length - 1]);
    let start = remapAngleToZeroToTwoPI(rayAngleArray[0]);

    if (anotherPlayersAngleToMainPlayer < start) {
        // this function is called when another player is garanteed in sight
        anotherPlayersAngleToMainPlayer += Math.PI * 2
    }
    const otherPlayerPosOnScreen = Math.floor((anotherPlayersAngleToMainPlayer - start) / this.dAlpha);
    const wallDistAtThisPos = this.wallDistArrayBeforeFishEyeCorrection[otherPlayerPosOnScreen];
    if (z < wallDistAtThisPos) {
        // check if another player is blocked by wall is HERE!!
        // draw other player if insight
        const ctx = document.getElementById('mainCanvas').getContext('2d');
        const soldierEl = document.getElementById('soldier');
        const
            drawX = (otherPlayerPosOnScreen * param.resolution - playerCurrentWidth / 2),
            drawY = 0.5 * (screenHeight - playerCurrentHeight) + 0.2 * playerCurrentHeight + state.accumulatedJumpHeight - playerCurrentJumpHeight,
            drawWidth = playerCurrentWidth,
            drawHeight = playerCurrentHeight,
            hitZoneWidth = (10 / 13.6) * drawWidth; /* ratio as per actual image ratio */
        //ctx.fillStyle = otherPlayer.isRespawning ? 'rgba(0, 255, 0, 0.3)' : 'rgba(0, 255, 0, 1)';
        //ctx.beginPath();
        //ctx.fillRect(drawX, drawY, drawWidth, drawHeight);
        //ctx.fill();
        ctx.globalAlpha = otherPlayer.isRespawning ? 0.5 : 1;
        ctx.drawImage(soldierEl, 0, 0, soldierEl.width, soldierEl.height, drawX, drawY, drawWidth, drawHeight);
        // player shadow
        // const gradient = ctx.createLinearGradient(drawX, drawY, drawX + 200,drawY +200);
        // gradient.addColorStop(0, 'rgba(0,0,0,0.2)');
        // gradient.addColorStop(.5, 'rgba(0,0,0,1)');
        // gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
        // ctx.fillStyle = gradient;
        // ctx.beginPath();
        // ctx.ellipse(drawX + 0.5 * drawWidth, drawY + drawHeight, 0.4 * drawWidth, 0.1 * drawWidth, 0, 0, 2 * Math.PI);
        // ctx.fill();
        ctx.globalAlpha = 1;
        // other player's id
        const fontSize = Math.min(18, 8 + 20/z);
        ctx.font = '500 ' + fontSize + 'px Roboto';
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.textAlign = "center";
        ctx.fillText(otherPlayerId, drawX + 0.5 * drawWidth, drawY - 10);
        // update hitZone
        if (!otherPlayer.isRespawning) {
            state.hitZone.push([otherPlayerId, drawX, drawY, hitZoneWidth, drawHeight, z]);
        }
    }
};
Game.prototype.drawMinimap = function() {
    // variables
    const
        ctx = document.getElementById('mainCanvas').getContext('2d'),
        miniMapMargin /* eg: top =left = 10px */= this.miniMapMargin,
        mapGrid = this.mapGrid.slice(),
        mapGridSize /* it's a square */ = mapGrid.length,
        miniMapSize /* it's a square */ = this.miniMapSize,
        pixel /* unit pixel for one grid, eg: 200/40=5px */ = miniMapSize / mapGridSize,
        rayAngleArray = this.rayAngleArray.slice(),
        wallDistArray = this.wallDistArrayBeforeFishEyeCorrection.slice(),
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
    rayAngleArray.map((i, index) => {
        const thisRayLength = wallDistArray[index];
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
    this.respawnFramethrottler++


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
        this.updateOtherPlayers();
    }
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