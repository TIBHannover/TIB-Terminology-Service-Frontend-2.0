import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import '../../layout/userPanel.css';



const ReportPanel = () => {

    const appContext = useContext(AppContext);

    const [content, setContent] = useState([]);


    function renderReports(){
        let reports = [];        
        for(let rep of appContext.reportsListForAdmin){
            reports.push(
                <div className="row">
                    <div className="col-sm-12">
                        <ul>
                            <li>{`Type: ${rep['reported_content_type']}`}</li>
                            <li>{`Date: ${rep['report_date']}`}</li>
                            <li>{`By: ${rep['reporter_username']}`}</li>
                            <li dangerouslySetInnerHTML={{ __html: `Link: <a href='${rep['reported_content_url']}' target='_blank'>${rep['reported_content_url']}</a>`}}></li>
                            <li>{`Reason: ${rep['report_reason']}`}</li>                            
                        </ul>
                    </div>
                    <hr></hr>
                </div>
            );
        }
        setContent(reports);
    }



    useEffect(() => {
        renderReports();
    }, []);



    if(!appContext.user || !appContext.isUserSystemAdmin){
        return "";
    }

    return(        
        <div className="row user-info-panel">
            <div className="col-sm-12">
                <h3>Reported Contents</h3>
                <br></br>
                {content}
            </div>
        </div>
    );

}

export default ReportPanel;