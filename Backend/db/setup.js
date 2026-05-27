const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    // Видаляємо стару таблицю, якщо хочеш почати з чистого листа (опціонально)
    // db.run(`DROP TABLE IF EXISTS scores`);

    db.run(`CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        time_seconds INTEGER NOT NULL,
        turns INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error("Помилка створення таблиці:", err.message);
        else console.log("База даних готова до роботи.");
    });
});

module.exports = db;