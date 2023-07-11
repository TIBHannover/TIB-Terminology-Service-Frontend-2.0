import { useState } from "react";
import AuthTool from "../Login/authTools";


export default function SubmitedIssueRequests(){    
    const [issuesList, setIssuesList] = useState(null);  

    getIssueList().then((resp) => {
        setIssuesList(resp);
    });

    console.info(issuesList);

    return [
        <div className="row">
                         
        </div> 
    ];

}


async function getIssueList(){
    let data = new FormData();
    let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});
    data.append("username", localStorage.getItem("ts_username"));    
    fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/get_submited_issues', {method: 'POST', headers:headers, body: data})
            .then((response) => response.json())
            .then((data) => {
                return data;
            })
            .catch((error) => {

            })
}

