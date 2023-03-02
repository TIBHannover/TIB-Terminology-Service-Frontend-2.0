import React from 'react'

class InfoAnnotations extends React.Component{
    constructor(props){
        super(props);
        this.setState = ({

        })
        this.createTable = this.createTable.bind(this);
    }

    createTable(){
        let ontology = this.props.ontology;
        let entries = Object.entries(ontology.config.annotations);
        let listItems = entries.map(([key, value]) => (
              <li>
                {key}: {value}
              </li>
        ));
        return <ul>{listItems}</ul>;
      };

    componentDidMount(){
        this.createTable();
    }

    componentDidUpdate(){
        this.createTable();
    }


    render(){
        return(
            <div>
                <ul>
                    <li>{this.createTable()}</li>
                </ul>

            </div>
        )
    }

}

export default InfoAnnotations