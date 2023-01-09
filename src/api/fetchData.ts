const callHeader = {
  'Accept': 'application/json'
};
const getCallSetting:RequestInit = {method: 'GET', headers: callHeader};
const size = 10000;


/**
 * Get the ontology list 
 * @returns A list
 */
 export async function getAllOntologies (){
  let OntologiesListUrl = <any> process.env.REACT_APP_API_ONTOLOGY_LIST;
  return fetch(OntologiesListUrl, getCallSetting)
    .then((s) => s.json())
    .then((s) => {
      return s['_embedded']['ontologies'];
    })
    .catch((s) => {
      return [];
    })
}



/**
 * Get the ontology list for collection(s)
 * @returns A list of ontologies
 */
 export async function getCollectionOntologies (collections, exclusive){
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
  let answer = await fetch(OntologiesBaseServiceUrl, getCallSetting);
  answer = await answer.json();
  let ontologiesCount = answer['page']['totalElements'];
  let targetUrl = OntologiesBaseServiceUrl + "/filterby?schema=collection&page=0&size=" + ontologiesCount + "&exclusive=" + exclusive + "&";
  let urlPros = "";
  for(let col of collections){
    if (col !== ""){
      urlPros += ("classification=" + encodeURIComponent(col) + "&");
    }
  }
  targetUrl += urlPros;
  return fetch(targetUrl, getCallSetting)
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
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
  return fetch(
    OntologiesBaseServiceUrl + '/' + encodeURIComponent(ontologyid),
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
    
    return terms;
  
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
    
    return props;

  }
  catch(e){
    console.info(e);
    return undefined
  }
  
}


/**
 * Get the js tree for a node. It returns the subtree of that node as a flat list.
 */
export async function getChildrenJsTree(ontologyId:string, targetNodeIri:string, targetNodeId:string, extractName:string) {
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
  let url = OntologiesBaseServiceUrl + "/";
  url += ontologyId + "/" + extractName + "/" + encodeURIComponent(encodeURIComponent(targetNodeIri)) + "/jstree/children/" + targetNodeId;
  let res =  await (await fetch(url, getCallSetting)).json(); 
  return res;
}



/**
 * Get a node metadata by its iri
 * @param ontology 
 * @param nodeIri 
 * @param mode 
 * @returns 
 */
 export async function getNodeByIri(ontology:string, nodeIri:string, mode:string) {
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL + "/";
  let baseUrl = OntologiesBaseServiceUrl + ontology + "/" + mode;
  let node =  await fetch(baseUrl + "?iri=" + nodeIri, getCallSetting);
  if (node.status === 404){
    return false;
  }
  node = await node.json();
  node = node['_embedded'][mode][0];
  let parents = await getParents(node, mode);
  if(mode === "terms"){
    let rels = await getClassRelations(node, ontology);
    node['relations'] = rels;
    node['eqAxiom'] = await getEqAxiom(node['iri'], ontology);
    node['subClassOf'] = await getSubClassOf(node['iri'], ontology);
  }
  else{
    node['relations'] = [];
  }
  node['parents'] = parents;  
  return node;
}

/**
 * Get subClass Of values for selected node
 * @param ontology 
 * @param nodeIri 
 * @param mode 
 * @returns 
 */
export async function getSubClassOf(nodeIri:string, ontologyId:string){
  let url = <string> "";
  url = process.env.REACT_APP_API_BASE_URL + '/' + ontologyId + '/terms/' + encodeURIComponent(encodeURIComponent(nodeIri)) + '/superclassdescription';
  let res = await fetch(url, getCallSetting);
  res = await res.json();
  res = res["_embedded"];
  if (typeof(res) !== "undefined"){
    let result= "";
    for(let i=0; i < res["strings"].length; i++){
      result += '<li>'+ res["strings"][i]["content"] +'</li>';     
    }
    return result;
  }
  return "N/A"

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


/**
 * Get a list of all existing collections. 
 * @returns 
 */
export async function getAllCollectionsIds() {
  let url = <any> process.env.REACT_APP_COLLECTION_IDS_BASE_URL;
  let StatsBaseUrl = <any> process.env.REACT_APP_STATS_API_URL;
  let cols =  await fetch(url, getCallSetting);
  cols = await cols.json();
  let collections = cols['_embedded']["strings"];
  let result: Array<any> = [];
  for( let col of collections ){
    let statsUrl = StatsBaseUrl + "byclassification?schema=collection&" + "classification=" + col['content'];
    let statsResult = await fetch(statsUrl, getCallSetting);
    statsResult = await statsResult.json();
    let record = {"collection": col['content'], "ontologiesCount": statsResult["numberOfOntologies"]};
    result.push(record);
  }
  return result;
}



/**
 * Get a node parents
 * @param node 
 * @returns 
 */
export async function getParents(node:any, mode:string) {
  if(typeof(node['_links']['hierarchicalParents']) === "undefined"){
    return [];
  }
  let url = node['_links']['hierarchicalParents']['href'];
  let res = await fetch(url, getCallSetting);
  res = await res.json();
  let parents = res["_embedded"][mode];
  let result:Array<any> = [];
  for(let p of parents){
    let temp = {"label":p.label, "iri": p.iri, "ontology": p.ontology_name};
    result.push(temp);
  }
  return result;
}


/**
 * Get a class relations
 * @param classNode
 * @param ontologyId
 */
export async function getClassRelations(classNode:any, ontologyId:string) {
  if(typeof(classNode['_links']['graph']) === "undefined"){
    return [];
  }
  let url = classNode['_links']['graph']['href'];
  let res = await fetch(url, getCallSetting);
  res = await res.json();
  let nodes = res['nodes'];
  let relations = res['edges'];
  let result: { relation: string, relationUrl: string, target: string, targetUrl: string }[]  = [];
  for(let rel of relations){
    if(rel['label'] === "is a"){
      continue;
    }
    let targetNode = "";
    let targetNodeUrl = "";
    if(rel['source'] === classNode['iri']){
      targetNodeUrl = rel['target'];
    }
    else{
      targetNodeUrl = rel['source'];
    }
    for(let n of nodes){
      if(n['iri'] === targetNodeUrl){
        targetNode = n['label'];
        break;
      }
    }
    result.push({
      "relation": rel['label'],
      "relationUrl": rel['uri'],
      "target": targetNode,
      "targetUrl": targetNodeUrl
    });

  }

  return result;

}


/**
 * Get a class to Equivalent Axioms
 * @param classid 
 * @returns 
 */

async function getEqAxiom(nodeIri:string, ontologyId:string){
  let url = <string> "";
  url = process.env.REACT_APP_API_BASE_URL + '/' + ontologyId + '/terms/' + encodeURIComponent(encodeURIComponent(nodeIri)) + '/equivalentclassdescription';
  let res = await fetch(url, getCallSetting);
  res = await res.json();  
  res = res["_embedded"];
  if (typeof(res) !== "undefined"){
    return res["strings"][0]["content"];
  }
  return "N/A"

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
