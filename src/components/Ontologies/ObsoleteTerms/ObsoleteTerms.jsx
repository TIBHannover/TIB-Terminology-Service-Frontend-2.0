import {useEffect} from "react";
import PaneResize from "../../common/PaneResize/PaneResize";



const ObsoleteTerms = (props) => {
    let paneResize = new PaneResize();

    useEffect(() => {
        paneResize.setOriginalWidthForLeftPanes();
        document.body.addEventListener("mousedown", paneResize.onMouseDown);
        document.body.addEventListener("mousemove", paneResize.moveToResize);
        document.body.addEventListener("mouseup", paneResize.releaseMouseFromResize);
        
        return () => {
            document.body.addEventListener("mousedown", paneResize.onMouseDown);
            document.body.addEventListener("mousemove", paneResize.moveToResize);
            document.body.addEventListener("mouseup", paneResize.releaseMouseFromResize);
        }
    });
    

    return(
        <div className="tree-view-container resizable-container">
            <div className="tree-page-left-part" id="page-left-pane">
                Left
            </div>
            {paneResize.generateVerticalResizeLine()} 
            <div className="node-table-container" id="page-right-pane">
                Right
            </div>
        </div>
    );


}






export default ObsoleteTerms;