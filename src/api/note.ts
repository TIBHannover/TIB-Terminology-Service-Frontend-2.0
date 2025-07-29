import TermApi from "./term";
import {
    NewNoteRequest,
    NoteData,
    NoteListResponse,
    NoteListParams,
    GetNoteDetailParams,
    NoteDetailResponse,
    CreateCommentParams,
    CommentData,
    UpdateCommentParams,
    PinnNoteParams
} from "./types/noteTypes";
import {getTsPluginHeaders} from "./header";
import {TsPluginHeader} from "./types/headerTypes";


export async function submitNote(noteData: NewNoteRequest, editMode: boolean = false): Promise<object | boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT;
        let path = !editMode ? '/note/create/' : '/note/update/';
        let httpMethod = !editMode ? 'POST' : 'PUT';
        let extractKey = !editMode ? 'note_created' : 'note_updated';
        let result: any = await fetch(url + path, {
            method: httpMethod,
            headers: headers,
            body: JSON.stringify(noteData)
        });
        result = await result.json();
        result = result['_result'][extractKey]['id'];
        return result;
    } catch (e) {
        return false;
    }
}


export async function getNoteList(params: NoteListParams): Promise<NoteListResponse | null> {
    try {
        let {ontologyId, type, pageNumber, pageSize, targetTerm, onlyOntologyOriginalNotes} = params;

        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/list?ontology=' + ontologyId;
        url += ('&page=' + pageNumber + '&size=' + pageSize);
        if (targetTerm) {
            url += ('&artifact_iri=' + encodeURIComponent(targetTerm['iri']))
        }
        if (type) {
            url += ('&artifact_type=' + type);
        }

        if (onlyOntologyOriginalNotes) {
            url += '&onlyOriginalNotes=true';
        }

        let result: any = await fetch(url, {headers: headers});
        result = await result.json();
        let notes: NoteListResponse = result['_result'];
        if (params.withoutLabelFetch) {
            return notes;
        }
        await Promise.all(
            notes['notes'].map(async (note) => {
                if (!note['semantic_component_label'] && note['semantic_component_type'] !== "ontology") {
                    let termApi: any = new TermApi(note['ontology_id'], note['semantic_component_iri'], note['semantic_component_type']);
                    await termApi.fetchTerm({withRelations: false});
                    note['semantic_component_label'] = termApi.term['label'];
                }
            })
        );
        return notes;
    } catch (e) {
        return null;
    }
}


export async function getNoteDetail(params: GetNoteDetailParams): Promise<NoteDetailResponse | {} | '404'> {
    try {
        let {noteId, ontologyId} = params;
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/get/' + noteId + '?withComments=True&ontology=' + ontologyId;
        let result: any = await fetch(url, {headers: headers});
        if (result.status === 404) {
            return '404';
        }
        result = await result.json();
        let noteResp: NoteDetailResponse = result['_result'];
        let note: NoteData | undefined = noteResp['note'];
        if (!note) {
            return {};
        }
        note['comments_count'] = note['comments'].length;
        if (!note['semantic_component_label'] && note['semantic_component_type'] !== "ontology") {
            let termApi: any = new TermApi(note['ontology_id'], note['semantic_component_iri'], note['semantic_component_type']);
            await termApi.fetchTerm({withRelations: false});
            note['semantic_component_label'] = termApi.term['label'];
        }
        noteResp['note'] = note;
        return noteResp;

    } catch (e) {
        return {}
    }
}


export async function submitNoteComment(params: CreateCommentParams): Promise<CommentData | boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/create_comment/';
        let result: any = await fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(params)});
        result = await result.json();
        result = result['_result']['comment_created'];
        return result;

    } catch (e) {
        return false;
    }
}


export async function editNoteComment(params: UpdateCommentParams) {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/update_comment/';
        let result: any = await fetch(url, {method: 'PUT', headers: headers, body: JSON.stringify(params)});
        result = await result.json();
        result = result['_result']['comment_updated'];
        return result;
    } catch (e) {
        return false;
    }
}


export async function pinnNote(params: PinnNoteParams): Promise<boolean> {
    try {
        let headers: TsPluginHeader = getTsPluginHeaders({isJson: true, withAccessToken: true});
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/update_pin/';
        let result: any = await fetch(url, {method: 'PUT', headers: headers, body: JSON.stringify(params)});
        return result.ok;
    } catch (e) {
        return false;
    }
}