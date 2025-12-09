require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ----- MIDDLEWARE -----
app.use(cors());
app.use(bodyParser.json());

// ----- SERVE FRONTEND -----
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// ----- IN-MEMORY STORAGE -----
let inboxes = {};
// Structure:
// {
//    "test@tempmail.demo": [
//        { sender, subject, body, date, attachments, replies }
//    ]
// }
// store demo cards per inbox
let demoCards = {}; 
// demoCards = { "user@tempmail.demo": { holder, number, expiry, cvv } }

function createDemoCard(inbox) {
  const holder = inbox.split("@")[0];
  const number = "4" + Math.floor(100000000000000 + Math.random() * 900000000000000)
    .toString()
    .replace(/(.{4})/g, "$1 ").trim();
  const expiry = "12/29";
  const cvv = Math.floor(100 + Math.random() * 900).toString();

  return { holder, number, expiry, cvv };
}


// 1️⃣ CREATE INBOX
app.post("/create-inbox", (req, res) => {
    const { inbox } = req.body;

    if (!inbox) return res.status(400).json({ error: "Inbox required" });

    if (!inboxes[inbox]) inboxes[inbox] = [];

    res.json({ message: "Inbox created", inbox });
});

// 2️⃣ GET MESSAGES
app.get("/messages/:inbox", (req, res) => {
    const { inbox } = req.params;
    if (!inboxes[inbox]) return res.status(404).json({ error: "Inbox not found" });

    res.json({ messages: inboxes[inbox] });
});

// 3️⃣ SEND MESSAGE
app.post("/send-message", (req, res) => {
    const { inbox, sender, subject, body, attachments } = req.body;

    if (!inboxes[inbox]) return res.status(404).json({ error: "Inbox not found" });

    const msg = {
        sender,
        subject,
        body,
        date: new Date(),
        attachments: attachments || [],
        replies: []
    };

    inboxes[inbox].push(msg);
    res.json({ message: "Message received", msg });
});

// 4️⃣ REPLY TO A MESSAGE
app.post("/reply-message", (req, res) => {
    const { inbox, msgIndex, replySender, replyBody } = req.body;

    if (!inboxes[inbox]) return res.status(404).json({ error: "Inbox not found" });
    if (!inboxes[inbox][msgIndex]) return res.status(404).json({ error: "Message not found" });

    inboxes[inbox][msgIndex].replies.push({
        sender: replySender,
        body: replyBody,
        date: new Date()
    });

    res.json({ message: "Reply added", msg: inboxes[inbox][msgIndex] });
});

// 5️⃣ DELETE INBOX
app.delete("/delete-inbox/:inbox", (req, res) => {
    const { inbox } = req.params;

    if (!inboxes[inbox]) return res.status(404).json({ error: "Inbox not found" });

    delete inboxes[inbox];

    res.json({ message: "Inbox deleted" });
});

// 6️⃣ DEMO CARD
app.get("/demo-card/:inbox", (req, res) => {
    const { inbox } = req.params;

    if (!inboxes[inbox]) return res.status(404).json({ error: "Inbox not found" });

    const card = {
        holder: inbox.split("@")[0],
        number: "4111 1111 1111 1111",
        expiry: "12/29",
        cvv: "123"
    };

    res.json({ card });
});

// ----- START SERVER -----
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
