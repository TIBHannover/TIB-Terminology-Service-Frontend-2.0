

class OntologyLib{

    static formatCreators(creators) {        
        let value = []
        for (let i = 0; i < creators.length; i++) {
          value.push(creators[i])
        }        
        return value.join(',\n');
    }


    static formatSubject(config){        
        if(config.classifications[1] !== undefined){            
            let value = []
            let subjectList = config.classifications[1].subject ? config.classifications[1].subject : config.classifications[1].Subject;
            for(let i=0; i< subjectList.length; i++){
                value.push(subjectList[i])
            }            
            return value.join(',\n')
        }    
        return "";      
    }





}

export default OntologyLib;