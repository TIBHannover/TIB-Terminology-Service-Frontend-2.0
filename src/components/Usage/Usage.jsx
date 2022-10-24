import React from 'react'

class UsagePage extends React.Component{
    render(){
        return(
            <div className='row justify-content-center doc-design'>
                <div className='col-sm-8'>
                    <h2>NFDI4Ing Terminology Service Use Cases</h2>
                    <p className='justify'>
                        NFDI4Ing has specified a set of archetypes. The next use cases are describing the application of the 
                        Terminology Service as part of the NFDI4Ing work on the archetypes: 
                    </p>
                    <div id="usage-accordion-1">
                        <div class="card">
                            <div class="card-header" id="usage-heading-1">
                            <h5 class="mb-0">
                                <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-1" aria-expanded="true" aria-controls="usage-collapse-1">
                                   Archetype Golo
                                </button>
                            </h5>
                            </div>

                            <div id="usage-collapse-1" class="collapse show" aria-labelledby="usage-heading-1" data-parent="#usage-accordion-1">
                            <div class="card-body">
                                <p className='justify'>
                                    As an engineer at an OEM in the automotive industry, I collaborate with various suppliers that produces 
                                    headlights in accordance to my technical specifications. To communicate my need with these partners 
                                    I use an authoring tool that automatically produces a documentation including detailed technical information.
                                </p>
                                <p className='justify'>
                                    During a meeting with my suppliers I encountered that my partners are using a different terminology 
                                    in their test cases. While we use the term "luminous intensity" to measure the power emitted by a 
                                    light source in a particular direction per unit solid angle, my partners use the term "light intensity". 
                                    This small difference worsens the searchability in the documentation and complaints often arise 
                                    because of seemingly missing information. To decrease communication efforts and enhance a common 
                                    understanding I want to:
                                </p>
                                <ul>
                                    <li>identify related terms in my designated community and map them automatically</li>
                                    <li>improve the findability by suggesting similar terms during search in the documents</li>                                    
                                </ul>
                                <p className='justify'>
                                    <b>
                                        The Terminology Service will provide a mapping functionality that allows the assignment of 
                                        synonymous technical terms to each other. For this purpose, the service provides definitions 
                                        and synonyms of individual terms, which can be accessed within documentation software. 
                                        This enables clear communication in the designated community and enhance the interaction 
                                        with other stakeholders.
                                    </b>
                                </p>
                            </div>
                            </div>
                        </div>
                    </div> 
                    <br></br>                   
                    <p className='justify'>
                        The following use case descriptions are documenting potential usage of the Terminology Service outside 
                        the NFDI4Ing project context: 
                    </p>
                    
                </div>                
            </div>
        )
    }

}

export default UsagePage