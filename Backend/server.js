const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error("Помилка підключення до БД:", err.message);
    else console.log("База даних підключена успішно.");
});

// Створюємо таблицю (оновлену)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        level INTEGER,
        time_seconds INTEGER,
        turns INTEGER
    )`);
});

app.get('/api/leaderboard', (req, res) => {
    db.all("SELECT * FROM scores ORDER BY level DESC, time_seconds ASC LIMIT 10", [], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

app.post('/api/scores', (req, res) => {
    const { username, level, time_seconds, turns } = req.body;
    db.run("INSERT INTO scores (username, level, time_seconds, turns) VALUES (?, ?, ?, ?)", 
    [username, level, time_seconds, turns], function(err) {
        if (err) return res.status(500).send(err);
        res.json({ id: this.lastID });
    });
});

app.delete('/api/scores/:id', (req, res) => {
    if (req.body.password !== '1111') return res.status(403).json({error: 'Pass'});
    db.run("DELETE FROM scores WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ status: 'ok' });
    });
});

app.listen(3000, () => console.log("Server 3000 online"));