

export const LoginLoadingAnimation = () => {
  return (
    <div className="overlay" id="login-loading">
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div className="row">
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Login ...</span>
          </div>
        </div>
        <div className="row login-load-text">
          <h2><strong>Login ...</strong></h2>
        </div>
      </div>
    </div>
  );
}