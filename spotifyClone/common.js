
const APP_URL = import.meta.env.VITE_redirectURL

export const endpoints = {
    userProfile: "https://api.spotify.com/v1/me",
    userPlaylists: "https://api.spotify.com/v1/me/playlists",
    userTopArtists: "https://api.spotify.com/v1/me/top/artists?time_range=long_term",
    userTopTracks: "https://api.spotify.com/v1/me/top/tracks?time_range=long_term",
    userTopAlbums: "https://api.spotify.com/v1/me/shows?offset=0&limit=20",
    featuredPLaylists: "https://api.spotify.com/v1/browse/featured-playlists",
    playlistItems: "https://api.spotify.com/v1/playlists/",
    albumItems: "https://api.spotify.com/v1/albums/"
}

export const historyStates = {
    DASHBOARD: "dashboard",
    PLAYLIST: "playlist"
}

export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in')
    document.location.href = APP_URL;
}