

class AppHelpers{

    static InlineWrapperWithMargin({ children }: PropsWithChildren<unknown>) {
        return [
          <div className='row'>
            <div className='col-sm-6 skeleton-loading-box'>{children}</div>
            <div className='col-sm-6 skeleton-loading-box'>{children}</div>
          </div>    
        ];
    }

    static setSiteTitleAndFavIcon(){
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


    static checkBackendStatus(){
        let getCallSetting = {method: 'GET', headers: {'Accept': 'text/plain;charset=UTF-8 '}};
        let url = "https://service.tib.eu/ts4tib/api/accessibility";
        fetch(url, getCallSetting).then((res) => res.text()).then((res) => {
            if(res !== "API is Accessible!" && !document.getElementById('backend-is-down-message')){      
            let rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            rowDiv.setAttribute('id', 'backend-is-down-message')
            let colDiv = document.createElement('div');
            colDiv.classList.add('col-sm-12');
            colDiv.classList.add('text-center');
            let alertDiv = document.createElement('div');
            alertDiv.classList.add('alert');
            alertDiv.classList.add('alert-danger');
            let text = document.createTextNode("We are facing some issues with our services. Therefore, some of the functionalities may not work at the moment.");
            alertDiv.appendChild(text);
            colDiv.appendChild(alertDiv);
            rowDiv.appendChild(colDiv);
            document.getElementById('backend-is-down-message-span').appendChild(rowDiv);
            }    
        }).catch((e)=> {
            // document.getElementById("backend-is-down-message").style.display = "block";
        });
    }
}

export default AppHelpers;