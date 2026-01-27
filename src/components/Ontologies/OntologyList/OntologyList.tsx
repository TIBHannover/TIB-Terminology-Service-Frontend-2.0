import { useState, useEffect, useContext } from 'react';
import '../../layout/facet.css';
import '../../layout/ontologyList.css';
import { getCollectionStatFromOntoList, getSubjectStatFromOntoList } from '../../../api/collection';
import OntologyApi from '../../../api/ontology';
import { OntologyListRender } from './OntologyListRender';
import { OntologyListFacet } from './OntologyListFacet';
import Toolkit from '../../../Libs/Toolkit';
import OntologyListUrlFactory from '../../../UrlFactory/OntologyListUrlFactory';
import { AppContext } from '../../../context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { TsOntology } from '../../../concepts';



const TITLE_SORT_KEY = "title";



const OntologyList = () => {

  /* 
    This component is responsible for rendering the list of ontologies.
  */

  const appContext = useContext(AppContext);

  const [error, setError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ontologies, setOntologies] = useState<TsOntology[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ontologiesHiddenStatus, setOntologiesHiddenStatus] = useState<boolean[]>([]);
  const [unFilteredOntologies, setUnFilteredOntologies] = useState<TsOntology[]>([]);
  const [sortField, setSortField] = useState(TITLE_SORT_KEY);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [keywordFilterString, setKeywordFilterString] = useState("");
  const [exclusiveCollections, setExclusiveCollections] = useState(false);

  localStorage.setItem('language', "en");

  const ontologyApi = new OntologyApi({});
  const ontologyListQuery = useQuery({
    queryKey: ['ontologyList'],
    queryFn: ontologyApi.fetchOntologyList,
  });


  let allCollectionWithStats: { [key: string]: number } = {};
  let allSubjectWithStats: { [key: string]: number } = {};
  if (process.env.REACT_APP_PROJECT_NAME === "" && ontologyListQuery.data) {
    // Only for TIB General
    allCollectionWithStats = getCollectionStatFromOntoList(ontologyListQuery.data);
  }
  const allCollections = allCollectionWithStats;

  if (ontologyListQuery.data) {
    allSubjectWithStats = getSubjectStatFromOntoList(ontologyListQuery.data);
  }

  async function setComponentData() {
    try {
      if (!ontologyListQuery.data) {
        return;
      }
      let ontologiesList = [];
      if (appContext.userSettings.userCollectionEnabled && appContext.userSettings.activeCollection.ontology_ids.length > 0) {
        for (let onto of ontologyListQuery.data ?? []) {
          if (appContext.userSettings.activeCollection.ontology_ids.includes(onto.ontologyId)) {
            ontologiesList.push(onto);
          }
        }
      }
      else {
        ontologiesList = ontologyListQuery.data;
      }
      ontologiesList = sortArrayOfOntologiesBasedOnKey(ontologiesList, sortField);
      setOntologies(ontologiesList);
      setUnFilteredOntologies(ontologiesList);
      setIsLoaded(true);
    }
    catch (error) {
      //console.log(error)
      setIsLoaded(true);
      setError(true);
    }
  }




  function setStateBasedOnUrlParams() {
    let ontologyListUrlFactory = new OntologyListUrlFactory();
    let collectionsInUrl = ontologyListUrlFactory.collections;
    let subjectsInUrl = ontologyListUrlFactory.subjects;
    let sortByInUrl = ontologyListUrlFactory.sortedBy;
    let keywordFilterInUrl = ontologyListUrlFactory.keywordFilter;
    collectionsInUrl = collectionsInUrl ? collectionsInUrl : [...selectedCollections];
    subjectsInUrl = subjectsInUrl ? subjectsInUrl : [...selectedSubjects];
    keywordFilterInUrl = keywordFilterInUrl ? keywordFilterInUrl : keywordFilterString;
    sortByInUrl = sortByInUrl ? sortByInUrl : sortField;
    let pageInUrl = ontologyListUrlFactory.page ? Number(ontologyListUrlFactory.page) : pageNumber;
    let sizeInUrl = ontologyListUrlFactory.size ? Number(ontologyListUrlFactory.size) : pageSize;
    setSelectedCollections(collectionsInUrl);
    setSelectedSubjects(subjectsInUrl);
    setKeywordFilterString(keywordFilterInUrl);
    setSortField(sortByInUrl);
    setPageNumber(pageInUrl);
    setPageSize(sizeInUrl);
  }



  function ontology_has_searchKey(ontology: TsOntology, value: string) {
    try {
      value = value.toLowerCase().trim();
      let targetText = [
        ontology.ontologyId.toLowerCase().trim(),
        ontology.title.toLowerCase().trim(),
      ];

      for (let text of targetText) {
        if (text.includes(value)) {
          return true;
        }
      }
      return false;
    }
    catch (e) {
      return false;
    }
  }



  function sortArrayOfOntologiesBasedOnKey(ontologiesArray: TsOntology[], key: string) {
    if (key === "title") {
      ontologiesArray.sort((o1, o2) => {
        return o1.cleanTitle.toLowerCase().localeCompare(o2.cleanTitle.toLowerCase(), "en", { sensitivity: "base" });
      })
    } else if (key === 'ontologyId') {
      ontologiesArray.sort((o1, o2) => {
        return o1.ontologyId.toLowerCase().localeCompare(o2.ontologyId.toLowerCase(), "en", { sensitivity: "base" });
      })
    } else if (key.includes("numberOfClasses")) {
      ontologiesArray.sort((o1, o2) => {
        return Number(o2.numberOfClasses) - Number(o1.numberOfClasses);
      })

    } else if (key.includes("numberOfProperties")) {
      ontologiesArray.sort((o1, o2) => {
        return Number(o2.numberOfProperties) - Number(o1.numberOfProperties);
      })
    } else if (key.includes("numberOfIndividuals")) {
      ontologiesArray.sort((o1, o2) => {
        return Number(o2.numberOfIndividuals) - Number(o1.numberOfIndividuals);
      })
    } else if (key.includes("loaded")) {
      ontologiesArray.sort((o1, o2) => {
        return o1.loaded.localeCompare(o2.loaded);
      })
    }
    return ontologiesArray;
  }



  function handlePagination(value: string) {
    setPageNumber(Number(value));
  }



  function showInPageRangeOntologies() {
    let down = (pageNumber - 1) * pageSize;
    let up = down + pageSize;
    if (up > ontologies.length) {
      up = ontologies.length;
    }
    let hiddenStatus = new Array(ontologies.length).fill(false);
    for (let i = down; i < up; i++) {
      hiddenStatus[i] = true;
    }
    setOntologiesHiddenStatus(hiddenStatus);
  }



  function handlePageSizeDropDownChange(e: React.MouseEvent<HTMLLIElement>) {
    setPageSize(Number(e.currentTarget.value));
  }



  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    let newSortField = e.target.value;
    let sortedOntology = sortArrayOfOntologiesBasedOnKey(ontologies, newSortField);
    setSortField(newSortField);
    setOntologies(sortedOntology);
  }



  function filterWordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKeywordFilterString(e.target.value);
    setPageNumber(1);
  }



  function handleSwitchange(e: React.ChangeEvent<HTMLInputElement>) {
    setExclusiveCollections(e.target.checked);
    setPageNumber(1);
  }


  function handleFacetCollection(e: React.MouseEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    let collection = target.value.trim();
    let currentSelectedCollections = [...selectedCollections];
    if (target.checked) {
      currentSelectedCollections.push(collection);
    }
    else {
      let index = currentSelectedCollections.indexOf(collection);
      currentSelectedCollections.splice(index, 1);
    }
    setSelectedCollections(currentSelectedCollections);
    setPageNumber(1);
  }

  function handleFacetSubject(e: React.MouseEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    let subject = target.value.trim();
    let currentSelectedSubjects = [...selectedSubjects];
    if (target.checked) {
      currentSelectedSubjects.push(subject);
    }
    else {
      let index = currentSelectedSubjects.indexOf(subject);
      currentSelectedSubjects.splice(index, 1);
    }
    setSelectedSubjects(currentSelectedSubjects);
    setPageNumber(1);
  }



  function runFilter() {
    let ontologiesList = [...unFilteredOntologies];
    let keywordOntologies = [];
    if (keywordFilterString !== "") {
      for (let i = 0; i < ontologiesList.length; i++) {
        let ontology = ontologiesList[i];
        if (ontology_has_searchKey(ontology, keywordFilterString)) {
          keywordOntologies.push(ontology)
        }
      }
      ontologiesList = keywordOntologies;
    }
    if (selectedCollections.length !== 0) {
      let collectionFilteredOntologies = [];
      for (let onto of ontologiesList) {
        if (!exclusiveCollections) {
          for (let col of selectedCollections) {
            if (onto.collections.includes(col)) {
              collectionFilteredOntologies.push(onto);
              break;
            }
          }
        } else {
          let found = true;
          for (let col of selectedCollections) {
            if (!onto.collections.includes(col)) {
              found = false;
              break;
            }
          }
          if (found) {
            collectionFilteredOntologies.push(onto);
          }
        }
      }
      ontologiesList = collectionFilteredOntologies;
    }
    if (selectedSubjects.length !== 0) {
      let subjectFilteredOntologies = [];
      for (let onto of ontologiesList) {
        for (let subj of selectedSubjects) {
          if (onto.subjects.includes(subj)) {
            subjectFilteredOntologies.push(onto);
            break;
          }
        }
      }
      ontologiesList = subjectFilteredOntologies;
    }

    ontologiesList = sortArrayOfOntologiesBasedOnKey(ontologiesList, sortField);
    setOntologies(ontologiesList);
  }



  function updateUrl() {
    let ontologyListUrl = new OntologyListUrlFactory();
    ontologyListUrl.update({
      keywordFilter: keywordFilterString,
      collections: selectedCollections,
      subjects: selectedSubjects,
      sortedBy: sortField,
      page: pageNumber,
      size: pageSize,
      andOpValue: exclusiveCollections
    });
  }



  useEffect(() => {
    setComponentData();
    setStateBasedOnUrlParams();
  }, [ontologyListQuery.data]);



  useEffect(() => {
    if (isLoaded) {
      updateUrl();
      runFilter();
    }
  }, [pageNumber, pageSize, keywordFilterString, selectedCollections, sortField, exclusiveCollections, isLoaded, selectedSubjects]);


  useEffect(() => {
    showInPageRangeOntologies();
  }, [ontologies]);



  if (error) {
    return <div>Error: Something Went Wrong!</div>
  }
  return (
    <>
      {Toolkit.createHelmet("Ontologies")}
      <div className='row justify-content-center ontology-list-container' id="ontologyList-wrapper-div">
        <div className='col-sm-11'>
          {!isLoaded && <div className="is-loading-term-list isLoading"></div>}
          {isLoaded &&
            <div className='row'>
              <div className='col-sm-4'>
                <OntologyListFacet
                  enteredKeyword={keywordFilterString}
                  filterWordChange={filterWordChange}
                  onSwitchChange={handleSwitchange}
                  handleFacetCollection={handleFacetCollection}
                  handleFacetSubject={handleFacetSubject}
                  selectedCollections={selectedCollections}
                  selectedSubjects={selectedSubjects}
                  allCollections={allCollections}
                  allSubjects={allSubjectWithStats}

                />
              </div>
              <div className='col-sm-8'>
                <OntologyListRender
                  handlePagination={handlePagination}
                  pageCount={Math.ceil(ontologies.length / pageSize)}
                  pageNumber={pageNumber}
                  pageSize={pageSize}
                  handlePageSizeDropDownChange={handlePageSizeDropDownChange}
                  sortField={sortField}
                  handleSortChange={handleSortChange}
                  ontologies={ontologies}
                  ontologiesHiddenStatus={ontologiesHiddenStatus}
                  isLoaded={isLoaded}
                />
              </div>
            </div>
          }
        </div>
      </div>
    </>
  )
}


export default OntologyList;