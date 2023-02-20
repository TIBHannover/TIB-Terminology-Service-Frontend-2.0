export function CookieBanner(){
    return(
        <div className="cc_banner-wrapper">
           <div className="cc_banner cc_container cc-container--open">
             <a className="cc_btn cc_btn_accept_all" href="" data-cc-event="click:dismiss" rel="nofollow">Got it</a>
             <p className="cc_message">
               This website only uses technically necessary cookies.&ensp;
               <a className="cc_more_info" data-cc-if="options.link" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy"}>More info.</a>
             </p>
           </div>
        </div>
    )
}