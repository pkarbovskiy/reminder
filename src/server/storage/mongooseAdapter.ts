import { Schema, connect, model, Document } from 'mongoose'
import { cfg } from '../../../config'
import { AbstractStorageAdapter } from '../abstructs/abstruct-storage-adapter'
import { Message } from '../common/interfaces'

if (!cfg.mongoUrl) {
    throw new Error("MONGO_URL env variable not set");
}

connect(cfg.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const ReminderSchema: Schema = new Schema({
    name: { type: String, required: true },
    time: { type: Date, index: true },
})

export { ReminderSchema }

export interface MessageDocument extends Document {
    name: string;
    time: string;
}

export class MongoStorageAdapter extends AbstractStorageAdapter {

    protected Model

    constructor(mSchema: Schema) {
        super()
        this.Model = model<MessageDocument>('reminder', mSchema)
    }

    public addRecord(message: Message): void | { error: string } {

        if (message.name == null) {
            return { error: 'name is required' }
        }

        const reminder = new this.Model(message)

        reminder.save(err => {
            //probably should send to the log or notify the client
            if (err) return console.log(err)
            console.log(`new record was added`)
        })

    }

    public removeRecord(message: Message): void {
        this.Model.deleteMany(message, err => console.log(err))
    }

    public async getAllRecords(): Promise<Message[]> {
        return await this.Model.find().exec()
    }
} 