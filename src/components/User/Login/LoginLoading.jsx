

export const LoginLoadingAnimation = () => {
    return (
        <div class="overlay" id="login-loading">
          <div class="d-flex flex-column align-items-center justify-content-center">  
            <div className="row">
              <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Login ...</span>
              </div>
            </div>
            <div className="row login-load-text">
              <h2><strong>Login ...</strong></h2>
            </div>                                
          </div>
        </div>  
    );
}