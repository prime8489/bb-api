const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = "7196811056:AAFq0KEswGZdF-SeMYtU61aBLUsiq-7P1Nw"; // ✅ अपना बॉट टोकन डालें

// ✅ API Running Check
app.get("/", (req, res) => {
    res.send("✅ Broadcast API is running successfully!");
});

// ✅ Broadcast Message API (फोटो + टेक्स्ट सपोर्ट)
app.post("/save-broadcast", async (req, res) => {
    const { message, image_id, users } = req.body;

    if (!message || !users) {
        return res.status(400).json({ success: false, error: "Message and users are required!" });
    }

    let sentUsers = [];
    let failedUsers = [];

    for (let user of users) {
        try {
            if (image_id) {
                // ✅ अगर इमेज है, तो Telegram की sendPhoto API इस्तेमाल करें
                await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    chat_id: user,
                    photo: image_id, // ✅ Telegram File ID से इमेज भेजेगा
                    caption: message,
                    parse_mode: "HTML"
                });
            } else {
                // ✅ सिर्फ टेक्स्ट मैसेज भेजें
                await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    chat_id: user,
                    text: message,
                    parse_mode: "HTML"
                });
            }

            sentUsers.push(user);
        } catch (error) {
            failedUsers.push(user);
        }
    }

    res.json({
        success: true,
        message: "📢 Broadcast Sent Successfully!",
        sent: sentUsers.length,
        failed: failedUsers.length
    });
});

// ✅ Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Broadcast API running on port ${PORT}`));
