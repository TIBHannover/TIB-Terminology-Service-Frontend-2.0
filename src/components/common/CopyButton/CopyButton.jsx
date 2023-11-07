import {useState} from "react";



const CopyLinkButton = (props) => {
    const [copied, setCopied] = useState(false);

    return [
        <button 
            type="button" 
            class="btn btn-sm copy-link-icon-btn borderless-btn"
            key={"copy-btn"} 
            onClick={() => {                  
                navigator.clipboard.writeText(props.valueToCopy);
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 1000); 
            }}
            >
            <i class="fa fa-solid fa-copy"></i> {copied && <i class="fa fa-check" aria-hidden="true"></i>}
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
                let copyValue = document.createElement('a');
                copyValue.href = props.url;
                copyValue.textContent = props.label;                
                let holderDiv = document.createElement('div');
                holderDiv.style.position = "absolute";                
                holderDiv.appendChild(copyValue);
                document.body.appendChild(holderDiv);
                let range = document.createRange();
                range.selectNode(holderDiv);
                let selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);                
                document.execCommand("copy");
                selection.removeAllRanges();
                document.body.removeChild(holderDiv);  
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 1000); 
            }}
            data-toggle="tooltip"
            data-placement="left" 
            title={props.tooltipText}
            >
            copy label as link {copied && <i class="fa fa-check" aria-hidden="true"></i>}
        </button>
    ];
}



export default CopyLinkButton;