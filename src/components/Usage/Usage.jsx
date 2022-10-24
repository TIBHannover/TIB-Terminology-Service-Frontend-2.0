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
                    {/* accordion-1 start */}
                    <div id="usage-accordion-1">
                        <div class="card">
                            <div class="card-header" id="usage-heading-1">
                            <h5 class="mb-0">
                                <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-1" aria-expanded="false" aria-controls="usage-collapse-1">
                                   Archetype Golo
                                </button>
                            </h5>
                            </div>

                            <div id="usage-collapse-1" class="collapse" aria-labelledby="usage-heading-1" data-parent="#usage-accordion-1">
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
                    {/* accordion-1 end */} 
                    <br></br>                   
                    <p className='justify'>
                        The following use case descriptions are documenting potential usage of the Terminology Service outside 
                        the NFDI4Ing project context: 
                    </p>

                    {/* accordion-2 start */}
                    <div id="usage-accordion-2">
                        <div class="card">
                            <div class="card-header" id="usage-heading-2">
                            <h5 class="mb-0">
                                <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-2" aria-expanded="false" aria-controls="usage-collapse-2">
                                   Academic Researcher
                                </button>
                            </h5>
                            </div>

                            <div id="usage-collapse-2" class="collapse" aria-labelledby="usage-heading-2" data-parent="#usage-accordion-2">
                                <div class="card-body">
                                    <p className='justify'>
                                        As a researcher in the automotive testing domain, I conduct various complex experiments. 
                                        During one experiment I capture a video sequence of the driver's face and some fitness data 
                                        through a wrist band. In a next step I use this data as input to some configured analysis 
                                        software to automatically calculate the satisfaction of the driver with a new car feature.
                                    </p>
                                    <p className='justify'>
                                        As part of my academic career I wish to publish my experimental results in journals and conferences 
                                        to make my designated community (academic researchers in the automotive engineering domain) 
                                        aware of my work.
                                    </p>
                                    <ul>
                                        <li>During the writing process I want to make use as much as possibly of the commonly used terminology within my designated community to support the readability and unambiguity of my descriptions.</li>
                                        <li>As part of my publication activities the publisher asks me to enrich my textual publication submission with a rich set of descriptive metadata to support its findability in search and browsing applications.</li>
                                    </ul>
                                    <p className='justify'>                                    
                                            As I have chosen to publish my work in a high impact journal that guarantees later validation 
                                            of published research results (reproducibility) through their readers, I am as well asked 
                                            to make my captured data and the primary analysis results available in data repository.                                    
                                    </p>
                                    <ul>
                                        <li>As part of this additional publication I am asked to enrich my primary data files and analysis results with descriptive metadata to support its findability in search and browsing applications. To address reproducibility aspects I am as well asked to add unambiguous metadata of applied measures and metrics.</li>                                    
                                    </ul>
                                    <p className='justify'>
                                        To address the above three requirements I want to use a set of controlled vocabularies that are 
                                        well-accepted by the designated community. My advantages by using a commonly agreed terminology 
                                        are an assurance that I as the author and the reader of the publication have the same understanding 
                                        about the terminology applied in the work at hand. In addition I can expect an increased probability 
                                        that my publication is found by search- and browsing applications, because:
                                    </p>
                                    <ul>
                                        <li>the designated community is using the same search terms that I am using in my publication.</li>
                                        <li>related search terms could be easily identified through the structure of the controlled vocabulary.</li>
                                    </ul>
                                    <p className='justify'>
                                        <b> 
                                            The Terminology Service provides search and browsing functionalities to find the most recent 
                                            terminologies applied in designated communities. The Service will as well provide a set of 
                                            software adapters that could be integrated into the researchers local working environment. 
                                            These will allow automated information gathering from the Terminology Service to ease the 
                                            workload to use a consolidated vocabulary in the writing and annotation process.
                                        </b>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* accordion-2 end */} 
                    <br></br>
                    {/* accordion-3 start */}
                    <div id="usage-accordion-3">
                        <div class="card">
                            <div class="card-header" id="usage-heading-3">
                            <h5 class="mb-0">
                                <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-3" aria-expanded="false" aria-controls="usage-collapse-3">
                                    Product Manager/Head of Department
                                </button>
                            </h5>
                            </div>

                            <div id="usage-collapse-3" class="collapse" aria-labelledby="usage-heading-3" data-parent="#usage-accordion-3">
                                <div class="card-body">
                                    <p className='justify'>
                                        As a product manager/head of department in a company in the automotive testing domain, 
                                        I am responsible for different teams (designated community) that are working on various 
                                        complex experiments. During the experiments various kinds of data is first produced and 
                                        in a next step analysed. The workload to produce the data and the analysis is time consuming 
                                        and the runtime of the used aperatures costly. To optimise workload and to reduce data 
                                        production costs I want to foster unambiguous exchange of information across teams and 
                                        departments (designated community) by reusing of as much as possible of the data and 
                                        knowledge produced during the experiments. I therefore want to:
                                    </p>                                    
                                    <ul>
                                        <li>ensure a consistent and unambiguous use and understanding of applied terminology in team discussions and written reports through the use of a fixed set of controlled vocabularies.</li>
                                        <li>optimise the findability of produced datasets, besides primary and secondary research results I want to annotate these with a fixed set of unambiguous terms from a controlled vocabulary.</li>
                                    </ul>
                                    <p className='justify'>
                                        <b>
                                            The Terminology Service provides search and browsing functionalities to find the most recent 
                                            terminologies applied in designated communities. The Service will as well provide a set of 
                                            software adapters that could be integrated into the researchers local working environment. 
                                            These will allow automated information gathering from the Terminology Service to ease the 
                                            workload to use a consolidated vocabulary in the writing and annotation process.
                                        </b>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* accordion-3 end */} 
                    <br></br>
                    {/* accordion-4 start */}
                    <div id="usage-accordion-4">
                        <div class="card">
                            <div class="card-header" id="usage-heading-4">
                            <h5 class="mb-0">
                                <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-4" aria-expanded="false" aria-controls="usage-collapse-4">
                                    Knowledge Worker
                                </button>
                            </h5>
                            </div>

                            <div id="usage-collapse-4" class="collapse" aria-labelledby="usage-heading-4" data-parent="#usage-accordion-4">
                                <div class="card-body">
                                    <p className='justify'>
                                        As a knowledge worker, employed in the automotive industry my work is to gather and provide a 
                                        common understanding about used terms, their definition and interrelations applied in information 
                                        exchange (like writing reports or manage a discussion) of my designated community. In my work 
                                        I must consider that the vocabulary that I produce
                                    </p>                                    
                                    <ul>
                                        <li>Is domain specific (Engineering, Culture, Chemistry …) and community specific.</li>
                                        <li>Is evolving continuously and dynamically over time (relations between terms could change, terms or relations could be removed or added).</li>
                                        <li>must have a broad acceptance in the designated community and must be continuously maintained through the designated community to avoid the creation of isolated solutions that prevents the broad uptake of results.</li>
                                    </ul>
                                    <p className='justify'>
                                        <b>
                                            The Terminology Service is:
                                            <ul>
                                                <li>a single entry point to search for- and in vocabularies in the broad engineering field to find existing terminologies that I can reuse in my vocabularies.</li>
                                                <li>a tool to support the promotion of my vocabularies in my designated community and above</li>
                                                <li>Enhance visibility, because the Terminology Service is the entry point for the work with terminologies in the engineering field.</li>
                                                <li>Provision of trust metrics (a feature that will come). Like is a vocabulary maintained regularly? Where is the vocabulary actively used? … This will increase the confidence in my designated community to make use of my vocabulary.</li>
                                                <li>a tool to create mappings between vocabularies to overcome silo solutions (a feature that will come). Mappings between vocabularies are like cross references that makes explicit that a vocabulary A uses the same term as vocabulary B.</li>
                                                <li>a tool to search for similar vocabularies (a feature that will come). E.g. automatically find a set of vocabularies that have an overlap with my vocabularies. This will support the identification of existing ontologies as a starting when a knowledge worker starts to work on a new vocabulary or ease the process of finding existing vocabularies by a project manager/head of department to align the applied terminology.</li>
                                                <li>A tool that provides interfaces for automated information gathering from the Terminology Service for easy integration of the Terminology Service in the engineering working tasks/environment. E.g. through widgets (a feature that will come) that support metadata tagging for RDM during report writing. Widgets are small software pieces that could be integrated in web based applications to query the Terminology Server</li>
                                            </ul>
                                        </b>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* accordion-4 end */} 
                    <br></br>
                    <h3><b>Glossary</b></h3>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <p className='justify'>
                                <b>Designated Community:</b> An identified group of potential Consumers who should be able to understand a 
                                particular set of information. The Designated Community may be composed of multiple user communities. 
                                A Designated Community is defined by the Archive and this definition may change over time.
                            </p>
                            <a href='https://public.ccsds.org/pubs/650x0m2.pdf' target="_blank">https://public.ccsds.org/pubs/650x0m2.pdf</a>
                        </div>
                    </div>   
                    <br></br>
                    <h2>Best Practices</h2>
                    <h4><b>The Terminology Service in the AIMS project</b></h4>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <p className='justify'>
                                The research project “Applying Interoperable Metadata Standards (AIMS)” addresses the challenges of 
                                metadata management in engineering. AIMS focuses on the creation and sharing of metadata standards 
                                as so-called application profiles. An application profile is a set of requirements for subject 
                                and use-case specific metadata and represented in RDF and SHACL. The 
                                <a href='https://coscine.rwth-aachen.de/coscine/apps/aimsfrontend/#/' target={"_blank"}> AIMS Frontend</a> 
                                is developed as an 
                                <a href='https://git.rwth-aachen.de/coscine/frontend/apps/aimsfrontend' target={'_blank'}> Open Source Project </a> 
                                 and allows the creation of entirely new application profiles. 
                                Within the frontend, users can search and drag vocabulary terms into their application 
                                profile as properties and define options about them. It is to note, that these options are, 
                                however, prefilled according to the technical ability. Currently, the TIB Terminology Service 
                                is used to retrieve these vocabulary terms, by automatically querying its 
                                <a href='http://service.tib.eu/ts4tib/swagger-ui.html' target={'_blank'}> REST Interface </a>. 
                            </p>                            
                        </div>
                    </div>                    
                </div>                
            </div>
        )
    }

}

export default UsagePage