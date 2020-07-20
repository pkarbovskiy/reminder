import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'
import { WebSocketServer } from './server'

import { cfg } from '../../config'

import { MongoStorageAdapter, ReminderSchema } from './storage/mongooseAdapter'

const PORT = cfg.port
const app = express()

const httpServer: http.Server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Listening on http://localhost:${PORT}`)
    }
})

const wsServer = new WebSocket.Server({ server: httpServer })
new WebSocketServer(wsServer, new MongoStorageAdapter(ReminderSchema))