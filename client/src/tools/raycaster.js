import { param } from "../param";

function raycaster(x, y, alpha, pointerAlpha) {
    // input origin x,y and angle alpha, return distance.
    const
        mapWidth = param.getMapGrid()[0].length,
        mapHeight = param.getMapGrid().length,
        hitCoordinate = [];
    // convert to normal coordinate system
    y = mapHeight - 1 - y;
    alpha += Math.PI * 0.5;
    //
    const
        originX = x,
        originY = y,
        cos = Math.cos(alpha),
        sin = Math.sin(alpha);

        function loop() {
            let
                nextX = sin > 0
                    ? /* goes right */ Math.floor(x + 1)
                    : sin < 0
                        ? /* goes left */ Math.ceil(x - 1)
                        : x,
                nextY = cos > 0
                    ? /* goes up */ Math.floor(y + 1)
                    : cos < 0
                        ? /* goes down */ Math.ceil(y - 1)
                        : y,
                distToNextX = (nextX - x) / sin,
                distToNextY = (nextY - y) / cos,
                hitDirection = null;

            if (distToNextX > distToNextY) {
                x += sin * distToNextY;
                y = nextY;
                hitDirection = 0;
            } else if (distToNextX < distToNextY) {
                x = nextX;
                y += cos * distToNextX;
                hitDirection = 1;
            } else {
                x = nextX;
                y = nextY;
                hitDirection = 2;
            }

            const checkHitResult = checkHit(x, y, sin, cos, hitDirection, mapWidth - 1, mapHeight - 1);
            if (checkHitResult !== 0) {
                const dist = Math.pow((x - originX) * (x - originX) + (y - originY) * (y - originY), 0.5);
                const distFishEyeCorrected = dist * Math.cos(alpha - pointerAlpha - Math.PI * 0.5);
                hitCoordinate.push(
                    {
                        x: x,
                        y: mapHeight - 1 - y,
                        hitDirection: hitDirection,
                        hitWallType: checkHitResult,
                        dist: dist,
                        distFishEyeCorrected: distFishEyeCorrected
                    });
            }
            if (checkHitResult !== 999) {
                loop();
            }
        }
        loop();
    //
    return hitCoordinate;
}

function checkHit (x, y, sin, cos, hitDirection, xMax, yMax) {
    // use normal coordinate
    const mapGrid = param.getMapGrid();
    if (hitDirection === 0) {
        // hit y
        x = Math.floor(x);
        y = cos > 0 ? y + 1 : y;
    } else if (hitDirection === 1) {
        // hit x
        x = sin > 0 ? x : x - 1;
        y = Math.floor(y) + 1;
    } else {
        x = sin > 0 ? x : x - 1;
        y = cos > 0 ? y + 1 : x;
    }
    y = mapGrid.length - 1 - y;
    const isInBorder = (x <= xMax && y <= yMax && x >= 0 && y >= 0);
    return isInBorder ? mapGrid[y][x] : 999;
}

export { raycaster };