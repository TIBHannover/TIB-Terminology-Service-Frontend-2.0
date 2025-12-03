import { useEffect, useState, useContext } from "react";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import JumpTo from "../../common/JumpTo/JumpTo";
import AlertBox from "../../common/Alerts/Alerts";

export const RenderIndividualList = (props) => {

  const ontologyPageContext = useContext(OntologyPageContext);

  const [content, setContent] = useState("");


  function createIndividualList() {
    let result = [];
    let individuals = props.individuals;
    for (let indv of individuals) {
      result.push(
        <li className="list-node-li" key={indv['iri']}>
          <span className="tree-text-container stour-individual-list-node" data-iri={indv["iri"]} id={indv["iri"]}>
            {indv["label"]}
          </span>
        </li>
      );
    }
    if (result.length === 0 && props.isLoaded) {
      result.push(
        <AlertBox message="This ontology has no individual." type="warning" />
      );
    }
    setContent(result);
  }


  function createActionButtonSection() {
    return [
      typeof (props.iri) !== "undefined" && props.iri !== " " && props.individuals.length !== 0 &&
      <div className="row tree-action-button-holder">
        <div className="col-sm-12">
          <button className='btn btn-secondary btn-sm tree-action-btn stour-check-in-tree-individual'
            onClick={props.switchViewFunction}>
            {props.listView ? "Show In Tree" : ""}
          </button>
        </div>
      </div>

    ];
  }

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }

  function selectNodeOnLoad() {
    if (ontologyPageContext.isSkos && !props.listView) {
      return true;
    }
    let node = document.getElementById(props.iri);
    if (node) {
      node.classList.add('clicked');
      if (isInViewport(node)) {
        // don't scroll if the node is already in the viewport
        return true;
      }
      let position = node.offsetTop;
      // -40 due to the margin-top of the container that makes issue for the scroll
      document.getElementsByClassName('tree-page-left-part')[0].scrollTop = position - 180;
    }
  }

  useEffect(() => {
    createIndividualList();
  }, [props.individuals]);


  useEffect(() => {
    selectNodeOnLoad();
  }, [content, props.iri]);


  return (
    <>
      <div className="tree-action-area-container">
        <div className='row'>
          <div className="col-sm-12">
            <JumpTo
              targetType={props.componentIdentity}
              label={"Jump to"}
              handleJumtoSelection={props.handleJumtoSelection}
              obsoletes={false}
            />
          </div>
        </div>
        {!ontologyPageContext.isSkos &&
          <div className='row tree-action-button-area'>
            <div className="col-sm-12">
              {createActionButtonSection()}
            </div>
          </div>
        }
        <hr />
      </div>
      <div className="row">
        <div className="col-sm-12 individual-list-container">
          {!props.isLoaded && <div className="col-sm-12 isLoading"></div>}
          <div className="row">
            <div className="col-sm-12">
              <ul>
                {content}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
}