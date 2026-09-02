import UserModel from "../components/User/Model/user";
import { runLogin, isLogin, logout } from "../api/user";
import { LoginResponse, ApiKey } from "../api/types/userTypes";
import { clearQueryCache } from "./QueryCache";

class Auth {
  static run(): boolean {
    const callbackUrl = new URL(window.location.href);
    const code = callbackUrl.searchParams.get("code");
    const state = callbackUrl.searchParams.get("state");
    if (code) {
      const storedTransaction = state
        ? sessionStorage.getItem("oauthLoginState:" + state)
        : null;
      if (state) {
        sessionStorage.removeItem("oauthLoginState:" + state);
      }
      let loginTransaction: {
        authProvider: string;
        redirectUrl: string;
      } | null = null;
      try {
        loginTransaction = storedTransaction
          ? JSON.parse(storedTransaction)
          : null;
      } catch (e) {
        loginTransaction = null;
      }
      if (!state || !loginTransaction) {
        Auth.clearCallbackParameters(callbackUrl);
        return false;
      }
      Auth.enableLoginAnimation();
      runLogin(code, state, loginTransaction.authProvider).then((payload) => {
        if (payload) {
          let userData = Auth.createUserDataObjectFromAuthResponse(
            payload,
            loginTransaction.authProvider,
          );
          if (!userData) {
            Auth.disableLoginAnimation();
            return false;
          }
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("authProvider", loginTransaction.authProvider);
          localStorage.setItem("redirectUrl", loginTransaction.redirectUrl);
          let redirectUrl =
            loginTransaction.redirectUrl ||
            process.env.REACT_APP_PROJECT_SUB_PATH;
          if (redirectUrl) {
            window.location.replace(redirectUrl);
          }
          return true;
        }
        Auth.disableLoginAnimation();
        Auth.clearCallbackParameters(callbackUrl);
        return false;
      });
    }
    return false;
  }

  static clearCallbackParameters(url: URL): void {
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    url.searchParams.delete("error");
    url.searchParams.delete("error_description");
    window.history.replaceState({}, document.title, url.toString());
  }

  static createUserDataObjectFromAuthResponse(
    response: LoginResponse,
    authProvider: string,
  ): UserModel | null {
    try {
      let user = new UserModel();
      user.setCsrf(response.csrf_token ?? "");
      user.setId(response["id"]);
      user.setFullName(response["name"]);
      user.setUsername(response["ts_username"]);
      user.setSystemAdmin(response["system_admin"]);
      user.setSettings(response["settings"] as any);
      user.setAuthProvider(authProvider);
      if (authProvider === "github") {
        user.setGitInfo({
          company: response["company"],
          homeUrl: response["github_home"],
        });
      } else if (authProvider === "orcid") {
        user.setOrcidInfo({ orcidId: response["orcid_id"] });
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
    let username = internalUserName.split("_");
    if (username.length > 1) {
      username = username.slice(1);
    } else {
      return internalUserName;
    }
    return username.join("");
  }

  static extractUserName(user: ApiKey): string {
    if (!user) {
      return "";
    } else if (user.owner && user.name) {
      return user.name;
    } else {
      return user.username;
    }
  }

  static async userIsLogin(): Promise<UserModel | null> {
    if (process.env.REACT_APP_AUTH_FEATURE !== "true") {
      return null;
    }
    let userObjInStore = localStorage.getItem("user");
    let user: UserModel | null = null;
    if (userObjInStore) {
      user = JSON.parse(userObjInStore);
    }
    if (user && user?.csrf) {
      let validation = await isLogin();
      if (validation) {
        return user;
      }
    }
    return null;
  }

  static runLogout(): void {
    clearQueryCache();
    localStorage.removeItem("user");
    logout().finally(() => {
      let redirectUrl = localStorage.getItem("redirectUrl")
        ? localStorage.getItem("redirectUrl")
        : process.env.REACT_APP_PROJECT_SUB_PATH;
      if (redirectUrl) {
        window.location.replace(redirectUrl);
      }
    });
  }
}

export default Auth;
