import { Loading } from "./loading";


// init objects
const
    loading = new Loading();


window.onload = function() {
    const loading = new Loading();
    loading.sendRequest();
    loading.drawLoadingPage();
};