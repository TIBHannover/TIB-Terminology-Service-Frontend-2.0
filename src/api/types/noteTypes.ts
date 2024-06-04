export type NewNoteRequest = {
    title: string,
    semantic_component_iri: string,
    semantic_component_label: string,
    semantic_component_type: string,
    content: string,
    ontology_id: string,
    visibility: string
}

export type GetNoteDetailParams = {
    noteId?: string,
    ontologyId?: string
}

export type NoteListParams = {
    ontologyId: string,
    type?: string,
    pageNumber?: number | string,
    pageSize?: number | string,
    targetTerm?: any,
    onlyOntologyOriginalNotes?: boolean

}

export type CreateCommentParams = {
    noteId: string,
    content: string
}

export type UpdateCommentParams = {
    commentId: string,
    content: string,
    ontologyId: string
}

export type PinnNoteParams = {
    ontology: string,
    note_id: string,
    pinned: boolean
}

export type NoteData = {
    id: string,
    title: string,
    content: string,
    semantic_component_iri?: string,
    semantic_component_label?: string,
    semantic_component_type?: string,
    ontology_id: string,
    visibility: string,
    created_at: string,
    client_ts?: string,
    created_by: string,
    pinned?: boolean,
    parent_ontology?: string,
    is_reported?: boolean,
    can_edit?: boolean,
    imported?: boolean,
    comments: Array<any> | [],
    comments_count?: number | string,
}

export type NoteListStats = {
    number_of_pinned?: number | string,
    page?: number | string,
    size?: number | string,
    total_number_of_records?: number | string,
    totalPageCount?: number | string,
}

export type NoteListResponse = {
    notes: Array<NoteData> | [],
    stats: NoteListStats
}

export type NoteDetailResponse = {
    note?: NoteData,
    number_of_pinned?: number | string,
}

export type CommentData = {
    id: string,
    content: string,
    created_at: string,
    updated_at?: string,
    created_by: string,
    note_id: string
}