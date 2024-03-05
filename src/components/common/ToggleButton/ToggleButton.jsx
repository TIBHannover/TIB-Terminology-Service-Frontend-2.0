import '../../layout/toggleButton.css';


export const ToggleButton = ({on, onClickCallback}) => {

    return(
        <label class="toggleButtonLabel" >
            <input type="checkbox" id="togBtn" onClick={onClickCallback} />
            <div class="slider round">                        
                {on && <span class="toggleButton-on">ON</span>}
                {!on && <span class="toggleButton-off">OFF</span>}
            </div>
        </label>
    );
}