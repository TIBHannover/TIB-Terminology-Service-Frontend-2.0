import { Link } from 'react-router-dom';


export function setResultTitleAndLabel(resultItem, obsoletes) {
    let content = [];
    let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']);
    if (resultItem["type"] === 'class') {
        targetHref += '/terms?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    }
    else if (['property', 'dataProperty', 'objectProperty', 'annotationProperty'].includes(resultItem["type"])) {
        targetHref += '/props?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    }
    else if (resultItem["type"] === 'individual') {
        targetHref += '/individuals?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    }

    content.push(
        <div className="search-card-title">
            <Link to={targetHref} className="search-result-title">
                [{resultItem.type}] <h4>{resultItem.label}</h4>
            </Link>
            <Link className="btn btn-default term-button" to={targetHref} >
                {resultItem.short_form}
            </Link>
        </div>
    );

    return content;
}

