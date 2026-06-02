class ConsoleManager {
    static clear() {
        engineConsole.logs = [];
        engineConsole.updateUI();
    }

    static exportLogs() {
        const text = engineConsole.logs.map(log => `[${log.time}] ${log.message}`).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'console-log.txt';
        a.click();
    }
}