let AudioPlayer = new Audio();

async function playmusic(songurl, pause = false) {
    AudioPlayer.src = songurl;
    
    if (!pause) {
        AudioPlayer.play();
  
      const playPauseButton = document.querySelector(".song-play");
      const playIconClass = "fa-solidfa-pause";
      const pauseIconClass = "fa-pause";
  
      const iconElement = playPauseButton.querySelector("i");
  
      iconElement.classList.remove(playIconClass);
      iconElement.classList.add(pauseIconClass);
    }
  
    document.querySelector(".song-info").innerHTML = track;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
};

async function displaySongs(songNames, UrlPrefix) {
    let songListElem = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    songListElem.innerHTML = "";

    songNames.forEach(songname => {
        let songurl = UrlPrefix + songname;

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

    Array.from(songListElem.getElementsByTagName("li")).forEach(li => {
        li.addEventListener("click", (e) => {
            let url = li.getAttribute("songurl");
            playmusic(url);
        });
    });
  }


async function main() {
    let data = await getDataFromDatabase();
    console.log(data);

    await displaySongs(data.songs.cs, "http://localhost:8000/songs/cs/");
}

document.addEventListener('DOMContentLoaded', () => main());
