export function createClassListTableHeader(){
    return [
        <thead>
            <tr>                
                <th scope="col" className="label-col">Label <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col">ID</th>
                <th scope="col">Description</th>
                <th scope="col">Alternative Term</th>
                <th scope="col">SubClass Of</th>
                <th scope="col">Equivalent to</th>
                <th scope="col">Example of usage</th>
                <th scope="col">See Also</th>
                <th scope="col">Contributor</th>
                <th scope="col">Comment</th>                
            </tr>
        </thead>
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


function hideTableColumn(){
    let tableCells = document.getElementsByClassName('label-col');
    for(let cell of tableCells){
        cell.style.visibility = "hidden";
    }
}