import { useEffect } from 'react';
import '../../layout/toggleButton.css';


export const ToggleButton = ({on, onClickCallback, onLabel, offLabel, tooltipText}) => { 
    
    useEffect(() => {
        document.getElementById("toggleBtn").checked = on;
    }, []);

    
    return(
        <label class="toggleButtonLabel" >
            <input type="checkbox" id="toggleBtn" onClick={onClickCallback} checked={on}/>
            <div class={"toggle-slider round " + (!on ? "toggle-slider-off" : "")} title={tooltipText}>                        
                {on 
                    ? <span class="toggleButton-on truncate-toggleButtonLabel">{onLabel}</span>
                    : <span class="toggleButton-off truncate-toggleButtonLabel">{offLabel}</span>
                }                
            </div>
        </label>
    );
}