const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    downloadContentFromMessage
} = require('@whiskeysockets/baileys')

const qrcode = require('qrcode-terminal')
const sharp = require('sharp')

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState('session')

    const sock = makeWASocket({
        auth: state
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, qr, lastDisconnect } = update

        if (qr) {
            console.log("📌 Scan QR :")
            qrcode.generate(qr, { small: true })
        }

        if (connection === 'open') {
            console.log("🤖 Bot connecté ✔")
        }

        if (connection === 'close') {
            const code = lastDisconnect?.error?.output?.statusCode

            console.log("❌ Déconnecté :", code)

            if (code !== DisconnectReason.loggedOut) {
                startBot()
            }
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {

        const msg = messages[0]
        if (!msg.message) return

        const from = msg.key.remoteJid

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            ""

        const prefix = "!"

        // 🏓 ping
        if (text === prefix + "ping") {
            await sock.sendMessage(from, { text: "Pong 🏓" })
        }

        // ℹ️ info
        if (text === prefix + "info") {
            await sock.sendMessage(from, {
                text: "🤖 Zokou-MD Bot\n⚡ Baileys\n👨‍💻 Version custom"
            })
        }

        // 📋 MENU ZOKOU-MD
        if (text === prefix + "menu") {

            let cmsg = `
╔══════════════════╗
║ 『ENRIQUE-𝐌𝐃』
╠══════════════════╣
║ Prefix : [ ! ]
║ Mode : public
║ Status : 🟢 Actif
╚══════════════════╝

╔═════◇
║ ⚡ COMMANDES
╠═════◇
║ !ping → test bot
║ !info → infos bot
║ !say texte → répète
║ !sticker → image en sticker
╚═════◇

╔═════◇
║ 🚧 COMMANDES À VENIR
╠═════◇
║ !tiktok → téléchargement vidéo
║ !youtube → download vidéo/audio
║ !play → musique
║ !lyrics → paroles
║ !antilink → anti liens
║ !admin → outils groupe
╚═════◇

╔═════◇
║ 👨‍💻 BY DON ENRIQUE++
╚═════◇
`

            await sock.sendMessage(from, { text: cmsg })
        }

        // 💬 say
        if (text.startsWith(prefix + "say ")) {
            const args = text.slice(5)
            await sock.sendMessage(from, { text: args })
        }

        // 🎭 sticker (image → sticker)
        if (msg.message.imageMessage && text === prefix + "sticker") {

            try {
                const stream = await downloadContentFromMessage(
                    msg.message.imageMessage,
                    'image'
                )

                let buffer = Buffer.from([])

                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }

                const sticker = await sharp(buffer)
                    .resize(512, 512)
                    .png()
                    .toBuffer()

                await sock.sendMessage(from, {
                    sticker
                })

            } catch (err) {
                console.log("Sticker error:", err)
            }
        }

    })

}

startBot()