import { useEffect, useState, useContext } from "react";
import { OntologyPageContext } from "../../../context/OntologyPageContext";

export const RenderIndividualList = (props) => {

  const ontologyPageContext = useContext(OntologyPageContext);

  const [content, setContent] = useState("");


  function createIndividualList() {
    let result = [];
    let individuals = props.individuals;
    for (let indv of individuals) {
      result.push(
        <li className="list-node-li">
          <span className="tree-text-container stour-individual-list-node" data-iri={indv["iri"]} id={indv["iri"]}>
            {indv["label"]}
          </span>
        </li>
      );
    }
    if (result.length === 0 && props.isLoaded) {
      result.push(
        <div className="alert alert-success">
          This ontology has no individual.
        </div>
      );
    }
    setContent(result);
  }



  function createActionButtonSection() {
    return [
      typeof (props.iri) !== "undefined" && props.iri !== " " && props.individuals.length !== 0 &&
      <div className="row tree-action-button-holder">
        <div className="col-sm-12">
          <button className='btn btn-secondary btn-sm tree-action-btn stour-check-in-tree-individual' onClick={props.switchViewFunction}>
            {props.listView ? "Show In Tree" : ""}
          </button>
        </div>
      </div>

    ];
  }


  function selectNodeOnLoad() {
    if (ontologyPageContext.isSkos && !props.listView) {
      return true;
    }
    let node = document.getElementById(props.iri);
    if (node) {
      node.classList.add('clicked');
      let position = document.getElementById(props.iri).offsetTop;
      document.getElementsByClassName('tree-page-left-part')[0].scrollTop = position;
    }
  }

  useEffect(() => {
    createIndividualList();
  }, [props.individuals]);

  useEffect(() => {
    let nodeContainers = document.getElementsByClassName("list-node-li");
    for (let li of nodeContainers) {
      li.style.marginBottom = '30px';
    }
    selectNodeOnLoad();
  }, [props.iri])


  return (
    <>
      <div className='row tree-action-button-area'>
        <div className="col-sm-12">
          {createActionButtonSection()}
        </div>
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