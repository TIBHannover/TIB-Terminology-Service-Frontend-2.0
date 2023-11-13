const callHeader = {
  'Accept': 'application/json',
  'user-agent': process.env.REACT_APP_PROJECT_ID === 'general' ? 'TIBCENTRAL' : process.env.REACT_APP_PROJECT_ID === 'nfdi4chem' ? 'NFDI4CHEM' : process.env.REACT_APP_PROJECT_ID === 'nfdi4ing' ? 'NFDI4ING': 'TIBCENTRAL',
};
const getCallSetting:RequestInit = {method: 'GET',mode: 'cors', headers: callHeader};
const size = 10000;



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


export async function getListOfTerms(ontologyId:string, page:any, size:any) {
  try{
    let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
    let url = OntologiesBaseServiceUrl + "/" + ontologyId + "/terms?page=" + page + "&size=" + size;
    let result = await (await fetch(url, getCallSetting)).json();    
    let totalTermsCount = result['page']['totalElements'];
    result = result['_embedded'];
    if(!result){
      return [];
    }
    if(typeof(result['terms']) === "undefined"){
      return [];
    }
    return {"results": result['terms'], "totalTermsCount":totalTermsCount };

    
  }
  catch(e){
    return [];
  }

}


export async function getIndividualsList(ontologyId:string){
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
  let url = OntologiesBaseServiceUrl + "/" + ontologyId + "/individuals?size=10000";
  let res = await fetch(url, getCallSetting);
  res = await res.json();
  res = res["_embedded"];
  if (!res || res["individuals"] === "undefined"){
    return [];
  }
  else{
    return res["individuals"];
  }
}


export async function getSkosOntologyRootConcepts(ontologyId:string) {
  try{
    let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
    let url = OntologiesBaseServiceUrl + "/" + ontologyId  + "/concepthierarchy?find_roots=SCHEMA&narrower=false&with_children=false&page_size=1000";
    let results =  await (await fetch(url, getCallSetting)).json();
    return results;
  }
  catch(e){
    return [];
  }  
}


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

export async function getNodeJsTree(ontologyId:string, targetNodeType:string, targetNodeIri:string, viewMode:any){
  try{
    let url = process.env.REACT_APP_API_BASE_URL + "/";
    url += ontologyId + "/" + targetNodeType + "/" + encodeURIComponent(encodeURIComponent(targetNodeIri)) + "/jstree?viewMode=All&siblings=" + viewMode;
    let listOfNodes =  await (await fetch(url, getCallSetting)).json();
    return listOfNodes;
  }
  catch(e){
    return [];
  }
}


export async function getChildrenJsTree(ontologyId:string, targetNodeIri:string, targetNodeId:string, extractName:string) {
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
  let url = OntologiesBaseServiceUrl + "/";
  url += ontologyId + "/" + extractName + "/" + encodeURIComponent(encodeURIComponent(targetNodeIri)) + "/jstree/children/" + targetNodeId;
  let res =  await (await fetch(url, getCallSetting)).json();
  return res;
}


export async function getChildrenSkosTree(ontologyId:string, targetNodeIri:string){
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
  let url = OntologiesBaseServiceUrl + "/" + ontologyId +  "/conceptrelations/" + encodeURIComponent(encodeURIComponent(targetNodeIri)) + "?relation_type=narrower&page=0&size=1000";
  let res =  await (await fetch(url, getCallSetting)).json();
  res = res['_embedded'];
  if(typeof(res['individuals']) !== "undefined"){
    return res['individuals'];
  }
  else{
    return [];
  }
}


export async function skosNodeHasChildren(ontologyId:string, targetNodeIri:string) {
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
  let url = OntologiesBaseServiceUrl + "/" + ontologyId +  "/conceptrelations/" + encodeURIComponent(encodeURIComponent(targetNodeIri)) + "?relation_type=narrower&page=0&size=1000";
  let res =  await (await fetch(url, getCallSetting)).json();
  res = res['_embedded'];  
  if(!res){
    return false;
  }
  else if(typeof(res['individuals']) === "undefined"){
    return false;
  }
  else if(res['individuals']!.length === 0){
    return false;
  }  
  else{
    return true;
  }
}


export async function getNodeByIri(ontology:string, nodeIri:string, mode:string, isIndividual=false) {
  if(nodeIri === "%20"){
    // empty iri
    return false;
  }  
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL + "/";
  let baseUrl = OntologiesBaseServiceUrl + ontology + "/" + mode;  
  let node = <any> "";
  if(mode === "individuals"){
    node =  await fetch(baseUrl + "/" + encodeURIComponent(nodeIri), getCallSetting);
  }
  else{
    node =  await fetch(baseUrl + "/" + encodeURIComponent(nodeIri) , getCallSetting);
  }

  if (node.status === 404){
    return false;
  }
  node = await node.json();
  if(isIndividual){
    node['isIndividual'] = true;
    node['relations'] = 'N/A';
    node['eqAxiom'] = 'N/A';
    node['subClassOf'] = 'N/A';
    return node;
  }
 
  let parents = await getParents(node, mode);
  if(mode === "terms"){
    let rels = await getClassRelations(node, ontology);
    node['relations'] = await getRelations(node['iri'], ontology);
    node['eqAxiom'] = await getEqAxiom(node['iri'], ontology);
    node['subClassOf'] = await getSubClassOf(node['iri'], ontology);
    node['instancesList'] = await getIndividualInstancesForClass(ontology, node['iri']);
  }
  else{
    node['relations'] = [];
  }
  node['parents'] = parents;  
  return node;
}


export async function getSkosNodeByIri(ontology:string, nodeIri:string) {  
  let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
  let url = OntologiesBaseServiceUrl + "/" + ontology +  "/individuals/" + encodeURIComponent(nodeIri);
  let res =  await (await fetch(url, getCallSetting)).json();  
  if(!res){
    return false;
  }
  else if(typeof(res['iri']) === "undefined"){
    return false;
  }  
  else{    
    return res;
  }
}


export async function getSkosNodeParent(ontology, iri) {
  let baseUrl = <any> process.env.REACT_APP_API_BASE_URL;  
  let url = baseUrl +  "/" + ontology +  "/conceptrelations/" + encodeURIComponent(encodeURIComponent(iri)) + "?relation_type=broader";
  let res = await (await fetch(url, getCallSetting)).json();
  res = res['_embedded'];    
  if(!res || !res['individuals']){
    return false;
  }
  return res['individuals'][0];
}


export async function isSkosOntology(ontologyId) {
  let baseUrl = <any> process.env.REACT_APP_API_BASE_URL;  
  let url = baseUrl + "/" + ontologyId;
  let res = await (await fetch(url, getCallSetting)).json();
  res = res["config"];
  if(!res || res['skos'] === "undefined"){
    return false
  }
  return res["skos"];
}



export async function getEqAxiom(nodeIri:string, ontologyId:string){
  let url = <string> "";
  url = process.env.REACT_APP_API_BASE_URL + '/' + ontologyId + '/terms/' + encodeURIComponent(encodeURIComponent(nodeIri)) + '/equivalentclassdescription';
  let res = await fetch(url, getCallSetting);
  res = await res.json();  
  res = res["_embedded"];
  if (typeof(res) !== "undefined"){
    let resultHtml = <string> "";
    resultHtml += "<ul>";
    for(let item of res["strings"]){
      resultHtml += "<li>";
      resultHtml += item["content"];
      resultHtml += "</li>";
    }
    resultHtml += "<ul>";
    return resultHtml;
  }
  return "N/A";
}


export async function getSubClassOf(nodeIri:string, ontologyId:string){
  let url = <string> "";
  let parentUrl = <string> "";
  url = process.env.REACT_APP_API_BASE_URL + '/' + ontologyId + '/terms/' + encodeURIComponent(encodeURIComponent(nodeIri)) + '/superclassdescription';
  parentUrl = process.env.REACT_APP_API_BASE_URL + '/' + ontologyId + '/terms/' + encodeURIComponent(encodeURIComponent(nodeIri)) + '/parents';
  let parentRes = await fetch(parentUrl, getCallSetting);
  parentRes = await parentRes.json();
  parentRes = parentRes["_embedded"];
  let res = await fetch(url, getCallSetting);
  res = await res.json();
  res = res["_embedded"];
  let result= "";
  if(!parentRes){
    return result;
  }
  result += "<ul>"
  for(let i=0; i < parentRes["terms"].length; i++){
    result += '<li>'+ '<a href=' + process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + ontologyId + '/terms?iri=' + encodeURIComponent(parentRes["terms"][i]["iri"]) + '>' + parentRes["terms"][i]["label"] + '</a>'+ '</li>';
  }
  if (typeof(res) !== "undefined"){
    for(let i=0; i < res["strings"].length; i++){
    result += '<li>'+ res["strings"][i]["content"] +'</li>';     
  }
  result += "<ul>"
  
}
  return result; 
}


export async function getRelations(nodeIri:string, ontologyId:string){
  let url = <string>""
  url = process.env.REACT_APP_API_BASE_URL + '/' + ontologyId + '/terms/' + encodeURIComponent(encodeURIComponent(nodeIri)) + '/relatedfroms';
  let res = await fetch(url, getCallSetting);
  res = await res.json();
  if (typeof(res) !== "undefined"){
    let entries = Object.entries(res)
    let result = "";
    
    for(let [k,v] of entries){               
      result += k 
      result += "<ul>"            
      for(let item of v){
        result += '<li>'+ '<a href=' + process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + ontologyId + '/terms?iri=' + encodeURIComponent(item["iri"]) + '>' + item["label"] + '</a>'+ '</li>';
      }
      result += "</ul>"      
    }     
    return result
  } 
  return "N/A"; 
      
}



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
    let collectionOntologies = await getCollectionOntologies([col['content']], false);
    let collectionOntologiesIds: Array<any> = [];
    for(let onto of collectionOntologies){
      collectionOntologiesIds.push(onto['ontologyId'].toUpperCase())
    }
    let record = {"collection": col['content'], "ontologiesCount": statsResult["numberOfOntologies"], "ontolgies": collectionOntologiesIds};
    result.push(record);
  }
  return result;
}


export async function getParents(node:any, mode:string) {
  if(mode === "individuals"){
    return [];
  }
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
    if(rel['label'] === "has proper occurrent part"){
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


export async function getIndividualInstancesForClass(ontologyId:string, classIri:string){
  try{
    let baseUrl = <any> process.env.REACT_APP_API_BASE_URL;
    let callUrl = baseUrl + "/" + ontologyId + "/" + encodeURIComponent(encodeURIComponent(classIri)) + "/terminstances";
    let result = await fetch(callUrl, getCallSetting);
    result = await result.json();
    result = result['_embedded'];
    if(!result || typeof(result['individuals']) === "undefined"){
      return [];
    }
    return result['individuals'];
  }
  catch(e){
    return [];
  }
}


export async function getAutoCompleteResult(enteredTerm:string, ontologyId:string, type:string){
  try{
    let autocompleteApiBaseUrl = <any> process.env.REACT_APP_SEARCH_URL;
    autocompleteApiBaseUrl = autocompleteApiBaseUrl.split('search')[0] + "select";
    let url = `${autocompleteApiBaseUrl}?q=${enteredTerm}&ontology=${ontologyId}&type=${type}&rows=10`;
    let result = await fetch(url, getCallSetting);
    result = await result.json();
    result = result['response']['docs'];
    return result;
  }
  catch(e){
    // throw e
    return [];
  }

}

export async function getObsoleteTermsForTermList(ontologyId:string, termType:string, page:any, size:any) {
  try{
    let OntologiesBaseServiceUrl = <any> process.env.REACT_APP_API_BASE_URL;
    let url = OntologiesBaseServiceUrl + "/";  
    url += ontologyId + "/" + termType + "/roots?includeObsoletes=true&size=" + size + "&page=" + page;    
    let res =  await (await fetch(url, getCallSetting)).json();
    let totalTermsCount = res['page']['totalElements'];
    res = res['_embedded'];
    return {"results": res['terms'], "totalTermsCount":totalTermsCount };
  }
  catch(e){
    return {"results": [], "totalTermsCount":0};
  }
  
}



async function getPageCount(url: string){
  let answer = await fetch(url, getCallSetting);
  answer = await answer.json();
  return Math.ceil(answer['page']['totalElements'] / size);
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

export const fix_url = (url: string) => {
  if (url.substr(0, 5) === 'http:') {
    return url.replace('http', 'https')
  } else {
    return url
  }
}

export const get_url_prefix = (url: string | undefined) => {
  if (url === undefined) return ''
  return fix_url(url.substring(0, url.search('/terms') + 7))
}
