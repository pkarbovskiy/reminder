import { Message, Error } from '../common/interfaces'

export abstract class AbstractStorageAdapter {
    protected connection
    /**
     * method to add a record
     * @param message message to add
     */
    public abstract addRecord(message: Message): void | Error

    // public abstract removeRecord(message: Message): void
    /**
     * method to get all records
     */
    public abstract async getAllRecords(): Promise<Message[]>
}