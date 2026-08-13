import {
  Component,
  isValidElement,
  ReactNode,
  useEffect,
  useContext,
  useRef,
  useState,
} from "react";
import { EntityInfoWidget } from "@ts4nfdi/terminology-service-suite";
import { QueryClient, QueryClientProvider } from "react-query";
import Modal from "react-bootstrap/Modal";
import {
  classMetaData,
  propertyMetaData,
  individualMetadata,
  skosTermMetaData,
} from "./metadataParser";
import AlertBox from "../../../common/Alerts/Alerts";
import CopyLinkButton from "../../../common/CopyButton/CopyButton";
import { CopyLinkButtonMarkdownFormat } from "../../../common/CopyButton/CopyButton";
import Toolkit from "../../../../Libs/Toolkit";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";
import { TermDetailTableComProp, TableMetadata } from "../types";
import {
  TsClass,
  TsIndividual,
  TsProperty,
  TsSkosTerm,
} from "../../../../concepts";

const entityInfoApi = "https://api.terminology.tib.eu/api/";
const entityInfoQueryClient = new QueryClient();

type MetadataInfoErrorBoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

class MetadataInfoErrorBoundary extends Component<MetadataInfoErrorBoundaryProps> {
  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.props.children;
  }
}

const TermDetailTable = (props: TermDetailTableComProp) => {
  /*
      This component is responsible for rendering the detail table of a term.
      It requires the ontologyPageContext to be available.
    */
  const ontologyPageContext = useContext(OntologyPageContext);

  function setLabelAsLink() {
    if (!props.node) {
      return;
    }
    let baseUrl =
      process.env.REACT_APP_PUBLIC_URL +
      "ontologies/" +
      encodeURIComponent(props.node.ontologyId);
    let targetHref =
      baseUrl + "/terms?iri=" + encodeURIComponent(props.node.iri);
    if (props.componentIdentity === "props") {
      targetHref = baseUrl + "/props?iri=" + encodeURIComponent(props.node.iri);
    } else if (props.componentIdentity === "individuals") {
      targetHref =
        baseUrl + "/individuals?iri=" + encodeURIComponent(props.node.iri);
    }
    return targetHref;
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

      let row = createRowInTable(
        key,
        metadataToRender[key].value,
        metadataToRender[key].isLink,
        metadataToRender[key].iri,
      );
      result.push(row);
    }
    return result;
  }

  function copyButtonRequired(metadataLabel: string, isLink: boolean): boolean {
    if (isLink && metadataLabel !== "Label") {
      return true;
    }
    if (metadataLabel === "CURIE" || metadataLabel === "Term ID") {
      return true;
    }
    return false;
  }

  function createRowInTable(
    metadataLabel: string,
    metadataValue: any,
    isLink: boolean,
    iri?: string,
  ) {
    if (!props.node) {
      return [];
    }
    let row = [
      <div className="col-sm-12 node-detail-table-row" key={metadataLabel}>
        <div className="row">
          <div className="col-4 col-md-3" key={metadataLabel + "-label"}>
            <div className="node-metadata-label">{metadataLabel}</div>
          </div>
          <div
            className="col-7 col-md-8 node-metadata-value"
            key={metadataLabel + "-value"}
          >
            {formatText(metadataLabel, metadataValue, isLink)}
            {copyButtonRequired(metadataLabel, isLink) && (
              <CopyLinkButton valueToCopy={metadataValue} />
            )}
            {metadataLabel === "Label" && (
              <CopyLinkButtonMarkdownFormat
                label={
                  props.node.ontologyId.toUpperCase() + ":" + props.node.label
                }
                url={setLabelAsLink()}
                tooltipText={
                  "This will copy the label of the term (in markdown format) and add the ontology id as a prefix to be able to link to this term within this terminology service, e.g. " +
                  props.node.ontologyPreferredPrefix +
                  ":" +
                  props.node.label
                }
              />
            )}
          </div>
          <div
            className="col-1 metadata-info-cell"
            key={metadataLabel + "-info"}
          >
            {iri && (
              <MetadataInfoButton
                iri={iri}
                label={metadataLabel}
                ontologyId={
                  ontologyPageContext.ontology.ontologyId ??
                  props.node.ontologyId
                }
              />
            )}
          </div>
        </div>
      </div>,
    ];

    return row;
  }

  function formatText(
    metadataLabel: string,
    metadataValue: any,
    isLink: boolean = false,
  ) {
    if (!props.node) {
      return;
    }
    if (isValidElement(metadataValue)) {
      return metadataValue;
    }
    if (isLink) {
      return (
        <a href={metadataValue} target="_blank" rel="noreferrer">
          {metadataValue}
        </a>
      );
    } else if (
      [
        "Type",
        "Imported From",
        "Also In",
        "Instances",
        "Instance of",
        "Domain",
        "Range",
        "Description",
        "in defining formula",
      ].includes(metadataLabel)
    ) {
      return metadataValue;
    } else if (Array.isArray(metadataValue)) {
      return Toolkit.renderDangerousHtml(
        metadataValue.join("<br/>"),
        {},
        "span",
      );
    }

    return Toolkit.renderDangerousHtml(metadataValue, {}, "span");
  }

  if (!props.node) {
    return <div className="is-loading-term-list isLoading-small"></div>;
  }

  const helmetText = props.node.label
    ? `${props.node.ontologyId}:${props.node.label}`
    : `${props.node.ontologyId}:${props.node.shortForm}`;

  return (
    <div>
      {Toolkit.createHelmet(helmetText)}
      {props.node.isObsolete && (
        <AlertBox
          type="danger"
          message="Attention: This term is deprecated!"
          alertColumnClass="col-sm-12"
        />
      )}
      {createTable()}
    </div>
  );
};

function MetadataInfoButton({
  iri,
  label,
  ontologyId,
}: {
  iri: string;
  label: string;
  ontologyId: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showIriFallback, setShowIriFallback] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const noop = () => {};
  const safeIriUrl = Toolkit.getSafeHttpUrl(iri);

  useEffect(() => {
    if (!showModal || !widgetRef.current) {
      setShowIriFallback(false);
      return;
    }

    const updateFallback = () => {
      setShowIriFallback(hasNoInformationMessage(widgetRef.current));
    };
    const observer = new MutationObserver(updateFallback);
    observer.observe(widgetRef.current, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    updateFallback();

    return () => {
      observer.disconnect();
    };
  }, [showModal]);

  return (
    <>
      <button
        type="button"
        className="metadata-info-button"
        aria-label={`Show ${label} metadata information`}
        title={`Show "${label}" metadata information`}
        onClick={() => setShowModal(true)}
      >
        <i className="bi bi-info-circle" aria-hidden="true"></i>
      </button>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        className="metadata-info-modal"
      >
        <Modal.Header>
          <Modal.Title>{label}</Modal.Title>
          <button
            type="button"
            className="metadata-info-close"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </Modal.Header>
        <Modal.Body>
          {showIriFallback ? (
            safeIriUrl ? (
              <a
                className="metadata-info-iri"
                href={safeIriUrl}
                target="_blank"
                rel="noreferrer"
              >
                {iri}
              </a>
            ) : (
              <span className="metadata-info-iri">{iri}</span>
            )
          ) : (
            <div ref={widgetRef}>
              <MetadataInfoErrorBoundary
                onError={() => setShowIriFallback(true)}
              >
                <QueryClientProvider client={entityInfoQueryClient}>
                  <EntityInfoWidget
                    api={entityInfoApi}
                    entityType="property"
                    hasTitle
                    iri={iri}
                    onNavigateToDisambiguate={noop}
                    onNavigateToEntity={noop}
                    onNavigateToOntology={noop}
                    ontologyId={ontologyId}
                    parameter=""
                    showBadges
                  />
                </QueryClientProvider>
              </MetadataInfoErrorBoundary>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

function hasNoInformationMessage(element: HTMLElement | null): boolean {
  return (
    element?.innerText
      .split("\n")
      .map((text) => text.trim().toLowerCase())
      .includes("no information available") ?? false
  );
}

export default TermDetailTable;
