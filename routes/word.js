const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController')


router.route('/')
    .post((req, res) => {
        switch (req.body.obrazac) {
            case "mladenovac":
                wordController.mladenovac(req, res);
                break;
            case "pesacka":
                wordController.pesacka(req, res);
                break;
            case "snabdevanjeDo35t":
                wordController.snabdevanjeDo35t(req, res);
                break;
            case "mesalice":
                wordController.mesalice(req, res);
                break;
            case "obrenovac":
                wordController.obrenovac(req, res);
                break;
            case "vangabarit":
                wordController.vangabarit(req, res);
                break;
            case "snabdevanjePreko35t":
                wordController.snabdevanjePreko35t(req, res);
                break;
            case "autoSkola":
                wordController.autoSkola(req, res);
                break;
            case "barajevo":
                wordController.barajevo(req, res);
                break;
            case "gradilista":
                wordController.gradilista(req, res);
                break;
            case "gradilistaVangabarit":
                wordController.gradilistaVangabarit(req, res);
                break;
            case "kretanjeFizickoLice":
                wordController.kretanjeFizickoLice(req, res);
                break;
            case "izmenaResenja":
                wordController.izmenaResenja(req, res);
                break;
            case "lazarevac":
                wordController.lazarevac(req, res);
                break;
            case "kretanja":
                wordController.kretanja(req, res);
                break;
            default:
                return res.status(400).json({ 'message': 'Greska' });
                break;
        }
    })
   
module.exports = router;