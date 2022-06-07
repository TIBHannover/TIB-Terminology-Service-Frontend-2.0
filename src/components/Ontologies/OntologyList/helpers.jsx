import React from 'react';


export function BuildCollectionForCard(collections){
    let result = [];
    for(let i=0; i < collections.length; i++){
        if (i !== collections.length - 1){
            result.push(<span className='ontology-collection-name'><a href="#">{collections[i]}</a></span>)
            result.push(",")
        }
        else{
            result.push(<span className='ontology-collection-name'><a href="#">{collections[i]}</a></span>)
        }
        
    }

    return result;
}
