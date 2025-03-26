import { INote } from "../../types/note.types";

export interface INoteRepository {
    addNote(orgId: string, newNote: Partial<INote>): Promise<INote | null>
    getContentNotesByEntityIds(orgId: string, entity_ids: string[]): Promise<INote[]>
}