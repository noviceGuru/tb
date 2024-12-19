import { WebSocket } from 'ws';
import { OPEN, RawData, WebSocketServer } from "ws";

const port = 8000;
const wsServer = new WebSocketServer({ port });

type ClientInfo = {
    id: number;
    address: string | undefined;
    connectTime: string;
}

// Store connected clients with unique IDs
const clients = new Map<WebSocket, ClientInfo>();
let clientIdCounter = 1;

console.log('Server started on port', port);

wsServer.on("connection", (ws: WebSocket, req) => {
    // Assign unique ID to client
    const clientId = clientIdCounter++;
    const clientInfo: ClientInfo = {
        id: clientId,
        address: req.socket.remoteAddress,
        connectTime: new Date().toISOString()
    };
    
    // Store client
    clients.set(ws, clientInfo);
    console.log(`New client connected! ID: ${clientId}`);
    printConnectedClients();

    ws.on("message", (message: RawData) => {
        console.log(`Message from client ${clientId}:`, JSON.parse(message.toString()));
        broadcastMessage(ws, JSON.parse(message.toString()));
    });

    // Remove client on disconnect
    ws.on("close", () => {
        console.log(`Client ${clientId} disconnected`);
        clients.delete(ws);
        printConnectedClients();
    });

    // Handle errors
    ws.on("error", (error) => {
        console.error(`Error with client ${clientId}:`, error);
    });
});

// Function to print connected clients
function printConnectedClients() {
    console.log('\nCurrently connected clients:');
    console.log('---------------------------');
    if (clients.size === 0) {
        console.log('No clients connected');
    } else {
        clients.forEach((client) => {
            console.log(`ID: ${client.id}`);
            console.log(`IP: ${client.address}`);
            console.log(`Connected at: ${client.connectTime}`);
            console.log('---------------------------');
        });
    }
    console.log(`Total clients: ${clients.size}\n`);
}

// Optional: Print connected clients periodically
setInterval(printConnectedClients, 30000); // Print every 30 seconds

function broadcastMessage(ws: WebSocket, message: any) {
    const sender = clients.get(ws);
    if (!sender) return;

    clients.forEach((clientInfo, client) => {
        if (clientInfo.id !== sender.id && client.readyState === OPEN) {
            const messageWithSender = {
                from: sender.id,
                ...message
            };
            client.send(JSON.stringify(messageWithSender));
        }
    });
}