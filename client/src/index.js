import { CONST } from "./globalvar";
import { Player } from "./player";
import { Loading } from "./loading";


// init objects
const
    loading = new Loading();


window.onload = function() {
    const loading = new Loading();
    loading.sendRequest();
    loading.drawLoadingPage();
};