import { Message, ReminderTable } from './interfaces'
import * as moment from 'moment'
/**
 * method to create optimal structure for state
 * @param messages array of messages
 */
const structureTheMessagesForState = (messages: Message[]): { [time: string]: Message[] } => {
    // tyoescript should catch this, just a little of savety net
    if (!messages) {
        return {}
    }

    return messages.reduce((acc, val) => {
        // removing events in the past
        if (moment(val.time).isBefore(Date.now())) {
            return acc
        }
        // if no record with this time exists 
        if (acc[val.time] == null) {
            acc[val.time] = []
        }

        acc[val.time].push(val)

        return acc
    }, {} as ReminderTable)
}
/**
 * method to get time in iso format
 * @param time time in string format
 */
const convertToISOTime = (time: string): string =>
    moment(time).seconds(0).milliseconds(0).toISOString()

export { structureTheMessagesForState, convertToISOTime }