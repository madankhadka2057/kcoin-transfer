import app from './app';
import http from 'http';
import { socketService } from './services/SocketService';

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

socketService.init(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
