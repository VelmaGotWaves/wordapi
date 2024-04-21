const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/tabele(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'tabele.html'));
});

module.exports = router;