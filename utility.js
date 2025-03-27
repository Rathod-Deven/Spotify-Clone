function getURLOrigin() {
    let devOriginUrl = localStorage.getItem("DEV_ORIGIN_URL_SUFFIX");
    
    if (devOriginUrl) {
        return devOriginUrl;
    } else {
        return window.location.origin + "/Spotify-Clone";
    }
}
