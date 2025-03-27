const DATABASE_URL = getURLOrigin() + "/database.json";

let AudioPlayer = new Audio();
let currentAlbumSongListElem = undefined;

async function getDataFromDatabase() {
    let res = await fetch(DATABASE_URL);
    let data = await res.json();
    return data;
}

async function playMusic(songurl, pause = false) {
    AudioPlayer.src = songurl;
    
    if (!pause) {
        AudioPlayer.play();
  
      const playPauseButtonElem = document.querySelector(".song-play");
      const playIconClass = "fa-solidfa-pause";
      const pauseIconClass = "fa-pause";
  
      const iconElem = playPauseButtonElem.querySelector("i");
  
      iconElem.classList.remove(playIconClass);
      iconElem.classList.add(pauseIconClass);
    }
  
    document.querySelector(".song-info").innerHTML = songurl.split("/").pop();
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
};

async function displaySongs(songNames, UrlPrefix) {
    let songListElem = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    songListElem.innerHTML = "";

    songNames.forEach(songname => {
        let songurl = `${UrlPrefix}/${songname}`;

        songListElem.innerHTML += `
            <li songurl="${songurl}">
                <i class="fa-solid fa-music"></i>
                
                <div class="info">
                    <div>${songname}</div>
                    <div>Deven</div>
                </div>

                <div class="playnow">
                    <span>Play Now</span>
                    <i class="fa-regular fa-circle-play"></i>
                </div>
            </li>
        `;
    });

    let songElems = Array.from(songListElem.getElementsByTagName("li"))
    songElems.forEach(li => {
        li.addEventListener("click", (e) => {
            let url = li.getAttribute("songurl");
            playMusic(url);
        });
    });

    return songElems;
}

async function displayAlbums(playlists) {
    let cardcontainer = document.querySelector(".cardcontainer");

    Object.entries(playlists).forEach(([key, value]) => {
        cardcontainer.innerHTML += `
            <div class="card" data-folder="${key}">
                <div class="play">
                    <i class="fa-solid fa-play"></i>
                </div>
                <img src="songs/${key}/${value.coverimg}" />
                <h4>${value.title}</h4>
                <p>${value.description}</p>
            </div>`;
    });

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            let folder = item.currentTarget.dataset.folder;
            let songs = playlists[folder].songs;
            console.log(`Loading songs for ${folder}:`, songs);
            currentAlbumSongListElem = await displaySongs(songs, getURLOrigin() + "/songs/" + folder);
            currentAlbumSongListElem[0].click();
        });
    });
}

async function main() {
    let data = await getDataFromDatabase();
    console.log(data);

    let currentAlbumSongs = data.playlists.radhakrishna.songs;

    currentAlbumSongListElem = await displaySongs(currentAlbumSongs, getURLOrigin() + "/songs/radhakrishna");
    console.log(currentAlbumSongListElem);
    await displayAlbums(data.playlists);

    const playPauseButtonElem = document.querySelector(".song-play");
    const playIconClass = "fa-solidfa-pause";
    const pauseIconClass = "fa-pause";

    playPauseButtonElem.addEventListener("click", () => {
        const iconElement = playPauseButtonElem.querySelector("i");
        
        if (AudioPlayer.paused) {
            AudioPlayer.play();
            iconElement.classList.remove(playIconClass);
            iconElement.classList.add(pauseIconClass);
        } else {
            AudioPlayer.pause();
            iconElement.classList.remove(pauseIconClass);
            iconElement.classList.add(playIconClass);
        }
    });

    AudioPlayer.addEventListener("ended", () => {
        console.log("Audio has finished playing!");
    });

    AudioPlayer.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(AudioPlayer.currentTime)} / ${secondsToMinutesSeconds(AudioPlayer.duration)}`;
        document.querySelector(".circle").style.left = (AudioPlayer.currentTime / AudioPlayer.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percentage;
        AudioPlayer.currentTime = (AudioPlayer.duration * percentage) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // pre.addEventListener("click", () => {
    //     let index = currentAlbumSongs.indexOf(AudioPlayer.src.split("/").pop());
        
    //     if (index >= 0) {
    //         playMusic();
    //     } else {
    //         console.log("No previous song found.");
    //     }
    // });
    
    // next.addEventListener("click", () => {
    //     let index = currentAlbumSongs.indexOf(AudioPlayer.src.split("/").pop());
        
    //     if (index + 1 < currentAlbumSongs.length) {
    //         playMusic(currentAlbumSongs[index + 1]);
    //     } else {
    //         console.log("No next song found.");
    //     }
    // });

    document
        .querySelector(".range")
        .getElementsByTagName("input")[0]
        .addEventListener("change", (e) => {
            AudioPlayer.volume = parseInt(e.target.value) / 100;
        });
}

document.addEventListener('DOMContentLoaded', () => main());
