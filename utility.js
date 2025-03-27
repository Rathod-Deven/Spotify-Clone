function getURLOrigin() {
    let devOriginUrl = localStorage.getItem("DEV_ORIGIN_URL_SUFFIX");
    
    if (devOriginUrl) {
        return devOriginUrl;
    } else {
        return window.location.origin + "/Spotify-Clone";
    }
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00";
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);
  
    const formettedMinutes = String(minutes).padStart(2, "0");
    const formettedseconds = String(remainingseconds).padStart(2, "0");
  
    return `${formettedMinutes}:${formettedseconds}`;
}
