import { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom'
import { olsSearch } from '../../../api/search';
import Facet from '../Facet/facet';
import Pagination from "../../common/Pagination/Pagination";
import { setResultTitleAndLabel } from './SearchHelpers';
import TermLib from '../../../Libs/TermLib';
import Toolkit from '../../../Libs/Toolkit';
import DropDown from '../../common/DropDown/DropDown';
import SearchLib from '../../../Libs/searchLib';
import { fetchAllCollectionWithOntologyList, getCollectionsAndThierOntologies } from '../../../api/collection';
import '../../layout/searchResult.css';
import '../../layout/facet.css';
import SearchUrlFactory from '../../../UrlFactory/SearchUrlFactory';
import CommonUrlFactory from '../../../UrlFactory/CommonUrlFactory';
import * as SiteUrlParamNames from '../../../UrlFactory/UrlParamNames';
import { AppContext } from '../../../context/AppContext';
import { useQuery } from '@tanstack/react-query';
import CopyLinkButton from '../../common/CopyButton/CopyButton';




const SearchResult = (props) => {

  /*
    This component is responsible for rendering the search results and facet.
  */

  const appContext = useContext(AppContext);

  const location = useLocation();

  const searchUrlFactory = new SearchUrlFactory();
  const commonUrlFactory = new CommonUrlFactory();

  let language = commonUrlFactory.getParam({ name: SiteUrlParamNames.Lang }) || Toolkit.getVarInLocalSrorageIfExist('language', false) || "en";

  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE = 10;

  const [searchResult, setSearchResult] = useState([]);
  const [selectedOntologies, setSelectedOntologies] = useState(SearchLib.getFilterAndAdvancedOntologyIdsFromUrl());
  const [selectedTypes, setSelectedTypes] = useState(searchUrlFactory.types);
  const [selectedCollections, setSelectedCollections] = useState(searchUrlFactory.collections);
  const [facetFields, setFacetFields] = useState([]);
  const [pageNumber, setPageNumber] = useState(parseInt(searchUrlFactory.page ? searchUrlFactory.page : DEFAULT_PAGE_NUMBER));
  const [pageSize, setPageSize] = useState(parseInt(searchUrlFactory.size ? searchUrlFactory.size : DEFAULT_PAGE_SIZE));
  const [expandedResults, setExpandedResults] = useState([]);
  const [totalResultsCount, setTotalResultsCount] = useState([]);
  const [filterTags, setFilterTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(language);


  const PAGE_SIZES_FOR_DROPDOWN = [{ label: "10", value: 10 }, { label: "20", value: 20 }, { label: "30", value: 30 }, { label: "40", value: 40 }];
  const searchQuery = searchUrlFactory.searchQuery ? searchUrlFactory.searchQuery : "";
  const exact = searchUrlFactory.exact === "true" ? true : false;
  const searchUnderIris = SearchLib.decodeSearchUnderIrisFromUrl();
  const searchUnderAllIris = SearchLib.decodeSearchUnderAllIrisFromUrl();


  let collectionIdsAndOntologies = [];
  const collectionsWithOntologiesQuery = useQuery({
    queryKey: ['allCollectionsWithTheirOntologies'],
    queryFn: getCollectionsAndThierOntologies
  });

  if (process.env.REACT_APP_PROJECT_ID === "general" && collectionsWithOntologiesQuery.data) {
    collectionIdsAndOntologies = collectionsWithOntologiesQuery.data;
  }
  const allCollectionIds = collectionIdsAndOntologies;



  async function search() {

    let ontologies = [...selectedOntologies];

    if (appContext.userSettings.userCollectionEnabled && ontologies.length === 0) {
      ontologies = [...appContext.userSettings.activeCollection.ontology_ids];
    }

    try {
      let obsoletes = Toolkit.getObsoleteFlagValue();
      let searchParams = {
        searchQuery: searchQuery,
        page: pageNumber,
        size: pageSize,
        selectedOntologies: ontologies,
        selectedTypes: selectedTypes,
        selectedCollections: selectedCollections,
        obsoletes: obsoletes,
        exact: exact,
        searchInValues: searchUrlFactory.searchIn,
        searchUnderIris: searchUnderIris,
        searchUnderAllIris: searchUnderAllIris,
      };

      let result = await olsSearch(searchParams);

      // This part is for updating the facet counts. 
      // First we search only with selected ontologies to set types counts and then search with selected types to set ontologies counts.          
      searchParams.selectedTypes = [];
      let searchResultForFacetCount = await olsSearch(searchParams);
      result['facet_counts']['facet_fields']['type'] = searchResultForFacetCount['facet_counts']['facet_fields']['type'];
      searchParams.selectedTypes = selectedTypes;
      searchParams.selectedOntologies = [];
      searchResultForFacetCount = await olsSearch(searchParams);
      result['facet_counts']['facet_fields']['ontologyId'] = searchResultForFacetCount['facet_counts']['facet_fields']['ontologyId'];

      setSearchResult(result['response']['docs']);
      setTotalResultsCount(result['response']['numFound']);
      setFacetFields(result['facet_counts']);
      setExpandedResults(result['expanded'])
      setLoading(false);
    }
    catch (e) {
      setSearchResult([]);
      setTotalResultsCount(0);
      setFacetFields([]);
      setExpandedResults([]);
      setLoading(false);
    }
  }



  function alsoInResult(iri) {
    let otherOntologies = [];
    if (expandedResults && expandedResults[iri]) {
      let allTags = expandedResults[iri]['docs'];
      for (let term of allTags) {
        otherOntologies.push(
          <div className='also-in-ontologies'>
            {TermLib.createOntologyTagWithTermURL(term['ontology_name'], term['iri'], term['type'])}
          </div>
        );
      }
    }
    return otherOntologies;
  }



  function createSearchResultList() {
    let searchResultList = [];
    for (let i = 0; i < searchResult.length; i++) {
      let alsoInList = alsoInResult(searchResult[i].iri);
      searchResultList.push(
        <div className="row result-card" key={searchResult[i]['id']}>
          <div className='col-sm-10'>
            {setResultTitleAndLabel(searchResult[i], Toolkit.getObsoleteFlagValue())}
            <div className="searchresult-iri">
              {searchResult[i].iri}
              <CopyLinkButton valueToCopy={searchResult[i].iri}></CopyLinkButton>
            </div>
            <div className="searchresult-card-description">
              <p>{searchResult[i].description}</p>
            </div>
            <div className="searchresult-ontology">
              <span><b>Ontology: </b></span>
              <Link className='btn btn-default ontology-button' to={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + searchResult[i]['ontology_name']} target="_blank">
                {searchResult[i].ontology_name}
              </Link>
            </div>
            <br />
            {alsoInList.length !== 0 &&
              <div className="also-in-design">
                <b>Also in:</b> {alsoInList}
              </div>
            }

          </div>
        </div>
      );
    }
    return searchResultList;
  }



  function handlePageSizeDropDownChange(e) {
    let size = parseInt(e.target.value);
    setPageSize(size);
    commonUrlFactory.setParam({ name: SiteUrlParamNames.Size, value: size });
  }



  function handlePagination(value) {
    setPageNumber(value);
    commonUrlFactory.setParam({ name: SiteUrlParamNames.Page, value: value });
  }



  function pageCount() {
    if (isNaN(Math.ceil(totalResultsCount / pageSize))) {
      return 0;
    }
    return (Math.ceil(totalResultsCount / pageSize))
  }



  function handleTypeFacetSelection(e) {
    let targetType = e.target.value;
    let selectedTypeList = [...selectedTypes];
    if (e.target.checked) {
      searchUrlFactory.updateUrlForFacetSelection({ fieldNameInUrl: SiteUrlParamNames.TermType, action: "add", value: targetType });
      selectedTypeList.push(targetType);
    }
    else {
      let index = selectedTypeList.indexOf(targetType);
      selectedTypeList.splice(index, 1);
      searchUrlFactory.updateUrlForFacetSelection({ fieldNameInUrl: SiteUrlParamNames.TermType, action: "remove", value: targetType });
    }

    setSelectedTypes(selectedTypeList);
    setPageNumber(1);
  }



  function handleOntologyFacetSelection(e) {
    let selectedOntologiesList = [...selectedOntologies];
    let targetOntologyId = e.target.value.toLowerCase();
    if (e.target.checked) {
      searchUrlFactory.updateUrlForFacetSelection({ fieldNameInUrl: SiteUrlParamNames.Ontology, action: "add", value: targetOntologyId });
      selectedOntologiesList.push(targetOntologyId);
    }
    else {
      let index = selectedOntologiesList.indexOf(targetOntologyId);
      selectedOntologiesList.splice(index, 1);
      searchUrlFactory.updateUrlForFacetSelection({ fieldNameInUrl: SiteUrlParamNames.Ontology, action: "remove", value: targetOntologyId });
    }

    setSelectedOntologies(selectedOntologiesList);
    setPageNumber(1);
  }



  function handleCollectionFacetSelection(e) {
    let selectedCollectionsList = [...selectedCollections];
    let targetCollection = e.target.value.trim();
    if (e.target.checked) {
      selectedCollectionsList.push(targetCollection);
      searchUrlFactory.updateUrlForFacetSelection({ fieldNameInUrl: SiteUrlParamNames.Collection, action: "add", value: targetCollection });
    }
    else {
      let index = selectedCollectionsList.indexOf(targetCollection);
      selectedCollectionsList.splice(index, 1);
      searchUrlFactory.updateUrlForFacetSelection({ fieldNameInUrl: SiteUrlParamNames.Collection, action: "remove", value: targetCollection });
    }

    setSelectedCollections(selectedCollectionsList);
    setPageNumber(1);
  }



  function clearFilters() {
    let allFacetCheckBoxes = document.getElementsByClassName('search-facet-checkbox');
    for (let checkbox of allFacetCheckBoxes) {
      if (checkbox.dataset.ischecked !== "true") {
        document.getElementById(checkbox.id).checked = false;
      }
      delete checkbox.dataset.ischecked;
    }
    searchUrlFactory.clearFacetUrlParams();
    setSelectedTypes([]);
    setSelectedOntologies([]);
    setSelectedCollections([]);
    setPageNumber(1);
    setPageSize(10);
    setFilterTags("");
    localStorage.setItem('language', "en");
    commonUrlFactory.deleteParam({ name: 'lang' });
    setLang("en");
  }


  function handleRemoveTagClick(e) {
    try {
      let tagType = e.target.dataset.type;
      let tagValue = e.target.dataset.value;
      e.target.checked = false;
      e.target.value = tagValue;
      if (document.getElementById('search-checkbox-' + tagValue)) {
        document.getElementById('search-checkbox-' + tagValue).checked = false;
      }
      if (tagType === "type") {
        handleTypeFacetSelection(e);
      }
      else if (tagType === "ontology") {
        handleOntologyFacetSelection(e);
      }
      else if (tagType === "collection") {
        handleCollectionFacetSelection(e);
      }
      localStorage.setItem('language', "en");
      commonUrlFactory.deleteParam({ name: 'lang' });
      setLang("en");
    }
    catch (e) {
      // console.info(e);
    }
  }



  function createFilterTags() {
    let tagsList = [];
    for (let type of selectedTypes) {
      let newTag = <div className='search-filter-tags' key={type}>{type} <i onClick={handleRemoveTagClick} data-type={"type"} data-value={type} className="fa fa-close remove-tag-icon"></i></div>;
      tagsList.push(newTag);
    }
    for (let ontologyId of selectedOntologies) {
      let newTag = <div className='search-filter-tags' key={ontologyId}>{ontologyId} <i onClick={handleRemoveTagClick} data-type={"ontology"} data-value={ontologyId} className="fa fa-close remove-tag-icon"></i></div>;
      tagsList.push(newTag);
    }
    for (let collection of selectedCollections) {
      let newTag = <div className='search-filter-tags' key={collection}>{collection} <i onClick={handleRemoveTagClick} data-type={"collection"} data-value={collection} className="fa fa-close remove-tag-icon"></i></div>;
      tagsList.push(newTag);
    }
    setFilterTags(tagsList);
  }


  useEffect(() => {
    search();
  }, []);


  useEffect(() => {
    setLoading(true);
    setSearchResult([]);
    search();
    createFilterTags();
  }, [pageNumber, pageSize, selectedOntologies, selectedTypes, selectedCollections, lang, location.search]);



  return (
    <div className='row justify-content-center search-result-container' id="searchterm-wrapper">
      {Toolkit.createHelmet(searchQuery)}
      <div className='col-sm-11'>
        <div className='row'>
          <div className='col-sm-4'>
            {searchResult.length > 0 && !loading &&
              <Facet
                facetData={facetFields}
                handleChange={search}
                selectedCollections={selectedCollections}
                selectedOntologies={selectedOntologies}
                selectedTypes={selectedTypes}
                allCollections={allCollectionIds}
                handleOntologyCheckBoxClick={handleOntologyFacetSelection}
                handleTypesCheckBoxClick={handleTypeFacetSelection}
                handleCollectionsCheckboxClick={handleCollectionFacetSelection}
                clearFacet={clearFilters}
              />
            }
          </div>
          <div className='col-sm-8' id="search-list-grid">
            {searchResult.length > 0 && <h3 className="text-dark">{`${totalResultsCount} results found for "${searchQuery}"`}</h3>}
            <div>{filterTags}</div>
            <div className='row'>
              <div className='col-sm-8 text-right zero-padding-col'>
                <DropDown
                  options={Toolkit.listOfSiteLangs()}
                  dropDownId="lang-list"
                  dropDownTitle="Language"
                  dropdownClassName={"white-dropdown"}
                  dropDownValue={lang}
                  defaultVaue={lang}
                  dropDownChangeHandler={(e) => {
                    localStorage.setItem('language', e.target.value);
                    commonUrlFactory.setParam({ name: 'lang', value: e.target.value });
                    setLang(e.target.value);
                  }}
                />
              </div>
              <div className='col-sm-4 text-right zero-padding-col'>
                <DropDown
                  options={PAGE_SIZES_FOR_DROPDOWN}
                  dropDownId="list-result-per-page"
                  dropDownTitle="Result Per Page"
                  dropdownClassName={"white-dropdown"}
                  dropDownValue={pageSize}
                  dropDownChangeHandler={handlePageSizeDropDownChange}
                />
              </div>
            </div>

            {searchResult.length > 0 && createSearchResultList()}
            {searchResult.length > 0 &&
              <Pagination
                clickHandler={handlePagination}
                count={pageCount()}
                initialPageNumber={pageNumber}
              />
            }
            {!loading && searchResult.length === 0 && <h3 className="text-dark">{'No search results for "' + searchQuery + '"'}</h3>}
          </div>
        </div>
        <div className='row text-center'>
          {loading && <div className="is-loading-term-list isLoading"></div>}
        </div>
      </div>
    </div>
  );

}

export default SearchResult;