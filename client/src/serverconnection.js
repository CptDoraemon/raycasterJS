import { state } from "./state";
import { game } from "./game";

function ServerConnection() {
    this.ws = null;
}
ServerConnection.prototype.initiateConnection = function() {
    const HOST = location.hostname !== 'localhost' ? location.origin.replace(/^http/, 'ws') : 'ws://localhost:5000/';
    const ws = new WebSocket(HOST);
    this.ws = ws;

    ws.onopen = function() {
        state.updateServerMessage('Connected to the server');
        const requestJoinGame = {
            what: 'upLinkRequestJoinGame',
        };
        ws.send(JSON.stringify(requestJoinGame));
    };

    ws.onmessage = (e) => {
        const received = JSON.parse(e.data);
        if (received.what === 'downLinkUpdatePosition') {
            this.handleDownLinkUpdatePosition(received)
        } else if (received.what === 'serverMessage') {
            // serverMessage that need to be post to serverMessageComponent
            state.updateServerMessage(received.payload);
        } else if (received.what === 'downLinkRequestJoinGame') {
            // set _id for this player
            this.handleDownLinkRequestJoinGame(received)
        }
    };

    ws.onerror = (e) => console.log(e);
    ws.onclose = () => {
        state.updateServerMessage('Connection lost. Please refresh the page to reconnect.');
        state.isConnectedToServer = false;
    }
};
ServerConnection.prototype.handleDownLinkRequestJoinGame = function(received) {
    state.playerId = received.payload;
    state.isConnectedToServer = true;
};
ServerConnection.prototype.upLinkUpdatePosition = function() {
    const payload = {
        playerId: state.playerId,
        x: game.mainPlayer.x,
        y: game.mainPlayer.y,
        accumulatedJumpHeight: state.accumulatedJumpHeight,
        healthPoint: state.healthPoint,
        death: state.death,
        latency: state.latency,
        timeSent: new Date(),
        isRespawning: state.isRepawnProtected || state.isRespawning,
        hitPlayerArray: state.hitPlayerArray
    };
    if (state.killedBy) {
        payload.killedBy = state.killedBy
    }
    const data = {
        what: 'upLinkUpdatePosition',
        payload: payload,
        playerId: state.playerId,
    };
    this.ws.send(JSON.stringify(data));

    //reset after sent
    state.hitPlayerArray = [];
    state.killedBy = null;
};
ServerConnection.prototype.handleDownLinkUpdatePosition = function(received) {
    //console.log(received);
    state.playersArray = received.payload.slice();
    //
    let mainPlayerObj = received.payload.filter((obj) => obj.playerId === state.playerId);
    mainPlayerObj = mainPlayerObj[0];
    // calc latency
    const now = new Date();
    state.latency = Math.floor((now - new Date(mainPlayerObj.timeSent)) / 2);
    // calc damage
    if (mainPlayerObj.hitBy && !state.isRespawning && !state.isRepawnProtected) {
        if (mainPlayerObj.hitBy.length !== 0) {
            for (let i=0; i<mainPlayerObj.hitBy.length; i++) {
                const damage = Math.floor(Math.random() * 10 + 5);
                const hpAfterDamage = state.healthPoint - damage;
                if (hpAfterDamage <= 0) {
                    state.death++;
                    state.isRespawning = true;
                    state.healthPoint = 0;
                    state.killedBy = mainPlayerObj.hitBy[i];
                    state.updateServerMessage('You were killed by ' + mainPlayerObj.hitBy[i]);
                    const hpEl = document.getElementById('playerStatusHealthPoint');
                    hpEl.innerHTML = state.healthPoint;
                    //
                    setTimeout(() => {
                        state.damageIndicator = [];
                        game.drawDamageIndicatorArray = [];
                    }, 1000);
                    break;
                } else {
                    state.damageIndicator.push(mainPlayerObj.hitBy[i]);
                    state.healthPoint = hpAfterDamage;
                    const hpEl = document.getElementById('playerStatusHealthPoint');
                    hpEl.innerHTML = state.healthPoint;
                }
            }
        }
    }
    // update info related to this player
    state.kill = mainPlayerObj.kill;
    if (mainPlayerObj.killerOf) {
        state.updateServerMessage('You killed ' + mainPlayerObj.killerOf);
    }
};

const serverConnection = new ServerConnection();

export  { serverConnection };