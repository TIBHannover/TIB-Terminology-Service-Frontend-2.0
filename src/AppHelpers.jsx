import AlertBox from "./components/common/Alerts/Alerts";


export function InlineWrapperWithMargin({ children }) {
    return [
      <div className='row'>
        <div className='col-sm-6 skeleton-loading-box'>{children}</div>
        <div className='col-sm-6 skeleton-loading-box'>{children}</div>
      </div>    
    ];
}
    


export function setSiteTitleAndFavIcon(){
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    else if(process.env.REACT_APP_PROJECT_ID === "nfdi4chem"){
      link.href = '/chem_small_logo.png';
      document.title = "NFDI4Chem Terminology Service"
    }
    
    else if(process.env.REACT_APP_PROJECT_ID === "nfdi4ing"){
      link.href = 'https://nfdi4ing.de/wp-content/uploads/2020/01/cropped-signet-192x192.png';
      document.title = "NFDI4Ing Terminology Service"
    }
    else{
      // General 
      document.title = "TIB Terminology Service"
    }
}


export function BackendIsDownMessage(){
    return(
      <>
        <div className="row">
          <div className="col-sm-12 text-center" id="backend-is-down-message-span">
              <AlertBox  
                  message="We are facing some issues with our services. Therefore, some of the functionalities may not work at the moment."
                  type="danger"
              />
          </div>
        </div>
      </>
    );
}
