import mongoose from 'mongoose'

export const messageSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['text', 'common'],
        default: 'text'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function(this: { type: string }) {
            return this.type !== 'common';
        }
    },
    senderName: {
        type: String,
        required: function(this: { type: string }) {
            return this.type !== 'common';
        }
    },
    text: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String
    },
    seen: [{
        _id: false,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        seenAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { _id: false, timestamps: true });



export const chatSchema = new mongoose.Schema({
    name: { type: String },
    participants: [{
        _id: false,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        type: {
            type: String
        },
        name: {
            type: String
        }
    }],
    messages: [
        messageSchema
    ]
})

export default mongoose.model("Chat", chatSchema)