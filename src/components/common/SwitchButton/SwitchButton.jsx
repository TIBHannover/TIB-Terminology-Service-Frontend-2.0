

const SwitchButton = (props) => {

    const {id, label, smallText, className, onChange, checked, dataId, inLine} = props;


    function handleSwitchChange(e){
        let isChecked = e.target.checked;
        if(isChecked){
            let allCollectionCheckboxes = document.getElementsByClassName(className);
            for(let checkbox of allCollectionCheckboxes){
                if(checkbox.dataset.id !== e.target.dataset.id){
                    checkbox.checked = false;
                }
            }     
        }
        onChange && onChange(e);
    }



    return (
        <div className={"form-check form-switch" + (inLine ? " d-inline" : "")} key={"key_" + id}>
            <input 
                className={"form-check-input " + className}
                type="checkbox" 
                role="switch" 
                id={id}
                data-id={dataId} 
                onChange={handleSwitchChange}
                checked={checked}
            />
             <label class="form-check-label" for={id}>
                {label}&nbsp;
                {smallText && (<small>{smallText}</small>)}
            </label>
        </div>
    )
}

export default SwitchButton;