import { fetchInfo } from "../../api";
import { endpoints, historyStates } from "../../common";

let mainPlaylistImage;
let mainPlaylistName;
let currentPlayingTitle = document.getElementById("currentPlayingTitle");
let currentPlayingImg = document.getElementById("currentPlayingImg");
let currentPlayingArtist = document.getElementById("currentPlayingArtist");
let currentStart = document.getElementById("currentStart");
let currentEnd = document.getElementById("currentEnd");
let volumeSlider = document.getElementById("volumeSlider");
let progressBar = document.getElementById("progressBar");
let playPause = document.getElementById("playPause");
let mute = document.getElementById("mute");
let muted = false;
let progressInterval;
let audio = new Audio();

async function getPlaylists(){
    let playlistSidebar = document.getElementById("playlistSidebar");
    let playlists = await fetchInfo(endpoints.userPlaylists);
    for(let item of playlists.items){
        let playlist = document.createElement("div");
        let url = item.images.length > 0 ? item.images[0].url : "https://i.pinimg.com/originals/a0/7c/b8/a07cb8dca58085601dd4897053b9092a.jpg"
        playlist.classList.add("w-full", "h-[14%]", "mb-2", "hoverLighten", "scroll-smooth", "grid", "grid-rows-3", "grid-cols-6")
        playlist.innerHTML = 
            "        <div style = \"background-image:url('" + url +"') \" class=\"col-span-1 row-span-3 w-full bg-contain bg-no-repeat bg-center rounded-lg\"></div>\n" +
            "        <div class=\"col-span-5 row-span-1 flex items-start pl-3 pt-1 font-semibold text-lg text-white\">" + item.name + "</div>\n" +
            "        <div class=\"col-span-5 row-span-1  pl-3 pt-6 flex items-center font-semibold text-sm text-gray-500\"> " + (item.public ? "Public" : "Private") + " ⋅ "+ item.owner.display_name + " </div>\n" 
            // "        "
        playlist.addEventListener("mousedown", ()=>{
            clickPlaylist(item.id, url, item.name, endpoints.playlistItems)}
            )
        playlistSidebar.appendChild(playlist)
    }
    mainPlaylistImage = playlists.items[0].images[0].url
    mainPlaylistName = playlists.items[0].name
    return playlists.items[0].id
}
async function getTopItems(){
    let topItemsSpace = document.getElementById("topItems");
    let topArtistsSpace = document.getElementById("topItems2");
    let featuredPlaylists = document.getElementById("topItems3");
    let topTracks = await fetchInfo(endpoints.userTopTracks);
    for(let item of topTracks.items){
        let album = document.createElement("div");
        let name = item.name.slice(0, 17) === item.name ? item.name : item.name.slice(0, 17) + "..";
        let url = item.album.images.length > 0 ? item.album.images[0].url : "https://i.pinimg.com/originals/a0/7c/b8/a07cb8dca58085601dd4897053b9092a.jpg"
        album.style.backgroundImage = "url(" + url + ")";
        album.classList.add("bg-black" ,"bg-contain" ,"bg-opacity-30" ,"hoverHighlight2" ,"rounded-2xl" ,"w-1/6" ,"h-[95%]" ,"flex-shrink-0")
        album.innerHTML = "<div class=\"w-full h-full bg-black bg-opacity-50 shadow-lg text-lg font-normal grid grid-cols-1 grid-rows-4 backdrop-blur-2xl rounded-2xl hoverHighlight2\">\n" +
            "                        <div class=\"row-span-3\">\n" +
            "                        <img src=\" " + url  + "\" alt=\"\" class=\"w-[90%] top-3 left-[5%] rounded-xl shadow-xl relative\">\n" +
            "                        </div>\n" +
            "                        <div class=\"flex items-center justify-center text-center text-xl font-semibold text-ellipsis whitespace-nowrap overflow-hidden\">\n" +
            "                            " + name + "\n" +
            "                        </div>\n" +
            "                    </div>"
            album.addEventListener("mousedown", ()=>{
                clickPlaylist(item.album.id, url, item.album.name, endpoints.albumItems)}
                )
        topItemsSpace.appendChild(album)
    }
    let topArtists = await fetchInfo(endpoints.userTopArtists)
    for(let item of topArtists.items){
        let album = document.createElement("div");
        let name = item.name.slice(0, 17) === item.name ? item.name : item.name.slice(0, 17) + "..";
        album.classList.add("bg-black", "bg-opacity-30", "hoverHighlight2", "backdrop-blur-xl", "rounded-2xl", "w-1/6", "h-full", "flex-shrink-0", "shadow-lg", "text-lg", "font-normal", "grid", "grid-cols-1", "grid-rows-4")
        let url = item.images.length > 0 ? item.images[0].url : "https://i.pinimg.com/originals/a0/7c/b8/a07cb8dca58085601dd4897053b9092a.jpg"
        album.innerHTML =
            "                        <div class=\"row-span-3\">\n" +
            "                        <div style = \"background-image:url('" + url +"') \"class=\"w-[90%] bg-contain h-full top-3 left-[5%] rounded-2xl relative\"></div>\n" +
            "                        </div>\n" +
            "                        <div class=\"flex items-center justify-center text-center text-xl font-semibold text-clip truncate whitespace-nowrap overflow-hidden\">\n" +
            "                            " + name + "\n" +
            "                        </div>\n"
        topArtistsSpace.appendChild(album)
    }

    let featured = await fetchInfo(endpoints.featuredPLaylists)
    for(let item of featured.playlists.items){
        let album = document.createElement("div");
        let name = item.name.slice(0, 17) === item.name ? item.name : item.name.slice(0, 17) + "..";
        let url = item.images.length > 0 ? item.images[0].url : "https://i.pinimg.com/originals/a0/7c/b8/a07cb8dca58085601dd4897053b9092a.jpg"
        album.style.backgroundImage = "url(" + url + ")";
        album.classList.add("bg-black" ,"bg-contain" ,"hoverHighlight2" ,"rounded-2xl" ,"w-1/6" ,"h-[95%]" ,"flex-shrink-0")
        album.innerHTML = "<div class=\"w-full h-full bg-blackTransparent shadow-lg text-lg font-normal grid grid-cols-1 grid-rows-4 backdrop-blur-2xl rounded-2xl hoverHighlight2\">\n" +
            "                        <div class=\"row-span-3\">\n" +
            "                        <img src=\" " + url  + "\" alt=\"\" class=\"w-[90%] top-3 left-[5%] rounded-xl shadow-xl relative\">\n" +
            "                        </div>\n" +
            "                        <div class=\"flex items-center justify-center text-center text-xl font-semibold text-ellipsis whitespace-nowrap overflow-hidden\">\n" +
            "                            " + name + "\n" +
            "                        </div>\n" +
            "                    </div>"
            album.addEventListener("mousedown", ()=>{
                clickPlaylist(item.id, url, item.name, endpoints.playlistItems)}
                )
        featuredPlaylists.appendChild(album)
    }
}

function clickPlaylist(newPlayListID, mainPlaylistImage, mainPlaylistName, endpoint){
    let playlistHighlight = document.getElementById("playlistHighlight")
    playlistHighlight.innerHTML = "";
    loadMainPlaylist(newPlayListID, mainPlaylistImage, mainPlaylistName, endpoint)
    const section = [newPlayListID, mainPlaylistImage, mainPlaylistName, endpoint]
    history.pushState(section, "", ``)//http://localhost:3000/dashboard/Playlist/${newPlayListID}
}

function onAudioMetaData(){
    currentEnd.textContent = timeDisplay(audio.duration*1000)
    clearInterval(progressInterval)
    progressInterval = setInterval(()=>{
        if(audio.paused) return;
        currentStart.textContent = timeDisplay(audio.currentTime*1000)
        progressBar.style.backgroundImage = "linear-gradient( to right, white " + audio.currentTime/audio.duration *100 + "%, rgb(50, 50, 50) " + audio.currentTime/audio.duration *100 + "%)"
        
    }, 100)
    audio.play()
}

function clickSong(previewURL){
    audio.src = previewURL
    audio.remove("loadedmetadata", onAudioMetaData)
    audio.addEventListener("loadedmetadata", onAudioMetaData)
    playPause.innerHTML = "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" />"
}

async function loadMainPlaylist(playlistMainID, mainPlaylistImage, mainPlaylistName, endpoint){
    let playlistHighlight = document.getElementById("playlistHighlight")
    let playlistHighlightImage = document.getElementById("playlistHighlightImage")
    let textBox = document.getElementById("textBoxPlaylistMain")
    let iterable; let playlistItems; let album; let albumName; let url;
    if(endpoint === endpoints.playlistItems){
        playlistItems = await fetchInfo(endpoint + playlistMainID + "/tracks")
        iterable = playlistItems.items
        album = false
    } else {
        playlistItems = await fetchInfo(endpoint + playlistMainID)
        iterable = playlistItems.tracks.items
        album = true
        albumName = playlistItems.name;
        url = playlistItems.images[0].url
    }
    playlistHighlightImage.style.backgroundImage = "url(" + mainPlaylistImage + ")"
    textBox.textContent = mainPlaylistName.slice(0, 20) === mainPlaylistName ? mainPlaylistName : mainPlaylistName.slice(0, 20) + "..";
    let i = 0;
    for(let item of iterable){
        let track = document.createElement("div")
        let base = !album ? item.track : item;
        let name = base.name.slice(0, 20) === base.name ? base.name : base.name.slice(0, 20) + "..";
        if(!album){
        albumName = base.album.name.slice(0, 25) === base.album.name ? base.album.name : base.album.name.slice(0, 25) + "..";
        url = base.album.images[0].url;
        }
        let Artistname = base.artists[0].name;
        let time = base.duration_ms;
        track.classList.add("bg-spBlack", "w-full", "h-1/5", "rounded-r-xl", "grid", "grid-cols-12", "mb-2")
        track.innerHTML = "<div style=\"background-image: url('" + url + "');\" class=\"col-span-1 bg-cover bg-no-repeat rounded-r-xl bg-center bg-spBlack flex items-center justify-center\">" +
            "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"#1DB954\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"w-8 h-8\">\n" +
            "  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z\" />\n" +
            "</svg>\n" +
            "</div>\n" +
            "                        <div class=\"col-span-5 pl-5 flex-col items-center text-white font-semibold lg:text-lg xl:text-xl\">\n" +
            "                            <div>" + name + "</div>\n" +
            "                            <div class=\"items-center text-gray-500 hover:underline lg:text-sm xl:text-base\">" + Artistname + "</div>\n" +
            "                        </div>\n" +
            "                        <div class=\"col-span-5  flex items-center hover:underline text-gray-500  lg:text-sm xl:text-lg\">" + albumName + "</div>\n" +
            "                        <div class=\"col-span-1 flex items-center text-gray-500 font-semibold lg:text-sm xl:text-lg\">" + timeDisplay(time) + "</div>"
        let bg = url
        track.addEventListener("mouseup", function(){
            currentPlayingImg.style.backgroundImage = "url('" + bg + "')";
            currentPlayingArtist.textContent = Artistname
            currentPlayingTitle.textContent = base.name;
            if(base.preview_url){
            track.classList.add("bg-spGreen")
            trackSpec.style.opacity = "1"
            clickSong(base.preview_url)}
        })
        let trackSpec = track.querySelector("svg")
        trackSpec.style.opacity = "0"
        track.addEventListener("mousemove", () => {
            trackSpec.style.opacity = "1"
        })
        track.addEventListener("mouseout", () => {
            trackSpec.style.opacity = "0"
        });
        playlistHighlight.appendChild(track)
        i++
    }
}

function timeDisplay(duration_ms){
    let minutes = Math.floor((duration_ms/1000)/60)
    let seconds = (duration_ms/1000)%60
    let secondsFinal = Math.round(seconds) < 10 ? ("0" + Math.round(seconds)) : Math.round(seconds)
    return minutes + ":" + secondsFinal
}

document.addEventListener('DOMContentLoaded', async ()=>{
    let playlistMainID = await getPlaylists()
    getTopItems()
    loadMainPlaylist(playlistMainID, mainPlaylistImage, mainPlaylistName, endpoints.playlistItems)
    const section = [playlistMainID, mainPlaylistImage, mainPlaylistName, endpoints.playlistItems]
    history.pushState(section, "", "")
    window.addEventListener("popstate", (event)=>{
        playlistHighlight.innerHTML = ""; 
        loadMainPlaylist(event.state[0], event.state[1], event.state[2], event.state[3])
    })
    window.addEventListener('unload', function(event) {
        console.log(import.meta.env.VITE_APP_URL);
        this.document.location.href = import.meta.env.VITE_APP_URL
      });
    playPause.addEventListener("mouseup", ()=>{
        playPause.style.fill="#1DB954"
        if(audio.paused){
            audio.play()
            playPause.innerHTML = "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" />"
        } else {
            audio.pause()
            playPause.innerHTML = "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" />\n" +
                "                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z\" />\n"
            
        }
        setTimeout(function() {
            playPause.style.fill="white"
        }, 100)
    })
    volumeSlider.addEventListener("change", function(){
        audio.volume = volumeSlider.value/100
    })
    mute.addEventListener("mouseup", function(){
        if(!muted){
        audio.volume = 0
        volumeSlider.value = 0;
        mute.innerHTML =
            "  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z\" />\n"
        muted = true;
        } else {
            audio.volume = 1
            volumeSlider.value = 100;
            mute.innerHTML = "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z\" />\n"
            muted = false;
        }
    })
})