import { getCallSetting, size } from "./constants";



export async function getAllOntologies (){
  let OntologiesListUrl = process.env.REACT_APP_API_ONTOLOGY_LIST;
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
  let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;  
  let ontologiesCount = 100000;
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


export async function getOntologyDetail (ontologyid) {
  let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
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

export async function getOntologyRootTerms(ontologyId) {
  try{
    let ontology = await getOntologyDetail(ontologyId);
    let termsLink = ontology['_links']['terms']['href'];
    let pageCount = await getPageCount(termsLink + '/roots');
    let terms = [];    
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


export async function getListOfTerms(ontologyId, page, size) {
  try{
    let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
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


export async function getIndividualsList(ontologyId){
  let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
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


export async function getSkosOntologyRootConcepts(ontologyId) {
  try{
    let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
    let url = OntologiesBaseServiceUrl + "/" + ontologyId  + "/concepthierarchy?find_roots=SCHEMA&narrower=false&with_children=false&page_size=1000";
    let results =  await (await fetch(url, getCallSetting)).json();
    return results;
  }
  catch(e){
    return [];
  }  
}


export async function getOntologyRootProperties(ontologyId) {
  try{
    let ontology = await getOntologyDetail(ontologyId);
    let propertiesLink = ontology['_links']['properties']['href'];
    let pageCount = await getPageCount(propertiesLink + '/roots');
    let props = [];
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

export async function getNodeJsTree(ontologyId, targetNodeType, targetNodeIri, viewMode){
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


export async function getChildrenJsTree(ontologyId, targetNodeIri, targetNodeId, extractName) {
  let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
  let url = OntologiesBaseServiceUrl + "/";
  url += ontologyId + "/" + extractName + "/" + encodeURIComponent(encodeURIComponent(targetNodeIri)) + "/jstree/children/" + targetNodeId;
  let res =  await (await fetch(url, getCallSetting)).json();
  return res;
}


export async function getChildrenSkosTree(ontologyId, targetNodeIri){
  let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
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


export async function skosNodeHasChildren(ontologyId, targetNodeIri) {
  let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
  let url = OntologiesBaseServiceUrl + "/" + ontologyId +  "/conceptrelations/" + encodeURIComponent(encodeURIComponent(targetNodeIri)) + "?relation_type=narrower&page=0&size=1000";
  let res =  await (await fetch(url, getCallSetting)).json();
  res = res['_embedded'];  
  if(!res){
    return false;
  }
  else if(typeof(res['individuals']) === "undefined"){
    return false;
  }
  else if(res['individuals'] && res['individuals'].length === 0){
    return false;
  }  
  else{
    return true;
  }
}


export async function getNodeByIri(ontology, nodeIri, mode, isIndividual=false) {
  if(nodeIri === "%20"){
    // empty iri
    return false;
  }  
  let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL + "/";
  let baseUrl = OntologiesBaseServiceUrl + ontology + "/" + mode;  
  let node =  "";  
  node =  await fetch(baseUrl + "/" + encodeURIComponent(nodeIri) , getCallSetting);

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
    // let rels = await getClassRelations(node, ontology);
    let [relations, eqAxiom, subClassOf, instancesList] = await Promise.all([
      getRelations(node['iri'], ontology),
      getEqAxiom(node['iri'], ontology),
      getSubClassOf(node['iri'], ontology),
      getIndividualInstancesForClass(ontology, node['iri'])

    ]);
    node['relations'] = relations;
    node['eqAxiom'] = eqAxiom;
    node['subClassOf'] = subClassOf; 
    node['instancesList'] = instancesList;
  }
  else{
    node['relations'] = [];
  }
  node['parents'] = parents;  
  return node;
}


export async function getSkosNodeByIri(ontology, nodeIri) {  
  let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
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
  let baseUrl =  process.env.REACT_APP_API_BASE_URL;  
  let url = baseUrl +  "/" + ontology +  "/conceptrelations/" + encodeURIComponent(encodeURIComponent(iri)) + "?relation_type=broader";
  let res = await (await fetch(url, getCallSetting)).json();
  res = res['_embedded'];    
  if(!res || !res['individuals']){
    return false;
  }
  return res['individuals'][0];
}


export async function isSkosOntology(ontologyId) {
  let baseUrl =  process.env.REACT_APP_API_BASE_URL;  
  let url = baseUrl + "/" + ontologyId;
  let res = await (await fetch(url, getCallSetting)).json();
  res = res["config"];
  if(!res || res['skos'] === "undefined"){
    return false
  }
  return res["skos"];
}



export async function getEqAxiom(nodeIri, ontologyId){
  let url =  "";
  url = process.env.REACT_APP_API_BASE_URL + '/' + ontologyId + '/terms/' + encodeURIComponent(encodeURIComponent(nodeIri)) + '/equivalentclassdescription';
  let res = await fetch(url, getCallSetting);
  res = await res.json();  
  res = res["_embedded"];
  if (typeof(res) !== "undefined"){
    let resultHtml =  "";
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


export async function getSubClassOf(nodeIri, ontologyId){
  let url =  "";
  let parentUrl =  "";
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


export async function getRelations(nodeIri, ontologyId){
  let url = ""
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



export async function getAllCollectionsIds(withStats=true) {
  try{
    let url =  process.env.REACT_APP_COLLECTION_IDS_BASE_URL;
    let StatsBaseUrl =  process.env.REACT_APP_STATS_API_URL;
    let cols =  await fetch(url, getCallSetting);
    cols = await cols.json();
    let collections = cols['_embedded']["strings"];
    let result = [];
    for( let col of collections ){
      let ontologiesCountForCollection = 0;
      if(withStats){
        let statsUrl = StatsBaseUrl + "byclassification?schema=collection&" + "classification=" + col['content'];
        let statsResult = await fetch(statsUrl, getCallSetting);
        statsResult = await statsResult.json();
        ontologiesCountForCollection = statsResult["numberOfOntologies"];
      }
      
      let collectionOntologies = await getCollectionOntologies([col['content']], false);
      let collectionOntologiesIds = [];
      for(let onto of collectionOntologies){
        collectionOntologiesIds.push(onto['ontologyId'].toUpperCase())
      }
      let record = {"collection": col['content'], "ontologiesCount": ontologiesCountForCollection, "ontolgies": collectionOntologiesIds};    
      result.push(record);
    }
    return result;
  }
  catch(e){
    return [];
  }  
}


export async function getParents(node, mode) {
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
  let result = [];
  for(let p of parents){
    let temp = {"label":p.label, "iri": p.iri, "ontology": p.ontology_name};
    result.push(temp);
  }
  return result;
}


export async function getClassRelations(classNode, ontologyId) {
  if(typeof(classNode['_links']['graph']) === "undefined"){
    return [];
  }
  let url = classNode['_links']['graph']['href'];
  let res = await fetch(url, getCallSetting);
  res = await res.json();
  let nodes = res['nodes'];
  let relations = res['edges'];
  let result = [];
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


export async function getIndividualInstancesForClass(ontologyId, classIri){
  try{
    let baseUrl =  process.env.REACT_APP_API_BASE_URL;
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


export async function getJumpToResult(inputData, count=10){
  try{
    let autocompleteApiBaseUrl =  process.env.REACT_APP_SEARCH_URL;
    autocompleteApiBaseUrl = autocompleteApiBaseUrl.split('search')[0] + "select";
    let url = `${autocompleteApiBaseUrl}?q=${inputData['searchQuery']}&rows=${count}`;    
    url = inputData['ontologyIds'] ? (url + `&ontology=${inputData['ontologyIds']}`) : url;
    url = inputData['types'] ? (url + `&type=${inputData['types']}`) : url;
    url = inputData['obsoletes'] ? (url + "&obsoletes=true") : url;
    url = inputData['collectionIds'] ? (url + `&schema=collection&classification=${inputData['collectionIds']}`) : url;    
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

export async function getObsoleteTermsForTermList(ontologyId, termType, page, size) {
  try{
    let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
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



export async function getObsoleteTerms(ontologyId, termType) {
  try{
    let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
    let url = OntologiesBaseServiceUrl + "/";  
    url += ontologyId + "/" + termType + "/roots?includeObsoletes=true&size=1000";
    let res =  await (await fetch(url, getCallSetting)).json();
    return res['_embedded'][termType];
  }
  catch(e){
    return [];
  }
  
}


async function getPageCount(url){
  let answer = await fetch(url, getCallSetting);
  answer = await answer.json();
  return Math.ceil(answer['page']['totalElements'] / size);
}


export async function getAutoCompleteResult(inputData, count=5){
  try{
    let url =  process.env.REACT_APP_API_URL + `/suggest?q=${inputData['searchQuery']}&rows=${count}`;
    url = inputData['ontologyIds'] ? (url + `&ontology=${inputData['ontologyIds']}`) : url;
    url = inputData['types'] ? (url + `&type=${inputData['types']}`) : url;
    url = inputData['obsoletes'] ? (url + "&obsoletes=true") : url;
    url = inputData['collectionIds'] ? (url + `&schema=collection&classification=${inputData['collectionIds']}`) : url;  
    let searchResult = await fetch(url, getCallSetting);
    searchResult =  (await searchResult.json())['response']['docs'];
    return searchResult;
  }
  catch(e){
    return [];
  }
}



export async function olsSearch(searchQuery, page, size, selectedOntologies, selectedTypes, selectedCollections, obsoletes, exact) {
    try{
      let rangeStart = (page - 1) * size;
      let searchUrl = process.env.REACT_APP_SEARCH_URL + `?q=${searchQuery}&start=${rangeStart}&groupField=iri&rows=${size}`;
      searchUrl = selectedOntologies.length !== 0 ? (searchUrl + `&ontology=${selectedOntologies.join(',')}`) : searchUrl;
      searchUrl = selectedTypes.length !== 0 ? (searchUrl + `&type=${selectedTypes.join(',')}`) : searchUrl;
      searchUrl = obsoletes ? (searchUrl + "&obsoletes=true") : searchUrl;
      searchUrl = exact ? (searchUrl + "&exact=true") : searchUrl;
      if(process.env.REACT_APP_PROJECT_NAME === "" && selectedCollections.length !== 0){
        // If TIB General. Set collections if exist in filter
        searchUrl += `&schema=collection&classification=${selectedCollections.join(',')}`;
      }
      else if(process.env.REACT_APP_PROJECT_NAME !== ""){
        // Projects such as NFDI4CHEM. pre-set the target collection on each search
        searchUrl += `&schema=collection&classification=${process.env.REACT_APP_PROJECT_NAME}`;
      }
      let result = await (await fetch(searchUrl, getCallSetting)).json(); 
      return result;
    }
    catch(e){
      throw e;
      return [];
    }
}







