import { structureTheMessagesForState } from './utils'
import * as moment from 'moment'
import { Message } from './interfaces'

describe('test for structureTheMessagesForState', () => {

    test('when we provided no messages then we should get empty object', () => {
        expect(structureTheMessagesForState(null)).toEqual({})
    })

    test('when we provided empty array of messages then we should get empty object', () => {
        expect(structureTheMessagesForState([])).toEqual({})
    })

    test(`when we provide list of messages and times are different then
            they should be converted to specifically shaped object`, () => {
        const time: string = moment().add(1, 'minutes').seconds(0).milliseconds(0).toISOString()
        const time1: string = moment().add(2, 'minutes').seconds(0).milliseconds(0).toISOString()
        const messages: Message[] = [
            { name: '1', time },
            { name: '2', time: time1 },
        ]
        const structure = structureTheMessagesForState(messages)
        expect(structure).toEqual({
            [time]: [messages[0]],
            [time1]: [messages[1]]
        })
    })
    test(`when we provide list of messages and time is the same then
            they should be converted to specifically shaped object`, () => {
        const time: string = moment().add(1, 'minutes').seconds(0).milliseconds(0).toISOString()
        const messages: Message[] = [
            { name: '1', time },
            { name: '2', time },
        ]
        const structure = structureTheMessagesForState(messages)
        expect(structure).toEqual({
            [time]: [messages[0], messages[1]]
        })
    })

    test(`when we provide list of messages and message has time in the past then
            only future events should be converted`, () => {
        const time: string = moment().add(10, 'minutes').seconds(0).milliseconds(0).toISOString()
        const time1: string = moment().add(-10, 'minutes').seconds(0).milliseconds(0).toISOString()
        const messages: Message[] = [
            { name: '1', time },
            { name: '2', time: time1 },
        ]
        const structure = structureTheMessagesForState(messages)
        expect(structure).toEqual({
            [time]: [messages[0]]
        })
    })
});
