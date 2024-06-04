export type TsPluginHeader  = {
    'X-TS-Frontend-Id'?: string | null,
    'X-TS-Frontend-Token'?: string | null,
    'X-TS-Auth-Provider'?: string | null,
    'X-TS-Orcid-Id'?: string | null,
    'X-TS-User-Name'?: string | null,
    'Authorization'?: string | null,
    'X-TS-User-Token'?: string | null,
    'Content-Type'?: string | null,
    'X-TS-Auth-APP-Code'?: string | null,
} & HeadersInit;


export type GetHeaderFuncParams = {
    isJson? :boolean,
    withAccessToken? :boolean
}