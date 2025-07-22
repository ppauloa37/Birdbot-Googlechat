const functions = require('firebase-functions');

exports.chatBot = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST' || !req.body) {
        return res.status(400).send('Bad Request');
    }

    const event = req.body;
    console.log('Evento do Chat recebido:', JSON.stringify(event));

    let reply = {};

    if (event.type === 'MESSAGE' && event.message.text) {
        const receivedText = event.message.text.toLowerCase();

        if (receivedText.includes('olá') || receivedText.includes('oi')) {
            reply = { "text": "Olá! Como posso ajudar você hoje?" };
        } else if (receivedText.includes('hora')) {
            const now = new Date();
            const options = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Fortaleza', // Fuso horário para São Bento, Paraíba
                hour12: false
            };
            reply = { "text": `Agora são ${now.toLocaleTimeString('pt-BR', options)} em São Bento, Paraíba.` };
        } else {
            reply = { "text": "Entendi: '" + event.message.text + "'. Tente perguntar sobre a 'hora' ou diga 'olá'!" };
        }
    } else if (event.type === 'ADDED_TO_SPACE') {
        reply = { "text": `Obrigado por me adicionar ao espaço ${event.space.displayName || 'este espaço'}! Digite 'olá' para começar.` };
    } else if (event.type === 'REMOVED_FROM_SPACE') {
        console.log('Bot removido do espaço:', event.space.displayName || 'este espaço');
        return res.status(200).send('OK');
    } else {
        console.log('Evento não suportado:', event.type);
        return res.status(200).send('OK');
    }

    res.json(reply);
});
