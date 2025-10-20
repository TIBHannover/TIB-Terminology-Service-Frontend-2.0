import { Link } from 'react-router-dom';
import TermLib from '../../../Libs/TermLib';
import TsTerm from '../../../concepts/term';


export function setResultTitleAndLabel(resultItem: TsTerm, obsoletes: boolean) {
    let content = [];
    let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontologyId']);
    let termType = TermLib.getTermType(resultItem);
    if (termType === 'class') {
        targetHref += '/terms?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    }
    else if (['property', 'dataProperty', 'objectProperty', 'annotationProperty'].includes(termType)) {
        targetHref += '/props?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    }
    else if (termType === 'individual') {
        targetHref += '/individuals?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    }

    content.push(
        <div className="search-card-title">
            <Link to={targetHref} className="search-result-title">
                [{termType}] <h4>{TermLib.extractLabel(resultItem)}</h4>
            </Link>
            <Link className="btn btn-default term-button" to={targetHref} >
                {resultItem.shortForm}
            </Link>
        </div>
    );

    return content;
}

