import { logout, endpoints } from "./common";


const getHeader = ()=>{
    const access_token = localStorage.getItem('access_token');
    const token_type = localStorage.getItem('token_type');
    const expires_in = localStorage.getItem('expires_in');
    if(Date.now() < expires_in ){
        return {access_token, token_type}
    } else {
        logout();
    }
}

const apiConfig = ({access_token, token_type}, method='GET')=>{
    return {
        headers: {
            Authorization: `${token_type} ${access_token}`
        },
        method
    }
}

export const fetchInfo = async (endpoint)=>{
    const result = await fetch(endpoint, apiConfig(getHeader()))
    return result.json();
}