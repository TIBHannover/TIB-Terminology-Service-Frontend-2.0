import {useState} from "react";



const CopyLinkButton = (props) => {
    const [copied, setCopied] = useState(false);

    return [
        <button 
            type="button" 
            class="btn btn-secondary btn-sm copy-link-btn"
            key={"copy-btn"} 
            onClick={() => {                  
                navigator.clipboard.writeText(props.valueToCopy);
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 1000); 
            }}
            >
            copy {copied && <i class="fa fa-check" aria-hidden="true"></i>}
        </button>
    ];
}



export const CopyLinkButtonMarkdownFormat = (props) => {
    const [copied, setCopied] = useState(false);

    return [
        <button 
            type="button" 
            class="btn btn-secondary btn-sm copy-link-btn"
            key={"copy-btn"} 
            onClick={() => {                  
                let copyValue = "[" + props.label + "](" + props.url + ")";
                navigator.clipboard.writeText(copyValue);
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 1000); 
            }}
            data-toggle="tooltip"
            data-placement="left" 
            title={props.tooltipText}
            >
            copy markdown link {copied && <i class="fa fa-check" aria-hidden="true"></i>}
        </button>
    ];
}



export default CopyLinkButton;