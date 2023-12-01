import React from "react";



const DropDown = (props) => {
    let options = [];
    for(let item of props.options){
        options.push(
            <option value={item.value} key={item.value}>{item.label}</option>
        );
    }
    
    return (
        <div className={"site-dropdown-container " + props.containerClass}>
            <label for={props.dropDownId} className='col-form-label'>{props.dropDownTitle}</label>
            <select 
                className={'site-dropdown-menu ' + props.dropdownClassName}
                id={props.dropDownId}
                value={props.dropDownValue} 
                onChange={props.dropDownChangeHandler}
                >
                {options}
            </select>   
        </div>   
    );
}


export default DropDown;