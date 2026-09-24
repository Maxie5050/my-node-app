const http = require('http');
const EventEmitter = require('events');
const logger = require('./logger');

// === Task 3: OrderHandler (Pi to 7 decimal places) ===
class OrderHandler extends EventEmitter {
    processOrder(orderId) {
        this.emit('order:start', orderId);

        setTimeout(() => {
            this.emit('order:processing', orderId);
        }, 2000);

        setTimeout(() => {
            const randomSum = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
            this.emit('order:complete', orderId, randomSum);
        }, 4000);
    }
}

function calculatePi7() {
    let pi = 0;
    let sign = 1;
    const iterations = 20000000; 
    for (let i = 0; i < iterations; i++) {
        pi += sign / (2 * i + 1);
        sign = -sign;
    }
    return (pi * 4).toFixed(7);
}

// === Task 5: UserTracker ===
class UserTracker extends EventEmitter {
    trackAction(userId, action, metadata) {
        const eventData = {
            userId: userId,
            action: action,
            timestamp: new Date().toISOString(),
            metadata: metadata,
            id: Math.random().toString(36).substr(2, 9)
        };
        this.emit('user:action', eventData);
    }
}

const orderHandler = new OrderHandler();
const userTracker = new UserTracker();

// === Task 1: AppServer ===
class AppServer extends EventEmitter {
    constructor() {
        super();
        this.server = http.createServer((req, res) => {
            this.emit('request:received', { method: req.method, url: req.url });

            // === Task 3: Orders endpoint /order/<id> ===
            if (req.method === 'GET' && req.url.startsWith('/order/')) {
                const parts = req.url.split('/');
                const orderId = parts[parts.length - 1] || 'unknown';
                orderHandler.processOrder(orderId);
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end(`Order #${orderId} accepted for processing.`);
            }

            // HTML response for main page
            if (req.url === '/') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(`
                    <h1>Student Information (Variant 5):</h1>
                    <p><b>Full Name:</b> Hladki Maksym Vadymovych</p>
                    <p><b>Group:</b> 477</p>
                    <p><b>Pi Value (7 places):</b> ${calculatePi7()}</p>
                `);
            }

            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end("Hello from Event-Driven Server!");
        });
    }

    start(port) {
        this.server.listen(port, () => {
            this.emit('server:started', port);
        });
    }

    stop() {
        this.server.close(() => {
            this.emit('server:stopped');
        });
    }
}

const app = new AppServer();
logger.setupLogger(app);

app.on('server:started', (port) => console.log(`Server started on port ${port}`));
app.on('server:stopped', () => console.log('Server stopped'));
app.on('request:received', (data) => console.log(`Request received: ${data.method} ${data.url}`));

orderHandler.on('order:start', (id) => console.log(`-> [order:start] Order #${id} started`));
orderHandler.on('order:processing', (id) => console.log(`-> [order:processing] Order #${id}: In progress...`));
orderHandler.on('order:complete', (id, sum) => {
    const piValue = calculatePi7();
    console.log(`-> [order:complete] Order #${id} completed for ${sum} rub. PI=${piValue}`);
});

userTracker.on('user:action', (data) => {
    console.log(`\n[+] User ${data.userId} performed action "${data.action}"`);
    console.log(`    Time: ${data.timestamp}`);
    console.log(`    Event ID: ${data.id}`);
    console.log(`    Metadata: ${JSON.stringify(data.metadata)}`);
});

app.start(3000);

userTracker.trackAction('user_max', 'login', { device: 'PC' });
userTracker.trackAction('user_max', 'view_page', { page: 'home' });

setTimeout(() => {
    app.stop();
}, 10000);
