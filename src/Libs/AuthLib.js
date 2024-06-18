
class AuthLib{


    static enableLoginAnimation(){
        document.getElementsByClassName("App")[0].style.filter = "blur(10px)";
        document.getElementById("login-loading").style.display = "block";
    }


    static disableLoginAnimation(){
        document.getElementsByClassName("App")[0].style.filter = "";
        document.getElementById("login-loading").style.display = "none";
    }


    static getUserName(internalUserName){
        if (!internalUserName || !internalUserName.includes("_")){
            return internalUserName;
        }

        return internalUserName.split("_", 2)[1];
    }

}

export default AuthLib;