let GlobalVar;
(function() {
    GlobalVar = function() {
        // global variables
    };
    const
        width = window.innerWidth,
        height = window.innerHeight,
        assetsUrlObj = {
            sky: './assets/sky.jpg',
            gun: './assets/gun.png',
            muzzle: './assets/muzzle.png',
            emptyBullet: './assets/bullet.png',
            soldier: './assets/soldier.png'
        };
    GlobalVar.prototype.getWindowWidth = function() {
        return width
    };
    GlobalVar.prototype.getWindowHeight = function(){
        return height
    };
    GlobalVar.prototype.getAssetsUrlObj = function(){
        this.assetsCount = Object.keys(assetsUrlObj).length;
        return assetsUrlObj
    };
    GlobalVar.prototype.remapAngleToZeroToTwoPI = function(angle) {
        const twoPI = Math.PI * 2;
        let a = angle % twoPI;
        return a > 0 ? a : twoPI + a
    }
})();

const CONST = new GlobalVar();
export { CONST };