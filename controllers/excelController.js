const fs = require("fs");
const path = require('path');
const excelToJson = require('convert-excel-to-json');
const {
    patchDocument,
    PatchType,
    TextRun,
    Paragraph,
    Document,
    Packer,
    Table,
    TableCell,
    TableRow,
    WidthType,
    VerticalAlign,
    TextDirection,
    AlignmentType,
    HeadingLevel,
} = require("docx");
const excel_to_word = async (req, res) => {

    // iz body izvadi dokument 
    const excelFile = req.files.excelFile;
    // console.log(req.files)
    //pretvori u json

    
    const jsonExcel = excelToJson({
        source: excelFile.data
    });
    let jsonRows = jsonExcel.Sheet1;
    let indexPocetkaPodataka = jsonRows.findIndex(red => red.B == 1 || red.B == "1")
    console.log(indexPocetkaPodataka)
    let kolicinaRedovaPodataka = jsonRows.length - indexPocetkaPodataka - 1;

    let setUlica = Array.from(new Set(jsonRows.slice(indexPocetkaPodataka, -1).map(red => red.A)));
    let redoviSaPodacima = jsonRows.slice(indexPocetkaPodataka, -1)

    patchDocument(
        fs.readFileSync(path.join(__dirname, 'IzmenaSaobracaja.docx')),
        {
            styles: {
                default: {
                    document: {
                        paragraph: {
                            font: "Tahoma",
                            size: "18",
                        },
                    }

                },
                paragraphStyles: [
                    {
                        id: "crveneFaze",
                        name: "Crvene Faze",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            font: "Tahoma",
                            color: "FF0000",
                            size: "18",
                        },

                    },
                    {
                        id: "normalan",
                        name: "Normalan",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            font: "Tahoma",
                            size: "18",
                        },

                    },
                ],
            },
            patches: {
                ubaci_set_ulica1: {
                    type: PatchType.PARAGRAPH,
                    children: setUlica.map((ulica , indeks) => new TextRun(indeks != setUlica.length-1?latinicaUCirilicu(ulica) + ", ": latinicaUCirilicu(ulica))),
                },
                ubaci_set_ulica2: {
                    type: PatchType.PARAGRAPH,
                    children: setUlica.map((ulica , indeks) => new TextRun(indeks != setUlica.length-1?latinicaUCirilicu(ulica) + ", ": latinicaUCirilicu(ulica))),
                },
                crvene_faze: {
                    type: PatchType.DOCUMENT,
                    children:
                        redoviSaPodacima.map(red => {
                            return new Paragraph({
                                style: "crveneFaze",
                                children: [
                                    new TextRun({
                                        text: `- Фаза ${red.B}: ул. ${latinicaUCirilicu(red.A)} `,
                                        bold: true,
                                        font: "Tahoma",
                                        color: "FF0000",
                                        size: "18",
                                    }),
                                    new TextRun({
                                        text: `(радне јаме ${generisiRadneJameString(latinicaUCirilicu(red.C).split(','))}), од дана `,
                                        bold: false,
                                        font: "Tahoma",
                                        color: "FF0000",
                                        size: "18",
                                    }),
                                    new TextRun({
                                        text: `${red.K}${new Date().getFullYear()}`,
                                        bold: true,
                                        font: "Tahoma",
                                        color: "FF0000",
                                        size: "18",
                                    }),
                                    new TextRun({
                                        text: ` до `,
                                        bold: false,
                                        font: "Tahoma",
                                        color: "FF0000",
                                        size: "18",
                                    }),
                                    new TextRun({
                                        text: `${red.L}${new Date().getFullYear()}`,
                                        bold: true,
                                        font: "Tahoma",
                                        color: "FF0000",
                                        size: "18",
                                    }),
                                    new TextRun({
                                        text: ` године.`,
                                        bold: false,
                                        font: "Tahoma",
                                        color: "FF0000",
                                        size: "18",
                                    }),
                                ],
                            })
                        }),

                },
                tabele: {
                    type: PatchType.DOCUMENT,
                    children: redoviSaPodacima.flatMap(red => {
                        return [
                            new Paragraph({
                                text: "",
                            }),
                            new Table({ 
                                alignment: AlignmentType.CENTER,
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                rows: vratiRedoveTabele(red)
                            }),
                            
                        ]
                    })


                }
            },
            keepOriginalStyles: true,

        }).then((doc) => {

            // fs.writeFileSync("My Document1.docx", doc);

            const buffer = Buffer.from(doc);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(buffer);
        })

}
function generisiRadneJameString(radneJame) {
    let radneJameString;
    if (radneJame.length == 1) radneJameString = radneJame[0]
    else if (radneJame.length == 2) radneJameString = `${radneJame[0]} и ${radneJame[0]}`
    else radneJameString = radneJame.map((jama, indeks) =>
        indeks == radneJame.length - 1 ? jama : indeks == radneJame.length - 2 ? jama + ' и ' : jama + ', '
    ).join('');
    return radneJameString;
}
function latinicaUCirilicu(text) {

    const latinica_cirilica = {
        "a": "а",
        "b": "б",
        "v": "в",
        "g": "г",
        "d": "д",
        "đ": "ђ",
        "e": "е",
        "ž": "ж",
        "z": "з",
        "i": "и",
        "j": "ј",
        "k": "к",
        "l": "л",
        "lj": "љ",
        "m": "м",
        "n": "н",
        "nj": "њ",
        "o": "о",
        "p": "п",
        "r": "р",
        "s": "с",
        "t": "т",
        "ć": "ћ",
        "u": "у",
        "f": "ф",
        "h": "х",
        "c": "ц",
        "š": "ч",
        "dž": "џ",
        "š": "ш",
        "A": "А",
        "B": "Б",
        "V": "В",
        "G": "Г",
        "D": "Д",
        "Đ": "Ђ",
        "E": "Е",
        "Ž": "Ж",
        "Z": "З",
        "I": "И",
        "J": "Ј",
        "K": "К",
        "L": "Л",
        "Lj": "Љ",
        "M": "М",
        "N": "Н",
        "Nj": "Њ",
        "O": "О",
        "P": "П",
        "R": "Р",
        "S": "С",
        "T": "Т",
        "Ć": "Ћ",
        "U": "У",
        "F": "Ф",
        "H": "Х",
        "C": "Ц",
        "Č": "Ч",
        "Dž": "Џ",
        "Š": "Ш",
    };

    // return text.split('').map(char => mapa[char] || char).join(''); ovo je za cirilica u latinicu
    let result = '';
    let i = 0;
    while (i < text.length) {
        let char = text[i];
        let nextChar = text[i + 1];
        if (nextChar && latinica_cirilica[char + nextChar]) {
            result += latinica_cirilica[char + nextChar];
            i += 2; // Skip the next character
        } else {
            result += latinica_cirilica[char] || char;
            i++;
        }
    }
    return result;
}
function intevalDvaStringDatuma(dateKasniji, dateRaniji) {
    // Dates in the format DD.MM.YYYY
    const dateString1 = dateKasniji + new Date().getFullYear();
    const dateString2 = dateRaniji + new Date().getFullYear();

    // Parse the date strings
    const parts1 = dateString1?.split(".");
    const parts2 = dateString2?.split(".");
    const dateKasniji1 = new Date(parts1[2], parts1[1] - 1, parts1[0]); // Note: months are zero-based
    const dateRaniji1 = new Date(parts2[2], parts2[1] - 1, parts2[0]);
    (dateRaniji1 > dateKasniji1) && dateKasniji1.setFullYear(dateKasniji1.getFullYear() + 1); // mozda se prenosi u sledecu godinu pa mu daj sledecu godinu
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = dateKasniji1.getTime() - dateRaniji1.getTime();

    // Convert milliseconds to days and add 1 to include both dates
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const intervalInDays = Math.floor(differenceInMilliseconds / millisecondsPerDay) + 1;

    return intervalInDays;
}
function daLiIntervalDeoSpecificnogIntervala(dateKasniji, dateRaniji) {

    const partsKasniji = dateKasniji?.split(".");
    const partsRaniji = dateRaniji?.split(".");
    if (
        (Number(partsKasniji[1]) >= 4 && Number(partsKasniji[1]) <= 10) ||
        (Number(partsRaniji[1]) >= 4 && Number(partsRaniji[1]) <= 10)
    )
        return true
    else return false;

}
function vratiRedoveTabele(red) {
    let niz = []
    niz.push(
        new TableRow({
            children: [
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Фаза ${red.B}:`,
                                    bold: true,
                                    font: "Tahoma",
                                    size: "18",
                                })],
                        })
                    ],
                    verticalAlign: VerticalAlign.TOP,
                    borders: {
                        top: {
                            color: "808080",
                        },
                        left: {
                            color: "808080",
                        },
                    },
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [
                            new TextRun({
                                text: "Површина која се заузима (м2)",
                                font: "Tahoma",
                                size: "18",
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        margin: { top: 100, bottom: 100 }
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [
                            new TextRun({
                                text: "Висина накнаде дневно",
                                font: "Tahoma",
                                size: "18",
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [
                            new TextRun({
                                text: "Период коришћења (број дана)",
                                font: "Tahoma",
                                size: "18",
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,

                }),


            ]
        })
    )
    if (red.H && red.J) {
        niz.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Заузеће тротоара и зелене површине у оквиру регулације улице`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${Math.round((Number(red.H) + Number(red.J)) * 10) / 10}`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Тачка 1. подтачка 1в-3)",
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${intevalDvaStringDatuma(red.L, red.K)}`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT,
                    }),
                ]
            })
        )
    } else if (red.H) {
        niz.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Заузеће тротоара`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: red.H,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Тачка 1. подтачка 1в-3)",
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${intevalDvaStringDatuma(red.L, red.K)}`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT,
                    }),
                ]
            })
        )
    } else if (red.J) {
        niz.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Заузеће зелене површине`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: red.J,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Тачка 1. подтачка 1в-3)",
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${intevalDvaStringDatuma(red.L, red.K)}`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT,
                    }),
                ]
            })
        )
    }
    if (red.E && red.G) {
        niz.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text:  `Раскопавање тротоара и зелене површине у оквиру регулације улице`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${Math.round((Number(red.E) + Number(red.G)) * 10) / 10}`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: daLiIntervalDeoSpecificnogIntervala(red.L, red.K) ? "Тачка 1. подтачка 1б-1)" : "Тачка 1. подтачка 1б-2)",
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${intevalDvaStringDatuma(red.L, red.K)}`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT,
                    }),
                ]
            })
        )
    } else if (red.E) {
        niz.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Раскопавање тротоара`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: red.E,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: daLiIntervalDeoSpecificnogIntervala(red.L, red.K) ? "Тачка 1. подтачка 1б-1)" : "Тачка 1. подтачка 1б-2)",
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${intevalDvaStringDatuma(red.L, red.K)}`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT,
                    }),
                ]
            })
        )
    } else if (red.G) {
        niz.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Раскопавање зелене површине`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: red.G,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: daLiIntervalDeoSpecificnogIntervala(red.L, red.K) ? "Тачка 1. подтачка 1б-1)" : "Тачка 1. подтачка 1б-2)",
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${intevalDvaStringDatuma(red.L, red.K)}`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT,
                    }),
                ]
            })
        )
    }
    if (red.I) {
        niz.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Заузеће коловоза`,
                                    font: "Tahoma",
                                    size: "18",
                                    color: "FF0000",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: red.I,
                                    font: "Tahoma",
                                    size: "18",
                                    color: "FF0000",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Тачка 1. подтачка 1в-2)",
                                    font: "Tahoma",
                                    size: "18",
                                    color: "FF0000",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${intevalDvaStringDatuma(red.L, red.K)}`,
                                    font: "Tahoma",
                                    size: "18",
                                    color: "FF0000",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT,
                    }),
                ]
            })
        )
    }
    if (red.F) {
        niz.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Раскопавање коловоза`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: red.F,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: daLiIntervalDeoSpecificnogIntervala(red.L, red.K) ? "Тачка 1. подтачка 1б-1)" : "Тачка 1. подтачка 1б-2)",
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${intevalDvaStringDatuma(red.L, red.K)}`,
                                    font: "Tahoma",
                                    size: "18",
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        // textDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT,
                    }),
                ]
            })
        )
    }
    return niz;
}

module.exports = {
    excel_to_word,

}
