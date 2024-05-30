import { SearchSetting } from "./searchApiTypes"


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


export type UserModelType = {
    token?: string,
    fullName?: string,
    username?: string,
    userToken?: string,
    authProvider?: string,
    company?: string,
    githubHomeUrl?: string,
    orcidId?: string,
    systemAdmin?: boolean,
    settings?: UserSettings,
}


export type SearchSettingPayload ={
    title:string,
    description?:string,
    settings:SearchSetting
}


type UserCollection = {
    title:string,
    ontology_ids:string[]
}
