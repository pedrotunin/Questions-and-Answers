// Carregando Módulos
    const express = require("express")
    const app = express()
    const bodyParser = require("body-parser")
    const connection = require("./database/database")
    const Pergunta = require("./database/Pergunta")
    const Resposta = require("./database/Resposta")

//Database
    connection.authenticate().then(() => {
        console.log("Conexão feita com o banco de dados!")
    }).catch((error) => {
        console.log(error)
    })

// Configurações
    app.set("view engine", "ejs")
    app.use(express.static("public"))
    
    // Body Parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

// Rotas
    app.get("/", (req, res) => {
        Pergunta.findAll({
            raw: true,
            order: [["createdAt","desc"]]
        }).then((perguntas) => {
            res.render("index", {perguntas: perguntas})
        })
    })

    app.get("/perguntar", (req, res) => {
        res.render("perguntar")
    })

    app.post("/salvarpergunta", (req, res) => {
        Pergunta.create({
            titulo: req.body.titulo,
            descricao: req.body.descricao
        }).then(() => {
            res.redirect("/")
        })
    })

    app.get("/pergunta/:id", (req, res) => {
        const id = req.params.id 
        Pergunta.findOne({
            where: {id: id}
        }).then((pergunta) => {
            if(pergunta != undefined){ //pergunta encontrada

                Resposta.findAll({
                    where: {perguntaId: pergunta.id},
                    order: [["createdAt", "desc"]]
                }).then((respostas) => {
                    res.render("pergunta", {
                        pergunta: pergunta, 
                        respostas: respostas
                    })
                })

            } else{ //não foi encontrada
                res.redirect("/")
            } 
        })
    })

    app.post("/responder", (req, res) => {
        const corpo = req.body.corpo
        const perguntaId = req.body.pergunta
        Resposta.create({
            corpo: corpo,
            perguntaId: perguntaId
        }).then(() => {
            res.redirect("/pergunta/" + perguntaId)
        })
    })

// Outros
    app.listen(4000, (error) => {
        if(error) {
            console.log("Erro ao se conectar ao servidor.")
        } else {
            console.log("Conectado ao servidor!")
        }
    })