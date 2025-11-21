import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

class SocketService {
    private io: SocketIOServer | null = null;

    public init(httpServer: HttpServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: "http://localhost:3000", // Allow frontend
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    public emit(event: string, data: any) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
}

export const socketService = new SocketService();
