export function createClassListTableHeader(){
    return [
        <thead>
            <tr>                
                <th scope="col">Label</th>
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