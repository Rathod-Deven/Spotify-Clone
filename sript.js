let currentsong = new Audio();
let songs;
let currFolder;

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

async function getSong(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><i class="fa-solid fa-music"></i>
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Deven</div>
        </div>
          <div class="playnow">
            <span>Play Now</span>
            <i class="fa-regular fa-circle-play"></i>
        </div>
         </li>`;
  }

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (Element) => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
}

const playmusic = (track, pause = false) => {
  currentsong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentsong.play();

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

async function DispalyAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".cardcontainer");
  Array.from(anchors).forEach(async (e) => {
    if (e.href.includes("/song")) {
      let folder = e.href.split("/").slice(-2)[1];
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();

      cardcontainer.innerHTML =
        cardcontainer.innerHTML +
        ` <div data-folder="${folder}" class="card">
     <div class="play">
     <i class="fa-solid fa-play"></i>
   </div>
     <img src="/songs/${folder}/cover.jpg" />
     <h4>${response.title}</h4>
     <p>${response.description}</p>
   </div>`;

      Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
          songs = await getSong(`songs/${item.currentTarget.dataset.folder}`);
        });
      });
    }
  });
}

async function main() {
  await getSong("songs/cs");
  playmusic(songs[0], true);

  DispalyAlbums();

  const playPauseButton = document.querySelector(".song-play");
  const playIconClass = "fa-solidfa-pause";
  const pauseIconClass = "fa-pause";

  play.addEventListener("click", () => {
    const iconElement = playPauseButton.querySelector("i");
    const isPlaying = iconElement.classList.contains(playIconClass);
    if (currentsong.paused) {
      currentsong.play();
      iconElement.classList.remove(playIconClass);
      iconElement.classList.add(pauseIconClass);
    } else {
      currentsong.pause();
      iconElement.classList.remove(pauseIconClass);
      iconElement.classList.add(playIconClass);
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let parcent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = parcent;
    currentsong.currentTime = (currentsong.duration * parcent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  pre.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index >= 0) {
      playmusic(songs[index - 1]);
    } else {
      console.log("No previous song found.");
    }
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    } else {
      console.log("No next song found.");
    }
  });

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentsong.volume = parseInt(e.target.value) / 100;
    });

  const VolumeButton = document.querySelector(".volume");
  const high = "fa-solidfa-volume-high";
  const mute = "fa-solidfa-volume-xmark";

  document.querySelector(".volume>i").addEventListener("click", (e) => {
    const iconElement = VolumeButton.querySelector(".volume>i");
    const isPlaying = iconElement.classList.contains(playIconClass);
    if (e.target.src == "high") {
      e.target.src = "mute";
      currentsong.volume = 0;
      iconElement.classList.remove(high);
      iconElement.classList.add(mute);
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = "high";
      currentsong.volume = 0.5;
      iconElement.classList.remove(mute);
      iconElement.classList.add(high);
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 50;
    }
  });
}
main();