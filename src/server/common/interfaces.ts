
export interface Message {
    time: string,
    name: string
}

export interface Error {
    error: string
}

export type ReminderTable = {
    [time: string]: Message[]
}