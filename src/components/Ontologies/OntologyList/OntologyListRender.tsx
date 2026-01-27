import { useEffect, useState } from "react";
import Pagination from "../../common/Pagination/Pagination";
import DropDown from "../../common/DropDown/DropDown";
import { Link } from 'react-router-dom';
import { TsOntology } from "../../../concepts";


const TITLE_SORT_KEY = "title";
const CLASS_SORT_KEY = "numberOfClasses";
const PROPERT_SORT_KEY = "numberOfProperties";
const INDIVIDUAL_SORT_KEY = "numberOfIndividuals";
const PREFIX_SORT_KEY = "ontologyId";
const TIME_SORT_KEY = "loaded"
const PAGE_SIZES_FOR_DROPDOWN = [{ label: "10", value: 10 }, { label: "20", value: 20 }, {
  label: "30",
  value: 30
}, { label: "40", value: 40 }];
const SORT_DROPDONW_OPTIONS = [
  { label: "Title", value: TITLE_SORT_KEY },
  { label: "Prefix", value: PREFIX_SORT_KEY },
  { label: "Classes Count", value: CLASS_SORT_KEY },
  { label: "Properties Count", value: PROPERT_SORT_KEY },
  { label: "Individuals Count", value: INDIVIDUAL_SORT_KEY },
  { label: "Date Loaded", value: TIME_SORT_KEY },
];

type CmpProps = {
  handlePagination: (value: string) => void;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  handlePageSizeDropDownChange: (e: React.MouseEvent<HTMLLIElement>) => void;
  sortField: string;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  ontologies: TsOntology[];
  ontologiesHiddenStatus: boolean[];
  isLoaded: boolean;
  filterTags: JSX.Element[];
};


export const OntologyListRender = (props: CmpProps) => {

  const [ontologyListContent, setOntologyListContent] = useState<JSX.Element[]>([]);

  function BuildCollectionForCard(collections: string[]) {
    if (!collections) {
      return "";
    }
    let result = [];
    for (let i = 0; i < collections.length; i++) {
      if (i !== collections.length - 1) {
        result.push(<span className='ontology-collection-name'><Link
          to={process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' + collections[i]}>{collections[i]}</Link></span>)
        result.push(",")
      } else {
        result.push(<span className='ontology-collection-name'><Link
          to={process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' + collections[i]}>{collections[i]}</Link></span>)
      }

    }
    return result;
  }


  function buildOntologyCard(item: TsOntology, identifier: number) {
    return (
      <div className="row result-card stour-ontology-card-in-list" id={'ontology_' + identifier} key={item.ontologyId}>
        <div className='col-sm-9'>
          <div className="ontology-card-title-section">
            <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + item.ontologyId}
              className='ontology-button btn btn-secondary stour-onto-id'>{item.ontologyId}</Link>
            <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + item.ontologyId}
              className="ontology-title-text-in-box stour-onto-name"><b>{item.title}</b></Link>
          </div>
          <div className="ontology-card-description stour-onto-description">
            <p className="trunc-text">{item.description.substring(0, 100) + " ... "}</p>
            <a className="read-more-btn" data-value={item.description}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                let fullDescp = e.currentTarget.getAttribute("data-value") ?? "";
                let p = e.currentTarget.previousElementSibling;
                if (!p) {
                  return
                }
                if (e.currentTarget.textContent === "[Read more]") {
                  p.textContent = fullDescp;
                  e.currentTarget.textContent = "[Read less]"
                } else {
                  p.textContent = fullDescp.substring(0, 100) + " ... ";
                  e.currentTarget.textContent = "[Read more]"
                }
              }}
            >
              [Read more]</a>
          </div>
          {process.env.REACT_APP_PROJECT_ID === "general" &&
            <div className='ontology-card-collection-name stour-onto-collection-list'>
              <b>Collections:</b>
              {BuildCollectionForCard(item.collections)}
            </div>}
        </div>
        <div className="col-sm-3 ontology-card-meta-data">
          <span className='ontology-meta-data-field-span stour-onto-class-count'>{item.numberOfClasses} Classes</span>
          <hr />
          <span
            className='ontology-meta-data-field-span stour-onto-props-count'>{item.numberOfProperties} Properties</span>
          <hr />
          <span
            className='ontology-meta-data-field-span stour-onto-loaded-time'>Loaded: {item.loaded ? item.loaded.split("T")[0] : "N/A"}</span>
        </div>
      </div>

    );
  }


  function createOntologyList() {
    let ontologyList: JSX.Element[] = []
    for (let i = 0; i < props.ontologies.length; i++) {
      let item = props.ontologies[i]
      ontologyList.push(props.ontologiesHiddenStatus[i] ? buildOntologyCard(item, i) : <div></div>)
    }
    setOntologyListContent(ontologyList);
  }


  useEffect(() => {
    createOntologyList();
  }, [props.ontologies, props.ontologiesHiddenStatus]);


  return (
    <div className='row'>
      <div className='col-sm-12'>
        <div className='row'>
          <div className='col-sm-6'>
            <h3 className='h-headers stour-onto-list-browse'>Browse Ontologies ({props.ontologies.length})</h3>
          </div>
        </div>
        {process.env.REACT_APP_ONTOLOGY_SUGGESTION === "true" &&
          <>
            <div className='row'>
              <div className='col-sm-12'>
                Not able to find what you are looking for? You can
                <Link className="btn btn-sm btn-secondary ms-2 pt-0 pb-0 ps-1 pe-1 me-2 stour-onto-list-suggest-onto"
                  to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologysuggestion"}>suggest</Link>
                your ontology to be added to the list.
              </div>
            </div>
            <br></br>
          </>
        }
        <div className='row mb-4'>
          <div className='col-sm-12'>
            {props.filterTags}
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-6 text-right zero-padding-col'>
            <DropDown
              options={PAGE_SIZES_FOR_DROPDOWN}
              dropDownId="list-result-per-page"
              dropDownTitle="page size"
              dropDownValue={props.pageSize}
              dropDownChangeHandler={props.handlePageSizeDropDownChange}
              dropdownClassName={"white-dropdown"}
            />
          </div>
          <div className='col-sm-6 text-end zero-padding-col stour-onto-list-sort'>
            <DropDown
              options={SORT_DROPDONW_OPTIONS}
              dropDownId="ontology-list-sorting"
              dropDownTitle="sorted by"
              dropDownValue={props.sortField}
              dropDownChangeHandler={props.handleSortChange}
              dropdownClassName={"white-dropdown"}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            {ontologyListContent}
          </div>
        </div>
        <Pagination
          clickHandler={props.handlePagination}
          count={props.pageCount}
          initialPageNumber={props.pageNumber}
        />
      </div>
    </div>
  );
}