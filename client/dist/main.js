!function(t){var e={};function i(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(n,a,function(e){return t[e]}.bind(null,a));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";let n;i.r(e),function(){n=function(){};const t=window.innerWidth,e=window.innerHeight,i={sky:"./assets/sky.jpg",gun:"./assets/gun.png",muzzle:"./assets/muzzle.png",emptyBullet:"./assets/bullet.png",soldier:"./assets/soldier.png"};n.prototype.getWindowWidth=function(){return t},n.prototype.getWindowHeight=function(){return e},n.prototype.getAssetsUrlObj=function(){return this.assetsCount=Object.keys(i).length,i},n.prototype.remapAngleToZeroToTwoPI=function(t){const e=2*Math.PI;let i=t%e;return i>0?i:e+i}}();const a=new n;let o;!function(){o=function(){this.resolution=1,this.resolutionHigh=1,this.resolutionLow=5,this.healthPointMax=100,this.currentMagzineMax=30,this.totalMagzineMax=480,this.recoilStaticMax=10,this.recoilMovingMax=100,this.gunPositionOffsetMax=10,this.gunPositionFiringOffsetMax=30};const t=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],[1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,1,1,0,0,1,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,1,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,1],[1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1],[1,0,0,0,0,1,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1],[1,0,0,0,0,1,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,1,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],[1,0,0,0,0,1,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],e=[["rgb(75,43,24)","rgb(139,79,45)"],["rgb(255,255,255)","rgb(200,200,200)"],["rgb(64, 224, 208)","rgb(36,127,118)"]],i=.01*a.getWindowHeight(),n=i/10,s=a.getWindowWidth(),r=a.getWindowHeight(),l=Math.min(s,r),h=.01*l,p=Math.floor(.2*l),c=Math.floor(.8*l),d=(c-p)/5;o.prototype.getMiniMapMargin=function(){return h},o.prototype.getMiniMapSizeMin=function(){return p},o.prototype.getMiniMapSizeMax=function(){return c},o.prototype.getMiniMapToggleSpeed=function(){return d},o.prototype.getMapGrid=function(){return t},o.prototype.getWallColorArray=function(){return e},o.prototype.getInitialJumpVelocity=function(){return i},o.prototype.getGravity=function(){return n}}();const s=new o;function r(){this.currentJumpVelocity=0,this.accumulatedJumpHeight=0,this.isTogglingMiniMap=0,this.gunPositionOffsetX=0,this.gunPositionOffsetY=0,this.gunPositionOffsetXIncrementSign=1,this.gunPositionOffsetYIncrementSign=1,this.isGunPositionFiringOffset=!1,this.gunPositionFiringOffsetX=0,this.gunPositionFiringOffsetY=0,this.gunPositionFiringOffsetXIncrementSign=1,this.gunPositionFiringOffsetYIncrementSign=1,this.isFiring=!1,this.isFireRequested=!1,this.isReloadRequested=!1,this.isReloading=!1,this.muzzleRotate=Math.random()*Math.PI*2,this.thisRoundFiringFinished=!0,this.bulletHitX,this.bulletHitY,this.bulletHitZ,this.bulletHitConfirmed,this.bulletHitSparks=[],this.canvasCenterTextOpacity=1,this.canvasCenterTextOpacitySign=-1,this.isShowingNoAmmoText=!1,this.healthPoint=s.healthPointMax,this.currentMagzine=s.currentMagzineMax,this.totalMagzine=s.totalMagzineMax,this.isMagzineEmpty=!1,this.emptyBullets=[],this.serverMessage=[],this.serverMessageTimeout=null,this.playerId,this.latency=0,this.isDisplayingLatency=!0,this.isLowerGraphicQuality=!1,this.playersArray=[],this.isConnectedToServer=!1,this.hitZone=[],this.hitPlayerArray=[],this.isRespawning=!1,this.isRepawnProtected=!1,this.damageIndicator=[],this.kill=0,this.death=0}r.prototype.updateServerMessage=function(t){this.serverMessageTimeout&&clearTimeout(this.serverMessageTimeout);const e=this.serverMessage.slice(),i=document.getElementById("serverMessageComponent");i.style.opacity=1;let n="",a=new Date,o=a.getHours()<10?"0"+a.getHours():a.getHours(),s=a.getMinutes()<10?"0"+a.getMinutes():a.getMinutes(),r=a.getSeconds()<10?"0"+a.getSeconds():a.getSeconds();for(5===e.length&&e.shift(),t=(a=o+":"+s+":"+r)+" - "+t,e.push(t),e.map(t=>{n+='<div class="serverMessageItemWrapper">'+t+"</div>"});i.lastChild;)i.removeChild(i.lastChild);i.innerHTML=n,this.serverMessage=e,this.serverMessageTimeout=setTimeout(()=>{i.style.opacity=0,this.serverMessageTimeout=null},15e3)},r.prototype.updateGunPostion=function(t=!1){if(t)if(this.isGunPositionFiringOffset)this.gunPositionFiringOffsetX=0,this.gunPositionFiringOffsetY=0,this.isGunPositionFiringOffset=!1;else{let t=s.gunPositionFiringOffsetMax,e=.5*t+Math.random()*t*.5,i=.5*t+Math.random()*t*.5,n=this.gunPositionFiringOffsetX+e*this.gunPositionFiringOffsetXIncrementSign,a=this.gunPositionFiringOffsetY+i*this.gunPositionFiringOffsetYIncrementSign;this.gunPositionFiringOffsetXIncrementSign*=-1,this.gunPositionFiringOffsetYIncrementSign*=-1,this.gunPositionFiringOffsetX=n,this.gunPositionFiringOffsetY=a,this.isGunPositionFiringOffset=!0}else{let t=Math.random(),e=Math.random(),i=this.gunPositionOffsetX+t*this.gunPositionOffsetXIncrementSign,n=this.gunPositionOffsetY+e*this.gunPositionOffsetYIncrementSign;Math.abs(i)>s.gunPositionOffsetMax&&(this.gunPositionOffsetXIncrementSign*=-1,i=this.gunPositionOffsetX+t*this.gunPositionOffsetXIncrementSign),Math.abs(n)>s.gunPositionOffsetMax&&(this.gunPositionOffsetYIncrementSign*=-1,n=this.gunPositionOffsetY+e*this.gunPositionOffsetYIncrementSign),this.gunPositionOffsetX=i,this.gunPositionOffsetY=n}},r.prototype.getGunPostion=function(){const t=a.getWindowWidth(),e=a.getWindowHeight();return[.5*t+this.gunPositionOffsetX+this.gunPositionFiringOffsetX,.6*e+this.gunPositionOffsetY+s.gunPositionOffsetMax+this.gunPositionFiringOffsetY+s.gunPositionFiringOffsetMax,.4*t,.4*e]},r.prototype.updateText=function(t,e){let i=document.getElementById(t),n=document.createTextNode(e);for(let t=i.firstChild;null!==t;t=i.firstChild)i.removeChild(t);i.appendChild(n)};const l=new r;function h(){this.component,this.isDisplaying=!0}function p(){const t=t=>{const e=document.createElement("div");return e.id=t,e},e=[],i=(e,i,n,a)=>{const o=e.length,s=t("settingDropdownItem"+o);s.className="settingDropdownItem";const r=()=>{s.innerHTML="<span>"+i+' <i class="fas fa-toggle-on" style="color: green; font-size: 24px; top: .125em; position: relative""></i></span>',l[n]=!0},h=()=>{s.innerHTML="<span>"+i+' <i class="fas fa-toggle-off" style="color: rgba(0,0,0,0.5); font-size: 24px; top: .125em; position: relative"></i></span>',l[n]=!1};a?r():h(),s.onclick=(t=>{t.stopPropagation(),l[n]?h():r()}),e.push(s)},n=t("toolBarComponent"),a=t("info"),o=t("setting"),s=t("settingDropdown");i(e,"Lower graphic quality","isLowerGraphicQuality",!1),i(e,"Display latency","isDisplayingLatency",!0),a.innerHTML='<span><i class="fas fa-info-circle"></i></span>',o.innerHTML='<span><i class="fas fa-cog"></i></span>',a.onclick=(()=>{const t=new Event("keydown");t.keyCode=73,document.dispatchEvent(t)}),o.onclick=(()=>{this.isSettingDropdownActive?this.closeSettingDropdown():this.openSettingDropdown()}),s.onmouseleave=(()=>{this.closeSettingDropdown()}),o.appendChild(s),n.appendChild(a),n.appendChild(o),e.map(t=>s.appendChild(t)),this.component=n,this.settingDropdownComponent=s,this.isSettingDropdownActive=!1}function c(){}function d(){this.component,this.itemWrapperClass="serverMessageItemWrapper"}function u(){this.component,this.isDisplaying=!1,this.rowClassName="scoreBoardRow",this.rowTitleClassName="scoreBoardRowTitle scoreBoardRow",this.rowHighlightClassName="scoreBoardRow scoreBoardRowHighlight",this.rowItemClassName="scoreBoardRowItem",this.timeInterval}function g(){this.mainPlayer,this.otherPlayers=[],this.wallDistArray=[],this.hitWallTypeArray=[],this.hitDirectionArray=[],this.rayAngleArray=[],this.wallDistArrayBeforeFishEyeCorrection=[],this.fov=Math.PI/3,this.dAlpha,this.mapGrid=s.getMapGrid(),this.drawDamageIndicatorArray=[],this.deathTimeStamp,this.respawnFramethrottler=1,this.miniMapSizeMax=s.getMiniMapSizeMax(),this.miniMapSizeMin=s.getMiniMapSizeMin(),this.miniMapSize=this.miniMapSizeMin,this.miniMapMargin=s.getMiniMapMargin(),this.miniMapToggleSpeed=s.getMiniMapToggleSpeed()}h.prototype.mountComponent=function(){const t=document.getElementById("root"),e=document.createElement("div");e.id="instructionComponent",e.innerHTML='<h1>cs_assault.map</h1><ul><li>I: Open / close this window</li><li>W: Move Forward</li><li>S: Move Back</li><li>A: Turn Left</li><li>D: Turn Right</li><li>R: Reload</li><li>M: Toggle Map Zooming</li><li>Enter: Fire</li><li>Space: Jump</li><li>Tab: Score Board</li></ul><h1>Many thanks to these tutorials:</h1><ul><li><a href="http://www.playfuljs.com/a-first-person-engine-in-265-lines/" target="_blank">PlayfulJS.com</a></li><li><a href="http://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/" target="_blank">Permadi.com</a></li><li><a href="http://lodev.org/cgtutor/raycasting.html" target="_blank">Lodev.org</a></li></ul><h2><a href="https://www.xiaoxihome.com" target="_blank"><span>&copy; XIAOXIHOME.COM 2018~2019</span></a><h2>',t.appendChild(e),this.component=e,this.attachEventListener(),this.toggleDisplay()},h.prototype.attachEventListener=function(){document.addEventListener("keydown",t=>{73===t.keyCode&&this.toggleDisplay()})},h.prototype.toggleDisplay=function(){this.isDisplaying?(this.component.style.opacity=0,this.component.style.visibility="hidden"):(this.component.style.opacity=1,this.component.style.visibility="visible"),this.isDisplaying=!this.isDisplaying},p.prototype.mountComponent=function(){document.getElementById("root").appendChild(this.component)},p.prototype.closeSettingDropdown=function(){if(this.isSettingDropdownActive){const t=this.settingDropdownComponent;t.style.opacity=0,t.style.visibility="hidden",this.isSettingDropdownActive=!1}},p.prototype.openSettingDropdown=function(){if(!this.isSettingDropdownActive){const t=this.settingDropdownComponent;t.style.opacity=1,t.style.visibility="visible",this.isSettingDropdownActive=!0}},c.prototype.mountComponent=function(){const t=document.getElementById("root"),e=document.createElement("div");e.id="playerStatusComponent",e.innerHTML='<div class="playerStatusGroupWrapper"><div class="playerStatusIcon" style="position: relative; top: -0.1em;"><i class="fas fa-times-circle"></i></div><div class="playerStatusValue"><span id="playerStatusHealthPoint">'+l.healthPoint+'</span></div></div><div class="playerStatusGroupWrapper"><div class="playerStatusIcon" style="position: relative; top: -0.4em;"><i class="fas fa-joint"></i></div><div class="playerStatusValue"><span id="playerStatusCurrentMagzine">'+l.currentMagzine+'</span>|<span id="playerStatusTotalMagzine">'+l.totalMagzine+"</span></div></div>",t.appendChild(e)},d.prototype.mountComponent=function(){const t=document.getElementById("root"),e=document.createElement("div");e.id="serverMessageComponent",t.appendChild(e),this.component=e},u.prototype.mountComponent=function(){const t=document.getElementById("root"),e=document.createElement("div");e.id="scoreBoardComponent",t.appendChild(e),this.component=e,this.attachEventListener()},u.prototype.attachEventListener=function(){document.addEventListener("keydown",t=>{9===t.keyCode&&(t.preventDefault(),this.toggleDisplay())})},u.prototype.toggleDisplay=function(){if(this.isDisplaying)for(this.isDisplaying=!1,clearInterval(this.timeInterval),this.timeInterval=null,this.component.style.opacity=0,this.component.style.visibility="hidden";this.component.lastChild;)this.component.removeChild(this.component.lastChild);else this.isDisplaying=!0,this.updateData(),this.updateData=this.updateData.bind(this),this.timeInterval=setInterval(this.updateData,1e3),this.component.style.opacity=1,this.component.style.visibility="visible"},u.prototype.updateData=function(){if(this.isDisplaying){const t=l.playersArray.slice();t.sort((t,e)=>e.kill-t.kill);const e=l.playerId,i=t=>{const e=document.createElement("div");return e.className=t?this.rowHighlightClassName:this.rowClassName,e},n=t=>{const e=document.createElement("div");return e.className=this.rowItemClassName,e.innerHTML=t,e};for(;this.component.lastChild;)this.component.removeChild(this.component.lastChild);const a=document.createElement("div");a.className=this.rowTitleClassName;const o=n("Player ID"),s=n("Kill"),r=n("Death"),h=n("Ping");a.appendChild(o),a.appendChild(s),a.appendChild(r),a.appendChild(h),this.component.appendChild(a),t.map(t=>{const a=t.playerId===e?i(!0):i(!1),o=n(t.playerId),s=n(t.kill),r=n(t.death),l=n(t.latency+"ms");a.appendChild(o),a.appendChild(s),a.appendChild(r),a.appendChild(l),this.component.appendChild(a)})}},g.prototype.initiateCanvas=function(){const t=document.getElementById("root"),e=document.createElement("div");t.appendChild(e);const i=`<canvas id="mainCanvas" width=${a.getWindowWidth()} height=${a.getWindowHeight()}>Your Browser Does Not Support Html5 Canvas</canvas>`;e.innerHTML=i,(new h).mountComponent(),(new p).mountComponent(),(new c).mountComponent(),(new d).mountComponent(),l.updateServerMessage("Establishing connection to server"),(new u).mountComponent()},g.prototype.createMainPlayer=function(){this.mainPlayer=new M,this.mainPlayer.respawn()},g.prototype.ray=function(){const t=[],e=[],i=[],n=[],o=[],r=this.mapGrid,l=a.getWindowWidth(),h=(a.getWindowHeight(),s.resolution),p=this.fov/(l/h);this.dAlpha=p;let c=this.mainPlayer.alpha-.5*this.fov;for(let e=0;e<l;e+=h)t.push(c+=p);t.map((a,s)=>{const l=function(t,e,i){function n(t,e){return 0!==r[e][t]}const a=Math.sin(i),o=Math.cos(i),s=Math.tan(i),l=[];let h,p,c,d,u,g,m,y,f;if(a>=0&&o>0){for(h=Math.ceil(t),p=Math.min(e+s*(h-t),39);!n(Math.floor(h),Math.floor(p));)h++,p=Math.min(p+s,39);for(d=Math.ceil(e),c=t+(d-e)/s;!n(Math.floor(c),Math.floor(d));)c+=1/s,d++;g=Math.pow((h-t)*(h-t)+(p-e)*(p-e),.5),m=Math.pow((c-t)*(c-t)+(d-e)*(d-e),.5),g>=m?(u=m,y=0,f=r[Math.floor(d)][Math.floor(c)]):(u=g,y=1,f=r[Math.floor(p)][Math.floor(h)])}if(a>0&&o<=0){for(h=Math.floor(t),p=Math.min(e+s*(h-t),39);!n(Math.floor(h)-1,Math.floor(p));)h--,p=Math.min(p-s,39);for(d=Math.ceil(e),c=t+(d-e)/s;!n(Math.floor(c),Math.floor(d));)c+=1/s,d++;g=Math.pow((h-t)*(h-t)+(p-e)*(p-e),.5),m=Math.pow((c-t)*(c-t)+(d-e)*(d-e),.5),g>=m?(u=m,y=0,f=r[Math.floor(d)][Math.floor(c)]):(u=g,y=1,f=r[Math.floor(p)][Math.floor(h)-1])}if(a<=0&&o<0){for(h=Math.floor(t),p=Math.max(e+s*(h-t),1);!n(Math.floor(h)-1,Math.floor(p));)h--,p=Math.max(p-s,1);for(d=Math.floor(e),c=t+(d-e)/s;!n(Math.floor(c),Math.floor(d)-1);)c-=1/s,d--;g=Math.pow((h-t)*(h-t)+(p-e)*(p-e),.5),m=Math.pow((c-t)*(c-t)+(d-e)*(d-e),.5),g>=m?(u=m,y=0,f=r[Math.floor(d)-1][Math.floor(c)]):(u=g,y=1,f=r[Math.floor(p)][Math.floor(h)-1])}if(a<0&&o>=0){for(h=Math.ceil(t),p=Math.max(e+s*(h-t),1);!n(Math.floor(h),Math.floor(p));)h++,p=Math.max(p+s,1);for(d=Math.floor(e),c=t+(d-e)/s;!n(Math.floor(c),Math.floor(d)-1);)c-=1/s,d--;g=Math.pow((h-t)*(h-t)+(p-e)*(p-e),.5),m=Math.pow((c-t)*(c-t)+(d-e)*(d-e),.5),g>=m?(u=m,y=0,f=r[Math.floor(d)-1][Math.floor(c)]):(u=g,y=1,f=r[Math.floor(p)][Math.floor(h)])}return l.push(u),l.push(y),l.push(f),l}(this.mainPlayer.x,this.mainPlayer.y,t[s]),h=l[0],p=l[1],c=l[2],d=Math.abs(Math.cos(t[s]-this.mainPlayer.alpha));e.push(h),i.push(h*d),n.push(p),o.push(c)}),this.wallDistArrayBeforeFishEyeCorrection=e,this.wallDistArray=i,this.hitWallTypeArray=o,this.hitDirectionArray=n,this.rayAngleArray=t},g.prototype.drawFrame=function(){const t=a.getWindowWidth(),e=a.getWindowHeight(),i=document.getElementById("mainCanvas").getContext("2d");i.clearRect(0,0,t,e),s.resolution=l.isLowerGraphicQuality?s.resolutionLow:s.resolutionHigh;const n=document.getElementById("sky"),o=n.width,r=n.height,h=this.mainPlayer.alpha,p=2*Math.PI,c=h%p,d=c>0?c/p:(p+c)/p;i.drawImage(n,d*o,0,.25*o,r,0,0,t,.6*e),d>=.75&&i.drawImage(n,0,0,.25*o,r,(1-d)/.25*t,0,t,.6*e),i.beginPath(),i.fillStyle="rgba(150,150,150,1)",i.fillRect(0,.5*e,t,.5*e),i.fill(),this.wallDistArray.slice().map((t,n)=>{const a=.5*Math.min(3/t,1.5)*e,o=.5*e,r=o-a,h=o+a,p=this.hitWallTypeArray[n],c=this.hitDirectionArray[n],d=s.resolution,u=s.getWallColorArray()[p-1][c];i.fillStyle=u,i.beginPath(),i.fillRect(n*d,r+l.accumulatedJumpHeight,d,h-r),i.fill()}),this.otherPlayers.map(i=>{i.isInSight&&this.drawOtherPlayers(i,i.anotherPlayersAngleToMainPlayer,i.distance,t,e)});const u=this.mainPlayer.forward||this.mainPlayer.backward||l.currentJumpVelocity?15:0;i.strokeStyle="rgba(0,255,0,0.8)",i.beginPath(),i.moveTo(.5*t-20-u,.5*e),i.lineTo(.5*t-5-u,.5*e),i.stroke(),i.beginPath(),i.moveTo(.5*t+5+u,.5*e),i.lineTo(.5*t+20+u,.5*e),i.stroke(),i.beginPath(),i.moveTo(.5*t,.5*e-20-u),i.lineTo(.5*t,.5*e-5-u),i.stroke(),i.beginPath(),i.moveTo(.5*t,.5*e+5+u),i.lineTo(.5*t,.5*e+20+u),i.stroke();const g=()=>{const t=new Date,e=[],i=this.mainPlayer.alpha,n=a.getWindowWidth();l.bulletHitSparks.map(a=>{if(t-a.timeStamp<500){const t=i-a.playerAlpha,o=l.accumulatedJumpHeight-a.accumulatedJumpHeight;if(t){const e=Math.min(n*Math.tan(t),n);a.x-=e,a.playerAlpha=i}o&&(a.y+=o,a.accumulatedJumpHeight=l.accumulatedJumpHeight),e.push(a)}}),l.bulletHitSparks=e},m=()=>{const t=5e-6*a.getWindowWidth();l.bulletHitSparks.map(e=>{const i=Math.min(t,2*t/e.z);"dirt"===e.type?(e.x+=e.speedX,e.speedX*=.9,e.speedY+=i,e.y+=e.speedY,e.opacity-=.003,e.radius*=.99):"spark"===e.type||"blood"===e.type?(e.x+=e.speedX,e.speedX*=.999,e.speedY+=i,e.y+=e.speedY,e.opacity-=.001,e.radius*=.99):"crater"===e.type&&(e.opacity-=.003)}),l.bulletHitSparks.map(t=>{i.fillStyle="spark"===t.type?"rgba(255,255,0,"+t.opacity+")":"blood"===t.type?"rgba(255,0,0,"+t.opacity+")":"dirt"===t.type?"rgba(50,50,50,"+t.opacity+")":"rgba(0,0,0,"+t.opacity+")",i.beginPath(),i.arc(t.x,t.y,t.radius,0,2*Math.PI),i.fill()})};if(0!==l.bulletHitSparks.length){g();for(let t=0;t<10;t++)m()}const y=l.getGunPostion(),f=y[0],M=y[1],w=y[2],P=y[3],v=document.getElementById("gun"),b=v.width,S=v.height;if(l.isFiring){const t=document.getElementById("muzzle"),e=t.width,n=t.height,a=.2*w,o=a,s=f+w*(5.4/20.7),r=M+P*(1.7/13.2),h=0-.5*o,p=0-.5*a;i.translate(s,r),i.rotate(l.muzzelRotate),i.drawImage(t,0,0,e,n,h,p,o,a),i.rotate(-l.muzzelRotate),i.translate(-s,-r);const c=Math.min(4,20/l.bulletHitZ);i.fillStyle=l.bulletHitConfirmed?"rgb(255,0,0)":"rgb(0,0,0)",i.beginPath(),i.arc(l.bulletHitX,l.bulletHitY,c,0,2*Math.PI),i.fill()}i.drawImage(v,0,0,b,S,f,M,w,P);const C=document.getElementById("emptyBullet"),T=C.width,I=C.height,k=.05*w;l.emptyBullets.map(t=>{i.drawImage(C,0,0,T,I,t[0],t[1],k,k)});const x=n=>{i.font="36px csFont",l.canvasCenterTextOpacity>=.5&&l.canvasCenterTextOpacity<=1&&(l.canvasCenterTextOpacity=l.canvasCenterTextOpacity+.1*l.canvasCenterTextOpacitySign),l.canvasCenterTextOpacity<.5?(l.canvasCenterTextOpacity=.5,l.canvasCenterTextOpacitySign=1):l.canvasCenterTextOpacity>1&&(l.canvasCenterTextOpacity=1,l.canvasCenterTextOpacitySign=-1),i.fillStyle="rgba(255, 0, 0, "+l.canvasCenterTextOpacity+")",i.textAlign="center",i.fillText(n,.5*t,.6*e)};if(l.isReloading&&x("RELOADING"),l.isShowingNoAmmoText&&x("RAN OUT OF AMMO"),l.isDisplayingLatency&&(i.font="300 10px Roboto",i.fillStyle="rgb(0, 0, 0)",i.textAlign="right",i.fillText("ping: "+l.latency+" ms",t,10)),0!==l.damageIndicator.length){const t=[];this.otherPlayers.slice().map(e=>{-1!==l.damageIndicator.indexOf(e.playerId)&&t.push(e.anotherPlayersAngleToMainPlayer)});let e=this.mainPlayer.alpha,i=(e=a.remapAngleToZeroToTwoPI(e))-t[0];i=a.remapAngleToZeroToTwoPI(i);const n=(t,e)=>{const i=2*Math.PI,n=.5*e;return-n+i<t&&t<=i||0<=t&&t<=n?"front":n<t&&t<=.375*i?"left":.375*i<t&&t<=.625*i?"back":.625*i<t&&t<=-n+i?"right":void 0};t.map(t=>{let i=e-t;i=a.remapAngleToZeroToTwoPI(i);const o={direction:n(i,this.fov),date:new Date};this.drawDamageIndicatorArray.push(o)}),l.damageIndicator=[]}if(0!==this.drawDamageIndicatorArray.length){i.strokeStyle="rgba(255,0,0,0.3)",i.lineWidth=.05*e,this.drawDamageIndicatorArray.map(n=>{const a=n.direction,o=2*Math.PI;i.beginPath(),"front"===a?start=-.375*o:"right"===a?start=-.125*o:"back"===a?start=.125*o:"left"===a&&(start=.375*o),end=start+.25*o,i.arc(.5*t,.5*e,.2*e,start,end),i.stroke()}),i.lineWidth=1;const n=new Date;this.drawDamageIndicatorArray=this.drawDamageIndicatorArray.filter(t=>{const e=new Date(t.date);return n-e<1e3})}this.drawMinimap()},g.prototype.updateOtherPlayers=function(){const t=[];l.playersArray.map(e=>{e.playerId!==l.playerId&&t.push(e)}),this.otherPlayers=t,l.hitZone=[];const e=t=>{const e=this.mainPlayer.x,i=this.mainPlayer.y,n=t.x-e,o=t.y-i,s=Math.pow(n*n+o*o,.5),r=2*Math.PI,l=this.rayAngleArray.slice(),h=a.remapAngleToZeroToTwoPI;let p;0===n&&0===o?p=0:0===n?o>0?p=.25*r:o<0&&(p=.75*r):0===o?n>0?p=0:n<0&&(p=.5*r):n>0&&o>0?p=Math.atan(o/n):n<0&&o>0?p=.5*r-Math.atan(o/-n):n<0&&o<0?p=Math.atan(-o/-n)+.5*r:n>0&&o<0&&(p=r-Math.atan(-o/n)),p=h(p);const c=function(t,e,i,n){const a=h(e);let o=h(t);return a<i?o<n&&n<2*Math.PI||0<n&&n<a:o<n&&n<a}(l[0],l[l.length-1],this.fov,p);t.isInSight=c,t.anotherPlayersAngleToMainPlayer=p,t.distance=s};this.otherPlayers.map(t=>{e(t)}),this.otherPlayers.sort((t,e)=>e.distance-t.distance)},g.prototype.drawOtherPlayers=function(t,e,i,n,o){const r=t.playerId,h=.3*a.getWindowWidth(),p=h*(24/13.6),c=Math.min(3*h/i*.8,h),d=Math.min(3*p/i*.8,p),u=Math.min(6*t.accumulatedJumpHeight/i,t.accumulatedJumpHeight),g=a.remapAngleToZeroToTwoPI;g(rayAngleArray[rayAngleArray.length-1]);let m=g(rayAngleArray[0]);e<m&&(e+=2*Math.PI);const y=Math.floor((e-m)/this.dAlpha);if(i<this.wallDistArrayBeforeFishEyeCorrection[y]){const e=document.getElementById("mainCanvas").getContext("2d"),n=document.getElementById("soldier"),a=y*s.resolution-c/2,h=.5*(o-d)+.2*d+l.accumulatedJumpHeight-u,p=c,g=d,m=10/13.6*p;e.globalAlpha=t.isRespawning?.5:1,e.drawImage(n,0,0,n.width,n.height,a,h,p,g),e.globalAlpha=1;const f=Math.min(18,8+20/i);e.font="500 "+f+"px Roboto",e.fillStyle="rgb(255, 0, 0)",e.textAlign="center",e.fillText(r,a+.5*p,h-10),t.isRespawning||l.hitZone.push([r,a,h,m,g,i])}},g.prototype.drawMinimap=function(){const t=document.getElementById("mainCanvas").getContext("2d"),e=this.miniMapMargin,i=this.mapGrid.slice(),n=i.length,a=this.miniMapSize,o=a/n,s=this.rayAngleArray.slice(),r=this.wallDistArrayBeforeFishEyeCorrection.slice(),h=this.mainPlayer.x*o+e,p=this.mainPlayer.y*o+e,c=l.isTogglingMiniMap,d=a+c*this.miniMapToggleSpeed;c&&(d>=this.miniMapSizeMax||d<=this.miniMapSizeMin?this.miniMapSize=1===c?this.miniMapSizeMax:this.miniMapSizeMin:this.miniMapSize=d);for(let a=0;a<n;a++)for(let s=0;s<n;s++)i[a][s]&&(t.fillStyle="rgba(0,150,0,0.5)",t.fillRect(s*o+e,a*o+e,o,o));t.fillStyle="red",t.beginPath(),t.arc(h,p,a/100,0,2*Math.PI),t.fill(),s.map((e,i)=>{const n=r[i];t.strokeStyle="rgba(0,255,0,0.01)",t.beginPath(),t.moveTo(h,p),t.lineTo(h+o*n*Math.cos(e),p+o*n*Math.sin(e)),t.stroke()}),t.strokeStyle="black",t.beginPath(),t.moveTo(h,p),t.lineTo(h+o*Math.cos(this.mainPlayer.alpha),p+o*Math.sin(this.mainPlayer.alpha)),t.stroke();for(let i=0;i<=n;i++){const a=i*o+e,s=n*o+e;t.strokeStyle="rgba(0,150,0,0.1)",t.beginPath(),t.moveTo(e,a),t.lineTo(s,a),t.moveTo(a,e),t.lineTo(a,s),t.stroke()}},g.prototype.attachEventListeners=function(){const t=this.mainPlayer;document.addEventListener("keydown",function(e){switch(e.keyCode){case 65:t.counterClockwise=!0;break;case 87:t.forward=!0;break;case 68:t.clockwise=!0;break;case 83:t.backward=!0;break;case 32:l.accumulatedJumpHeight||(l.currentJumpVelocity=s.getInitialJumpVelocity());break;case 77:const i=l.isTogglingMiniMap;l.isTogglingMiniMap=i&&1===i?-1:1;break;case 13:l.isFireRequested||(l.isFireRequested=!0);break;case 82:l.isReloadRequested||(l.isReloadRequested=!0)}}),document.addEventListener("keyup",function(e){switch(e.keyCode){case 65:t.counterClockwise=!1;break;case 87:t.forward=!1;break;case 68:t.clockwise=!1;break;case 83:t.backward=!1;break;case 13:l.isFireRequested=!1}})},g.prototype.respawnFrame=function(){const t=new Date-new Date(this.deathTimeStamp);if(t>5e3&&this.mainPlayer.respawn(),l.isConnectedToServer&&f.upLinkUpdatePosition(),this.respawnFramethrottler%4==0){const e=document.getElementById("mainCanvas").getContext("2d"),i=a.getWindowWidth(),n=a.getWindowHeight();t<2500?(e.fillStyle="rgba(0,0,0,0.1)",e.fillRect(0,0,i,n),e.fill(),e.font="700 36px Roboto",e.fillStyle="rgb(255, 255, 255)",e.textAlign="center",e.fillText("RESPAWNING",.5*i,.5*n)):(e.fillStyle="rgba(255, 255, 255, 0.1)",e.fillRect(0,0,i,n),e.fill(),e.font="700 36px Roboto",e.fillStyle="rgb(0, 0, 0)",e.textAlign="center",e.fillText("HOLD ON",.5*i,.5*n))}this.respawnFramethrottler++,l.isRespawning?requestAnimationFrame(this.respawnFrame):(this.respawnFramethrottler=1,requestAnimationFrame(this.frame))},g.prototype.frame=function(){this.mainPlayer.move(),l.isConnectedToServer&&(f.upLinkUpdatePosition(),this.updateOtherPlayers()),this.ray(),this.drawFrame(),l.isRespawning?(this.deathTimeStamp=new Date,requestAnimationFrame(this.respawnFrame)):requestAnimationFrame(this.frame)},g.prototype.play=function(){m.initiateCanvas(),m.createMainPlayer(),m.attachEventListeners(),f.initiateConnection(),this.respawnFrame=this.respawnFrame.bind(this),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)};const m=new g;function y(){this.lastPing,this.ws}y.prototype.initiateConnection=function(){const t=location.origin.replace(/^http/,"ws"),e=new WebSocket(t);this.ws=e,e.onopen=function(){l.updateServerMessage("Connected to the server");e.send(JSON.stringify({what:"upLinkRequestJoinGame"}))},e.onmessage=(t=>{const e=JSON.parse(t.data);"downLinkUpdatePosition"===e.what?this.handleDownLinkUpdatePosition(e):"serverMessage"===e.what?l.updateServerMessage(e.payload):"downLinkRequestJoinGame"===e.what&&this.handleDownLinkRequestJoinGame(e)}),e.onerror=(t=>console.log(t)),e.onclose=(()=>{l.updateServerMessage("Connection lost. Please refresh the page to reconnect."),l.isConnectedToServer=!1})},y.prototype.handleDownLinkRequestJoinGame=function(t){const e=t.payload;l.playerId=e,l.isConnectedToServer=!0},y.prototype.upLinkUpdatePosition=function(){const t={playerId:l.playerId,x:m.mainPlayer.x,y:m.mainPlayer.y,accumulatedJumpHeight:l.accumulatedJumpHeight,healthPoint:l.healthPoint,death:l.death,latency:l.latency,timeSent:new Date,isRespawning:!(!l.isRepawnProtected&&!l.isRespawning),hitPlayerArray:l.hitPlayerArray};l.killedBy&&(t.killedBy=l.killedBy);const e={what:"upLinkUpdatePosition",payload:t,playerId:l.playerId};this.ws.send(JSON.stringify(e)),l.hitPlayerArray=[],l.killedBy=null},y.prototype.handleDownLinkUpdatePosition=function(t){l.playersArray=t.payload.slice();let e=t.payload.filter(t=>t.playerId===l.playerId);e=e[0];const i=new Date,n=Math.floor((i-new Date(e.timeSent))/2);if(l.latency=n,e.hitBy&&!l.isRespawning&&!l.isRepawnProtected&&0!==e.hitBy.length)for(let t=0;t<e.hitBy.length;t++){const i=Math.floor(10*Math.random()+5),n=l.healthPoint-i;if(n<=0){l.death++,l.isRespawning=!0,l.healthPoint=0,l.killedBy=e.hitBy[t],l.updateServerMessage("You were killed by "+e.hitBy[t]),document.getElementById("playerStatusHealthPoint").innerHTML=l.healthPoint,setTimeout(()=>{l.damageIndicator=[],m.drawDamageIndicatorArray=[]},1e3);break}l.damageIndicator.push(e.hitBy[t]),l.healthPoint=n,document.getElementById("playerStatusHealthPoint").innerHTML=l.healthPoint}l.kill=e.kill,e.killerOf&&l.updateServerMessage("You killed "+e.killerOf)};const f=new y;function M(){this.isCT=Math.random()>.5,this.x,this.y,this.alpha,this.forward=!1,this.backward=!1,this.clockwise=!1,this.counterClockwise=!1,this.moveSpeed=.05,this.rotateSpeed=.01,this.mapGrid=s.getMapGrid(),this.totalMagzine=120,this.gravity=s.getGravity()}function w(){this.loaded=0,this.total=1,this.isLoaded=0}M.prototype.respawn=function(){l.healthPoint=s.healthPointMax,document.getElementById("playerStatusHealthPoint").innerHTML=l.healthPoint;const t=[[3,10],[3,15],[3,20],[3,25],[3,30]],e=[[25,16],[25,27],[26,17],[34,16],[34,17]],i=Math.floor(5*Math.random());this.x=this.isCT?t[i][0]:e[i][0],this.y=this.isCT?t[i][1]:e[i][1],this.alpha=Math.random()>.5?-.75*Math.PI*2:.25*Math.PI*2,this.forward=!1,this.backward=!1,this.clockwise=!1,this.counterClockwise=!1,l.isRespawning&&(l.isRespawning=!1),l.isRepawnProtected=!0,setTimeout(()=>l.isRepawnProtected=!1,3e3)},M.prototype.move=function(){let t=this.forward?1:this.backward?-1:0,e=this.clockwise?1:this.counterClockwise?-1:0;if(t){const e=this.x+this.moveSpeed*Math.cos(this.alpha)*t,i=this.y+this.moveSpeed*Math.sin(this.alpha)*t;0===this.mapGrid[Math.floor(this.y)][Math.floor(e)]&&(this.x=e),0===this.mapGrid[Math.floor(i)][Math.floor(this.x)]&&(this.y=i),l.updateGunPostion(!1)}e&&(this.alpha=this.rotateSpeed*e+this.alpha);let i=l.currentJumpVelocity;const n=this.gravity,o=i;l.accumulatedJumpHeight+o>0?(l.currentJumpVelocity=i-n,l.accumulatedJumpHeight+=o):(l.currentJumpVelocity=0,l.accumulatedJumpHeight=0);const r=()=>{if(l.currentMagzine){l.isFiring=!0,l.thisRoundFiringFinished=!1,l.muzzelRotate=Math.random()*Math.PI*2,l.currentMagzine--;const t=this.forward||this.backward||l.currentJumpVelocity?s.recoilMovingMax:s.recoilStaticMax,e=.5*a.getWindowWidth()+(Math.random()-.5)*t,i=.5*a.getWindowHeight()+(Math.random()-.5)*t;l.bulletHitX=e,l.bulletHitY=i,l.bulletHitZ=m.wallDistArrayBeforeFishEyeCorrection[Math.floor(e)],l.bulletHitConfirmed=!1,l.hitZone.length&&l.hitZone.map(t=>{t[1]<e&&e<t[1]+t[3]&&t[2]<i&&i<t[2]+t[4]&&(l.hitPlayerArray.push(t[0]),l.bulletHitConfirmed=!0,l.bulletHitZ=t[5])});const n=new Date,o=.01*a.getWindowWidth(),r=Math.min(o,2*o/l.bulletHitZ),h=Math.min(5,20/l.bulletHitZ);if(l.bulletHitConfirmed)for(let t=0;t<10;t++){const t={type:"blood",speedX:(Math.random()-.5)*r*.5,speedY:(Math.random()-.5)*r*.5,timeStamp:n,x:l.bulletHitX,y:l.bulletHitY,z:l.bulletHitZ,radius:h,opacity:1,playerAlpha:this.alpha,accumulatedJumpHeight:l.accumulatedJumpHeight};l.bulletHitSparks.push(t)}else{const t={type:"crater",timeStamp:n,x:l.bulletHitX,y:l.bulletHitY,radius:.8*h,playerAlpha:this.alpha,opacity:1,accumulatedJumpHeight:l.accumulatedJumpHeight};l.bulletHitSparks.push(t);for(let t=0;t<5;t++){let t=(Math.random()-.5)*r*.1,e=(Math.random()-.5)*r*.05;const i={type:"dirt",speedX:t,speedY:e,timeStamp:n,x:l.bulletHitX,y:l.bulletHitY,z:l.bulletHitZ,radius:.5*h,opacity:.8,playerAlpha:this.alpha,accumulatedJumpHeight:l.accumulatedJumpHeight},a={type:"spark",speedX:t=(Math.random()-.5)*r*.5,speedY:e=(Math.random()-.5)*r*.5,timeStamp:n,x:l.bulletHitX,y:l.bulletHitY,z:l.bulletHitZ,radius:h,opacity:1,playerAlpha:this.alpha,accumulatedJumpHeight:l.accumulatedJumpHeight};l.bulletHitSparks.push(i,a)}}l.updateText("playerStatusCurrentMagzine",l.currentMagzine),setTimeout(()=>{l.thisRoundFiringFinished=!0},100),l.updateGunPostion(!0);const p=l.getGunPostion(),c=p[0],d=p[1],u=p[2],g=.05*u,y=[c+10/20.8*u,d+3.6/13.2*p[3],Math.random()*g+g,Math.random()*-g-g];l.emptyBullets.push(y)}else l.isMagzineEmpty?(l.isFireRequested=!1,l.isShowingNoAmmoText||(l.isShowingNoAmmoText=!0,setTimeout(()=>{l.isShowingNoAmmoText=!1},1e3))):l.isMagzineEmpty||(l.isReloadRequested=!0)};if(l.isReloading||(l.isReloadRequested&&!l.isMagzineEmpty?(()=>{const t=document.getElementById("playerStatusCurrentMagzine"),e=document.getElementById("playerStatusTotalMagzine");l.currentMagzine!==s.currentMagzineMax?(l.isReloading=!0,l.isFiring=!1,l.thisRoundFiringFinished=!0,setTimeout(()=>{const i=s.currentMagzineMax-l.currentMagzine;if(i<=l.totalMagzine?(l.currentMagzine=s.currentMagzineMax,l.totalMagzine-=i):(l.currentMagzine+=l.totalMagzine,l.totalMagzine=0),0===l.totalMagzine){const i="rgba(255, 69, 0, 1)";l.isMagzineEmpty=!0,t.style.color=i,e.style.color=i}l.updateText("playerStatusCurrentMagzine",l.currentMagzine),l.updateText("playerStatusTotalMagzine",l.totalMagzine),l.isReloading=!1,l.isReloadRequested=!1},1e3)):l.isReloadRequested=!1})():l.isFireRequested&&l.thisRoundFiringFinished?r():!l.isFireRequested&&l.isFiring&&(l.isFiring=!1)),l.emptyBullets.length){const t=a.getWindowWidth(),e=a.getWindowHeight(),i=.005*t;l.emptyBullets.map(t=>{t[0]+=t[2],t[1]+=t[3],t[3]+=i}),l.emptyBullets=l.emptyBullets.filter(i=>{return!(i[0]>t||i[0]<0||i[1]>e||i[1]<0)})}},w.prototype.sendRequest=function(){const t=a.getAssetsUrlObj();const e=(t,e)=>{const i=new XMLHttpRequest;let n=!1,a=0;i.open("GET",t,!0),i.onprogress=(t=>{const e=t.loaded-a;this.loaded+=e,a=t.loaded,n||(this.total+=t.total,n=!0)}),i.onload=(()=>{!function(t,e){const i=document.createElement("div");i.style.display="none";const n=document.createElement("img");n.id=e,n.src=t,i.appendChild(n),document.getElementById("root").appendChild(i)}(t,e),this.isLoaded+=1}),i.send()};for(let i in t)t.hasOwnProperty(i)&&e(t[i],i)},w.prototype.drawLoadingPage=function(){const t=document.getElementById("root"),e=a.getWindowWidth(),i=a.getWindowHeight(),n=.5*e,o=.5*i,s=Math.pow(n*n+o*o,.5),r=Math.PI,l=2*r/120,h=0-.5*r,p=`<canvas id="loadingCanvas" width=${e} height=${i}>Your Browser Does Not Support Html5 Canvas</canvas>`;t.innerHTML=p+'<div class="loading-wrapper" id="loading-wrapper"><p>Loading <span id="loadingPercentage">0</span>%<p></div>';const c=document.getElementById("loadingCanvas").getContext("2d"),d=document.getElementById("loading-wrapper"),u=document.getElementById("loadingPercentage");let g=h,m=0,y=()=>{const t=Math.ceil(this.loaded/this.total*100),p=(g-h)/(2*r)*100;if(m+1<=t){m++;for(;u.lastChild;)u.removeChild(u.lastChild);const t=document.createTextNode(m);u.appendChild(t)}m>50&&(d.className="loading-wrapper white-text"),p<t&&(c.clearRect(0,0,e,i),c.beginPath(),c.fillStyle="rgb(0, 172, 237)",c.moveTo(n,o),c.arc(n,o,s,h,g+=l),c.fill()),p<100||this.isLoaded!==a.assetsCount?requestAnimationFrame(y):this.finishLoading()};requestAnimationFrame(y)},w.prototype.finishLoading=function(){m.play();const t=document.getElementById("loadingCanvas"),e=document.getElementById("loading-wrapper");t.style.transition="2s",t.style.transitionDelay="0.5s",t.style.opacity="0",e.style.transition="2s",e.style.transitionDelay="0.5s",e.style.opacity="0",setTimeout(()=>{t.parentNode.removeChild(t),e.parentNode.removeChild(e)},3e3)};new w;window.onload=function(){const t=new w;t.sendRequest(),t.drawLoadingPage()}}]);