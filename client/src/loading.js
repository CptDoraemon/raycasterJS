import { Game } from "./game";
import { CONST } from "./globalvar";


function Loading() {
    this.loaded = 0;
    this.total = 1;
    this.isLoaded /* count */= 0;
}
Loading.prototype.sendRequest = function() {
    // this will also initiate CONST.assetsCount, which will be used in this.drawLoadingPage
    const urlObj = CONST.getAssetsUrlObj();

    function appendImg(url, elId) {
        const div = document.createElement('div');
        div.style.display = 'none';
        const img = document.createElement('img');
        img.id = elId;
        img.src = url;
        div.appendChild(img);
        document.getElementById('root').appendChild(div);
    }
    const loadImgThenAppendToDom = (url, elId) => {
        const xml = new XMLHttpRequest();
        let
            thisTotalAddedToSumTotal = false,
            loaded = 0;

        xml.open('GET', url, true);
        xml.onprogress = (e) => {
            const loadedIncrement = e.loaded - loaded;
            this.loaded += loadedIncrement;
            loaded = e.loaded;
            // add total only on first time
            if (!thisTotalAddedToSumTotal) {
                this.total += e.total;
                thisTotalAddedToSumTotal = true;
            }
        };
        xml.onload = () => {
            appendImg(url, elId);
            this.isLoaded += 1;
        };
        xml.send();
    };

    for (let key in urlObj) {
        if (urlObj.hasOwnProperty(key)) {
            loadImgThenAppendToDom(urlObj[key], key)
        }
    }
};
Loading.prototype.drawLoadingPage = function() {
    const
        rootDiv = document.getElementById('root'),
        width = CONST.getWindowWidth(),
        height = CONST.getWindowHeight(),
        centerX = 0.5 * width,
        centerY = 0.5 * height,
        radius = Math.pow(centerX * centerX + centerY * centerY, 0.5),
        PI = Math.PI,
        angleInOneFrame = PI * 2 / 120,
        startingAngle = 0 - PI * 0.5,
        loadingCanvas = `<canvas id="loadingCanvas" width=${width} height=${height}>Your Browser Does Not Support Html5 Canvas</canvas>`,
        loadingMessage =
            '<div class="loading-wrapper" id="loading-wrapper">' +
            '<p>Loading <span id="loadingPercentage">0</span>%<p>' +
            '</div>';
    rootDiv.innerHTML = loadingCanvas + loadingMessage;
    const
        ctx = document.getElementById('loadingCanvas').getContext('2d'),
        wrapper = document.getElementById('loading-wrapper'),
        loadingPercentageSpan = document.getElementById('loadingPercentage');

    let
        endingAngle = startingAngle,
        displayingPercentage = 0,
        textColorChangedToWhite = false;
    let frame = () => {
        const
            loadingPercentage = Math.ceil((this.loaded / this.total) * 100),
            canvasPercentage = 100 * ((endingAngle - startingAngle) / (PI * 2));

        // update text
        if (displayingPercentage + 1 <= loadingPercentage) {
            loadingPercentageSpan.firstChild.nodeValue = ++displayingPercentage;
        }

        // change text color to white once loaded > 50%
        if (displayingPercentage > 50 && !textColorChangedToWhite) wrapper.className = 'loading-wrapper white-text';

        // canvas animation
        if (canvasPercentage < loadingPercentage) {
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            ctx.fillStyle = 'rgb(0, 172, 237)';
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startingAngle, endingAngle += angleInOneFrame);
            ctx.fill();
        }

        if (canvasPercentage < 100 || this.isLoaded !== CONST.assetsCount) {
            // if the true loading speed is slower (slow 3g) than canvas animation epr frame speed, finishloading will be called before img append to DOM, therefore check this.isLoaded
            requestAnimationFrame(frame)
        } else {
            this.finishLoading()
        }
    };
    requestAnimationFrame(frame);
};
Loading.prototype.finishLoading = function() {
    window.game = new Game();
    game.play();
    const
        loadingCanvas = document.getElementById('loadingCanvas'),
        loadingText = document.getElementById('loading-wrapper');
    loadingCanvas.style.transition = '2s';
    loadingCanvas.style.transitionDelay = '0.5s';
    loadingCanvas.style.opacity = '0';
    loadingText.style.transition = '2s';
    loadingText.style.transitionDelay = '0.5s';
    loadingText.style.opacity = '0';

    setTimeout(() => {
        loadingCanvas.parentNode.removeChild(loadingCanvas);
        loadingText.parentNode.removeChild(loadingText);
    }, 3000);
};

export { Loading };