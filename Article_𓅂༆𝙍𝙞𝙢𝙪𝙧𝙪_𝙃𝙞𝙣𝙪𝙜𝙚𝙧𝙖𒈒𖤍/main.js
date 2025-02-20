const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline');

// Interface pour lire l'entrée utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Crée une nouvelle instance du client
const client = new Client({
    authStrategy: new LocalAuth()
});

// Fonction pour demander le numéro WhatsApp
const askForWhatsAppNumber = () => {
    rl.question("Veuillez entrer votre numéro WhatsApp (avec l'indicatif du pays, par exemple +33612345678) : ", (number) => {
        console.log(`Numéro reçu : ${number}`);
        // Ici, on pourrait stocker ou utiliser ce numéro comme nécessaire
        // Puis on initialise le client
        client.initialize();
        rl.close();
    });
};

// Événement lorsque le bot est prêt
client.on('ready', () => {
    console.log('Le bot est prêt !');
});

// Générez le QR code pour l'authentification
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Démarre le client et demande le numéro de téléphone
askForWhatsAppNumber();
