

console.log('v84 - project-2 script.js')
console.log('----------------------------------------')

let currentSong = new Audio()
let songs
let currentFolder
let folders
let songdiv = document.createElement("div")    // creating a div
let folderdiv = document.createElement("section")

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
}



// to fetch all the songs
async function getSongs(folder) {
    songdiv.innerHTML = " "
    currentFolder = folder
    let a = await fetch(`/${folder}`) // fetching songs from directory
    let response = await a.text() // convert the fetch data into text
    // console.log("response:  " + response);


    songdiv.setAttribute("class", "songJS") // assigning class to div
    songdiv.innerHTML = response // adding the fetch data to div
    // console.log(div);
    document.querySelector(".main").before(songdiv) // adding div to main class
    // console.log("fetch songs:  " + div);
    let as = " "
    as = songdiv.getElementsByTagName("a") // getting data from <a href
    // while (as.length > 0) {
    //     as.pop();
    // }
    // console.log(as);
    // console.log(as.length);
    songs = []
    // while (songs.length > 0) {
    //     songs.pop();
    // }
    // console.log(songs);
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        // songs.push(element.href)
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]) // using split to get the name after "/library/"
        }

    }




    //adding songs to the ul of playlist in html
    let songUL = document.querySelector(".playlist").getElementsByTagName("ul")[0]

    // console.log(songUL);
    songUL.innerHTML = " "

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
                    <li>
              <img src="svg/musicIcon.svg" alt="">
              <div class="songinfo">
                <div>${decodeURI(song)}</div>
                <div>Song Artist</div>
              </div>
              <div class="playnow">
                <img class="invert  " src="svg/play.svg" alt="">
              </div>
            </li>` //.replaceAll("%20", " ")
        // adding songs to the li of playlist

        // adding songs to the li of the playlist.
        // using replace All to replace %20 with space

    }
    // eventlistener to to play individual song when user click on it
    Array.from(document.querySelector(".playlist").getElementsByTagName("li")).forEach(e => {
        // console.log(e.getElementsByTagName("div")[0]);
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML) // playMusic is a function
        })
    })

    return songs
}




// function to play the songs from left library and display song name in playbar
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/library/" + track)
    currentSong.src = `/${currentFolder}/` + track
    if (!pause) {

        currentSong.play() // to play each song a a time
        play.src = "svg/pause.svg"
    }

    document.querySelector(".songdetails").innerHTML = decodeURI(track)







}




async function getFolders() {
    folderdiv.innerHTML = " "
    let cardContainer = document.querySelector(".cardContainer")
    let a = await fetch(`/library`) // fetching songs from directory
    let response = await a.text() // convert the fetch data into text
    // console.log("response:  " + response);
    folderdiv.setAttribute("class", "folderJS") // assigning class to div
    folderdiv.innerHTML = response // adding the fetch data to div
    // console.log(folderdiv);
    document.querySelector(".main").before(folderdiv) // adding div to main class
    // console.log("fetch folders:  " + folderdiv);

    // let anchors = " "
    anchors = folderdiv.getElementsByTagName("a") // getting data from <a href
    // console.log(anchors);


    folders = []


    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // console.log(e);

        //using includes and endswith to ignore other anchor tags like songs and links
        if (e.href.includes("/library") && e.href.endsWith("/")) {
            folders = e.href.split("/").slice(-2)[0]
            // console.log(folders);

            // getting meta data of the folder
            let a = await fetch(`/library/${folders}/info.json`)
            let response = await a.json()
            // console.log(response);

            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folders}" class="cards round mv2 mh1 p2">
            <img class="round" src="library/${folders}/cover.jpg" alt="Song Image">
            <div class="playbutton">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="#1DB954" />
                <polygon points="35,25 75,50 35,75" fill="black" />
              </svg>
            </div>
            <h2 class="pv2">${response.title}</h2>
            <p>${response.description}</p>
          </div>
            
            `

        }
    }


    // for (let index = 0; index < anchors.length; index++) {
    //     const element = anchors[index];
    //     // songs.push(element.href)
    //     if (element.href.endsWith("/")) {
    //         folders.push(element.href.split(`/library/`)[1]) // using split to get the name after "/library/"
    //     }
    // }



    // folders.splice(0,2) // to remove the first 2 undefineds
    // console.log(folders);




    //load the library
    // it returns an collection thats why we use array.from
    // item.target gives the gives the element on which we clicked
    // item.currenttarget gives the element on which we use eventlistener
    Array.from(document.getElementsByClassName("cards")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset);
            await getSongs(`library/${item.currentTarget.dataset.folder}`)
            document.querySelector(".left").style.left = "0px"
            playMusic(songs[0])

        })
    })






}





async function main() {
    await getSongs("library/NewAlbum")
    playMusic(songs[0], true)
    // console.log(songs);

    // display all the albums on playlist
    getFolders()



    // Pause/play
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "svg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "svg/play.svg"

        }
    })

    // previous
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index != 0) {
            playMusic(songs[index - 1])
        }
    })
    // next
    next.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index < songs.length - 1) {
            playMusic(songs[index + 1])
        }
    })

    // time update event (displays current song time in playbar)
    currentSong.addEventListener("timeupdate", () => {
        // console.log(formatTime(currentSong.currentTime), formatTime(currentSong.duration));
        document.querySelector(".songtime").innerHTML = formatTime(currentSong.currentTime) + " / " + formatTime(currentSong.duration)

        //to change the seekbar
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        // console.log(currentSong.currentTime);
        // console.log(currentSong.duration);

        if (currentSong.currentTime == currentSong.duration) {
            currentSong.play()
        }
    })



    // volume.addEventListener("click",()=>{

    // })

    // eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // target.getBoundingClientRect() gives the information about position of our cursor
        // target.getBoundingClientRect().width
        let seekbarWidth = e.target.getBoundingClientRect().width
        let seekbarpercent = e.offsetX / seekbarWidth * 100
        // console.log(seekbarpercent);

        // changes the position of circle when click
        document.querySelector(".circle").style.left = seekbarpercent + "%"
        // console.log(rect.width);
        console.log(currentSong.duration);
        console.log(seekbarpercent);
        console.log((currentSong.duration * seekbarpercent) / 100);

        // change the duration of song according to the position of cuircle
        currentSong.currentTime = ((currentSong.duration * seekbarpercent) / 100)
    })

    // to open playlist menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0px"
    })

    // to close  playlist menu
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })


    // event listener to volume 

    document.getElementById("volume").addEventListener("change", (e) => {
        console.log(e.target.value);
        currentSong.volume = e.target.value / 100
        if (volbtn.src.includes("mutedVolume.svg")) {
            console.log(volbtn.src);
            volbtn.src = volbtn.src.replace("mutedVolume.svg", "volume.svg")
        }
    })

    // event listener to mute btn
    volbtn.addEventListener("click", () => {
        if (volbtn.src.includes("volume.svg")) {
            volbtn.src = volbtn.src.replace("volume.svg", "mutedVolume.svg")
            currentSong.volume = 0
            document.getElementById("volume").value = 0
        }
        // e.target.src.replace("volume.svg", "mutedVolume.svg") will dont work
        else {
            volbtn.src = volbtn.src.replace("mutedVolume.svg", "volume.svg")
            currentSong.volume = 0.5
            document.getElementById("volume").value = 50
        }
    })


    //event listener to album playbutton
    // console.log(document.querySelector(".playbutton"));
    // document.querySelector(".playbutton").addEventListener("click", (e) => {
    //     console.log(document.querySelector(".playbutton"));
    //     console.log(e.target);
    // })

}
// because getSongs() is an asycn function and returns promise, thats why its important to make another async function and await it

main()



console.log('                                                                                                                                                                                                                                                                     ')