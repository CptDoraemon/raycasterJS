import { GlobalVar } from "./globalvar";
window.CONST = new GlobalVar();
import { Param } from "./param";
window.param = new Param();
import { State } from "./state";
window.state = new State();

import { Game } from "./game";
import { Loading } from "./loading";
import { ServerConnection } from "./serverconnection";

window.game = new Game();
window.serverConnection = new ServerConnection();


// init objects
const
    loading = new Loading();


window.onload = function() {
    const loading = new Loading();
    loading.sendRequest();
    loading.drawLoadingPage();
};