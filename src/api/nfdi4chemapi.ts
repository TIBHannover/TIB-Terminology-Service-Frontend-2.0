const callHeader = {
  'Accept': 'application/json'
};
const getCallSetting:RequestInit = {method: 'GET', headers: callHeader};
const size = 100;

/**
 * Get the ontology list for chem
 * @returns A list
 */
 export async function getChemOntologies (){
  return fetch(
    'https://service.tib.eu/ts4tib/api/ontologies/filterby?schema=collection&classification=NFDI4CHEM',
    getCallSetting
  )
    .then((s) => s.json())
    .then((s) => {
      return s['_embedded']['ontologies'];
    })
    .catch((s) => {
      return [];
    })
}


/**
 * Get an ontology detail
 * @param ontologyid 
 * @returns 
 */
export async function getOntologyDetail (ontologyid: string) {
  return fetch(
    'https://service.tib.eu/ts4tib/api/ontologies/' + encodeURIComponent(ontologyid),
    getCallSetting
  )
    .then((s) => s.json())
    .then((s) => {
      return s;
    })
    .catch((e) => {
      return undefined
    })
}

/**
 * fetch  the root terms (classes) for an ontology
 * @param ontologyId 
 */
export async function getOntologyRootTerms(ontologyId:string) {
  try{
    let ontology = await getOntologyDetail(ontologyId);
    let termsLink = ontology['_links']['terms']['href'];
    let pageCount = await getPageCount(termsLink + '/roots');
    let terms:Array<any> = [];
    for(let page=0; page < pageCount; page++){
        let url = termsLink + "/roots?page=" + page + "&size=" + size;      
        let res =  await (await fetch(url, getCallSetting)).json();
        if(page == 0){
            terms = res['_embedded']['terms'];
        }
        else{
            terms = terms.concat(res['_embedded']['terms']);
        }      
    }
    
    return processForTree(terms);

  }
  catch(e){
    return undefined
  }
  
}


/**
 * fetch  the root properties for an ontology
 * @param ontologyId 
 */
 export async function getOntologyRootProperties(ontologyId:string) {
  try{
    let ontology = await getOntologyDetail(ontologyId);
    let propertiesLink = ontology['_links']['properties']['href'];
    let pageCount = await getPageCount(propertiesLink + '/roots');
    let props:Array<any> = [];
    for(let page=0; page < pageCount; page++){
        let url = propertiesLink + "/roots?page=" + page + "&size=" + size;      
        let res =  await (await fetch(url, getCallSetting)).json();
        if(page == 0){
          props = res['_embedded']['properties'];
        }
        else{
          props = props.concat(res['_embedded']['properties']);
        }      
    }
    
    return processForTree(props);

  }
  catch(e){
    console.info(e);
    return undefined
  }
  
}


/**
 * get the page field from json result (TS api paginates the results)
 * @param url 
 * @returns 
 */
async function getPageCount(url: string){
  let answer = await fetch(url, getCallSetting);
  answer = await answer.json();
  return Math.ceil(answer['page']['totalElements'] / size);
}


/**
 * Get the children of a node (term/property) to load in the tree view.
 * @param childrenLink 
 * @param mode
 * @returns 
 */
export async function getChildren(childrenLink: string, mode: string){
  try{
      let data = await fetch(childrenLink, getCallSetting);
      data = await data.json();
      if (mode === 'term'){
        return processForTree(data['_embedded']['terms']); 
      }
      else{
        return processForTree(data['_embedded']['properties']);
      }
  }
  catch(e){
      return [];
  }
}


/**
 * Get a route in a tree to reach to an specific node. Used in opening an specific term/propert
 * @param ontologyId
 * @param nodeIri
 * @param mode (terms/properties)
 * @returns 
 */
export async function getTreeRoutes(nodeIri:string, mode:string,  allRoutes: Array<any>, isDetected:boolean) {
    let baseUrl = "https://service.tib.eu/ts4tib/api/ontologies/ms/terms";
    let node =  await (await fetch(baseUrl + "?iri=" + nodeIri, getCallSetting)).json();
    node = node['_embedded'][mode];
    // console.info(node[0]);
    if(typeof node[0]['_links']['hierarchicalParents'] !== 'undefined' && node[0]['is_root'] != true){
      let allParents =  await (await fetch(node[0]['_links']['hierarchicalParents']['href'], getCallSetting)).json();
      allParents = allParents['_embedded'][mode];
      // console.info(allParents);
      allRoutes.push(allParents[0]['short_form']);
      getTreeRoutes(allParents[0]['iri'], mode, allRoutes, isDetected);
    }
    else if(typeof node[0] !== 'undefined' &&  node[0]['is_root'] == true){
      return allRoutes;
    }
    
    return allRoutes;

}



/**
 * Get all descendants for a node in a term/property tree.
 * @param nodeDescendantsLink
 * @param mode (terms/properties) 
 * @returns 
 */
async function getAllDescendants(nodeDescendantsLink:string, mode:string) {
    let allDescendents: Array<string> = [];
    let results =  await (await fetch(nodeDescendantsLink, getCallSetting)).json();
    for(let i=0; i < results['_embedded'][mode].length; i++){
      allDescendents.push(results['_embedded'][mode][i]['iri'])
    }

    return allDescendents;
}



/**
 * This function process each node (term/property) obtainded from API call to match with the tree view. 
 * A tree node needs: children, id (beside existing metadata) 
 * @param listOfNodes 
 */
function processForTree(listOfNodes: Array<any>){
  let processedListOfNodes: Array<any> = [];
  for(let i=0; i < listOfNodes.length; i++){
    listOfNodes[i]['children'] = [];
    listOfNodes[i]['id'] = listOfNodes[i]['iri'];
    processedListOfNodes.push(listOfNodes[i]);
  }
  return processedListOfNodes;
}


/**
 * check if a node exist in a list of nodes obtain from API
 * @param nodesList
 * @param nodeIri
 * @returns 
 */
function nodeExistInList(nodesList: Array<any>, nodeIri:string){
  for(let i=0; i < nodesList.length; i++){
    if (nodesList[i]['iri'] === nodeIri){
      return true;
    }
  }
  return false;
}



export function getClassName (classid: string) {
  return fetch(
    'https://service.tib.eu/ts4tib/api/ontologies/' +
        encodeURIComponent(classid),
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
    .then((s) => s.json())
    .then((s) => {
      return { classID: classid, prefLabel: s.config?.title }
    })
    .catch((s) => {
      return { classID: classid, prefLabel: undefined }
    })
}



export function fetchConceptById (id: string) {
  return fetch(
    'https://service.tib.eu/ts4tib/api/terms' +
        encodeURIComponent(encodeURIComponent(id)),
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
    .then((s) => s.json())
    .then((s) => {
      return { conceptId: id, concept: s?._embedded?.terms[0] }
    })
}

export function autocompleteConcept (text: string, ontology:string|undefined) {
  let quert = ''
  if (ontology !== undefined) {
    quert = '&ontology=' + ontology
  }
  return fetch(
    'https://service.tib.eu/ts4tib/api/select?queryFields=label,synonym,short_form,obo_id&groupField=true&type=class&q=' + text + quert,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
    .then((s) => s.json())
    .then((s) => {
      return s?.response?.docs.map((p: any) => mapOlsToIriAndNameTuple(p))
    })
}

function mapOlsToIriAndNameTuple (item: any) {
  return { iri: item?.iri, label: item?.label }
}

export const fetch_data = (url: string) => {
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .catch((err) => {
      return []
    })
}

/**
   *
   * @param url Get url with http or https protocol
   * @returns concatinate s to http
   */
export const fix_url = (url: string) => {
  if (url.substr(0, 5) === 'http:') {
    return url.replace('http', 'https')
  } else {
    return url
  }
}

/**
   *
   * @param url
   * @returns return url from https to /terms
   */
export const get_url_prefix = (url: string | undefined) => {
  if (url === undefined) return ''
  return fix_url(url.substring(0, url.search('/terms') + 7))
}
