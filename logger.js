const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs.txt');

function setupLogger(app) {
    app.on('server:started', (port) => {
        const logLine = `[${new Date().toISOString()}] SERVER:STARTED: Port ${port}\n`;
        fs.appendFile(logFilePath, logLine, (err) => {
            if (err) console.error('Log write error:', err);
        });
    });

    app.on('server:stopped', () => {
        const logLine = `[${new Date().toISOString()}] SERVER:STOPPED\n`;
        fs.appendFile(logFilePath, logLine, (err) => {
            if (err) console.error('Log write error:', err);
        });
    });

    app.on('request:received', (data) => {
        const logLine = `[${new Date().toISOString()}] REQUEST:RECEIVED: ${data.method} ${data.url}\n`;
        fs.appendFile(logFilePath, logLine, (err) => {
            if (err) console.error('Log write error:', err);
        });
    });
}

module.exports = { setupLogger };
