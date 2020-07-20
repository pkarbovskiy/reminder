import * as WebSocket from 'ws'

export abstract class AbstractMessageServer<T> {
    constructor(private readonly wsServer: WebSocket.Server) {
        this.wsServer.on('connection', this.subscribeToMessages)
        this.wsServer.on('error', this.cleanupDisconnectedClients)
    }

    protected abstract handleMessage(sender: WebSocket, message: T): void
    /**
     * method to subscribe to message event
     * @param ws websocket
     */
    protected readonly subscribeToMessages = (ws: WebSocket): void => {
        ws.on('message', (data: WebSocket.Data) => {
            if (typeof data === 'string') {
                this.handleMessage(ws, JSON.parse(data))
            } else {
                console.log('Unsupported data type.')
            }
        })
    }
    /**
     * method to remove disconnected clients
     */
    private readonly cleanupDisconnectedClients = (): void => {
        this.wsServer.clients.forEach(client => {
            if (this.isDisconnected(client)) {
                this.wsServer.clients.delete(client)
            }
        })
    }
    /**
     * method to broatcast message to all connected clients
     * @param message message to broadcast
     */
    protected broadcast(message: Readonly<T>): void {
        this.wsServer.clients.forEach(client => {
            client.send(JSON.stringify(message))
        })
    }
    /**
     * method to reply to specific client
     * @param client ws client
     * @param message message to send
     */
    protected replyTo(client: WebSocket, message: Readonly<T>): void {
        client.send(JSON.stringify(message))
    }
    /**
     * get method to get all clients
     */
    protected get clients(): Set<WebSocket> {
        return this.wsServer.clients
    }
    /**
     * method to check if client is still connected
     * @param client ws client
     */
    private isDisconnected(client: WebSocket): boolean {
        return (
            client.readyState === WebSocket.CLOSING ||
            client.readyState === WebSocket.CLOSED
        )
    }
}