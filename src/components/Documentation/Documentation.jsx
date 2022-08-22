import React from 'react'
import '../layout/documentation.css'

class Documentation extends React.Component{
    render(){
        return(
            <div className='doc-design'>
                <h1 className="text-dark">Documentation</h1>
                <p>This service offers an intuitive search functionality which is based on a SOLR search index on identifiers and terms. TIB Terminology Service can be used both manually and programmatically. Manual access (User Interface) appeals to a larger audience whereas programmatical access (REST Interface) can play a key role in larger contexts. For this reason, they are both essential features of the service. </p>
                <br/>
                <h3 className="text-dark">User Interface Specification of TIB Terminology Service</h3>
                <p>There are two main ways of browsing the Terminology Service . You can either browse the available ontologies via the Ontologies tab or you can make search on all available ontologies by using the search box in the main page. If you browse the available ontologies, you should pick an ontology from the list and then you can browse through its tree view to lower levels or you can make a search for a specific term in that particular ontology through its search box. Alternatively, if you make a search from the search box provided in the home page, the results will be displayed based on all ontologies that include the searched term. By using advanced search options, results can be filtered by entity type or ontology. The entity types used for filtering are class, property, individual or ontology respectively. As a result, your search leads you to the graph based view of a term regardless of your browsing methodology. RDF serializations of the latest ontology version are offered as downloads through the service. </p>
                <br/>
                <h3 className="text-dark">REST Interface for TIB Terminology Service</h3>
                <p>The service also offers an API that allows to retrieve information on terms and their relations as json data for use in other webservices, e.g. in services of the research data management infrastructure of various research communities. In applications like research data management systems, ontological terms and their unique identifiers can, for example, be used as metadata on research data artifacts - thereby making research (meta)data more findable and interoperable. The REST API interface of the TIB Central Terminology Service starts with http://service.tib.eu/ts4tib/api. This API enables to query all the terminologies of various research communities maintained by TIB. The methodology on how to use this interface is explained in the <a href="https://service.tib.eu/ts4tib/swagger-ui.html">Swagger Documentation</a> in detail. The underlying models can also be viewed through this documentation for a deeper understanding of the API commands. Besides, it is possible to execute the publicly available API commands from the <a href="https://service.tib.eu/ts4tib/swagger-ui.html">Swagger Documentation</a></p>
                <br/>
                <h3 className="text-dark">Report an Issue</h3>
                <p>For feedback, enquiries or suggestion about TIB TS or to request a new ontology please use our GitLab issue tracker. For more information, you can contact TIB.</p>

            </div>
        )
    }
}

export default Documentation