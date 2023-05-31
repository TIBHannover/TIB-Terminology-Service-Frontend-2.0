export function createClassListTableHeader(){
    return [
        <thead>
            <tr>                
                <th scope="col" className="label-col">Label <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="id-col">ID <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="des-col">Description <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="alt-term-col">Alternative Term <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="sub-class-col">SubClass Of <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="eqv-col">Equivalent to <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="ex-usage-col">Example of usage <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="see-also-col">See Also <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="contrib-col">Contributor <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="comment-col">Comment <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th> 
            </tr>
        </thead>
    ];
}


export function createShowColumnsTags(){
    return [
        <span>
            <div class="show-hidden-column" data-column="label-col" id="label-col-show" onClick={showTableColumn}>Label <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="id-col" id="id-col-show" onClick={showTableColumn}>ID <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="des-col" id="des-col-show" onClick={showTableColumn}>Description <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="alt-term-col" id="alt-term-col-show" onClick={showTableColumn}>Alternative Term <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="sub-class-col" id="sub-class-col-show" onClick={showTableColumn}>SubClass Of <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="eqv-col" id="eqv-col-show" onClick={showTableColumn}>Equivalent to <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="ex-usage-col" id="ex-usage-col-show" onClick={showTableColumn}>Example of usage <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="see-also-col" id="see-also-col-show" onClick={showTableColumn}>See Also <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="contrib-col" id="contrib-col-show" onClick={showTableColumn}>Contributor <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="comment-col" id="comment-col-show" onClick={showTableColumn}>Comment <i className="fa fa-eye"></i></div>
        </span>        
    ];
}



export function setContributorField(term){
    if (term['annotation']['contributor']){
        return term['annotation']['contributor'];
    }
    else if(term['annotation']['term editor']){
        return term['annotation']['term editor'];
    }
    else if(term['annotation']['creator']){
        return term['annotation']['creator'];
    }
    else{
        return "N/A";
    }
}



function hideTableColumn(e){
    let columnClassName = e.target.parentNode.parentNode.className
    let tableCells = document.getElementsByClassName(columnClassName);
    for(let cell of tableCells){
        cell.style.display = "none";
    }
    document.getElementById(columnClassName + '-show').style.display = "inline-block";
   
}



function showTableColumn(e){
    let columnClassName = "";
    if(e.target.tagName === "I"){
        columnClassName = e.target.parentNode.dataset.column;
        e.target.parentNode.style.display = "none";
    }
    else{
        columnClassName = e.target.dataset.column;
        e.target.style.display = "none";
    }
    
    let tableCells = document.getElementsByClassName(columnClassName);
    for(let cell of tableCells){
        cell.style.display = "";
    }    
   
}