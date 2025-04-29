import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import '../../layout/userPanel.css';



const ReportPanel = () => {

    const appContext = useContext(AppContext);

    const [content, setContent] = useState([]);


    function renderReports() {
        let reports = [];
        for (let rep of appContext.reportsListForAdmin) {
            reports.push(
                <div className="row">
                    <div className="col-sm-12">
                        <ul>
                            <li key={1}>{`Type: ${rep['reported_content_type']}`}</li>
                            <li key={2}>{`Date: ${rep['report_date']}`}</li>
                            <li key={3}>{`By: ${rep['reporter_username']}`}</li>
                            <li key={4} dangerouslySetInnerHTML={{ __html: `Link: <a href='${rep['reported_content_url']}' target='_blank'>${rep['reported_content_url']}</a>` }}></li>
                            <li key={5}>{`Reason: ${rep['report_reason']}`}</li>
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



    if (!appContext.user || !appContext.isUserSystemAdmin) {
        return "";
    }

    return (
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