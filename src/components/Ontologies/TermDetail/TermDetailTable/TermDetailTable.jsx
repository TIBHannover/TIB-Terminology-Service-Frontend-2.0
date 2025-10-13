import { classMetaData, propertyMetaData } from './metadataParser';
import AlertBox from '../../../common/Alerts/Alerts';
import CopyLinkButton from '../../../common/CopyButton/CopyButton';
import { CopyLinkButtonMarkdownFormat } from '../../../common/CopyButton/CopyButton';
import Toolkit from '../../../../Libs/Toolkit';
import PropTypes from 'prop-types';


const TermDetailTable = (props) => {
  /*
    This component is responsible for rendering the detail table of a term.
    It requires the ontologyPageContext to be available.
  */


  function setLabelAsLink() {
    let baseUrl = process.env.REACT_APP_PUBLIC_URL + 'ontologies/' + encodeURIComponent(props.node.ontologyId);
    let targetHref = baseUrl + '/terms?iri=' + encodeURIComponent(props.node.iri);
    if (props.componentIdentity === 'props') {
      targetHref = baseUrl + '/props?iri=' + encodeURIComponent(props.node.iri);
    } else if (props.componentIdentity === 'individuals') {
      targetHref = baseUrl + '/individuals?iri=' + encodeURIComponent(props.node.iri);
    }
    return targetHref
  }


  function createTable() {
    let metadataToRender = "";
    if (props.componentIdentity === "terms") {
      metadataToRender = classMetaData(props.node, "class");
    } else if (props.componentIdentity === "individuals") {
      metadataToRender = classMetaData(props.node, "individual");
    } else {
      metadataToRender = propertyMetaData(props.node);
    }


    let result = [];
    for (let key of Object.keys(metadataToRender)) {
      if (!metadataToRender[key].value || typeof (metadataToRender[key].value) === "undefined" || metadataToRender[key].value === '') {
        continue;
      }

      let row = createRowInTable(key, metadataToRender[key].value, metadataToRender[key].isLink);
      result.push(row);
    }
    return result;
  }


  function createRowInTable(metadataLabel, metadataValue, isLink) {
    let row = [
      <div className="col-sm-12 node-detail-table-row" key={metadataLabel}>
        <div className='row'>
          <div className="col-sm-4 col-md-3" key={metadataLabel + "-label"}>
            <div className="node-metadata-label">{metadataLabel}</div>
          </div>
          <div className="col-sm-8 col-md-9 node-metadata-value" key={metadataLabel + "-value"}>
            {formatText(metadataLabel, metadataValue, isLink)}
            {isLink && metadataLabel !== "Label" && <CopyLinkButton valueToCopy={metadataValue} />}
            {metadataLabel === "Label" &&
              <CopyLinkButtonMarkdownFormat
                label={props.node.ontologyId.toUpperCase() + ":" + props.node.label}
                url={setLabelAsLink()}
                tooltipText={"This will copy the label of the term (in markdown format) and add the ontology id as a prefix to be able to link to this term within this terminology service, e.g. " + props.node.ontology_prefix + ":" + props.node.label}
              />
            }
          </div>
        </div>
      </div>
    ];

    return row;
  }


  function formatText(metadataLabel, metadataValue, isLink = false) {
    if (isLink) {
      return (<a href={metadataValue} target='_blank' rel="noreferrer">{metadataValue}</a>)
    } else if (["Used in axiom", "Equivalent to", "SubClass Of", "has curation status"].includes(metadataLabel)) {
      return (<span dangerouslySetInnerHTML={{ __html: metadataValue }}></span>)
    } else if (["Type", "Description", "Imported From", "Also In", "Instances", "Instance of", "Domain", "Range"].includes(metadataLabel)) {
      return metadataValue;
    }

    return (<span dangerouslySetInnerHTML={{ __html: metadataValue }}></span>)
  }


  if (!props.node.iri) {
    return <div className="is-loading-term-list isLoading-small"></div>;
  }

  const helmetText = props.node.label ? `${props.node.ontologyId}:${props.node.label}` : `${props.node.ontologyId}:${props.node.short_form}`;

  return (
    <div>
      {Toolkit.createHelmet(helmetText)}
      {props.node.isObsolete &&
        <AlertBox
          type="danger"
          message="Attention: This term is deprecated!"
          alertColumnClass="col-sm-12"
        />
      }
      {createTable()}
    </div>
  )
}


TermDetailTable.propTypes = {
  iri: PropTypes.string.isRequired,
  componentIdentity: PropTypes.string.isRequired,
  extractKey: PropTypes.string.isRequired,
  isIndividual: PropTypes.bool.isRequired,
  node: PropTypes.object.isRequired
}


export default TermDetailTable;