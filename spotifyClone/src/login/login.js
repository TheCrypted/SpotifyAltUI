const clientID = import.meta.env.VITE_clientID
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read"
const redirectURL = import.meta.env.VITE_redirectURL
const APP_URL = import.meta.env.VITE_APP_URL

const authorizeUser = ()=>{
    let url = import.meta.env.VITE_API_URL;
    console.log(url)
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(clientID);
    url += '&scope=' + encodeURIComponent(scopes);
    url += '&redirect_uri=' + encodeURIComponent(redirectURL);
    window.open(url, "Log-in", "width = 500, height = 500, left = 650, top = 200 ")
}

document.addEventListener("DOMContentLoaded", ()=>{
    let button = document.getElementById("loginButton")
    let sliders = document.getElementsByClassName("checkAlpha")
    let sliderSpeed = [3.5, 5, 2, 5]
    let clientPrevX = 0
    const newspaperTiming = {
        duration: 2000,
        iterations: 1,
    };
    button.addEventListener("click", authorizeUser)
    window.addEventListener("mousemove", (event)=>{
        if(event.clientX - clientPrevX > 0){
            let j = 0
            for(let slider of sliders){
                slider.scrollLeft += sliderSpeed[j];
                j++;
            }
    } else if(event.clientX - clientPrevX < 0){
        let k = 0
        for(let slider of sliders){
            slider.scrollLeft -= sliderSpeed[k];
            k++;
        }
    }
    clientPrevX = event.clientX
    })
})

window.setItemsLocalStorage = ({access_token, token_type, expires_in})=>{
    localStorage.setItem("access_token", access_token)
    localStorage.setItem("token_type", token_type)
    localStorage.setItem("expires_in", Date.now() + expires_in*1000)
    window.location.href = `${APP_URL}/dashboard/dashboard.html`
}

window.addEventListener("load", ()=>{
    const accessToken = window.localStorage.getItem("access_token")
    if (accessToken){
        window.location.href = `${APP_URL}/dashboard/dashboard.html`
    }
    if(window.opener !== null && !window.opener.closed){
        window.focus();
        if(window.location.href.includes("error")){
            window.close()
        }
        let {hash} = window.location
        let searchParams = new URLSearchParams(hash)
        const access_token = searchParams.get("#access_token")
        const token_type = searchParams.get("token_type")
        const expires_in = searchParams.get("expires_in")
        if(access_token){
            window.close()
            window.opener.setItemsLocalStorage({access_token, token_type, expires_in});
        } else{
            console.log("incorrect")
            window.close()
        }
        console.log(window.localStorage.getItem("access_token"));
    }
})