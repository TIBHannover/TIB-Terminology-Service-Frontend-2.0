import { classMetaData, propertyMetaData, individualMetadata, skosTermMetaData } from './metadataParser';
import AlertBox from '../../../common/Alerts/Alerts';
import CopyLinkButton from '../../../common/CopyButton/CopyButton';
import { CopyLinkButtonMarkdownFormat } from '../../../common/CopyButton/CopyButton';
import Toolkit from '../../../../Libs/Toolkit';
import PropTypes from 'prop-types';
import { TermDetailTableComProp, TableMetadata } from '../types';
import { TsClass, TsIndividual, TsProperty, TsSkosTerm } from '../../../../concepts';


const TermDetailTable = (props: TermDetailTableComProp) => {
  /*
    This component is responsible for rendering the detail table of a term.
    It requires the ontologyPageContext to be available.
  */


  function setLabelAsLink() {
    if (!props.node) {
      return;
    }
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
    let metadataToRender: TableMetadata = {};
    if (props.node instanceof TsClass) {
      metadataToRender = classMetaData(props.node);
    } else if (props.node instanceof TsIndividual) {
      metadataToRender = individualMetadata(props.node);
    } else if (props.node instanceof TsProperty) {
      metadataToRender = propertyMetaData(props.node);
    } else if (props.node instanceof TsSkosTerm) {
      metadataToRender = skosTermMetaData(props.node);
    }

    let result = [];
    for (let key of Object.keys(metadataToRender)) {
      if (!metadataToRender[key].value) {
        continue;
      }

      let row = createRowInTable(key, metadataToRender[key].value, metadataToRender[key].isLink);
      result.push(row);
    }
    return result;
  }


  function createRowInTable(metadataLabel: string, metadataValue: any, isLink: boolean) {
    if (!props.node) {
      return [];
    }
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
                tooltipText={"This will copy the label of the term (in markdown format) and add the ontology id as a prefix to be able to link to this term within this terminology service, e.g. " + props.node.ontologyPreferredPrefix + ":" + props.node.label}
              />
            }
          </div>
        </div>
      </div>
    ];

    return row;
  }


  function formatText(metadataLabel: string, metadataValue: any, isLink: boolean = false) {
    if (!props.node) {
      return;
    }
    if (isLink) {
      return (<a href={metadataValue} target='_blank' rel="noreferrer">{metadataValue}</a>)
    } else if (["Type", "Imported From", "Also In", "Instances", "Instance of", "Domain", "Range", "Description"].includes(metadataLabel)) {
      return metadataValue;
    }

    return (<span dangerouslySetInnerHTML={{ __html: metadataValue }}></span>)
  }


  if (!props.node) {
    return <div className="is-loading-term-list isLoading-small"></div>;
  }

  const helmetText = props.node.label ? `${props.node.ontologyId}:${props.node.label}` : `${props.node.ontologyId}:${props.node.shortForm}`;

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