function RenderIfLogin({component: Component}){
    if (localStorage.getItem('isLoginInTs') === 'true'){
        return Component;
    }
    return "";
}

export default RenderIfLogin;