function remapAngleToZeroToTwoPI(angle) {
    const twoPI = Math.PI * 2;
    let a = angle % twoPI;
    return a > 0 ? a : twoPI + a
}



function pointToPointCalculation([targetX, targetY], [playerX, playerY], currentAlpha, fov, screenWidth) {
    currentAlpha += Math.PI / 2;
    currentAlpha = remapAngleToZeroToTwoPI(currentAlpha);

    const
        dx = targetX - playerX,
        dy = targetY - playerX,
        z = Math.pow(dx*dx + dy*dy, 0.5),
        PI = Math.PI,
        start = remapAngleToZeroToTwoPI(currentAlpha - 0.5 * fov),
        end = remapAngleToZeroToTwoPI(currentAlpha + 0.5 * fov);
    let alpha;
    if (dy === 0) {
        alpha = dy > 0 ? 1.5 * twoPI : PI;
    } else {
        alpha = Math.asin(dx / z)
    }

    if (2 * PI - fov < alpha && alpha < 2 * PI) {
        alpha -= 2 * PI
    }
    if (alpha - start < fov) {
        const
            screenX = (alpha - start) / fov * screenWidth,
            zCorrected = z * Math.cos(alpha - currentAlpha - PI * 0.5);
        return {
            screenX: screenX,
            z: zCorrected
        }
    } else {
        return false
    }
}

export { pointToPointCalculation, remapAngleToZeroToTwoPI }