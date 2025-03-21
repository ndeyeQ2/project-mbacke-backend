const axios = require('axios');

// Endpoint pour le chatbot
exports.chatWithBot = async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Appelez l'API GPT pour générer une réponse
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a chatbot for a school exam management system.' },
                    { role: 'user', content: userMessage },
                ],
            },
            {
                headers: { Authorization: `Bearer YOUR_API_KEY` },
            }
        );

        // Réponse du chatbot
        const botReply = response.data.choices[0].message.content;
        res.status(200).json({ reply: botReply });
    } catch (error) {
        console.error('Erreur avec l\'API chatbot', error.message);
        res.status(500).json({ error: 'Une erreur est survenue avec le chatbot.' });
    }
};
