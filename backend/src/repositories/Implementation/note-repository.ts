import { Model, Schema, Types } from "mongoose";
import { connectTenantDB } from "../../config/db.config";
import { inject, injectable } from "tsyringe";
import { BaseRepository, CustomError } from "mern.common";
import { INote } from "../../types/note";
import { INoteRepository } from "../Interface/INoteRepository";
import { agencyTenantSchema } from "../../models/Implementation/agency";
import { clientTenantSchema } from "../../models/Implementation/client";
import mongoose from "mongoose";

@injectable()
export class NoteRepository extends BaseRepository<INote> implements INoteRepository {
    private _messageSchema: Schema;
    private _modelName = 'note';
    private _models: Map<string, Model<INote>> = new Map();

    constructor(
        @inject('note_model') schema: Schema
    ) {
        super(null as unknown as Model<INote>);
        this._messageSchema = schema;
    }

    private async getModel(
        orgId: string
    ): Promise<Model<INote>> {
        if (this._models.has(orgId)) {
            return this._models.get(orgId)!;
        }

        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');

        let model: Model<INote> = connection.model<INote>(this._modelName, this._messageSchema);
        this._models.set(orgId, model);
        return model;
    }




    async addNote(
        orgId: string,
        newNote: Partial<INote>
    ): Promise<INote | null> {
        const model = await this.getModel(orgId);
        const note = new model(newNote)
        return await note.save();
    }

    private getModelByType(type: 'Ownerdetail' | 'Client', connection: mongoose.Connection): Model<any> {
        return connection.models[type] || connection.model(type, type === 'Ownerdetail' ? agencyTenantSchema : clientTenantSchema);
    }
    

    async getContentNotesByEntityIds(
        orgId: string,
        entity_ids: string[]
    ): Promise<INote[]> {
        const model = await this.getModel(orgId);

        const notes = await model.find({
            entityType: "content",
            entityId: { $in: entity_ids },
        }).exec();
        const tenantConnection = await connectTenantDB(orgId);

        for (const note of notes) {
            const AddedByModel = this.getModelByType(note.addedByModel as 'Ownerdetail' | 'Client', tenantConnection);        
            const addedByDoc = await AddedByModel.findOne({ _id: note.addedBy }).select('name email profile')
            .lean<{ name?: string; email?: string; profile?: string }>();
            note.addedBy = addedByDoc ? { 
                name: addedByDoc.name ?? "user", 
                email: addedByDoc.email ?? "", 
                profile: addedByDoc.profile ?? "" 
              }
            : note.addedBy;        
        }

        return notes;
    }



}
