const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = "7909700744:AAFW9vb74CcR4ppzlwHfFSmloWjE4SfVEUI"; // ✅ यहाँ अपना बॉट टोकन डालें

// ✅ API Running Check
app.get("/", (req, res) => {
    res.send("✅ Broadcast API is running successfully!");
});

// ✅ Broadcast Message API
app.post("/save-broadcast", async (req, res) => {
    const { message, image, users } = req.body;

    if (!message || !users) {
        return res.status(400).json({ success: false, error: "Message and users are required!" });
    }

    for (let user of users) {
        let payload = {
            chat_id: user,
            text: message,
            parse_mode: "HTML"
        };

        // ✅ अगर इमेज भी भेजनी है
        if (image) {
            payload = {
                chat_id: user,
                photo: image,
                caption: message,
                parse_mode: "HTML"
            };
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, payload);
        } else {
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, payload);
        }
    }

    res.json({ success: true, message: "📢 Broadcast Sent Successfully!" });
});

// ✅ Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Broadcast API running on port ${PORT}`));
