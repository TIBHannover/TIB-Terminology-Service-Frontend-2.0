export default function isLogin(){
    if(localStorage.getItem("token")){
        return true;
    }
    return false;
}


export function Logout(){
    
}