import { NoteData } from "../api/types/noteTypes";

export class TsNote {
  noteData: NoteData;

  constructor(noteData: NoteData) {
    this.noteData = noteData;
  }

  get id(): string {
    return this.noteData.id ?? "";
  }

  get title(): string {
    return this.noteData.title ?? "";
  }

  get content(): string {
    return this.noteData.content ?? "";
  }

  get semantic_component_iri(): string {
    return this.noteData.semantic_component_iri ?? "";
  }

  get semantic_component_label(): string {
    return this.noteData.semantic_component_label ?? "";
  }

  get semantic_component_type(): string {
    return this.noteData.semantic_component_type ?? "";
  }

  get ontology_id(): string {
    return this.noteData.ontology_id ?? "";
  }

  get visibility(): string {
    return this.noteData.visibility ?? "";
  }

  get created_at(): string {
    return this.noteData.created_at ?? "";
  }

  get client_ts(): string | undefined {
    return this.noteData.client_ts;
  }

  get created_by(): any {
    return this.noteData.created_by;
  }

  get pinned(): boolean {
    return this.noteData.pinned ?? false;
  }

  get parent_ontology(): string | undefined {
    return this.noteData.parent_ontology;
  }

  get is_reported(): boolean {
    return this.noteData.is_reported ?? false;
  }

  get can_edit(): boolean {
    return this.noteData.can_edit ?? false;
  }

  get imported(): boolean {
    return this.noteData.imported ?? false;
  }

  get comments(): Array<any> {
    return this.noteData.comments ?? [];
  }

  get comments_count(): number | string {
    return this.noteData.comments_count ?? this.comments.length;
  }
}
