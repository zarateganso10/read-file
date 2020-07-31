const dados  = require('./dados.json');
const fs = require('fs');


const dadosRepeat = dados;
var mortes = []
var casos = [];
var suspeitos = [];
let soma = false;
let cidade = '';
let number = 0;
const municipios = [
    "aguaClara",
    "alcinopolis",
    "amambai",
    "anastacio",
    "anaurilandia",
    "angelica",
    "antonioJoao",
    "aparecidaTaboado",
    "aquidauana",
    "aralMoreira",
    "bandeirantes",
    "bataguassu",
    "bataypora",
    "belaVista",
    "bodoquena",
    "bonito",
    "brasilandia",
    "caarapo",
    "camapua",
    "campoGrande",
    "caracol",
    "cassilandia",
    "chapadaoDoSul",
    "corguinho",
    "coronelSapucaia",
    "corumba",
    "costaRica",
    "coxim",
    "deodapolis",
    "doisIrmaos",
    "douradina",
    "dourados",
    "eldorado",
    "fatima",
    "figueirao",
    "gloria",
    "guiaLopes",
    "iguatemi",
    "inocencia",
    "itapora",
    "itaquirai",
    "ivinhema",
    "japora",
    "jaraguari",
    "jardim",
    "jatei",
    "juti",
    "ladario",
    "lagunaCarapa",
    "maracaju",
    "miranda",
    "mundoNovo",
    "navirai",
    "nioaque",
    "novaAlvorada",
    "novaAndradina",
    "novoHorizonte",
    "paraisoAguas",
    "paranaiba",
    "paranhos",
    "pedroGomes",
    "pontaPora",
    "portoMurtinho",
    "ribas",
    "rioBrilhante",
    "rioNegro",
    "rioVerde",
    "rochedo",
    "santaRita",
    "saoGabriel",
    "selviria",
    "seteQuedas",
    "sidrolandia",
    "sonora",
    "tacuru",
    "taquarussu",
    "terenos",
    "tresLagoas",
    "vicentina",
]

const num = '1234567890';


const readFile1 = file => new Promise((resolve, reject) => {
    fs.readFile(__dirname + file, 'utf8',(err,data) => {
        if(err){
            reject(err)
        }else{
            const numCasosNovos = []
            const linhas = data.split(/\r?\n/);
            linhas.forEach(function(linha){
                if(linha.indexOf('+') !== -1){
                    number = parseInt(linha.slice(linha.indexOf('+') + 1, linha.length))
                    cidade = linha.slice( 0, linha.indexOf('+') -1)
                    soma = true;
                }else{
                    number = parseInt(linha.slice(linha.indexOf('-') + 1, linha.length).replace('.', ''));
                    cidade = linha.slice( 0, linha.indexOf('-') -1);
                    soma = false;
                }
                numCasosNovos.push({number, cidade, soma});
            })
            resolve(numCasosNovos)
        }
    } )
})

const readFile2 = file => new Promise((resolve, reject) => {
    fs.readFile(__dirname + file, 'utf8',(err,data) => {
        if(err){
            reject(err)
        }else{
            const numSuspeitos = []
            const linhas = data.split(/\r?\n/);
            linhas.forEach(function(linha){
                let index = -1;
                
                for(let i=0; i < linha.length; i++){
                    if(num.includes(linha[i])){
                        index = i;
                        break;
                    }
                }
                number = parseInt(linha.slice( index, linha.length).replace('.', ''))
                cidade = linha.slice(0 ,index - 1)
                numSuspeitos.push({number, cidade});
            })
            resolve(numSuspeitos)
        }
    } )
})

const readFile3 = file => new Promise((resolve, reject) => {
    fs.readFile(__dirname + file, 'utf8',(err,data) => {
        if(err){
            reject(err)
        }else{
           const numMortes = [];
           const linhas = data.split(/\r?\n/);
            linhas.forEach(function(linha){
                let index = linha.indexOf('%');
                let first =  linha.slice(0, index + 1);
                let second = linha.slice(index + 2, linha.length);
                index = -1;
                let final = -1;
                for(let i=0; i < first.length; i++){
                    if(num.includes(first[i]) && index < 0){
                        index = i;
                    }
                    if(index > 0 && first[i] === ' '){
                        final = i;
                        break;
                    }
                }
                number = parseInt(first.slice( index, final).replace('.', ''))
                cidade = first.slice(0 ,index - 1)
                numMortes.push({number, cidade});
                index = -1;
                final = -1;
                for(let i=0; i < second.length; i++){
                    if(num.includes(second[i]) && index < 0){
                        index = i;
                    }
                    if(index > 0 && second[i] === ' '){
                        final = i;
                        break;
                    }
                }
                number = parseInt(second.slice( index, final).replace('.', ''))
                cidade = second.slice(0 ,index - 1)
                numMortes.push({number, cidade});
            })
            resolve(numMortes)
        }
    } )
})

const writeFile = file => new Promise((resolve, reject) => {
    fs.readFile(__dirname + file, 'utf8',(err,data) => {
        if(err){
            reject(err)
        }else{
            const numSuspeitos = []
            const linhas = data.split(/\r?\n/);
            linhas.forEach(function(linha){
                let index = -1;
                for(let i=0; i < linha.length; i++){
                    if(num.includes(linha[i])){
                        index = i;
                        break;
                    }
                }
                number = parseInt(linha.slice( index, linha.length))
                cidade = linha.slice(0 ,index - 1)
                numSuspeitos.push({number, cidade});
            })
            resolve(numSuspeitos)
        }
    } )
})

async function Atualizar(){
    const data3 = await readFile3('/arquivos/mortes.txt');
    const data1 = await readFile1('/arquivos/casos.txt');
    const data2 = await readFile2('/arquivos/suspeitos.txt');
    let totalCases = 0;
    data1.map(caso => {
        if(caso.soma){
            for(let i = 0; i < municipios.length; i++){
                if(dados[municipios[i]].name.toLowerCase() === caso.cidade.toLowerCase()){
                    dadosRepeat[municipios[i]].confirmados = dados[municipios[i]].confirmados + caso.number
                    totalCases = totalCases + caso.number;
                }
            }
            }else{
                for(let i = 0; i < municipios.length; i++){
                    if(dados[municipios[i]].name === caso.cidade){
                        dadosRepeat[municipios[i]].confirmados = dados[municipios[i]].confirmados - caso.number
                        totalCases = totalCases - caso.number;
                    }
                }
            }
    })
    dadosRepeat["ms"].confirmados = dadosRepeat["ms"].confirmados + totalCases;
    totalSuspeitos = 0
    
    data2.map(caso => {
        for(let i = 0; i < municipios.length; i++){
            if(dados[municipios[i]].name.toLowerCase() === caso.cidade.toLowerCase()){
                dadosRepeat[municipios[i]].suspeitos = caso.number
                totalSuspeitos += caso.number
            }
        }
    })

    let totalMortes = 0;

    data3.map(caso => {
        for(let i = 0; i < municipios.length; i++){
            if(dados[municipios[i]].name.toLowerCase() === caso.cidade.toLowerCase()){
                dadosRepeat[municipios[i]].obitos = caso.number
                totalMortes += caso.number
            }
        }
    })

    dadosRepeat["ms"].obitos = totalMortes;

    dadosRepeat["ms"].suspeitos = totalSuspeitos;
    console.log(dadosRepeat["ms"])
    const dataAtualizada = JSON.stringify(dadosRepeat);
    fs.writeFile(__dirname + '/dadosAtualizados.json', dataAtualizada, 'utf8', (err, data) => {
        if(err){
            console.log(err)
        }else{
            console.log("success")
        }
    });
}
Atualizar()