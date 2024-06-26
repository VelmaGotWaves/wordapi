const fs = require("fs");
const {
    patchDocument,
    PatchType,
    TextRun,
    Paragraph,
    Document,
    Packer,
} = require("docx");
const path = require('path');
// const merger = require('../merger/lib/groupdocs.merger');
const DocxMerger = require('@scholarcy/docx-merger');

const mladenovac = async (req, res) => {
}
const pesacka = async (req, res) => {
}
const snabdevanjeDo35t = async (req, res) => {
}
const mesalice = async (req, res) => {
}
const obrenovac = async (req, res) => {
}
const vangabarit = async (req, res) => {
}
const snabdevanjePreko35t = async (req, res) => {
}
const autoSkola = async (req, res) => {
}
const barajevo = async (req, res) => {
}
const gradilista = async (req, res) => {
}
const gradilistaVangabarit = async (req, res) => {
}
const kretanjeFizickoLice = async (req, res) => {
}
const izmenaResenja = async (req, res) => {
}
const lazarevac = async (req, res) => {
}
const kretanja = async (req, res) => {

    const docxMerger = new DocxMerger();

    let { ime, adresa, preduzetnik, punNaziv, registracije } = req.body;
    
    adresa = adresa.split(' ')
    let broj = adresa.splice('-1')[0];
    let niz = ["из Београда, ул.", "бр."];
    let dokumenti = [];
    console.log('hello world')
    let promises = [];

    registracije.forEach(tablica => {
        const promise = patchDocument(
            fs.readFileSync(path.join(__dirname, 'OBRAZAC-KRETANJE.docx')),
            {
                patches: {
                    po_zahtevu: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun(preduzetnik?uGenitiv(ime)+ " ":ime + " "), new TextRun(punNaziv + " "), new TextRun(niz[0] + " "), new TextRun(adresa.join(' ') + " "), new TextRun(niz[1] + " "), new TextRun(broj)],
                    },
                    odobrava_se: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun(preduzetnik?uDativ(ime)+ " ":ime + " "), new TextRun(punNaziv + " "), new TextRun(niz[0] + " "), new TextRun(adresa.join(' ') + " "), new TextRun(niz[1] + " "), new TextRun(broj)],
                    },
                    registarski_br1: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun(tablica)],
                    },
                    podneo_je: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun(ime+ " "), new TextRun(punNaziv + " "), new TextRun(niz[0] + " "), new TextRun(adresa.join(' ') + " "), new TextRun(niz[1] + " "), new TextRun(broj)],
                    },
                    registarski_br2: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun(tablica)],
                    },
                },
                keepOriginalStyles: true,

            });
        promises.push(promise);
        promise.then((doc) => {
            // return doc;
            // fs.writeFileSync("My Document1.docx", doc);

            const buffer = Buffer.from(doc);
            dokumenti.push(buffer)

            // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            // res.send(buffer);
        })
    });

    Promise.all(promises)
        .then(async () => {
            // All promises resolved, now log dokumenti

            await docxMerger.initialize({}, dokumenti);
            const data = await docxMerger.save('nodebuffer');
            // fs.writeFileSync("output1.docx", data);
            dokumenti = [];
            promises = [];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(data);
        })
        .catch((error) => {
            // Handle errors if any of the promises fail
            console.error('Error occurred:', error);
        });


    // const file1 = fs.readFileSync(path.resolve(__dirname, 'sample1.docx'));
    // const file2 = fs.readFileSync(path.resolve(__dirname, 'sample2.docx'));
    // const docxMerger = new DocxMerger();
    // await docxMerger.initialize({}, [file1, file2]);
    // //SAVING THE DOCX FILE
    // const data = await docxMerger.save('nodebuffer');
    // fs.writeFileSync("output.zip", data);
    // fs.writeFileSync("output.docx", data);



}

function uGenitiv(ime) {
    const words = ime.split(' ');

    const modifiedWords = words.map(word => {
        const lastLetter = word[word.length - 1];
        const isVowel = ['а', 'е', 'и', 'у'].includes(lastLetter.toLowerCase());
        const isVowel2 = ['о'].includes(lastLetter.toLowerCase());

        const modifiedWord = isVowel ? word.slice(0, -1) + 'е' : isVowel2? word.slice(0, -1) + 'а' :word + 'а';
        return modifiedWord;
    });

    const modifiedSentence = modifiedWords.join(' ');

    return modifiedSentence;
}
function uDativ(ime) {
    const words = ime.split(' ');

    const modifiedWords = words.map(word => {
        const lastLetter = word[word.length - 1];
        const isVowel = ['а'].includes(lastLetter.toLowerCase());
        const isVowel2 = ['е', 'и', 'о', 'у'].includes(lastLetter.toLowerCase());

        const modifiedWord = isVowel ? word.slice(0, -1) + 'и' : isVowel2?word.slice(0, -1) + 'у' : word + 'у';
        return modifiedWord;
    });

    const modifiedSentence = modifiedWords.join(' ');

    return modifiedSentence;
}

module.exports = {
    mladenovac,
    pesacka,
    snabdevanjeDo35t,
    mesalice,
    obrenovac,
    vangabarit,
    snabdevanjePreko35t,
    autoSkola,
    barajevo,
    gradilista,
    gradilistaVangabarit,
    kretanjeFizickoLice,
    izmenaResenja,
    lazarevac,
    kretanja,
}