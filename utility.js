const DATABASE_URL = window.location.origin + "/Spotify-Clone/database.json";

async function getDatabaseURL() {
    let url = localStorage.getItem("DATABASE_URL");
    
    if (url) {
        return url;
    } else {
        return DATABASE_URL;
    }
}

async function getDataFromDatabase() {
    let url = await getDatabaseURL();
    let res = await fetch(url);
    let data = await res.json();
    return data;
}
