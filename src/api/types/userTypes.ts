import { SearchSetting } from "./searchApiTypes"

export type User = {
    id: string | number,
    username: string,
    name: string,
    created_at: string,
    updated_at?: string,
    auth_provider: string,
    client_ts: string,
    user_extra?: any,
    is_active: boolean,
    is_blocked: boolean,
}

export type ApiKey = {
    description: string,
    title: string,
    expires_at: string,
    owner: User
}

export type LoginResponse = {
    id?: string
    name?: string,
    token?: string,
    ts_username?: string,
    system_admin?: boolean,
    company?: string,
    github_home?: string,
    login?: string,
    orcid_id?: string,
    settings?: object,
    csrf_token?: string
}


export type UserSettings = {
    userCollectionEnabled: boolean | undefined,
    activeCollection: UserCollection | undefined,
    advancedSearchEnabled: boolean | undefined,
    activeSearchSetting: SearchSettingApiResponse | undefined,
    activeSearchSettingIsModified: boolean | undefined,
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
    csrf?: string,
}


export type SearchSettingPayload = {
    title: string,
    description?: string,
    settings: SearchSetting
}

export type SearchSettingApiResponse = {
    id: string | number,
    title: string,
    user_id: string | number,
    setting: SearchSetting,
    description?: string,
    created_at: string,
    updated_at?: string
}

export type ContactFormData = {
    title: string,
    description: string,
    email: string,
    name: string,
    safeQuestion: string,
    safeAnswer: string,
    type: string,
}


export type ContentReport = {
    reporter_username: string,
    report_date: string,
    report_reason: string,
    reported_content_type: string,
    reported_content_url: string
}


type UserCollection = {
    title: string,
    ontology_ids: string[]
}


