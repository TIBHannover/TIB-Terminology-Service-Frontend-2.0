import { useEffect } from 'react';
import '../../layout/toggleButton.css';


export const ToggleButton = ({on, onClickCallback}) => { 
    
    useEffect(() => {
        document.getElementById("toggleBtn").checked = on;
    }, []);


    return(
        <label class="toggleButtonLabel" >
            <input type="checkbox" id="toggleBtn" onClick={onClickCallback} />
            <div class={"slider round " + (!on ? "slider-off" : "")}>                        
                {on 
                    ? <span class="toggleButton-on">ON</span>
                    : <span class="toggleButton-off">OFF</span>
                }                
            </div>
        </label>
    );
}