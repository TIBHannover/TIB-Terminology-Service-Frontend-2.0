const callHeader = {
  'Accept': 'application/json'
};
const getCallSetting:RequestInit = {method: 'GET', headers: callHeader};
const size = 1000;
const OntologiesBaseServiceUrl = "https://service.tib.eu/ts4tib/api/ontologies";

/**
 * Get the ontology list for chem
 * @returns A list
 */
 export async function getAllOntologies (){
  let answer = await fetch(OntologiesBaseServiceUrl, getCallSetting);
  answer = await answer.json();
  let ontologiesCount = answer['page']['totalElements'];
  let targetUrl = OntologiesBaseServiceUrl + '?page=0&size=' + ontologiesCount;
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
    
    return processForTree("", terms, {}, "term");

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
    
    return processForTree("", props, {}, "property");

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
export async function getChildren(node:any, childrenFieldName:string, mode: string, alreadyExistedNodesInTree: {[id:string]: number}){ 
  try{      

      let extractName = "";
      if (mode === 'term'){
          extractName = "terms";
      }
      else{
          extractName = "properties";
      }

      let pageCount = await getPageCount(node['_links'][childrenFieldName]['href']);
      let children:Array<any> = [];
      for(let page=0; page < pageCount; page++){
          let url = node['_links'][childrenFieldName]['href'] + "?page=" + page + "&size=" + size; 
          let res =  await (await fetch(url, getCallSetting)).json();
          if(page == 0){
            children = res['_embedded'][extractName];
          }
          else{
            children = children.concat(res['_embedded'][extractName]);
          }      
      }
      
      return processForTree(node['iri'], children, alreadyExistedNodesInTree, mode); 

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
export async function getTreeRoutes(ontology:string, nodeIri:string, mode:string, allRoutes: Array<any>, treeData: Array<any>, childFieldName:string, ancestorFieldName:string) {
  let baseUrl = "https://service.tib.eu/ts4tib/api/ontologies/" + ontology + "/" + mode;
  let node =  await (await fetch(baseUrl + "?iri=" + nodeIri, getCallSetting)).json();
  let rootNodes: Array<any> = [];
  node = node['_embedded'][mode];
  if(typeof node[0]['_links'][ancestorFieldName] !== 'undefined' && node[0]['is_root'] != true){
    let allAncestors =  await (await fetch(node[0]['_links'][ancestorFieldName]['href'], getCallSetting)).json();
    allAncestors = allAncestors['_embedded'][mode];
    for(let i=0; i < allAncestors.length; i++){
      if(allAncestors[i]['is_root'] &&  !["TopObjectProperty", "Thing"].includes(allAncestors[i]['label'])){
        rootNodes.push(allAncestors[i]);
      }
    }
    allAncestors.push(node[0]);
    for(let i=0; i < rootNodes.length; i++){  
      rootNodes[i]['children'] = [];
      rootNodes[i]['modified_short_form'] = rootNodes[i]['short_form'];
      rootNodes[i]['parentIri'] = "";
      rootNodes[i]['part_of'] = false;
      treeData.push(rootNodes[i]);  
      await findNode(rootNodes[i], node[0], mode, allAncestors, [rootNodes[i]['short_form']], allRoutes, rootNodes[i]['short_form'], treeData[i], childFieldName, ancestorFieldName);
    }
  }
  else if(node[0]['is_root'] == true){
    allRoutes.push([node[0]['short_form']]);
    node[0]['children'] = [];
    node[0]['modified_short_form'] = node[0]['short_form'];
    node[0]['parentIri'] = "";
    node[0]['part_of'] = false;
    treeData.push(node[0]);
  }
  
}


/**
 * Find a node in the tree and build the node path
 * @param node 
 * @param target 
 * @param mode 
 * @param allAncestors 
 * @param route 
 * @param allRoutes 
 * @param rootNode 
 * @param treeData 
 * @param childFieldName 
 * @param ancestorFieldName 
 * @returns 
 */
async function findNode(node:any, target:any, mode:string, allAncestors:Array<any>, route:Array<any>, allRoutes:Array<any>, rootNode:string, treeData: Array<any>, childFieldName:string, ancestorFieldName:string) {  
  if(node['short_form'] == target['short_form']){
    allRoutes.push(route);
    return true;
  }
  else if(typeof node['_links'][childFieldName] !== 'undefined'){
    let pageCount = await getPageCount(node['_links'][childFieldName]['href']);
    let children:Array<any> = [];
    for(let page=0; page < pageCount; page++){
        let url = node['_links'][childFieldName]['href'] + "?page=" + page + "&size=" + size; 
        let res =  await (await fetch(url, getCallSetting)).json();
        if(page == 0){
          children = res['_embedded'][mode];
        }
        else{
          children = children.concat(res['_embedded'][mode]);
        }      
    }

    for(let j=0; j < children.length; j++){
      if(nodeExistInList(allAncestors, children[j]['iri'])){        
        route.push(children[j]['short_form']);
        children[j]['children'] = [];
        children[j]['modified_short_form'] = children[j]['short_form'];
        children[j]['parentIri'] = node['iri'];
        if(mode == "terms"){
          children[j]['part_of'] = await hasPartOfRelation(children[j], "term");
        }
        else{
          children[j]['part_of'] = await hasPartOfRelation(children[j], "property");
        }
        treeData['children'].push(children[j]);
        let answer = await findNode(children[j], target, mode, allAncestors, route, allRoutes, rootNode, treeData['children'][treeData['children'].length - 1], childFieldName, ancestorFieldName);
      }
    }
  }
  else{
    return false;
  }
}


/**
 * Get a node metadata by its iri
 * @param ontology 
 * @param nodeIri 
 * @param mode 
 * @returns 
 */
export async function getNodeByIri(ontology:string, nodeIri:string, mode:string) {
    let baseUrl = "https://service.tib.eu/ts4tib/api/ontologies/" + ontology + "/" + mode;
    let node =  await (await fetch(baseUrl + "?iri=" + nodeIri, getCallSetting)).json();
    return node['_embedded'][mode][0];
}


/**
 * This function process each node (term/property) obtainded from API call to match with the tree view. 
 * A tree node needs: children, parent, and id (beside existing metadata) 
 * @param listOfNodes 
 */
async function processForTree(parentIri:string, listOfNodes: Array<any>, alreadyExistedNodesInTree: {[id:string]: number}, mode:string){
  let processedListOfNodes: Array<any> = [];
  for(let i=0; i < listOfNodes.length; i++){
    listOfNodes[i]['children'] = [];
    listOfNodes[i]['parentIri'] = parentIri;
    listOfNodes[i]['id'] = listOfNodes[i]['iri'];
    listOfNodes[i]['part_of'] = await hasPartOfRelation(listOfNodes[i], mode);
    if(Object.keys(alreadyExistedNodesInTree).includes(listOfNodes[i]['short_form'])){
      listOfNodes[i]['modified_short_form'] = listOfNodes[i]['short_form'] + '_' + alreadyExistedNodesInTree[listOfNodes[i]['short_form']];
      alreadyExistedNodesInTree[listOfNodes[i]['short_form']] = alreadyExistedNodesInTree[listOfNodes[i]['short_form']] + 1;
    }
    else{
      listOfNodes[i]['modified_short_form'] = listOfNodes[i]['short_form'] + '_0';
      alreadyExistedNodesInTree[listOfNodes[i]['short_form']] = 1;
    }
    processedListOfNodes.push(listOfNodes[i]);
    
  }
  return [processedListOfNodes, alreadyExistedNodesInTree];
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
 * check if a node has part of relation with its parent. 
 * @param node 
 * @param parentIri 
 */
export async function hasPartOfRelation(node:any, mode:string) {    
    if (typeof(node['_links']['part_of']) === 'undefined' || node['parentIri'] === ""){
      return false;
    }
    let partOfParents = await (await fetch(node['_links']['part_of']['href'], getCallSetting)).json();
    if(mode === 'term'){
      partOfParents = partOfParents['_embedded']['terms'];
    }
    else{
      partOfParents = partOfParents['_embedded']['properties'];
    }
    
    return nodeExistInList(partOfParents,  node['parentIri']);
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
