import UserModel from "../components/User/Model/user";
import {runLogin, isLogin} from "../api/user";
import {LoginResponse} from "../api/types/userTypes";
import {jwtDecode} from "jwt-decode";


class Auth {

    static run(): boolean {
        let cUrl = window.location.href;
        if (cUrl.includes("code=")) {
            Auth.enableLoginAnimation();
            let code = cUrl.split("code=")[1];
            if (code.includes("&")) {
                code = code.split('&')[0];
            }
            runLogin(code).then((jwtToken) => {
                if (jwtToken) {
                    let userData = Auth.createUserDataObjectFromAuthResponse(jwtToken);
                    if (!userData) {
                        Auth.disableLoginAnimation();
                        return false;
                    }
                    localStorage.setItem('user', JSON.stringify(userData));
                    let redirectUrl = localStorage.getItem("redirectUrl") ? localStorage.getItem("redirectUrl") : process.env.REACT_APP_PROJECT_SUB_PATH;
                    if (redirectUrl) {
                        window.location.replace(redirectUrl);
                    }
                    return true;
                }
                Auth.disableLoginAnimation();
                return false;
            });
        }
        return false;
    }


    static createUserDataObjectFromAuthResponse(jwtToken: string): UserModel | null {
        try {
            let response = jwtDecode(jwtToken) as LoginResponse;
            let authProvider = localStorage.getItem('authProvider');
            let user = new UserModel();
            user.setJwt(jwtToken);
            user.setId(response["id"])
            user.setToken(response["token"]);
            user.setFullName(response["name"]);
            user.setUsername(response["ts_username"]);
            user.setSystemAdmin(response["system_admin"]);
            user.setSettings(response["settings"]);
            user.setAuthProvider(authProvider);
            if (authProvider === 'github') {
                user.setGitInfo({company: response["company"], homeUrl: response["github_home"]});
            } else if (authProvider === "orcid") {
                user.setOrcidInfo({orcidId: response["orcid_id"]});
            }
            return user;
        } catch (e) {
            return null;
        }
    }


    static enableLoginAnimation(): void {
        let app = document.getElementsByClassName("App")[0] as HTMLElement;
        app.style.filter = "blur(10px)";
        document.getElementById("login-loading")!.style.display = "block";
    }


    static disableLoginAnimation(): void {
        let app = document.getElementsByClassName("App")[0] as HTMLElement;
        app.style.filter = "";
        document.getElementById("login-loading")!.style.display = "none";
    }


    static getUserName(internalUserName: string | null): string {
        if (!internalUserName) {
            return "";
        }
        let username = internalUserName.split('_');
        if (username.length > 1) {
            username = username.slice(1);
        } else {
            return internalUserName;
        }
        return username.join('');
    }


    static async userIsLogin(): Promise<UserModel | null> {
        if (process.env.REACT_APP_AUTH_FEATURE !== "true") {
            return null;
        }
        let userObjInStore = localStorage.getItem('user');
        let user: UserModel | null = null;
        if (userObjInStore) {
            user = JSON.parse(userObjInStore)
        }
        if (user && user.token) {
            let validation = await isLogin();
            if (validation) {
                return user;
            }
        }
        return null;
    }


    static runLogout(): void {
        localStorage.removeItem("user");
        let redirectUrl = localStorage.getItem("redirectUrl") ? localStorage.getItem("redirectUrl") : process.env.REACT_APP_PROJECT_SUB_PATH;
        if (redirectUrl) {
            window.location.replace(redirectUrl);
        }
    }

}

export default Auth;