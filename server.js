const express = require("express");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

/* Allow JSON */
app.use(express.json());

/* Serve website */
app.use(express.static("."));

/* Gemini */
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/* AI endpoint */
app.post("/organize", async (req, res) => {

    try {

        const userText = req.body.text;

        if (!userText) {

            return res.status(400).json({
                error: "لم يتم إدخال أي نص"
            });

        }

        /* Send request to Gemini */
        const response = await ai.models.generateContent({

         model: "gemini-3.5-flash-lite",

            contents: `
أنت مساعد ذكي لتنظيم المهام.

المستخدم سيكتب مجموعة من المهام
بطريقة عشوائية.

استخرج جميع المهام من كلامه.

لكل مهمة حدد:

1. اسم المهمة
2. الموعد
3. التصنيف
4. الأولوية

التصنيفات الممكنة:

دراسة
عمل
شخصي
مشتريات
صحة
أخرى

الأولوية تكون:

عالية
متوسطة
منخفضة

إذا لم يذكر المستخدم موعدًا،
اكتب "غير محدد".

أعد النتيجة بصيغة JSON فقط.

استخدم هذا الشكل:

[
    {
        "title": "اسم المهمة",
        "date": "الموعد",
        "category": "التصنيف",
        "priority": "الأولوية"
    }
]

النص الذي كتبه المستخدم:

${userText}
`
        });

        /* Get AI result */
        let text = response.text;

        /* Remove markdown code fences if Gemini adds them */
        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        /* Convert AI result to JSON */
        const result = JSON.parse(text);

        /* Send to website */
        res.json(result);

    } catch (error) {

        console.error("AI ERROR:", error);

        res.status(500).json({
            error: "حدث خطأ أثناء استخدام الذكاء الاصطناعي"
        });

    }

});

/* Start server */
app.listen(3000, () => {

    console.log("AI To-Do Organizer running at:");
    console.log("http://localhost:3000");

});