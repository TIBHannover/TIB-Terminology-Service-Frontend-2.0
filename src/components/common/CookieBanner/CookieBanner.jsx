import React from "react"

class CookieBanner extends React.Component{
  constructor(props){
    super(props)
    this.state = JSON.parse(window.localStorage.getItem('state')) || {
      cookieShow: true
    }
    this.handleClick = this.handleClick.bind(this)
    this.showCookiePopup = this.showCookiePopup.bind(this)
    this.removeCookiePopup = this.removeCookiePopup.bind(this)
  }

  setState(state) {
    window.localStorage.setItem('state', JSON.stringify(state));
    super.setState(state);
  }

  handleClick() {
    this.setState({
      cookieShow: false
    });
  }

  showCookiePopup(){
    return(
      <div className="cc_banner-wrapper">
        <div onClick={this.handleClick} className="cc_banner cc_container cc-container--open">
          <p className="cc_btn cc_btn_accept_all" rel="nofollow">Got it</p>
          <p className="cc_message">
            This website only uses technically necessary cookies.&ensp;
          <a className="cc_more_info" data-cc-if="options.link" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy/#cookies"}>More info.</a>
          </p>
        </div>
      </div>
    )
  }

  removeCookiePopup() {
    return (
      null
    )
  }

  render(){
    return(
      <div>
        { this.state.cookieShow ? this.showCookiePopup() : this.removeCookiePopup() }
      </div>
    )
  }
}

export default CookieBanner;