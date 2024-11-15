
const DropDown = (props) => {
    const {mandatory, options, dropDownId, containerClass, dropDownTitle, dropdownClassName, dropDownValue, dropDownChangeHandler} = props;

    let optionsRendered = [];
    for(let item of options){
        optionsRendered.push(
            <option value={item.value} key={item.value}>{item.label}</option>
        );
    }
    
    return (
        <div className={"site-dropdown-container " + containerClass}>
            <label for={dropDownId} className={'col-form-label ' + (mandatory ? "required_input" : "")}>
                {dropDownTitle}
            </label>
            <select 
                className={'site-dropdown-menu ' + dropdownClassName}
                id={dropDownId}
                value={dropDownValue} 
                onChange={dropDownChangeHandler}
                >
                {optionsRendered}
            </select>   
        </div>   
    );
}


export default DropDown;