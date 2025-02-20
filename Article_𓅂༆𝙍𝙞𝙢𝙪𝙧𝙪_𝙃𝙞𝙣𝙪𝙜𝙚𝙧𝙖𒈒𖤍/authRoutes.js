const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    req.session.authenticated = true;
    res.send("Connexion réussie !");
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send("Déconnexion réussie !");
});

router.get('/status', (req, res) => {
    if (req.session.authenticated) {
        res.send("Utilisateur connecté !");
    } else {
        res.send("Utilisateur non connecté.");
    }
});

module.exports = router;
