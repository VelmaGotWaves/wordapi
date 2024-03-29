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

    const { ime, adresa, preduzetnik, punNaziv, poslovnoIme, registracije } = req.body;
    console.log({ ime, adresa, preduzetnik, punNaziv, poslovnoIme, registracije })

    let gay = '“LUKA PEDERCINA” из Београда, ул. бр.'
    let niz = ["123NZ", "604NZ", "605NZ", "606NZ", "607NZ"];
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
                        children: [new TextRun(uGenitiv(ime)), new TextRun()],
                    },
                    odobrava_se: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun(uDativ(ime)), new TextRun()],
                    },
                    registarski_br1: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun(tablica)],
                    },
                    podneo_je: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun(gay)],
                    },
                    registarski_br2: {
                        type: PatchType.PARAGRAPH,
                        children: [new TextRun(tablica)],
                    },
                    // sledeci_dokument: {
                    //     type: PatchType.DOCUMENT,
                    //     children: funkcija
                    // }
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
        const isVowel = ['a', 'e', 'i', 'o', 'u'].includes(lastLetter.toLowerCase());

        const modifiedWord = isVowel ? word.slice(0, -1) + 'e' : word + 'a';
        return modifiedWord;
    });

    const modifiedSentence = modifiedWords.join(' ');

    return modifiedSentence;
}
function uDativ(ime) {
    const words = ime.split(' ');

    const modifiedWords = words.map(word => {
        const lastLetter = word[word.length - 1];
        const isVowel = ['a'].includes(lastLetter.toLowerCase());
        const isVowel2 = ['e', 'i', 'o', 'u'].includes(lastLetter.toLowerCase());

        const modifiedWord = isVowel ? word.slice(0, -1) + 'i' : isVowel2?word.slice(0, -1) + 'y' : word + 'y';
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