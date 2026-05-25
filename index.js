if (command === "vv") {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!quoted) {
    return sock.sendMessage(from, {
      text: "❌ Réponds à une photo ou vidéo view once."
    });
  }

  // ===== VIEW ONCE V2 (le vrai format moderne WhatsApp) =====
  const viewOnceMsg =
    quoted.viewOnceMessageV2?.message ||
    quoted.viewOnceMessage?.message ||
    quoted;

  // DEBUG SAFE (optionnel)
  // console.log(JSON.stringify(viewOnceMsg, null, 2));

  // =========================
  // 📸 PHOTO VIEW ONCE
  // =========================
  const imageMsg =
    viewOnceMsg.imageMessage ||
    viewOnceMsg?.message?.imageMessage;

  if (imageMsg) {
    try {
      const stream = await downloadContentFromMessage(imageMsg, "image");
      let buffer = Buffer.from([]);

      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      return sock.sendMessage(from, {
        image: buffer,
        caption: "👀 Photo view once récupérée"
      });
    } catch (e) {
      return sock.sendMessage(from, {
        text: "❌ Erreur récupération image view once."
      });
    }
  }

  // =========================
  // 🎥 VIDÉO VIEW ONCE
  // =========================
  const videoMsg =
    viewOnceMsg.videoMessage ||
    viewOnceMsg?.message?.videoMessage;

  if (videoMsg) {
    try {
      const stream = await downloadContentFromMessage(videoMsg, "video");
      let buffer = Buffer.from([]);

      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      return sock.sendMessage(from, {
        video: buffer,
        caption: "👀 Vidéo view once récupérée"
      });
    } catch (e) {
      return sock.sendMessage(from, {
        text: "❌ Erreur récupération vidéo view once."
      });
    }
  }

  return sock.sendMessage(from, {
    text: "❌ Aucun média view once détecté (photo/vidéo)."
  });
}