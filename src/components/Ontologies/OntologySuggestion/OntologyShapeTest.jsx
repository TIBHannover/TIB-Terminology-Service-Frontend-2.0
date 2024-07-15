


const OntologyShapeTest = ({ purl }) => {


    async function runTest() {
        let url = "https://www.itb.ec.europa.eu/shacl/shacl/api/validate";
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
        let body = {
            "contentToValidate": purl,
            "contentSyntax": "application/rdf+xml",
            "embeddingMethod": "URL",
            "validationType": "extended",
            "reportSyntax": "application/ld+json",
            "externalRules": [
            {
                "ruleSet": "https://www.purl.org/ontologymetadata/shape/20240502",
                "embeddingMethod": "URL",
                "ruleSyntax": "text/turtle"
            }
            ],
            "addInputToReport": false,
            "addShapesToReport": false,
            "addRdfReportToReport": false,
            "rdfReportSyntax": "string",
            "wrapReportDataInCDATA": false
        }

        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error("Error: ", response.status);
            return;
        }
        let data = await response.json();
        console.log(data);
    }

    return (
        <div>
            <button onClick={runTest}>Run Test</button>
        </div>
    );

}

export default OntologyShapeTest;