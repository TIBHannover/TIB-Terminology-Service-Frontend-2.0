export type LoginResponse ={
    name:string,
    token:string,
    ts_username:string,
    ts_user_token:string,
    system_admin:boolean,
    company:string,
    github_home:string,
    login:string,
    orcid_id:string,
}


export type UserSettings = {
    userCollectionEnabled:boolean|undefined,
    activeCollection:UserCollection|undefined,
}


type UserCollection = {
    title:string,
    ontology_ids:string[]
}
