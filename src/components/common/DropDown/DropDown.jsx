import React from "react";



const DropDown = (props) => {
    let options = [];
    for(let item of props.options){
        options.push(
            <option value={item.value} key={item.value}>{item.label}</option>
        );
    }
    
    return (
        <div class="form-group">
            <label for={props.dropDownId} className='col-form-label'>{props.dropDownTitle}</label>
            <select 
                className='site-dropdown-menu list-result-per-page-dropdown-menu' 
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