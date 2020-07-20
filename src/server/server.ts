import * as WebSocket from 'ws'
import { Message, ReminderTable } from './common/interfaces'
import { structureTheMessagesForState, convertToISOTime } from './common/utils'
import { AbstractMessageServer } from './abstructs/abstruct-message-server'
import { AbstractStorageAdapter } from './abstructs/abstruct-storage-adapter'
import { CronJob } from 'cron'
import * as moment from 'moment'

export class WebSocketServer extends AbstractMessageServer<Message> {
    protected allReminders: ReminderTable

    constructor(wsServer: WebSocket.Server, protected storage: AbstractStorageAdapter) {
        super(wsServer)
        storage.getAllRecords().then(reminders => {
            this.allReminders = structureTheMessagesForState(reminders)
            new CronJob('* * * * * *', () => {
                this.sendReminder()
            }, null, true, '')
        })
    }
    /**
     * method for message handling
     * @param sender websocket
     * @param message command send by the client with time and name of reminder
     */
    protected handleMessage(sender: WebSocket, message: Message): void {
        // reset sec and milliseconds
        message.time = convertToISOTime(message.time)

        // if it's already in the past we dont need to add to allReminders
        if (moment(message.time).isAfter(Date.now()) && this.allReminders[message.time] == null) {
            this.allReminders[message.time] = [message]
            // adding to storage
            this.storage.addRecord(message)

            return
        }

        if (this.allReminders[message.time] &&
            !this.allReminders[message.time].some(msg => message.name === msg.name)
        ) {
            // adding to storage
            this.storage.addRecord(message)
            this.allReminders[message.time].push(message)
            return
        }
    }
    /**
     * method for broatcasting reminder to all connected clients
     */
    protected sendReminder(): void {
        //reset seconds and milliseconds to 0
        const currentDate = convertToISOTime(moment().toISOString())

        if (this.allReminders[currentDate] != null) {
            this.allReminders[currentDate].forEach((val: Message) => {
                this.broadcast(val)
            })
            delete this.allReminders[currentDate]
        }

    }
}