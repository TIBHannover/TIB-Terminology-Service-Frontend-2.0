import {useState} from "react";

const CookieBanner = () => {
  
  const [cookieShow, setCookieShow] = useState(!window.localStorage.getItem("cookie-show"));
  
  
  function handleClick() {
    setCookieShow(false);
    window.localStorage.setItem("cookie-show", false);
  }
  
  function showCookiePopup() {
    return (
      <div className="row text-center cc_banner-wrapper cc_banner cc_container cc-container--open">
        <div className="col-lg-7 col-md-8 m-auto">
          <p className="cc_message">
            This website only uses technically necessary cookies.&ensp;
            <a className="cc_more_info" data-cc-if="options.link"
               href={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy/#cookies"}>More info.</a>
          </p>
          <button className="cc_btn cc_btn_accept_all me-5" onClick={handleClick}>I accept</button>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      {cookieShow ? showCookiePopup() : ""}
    </div>
  )
}

export default CookieBanner;