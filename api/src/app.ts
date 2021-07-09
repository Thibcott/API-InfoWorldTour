//importation des modules
import { Request, Response } from "express";
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from "mysql";
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

//parametre pour la connection a la base de données

const connection = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBNAME
});

const port = 3000;//port de l'api

//cors
const allowedOrigins = ['http://localhost'];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: "DELETE,GET,POST,PUT",
    allowedHeaders: ['Content-Type', 'Authorization'],
};

//instentation de l api express
const app = express();
app.use(express.json());
//app.use();
app.use(cors(options));

//GET default 
app.get('/', function (req: Request, response: Response) {
    console.log("it works");
    response.send("it works");
});

//pour recupere la date du jour 
function getDate() {
    let d: Date = new Date();
    let date: string = d.getDate() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getFullYear() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();
    // console.log(date);
    return date;
}

// GET dateDuJour
app.get('/dateDuJour/', function (req: Request, response: Response) {
    //console.log(getDate());
    let date = getDate().toString()
    response.send({ "date": date });
});

//GET db en fonction de la table  
app.get('/getMessage/', function (req: Request, response: Response) {

    //requete envoyer a la base de données
    connection.query('select * from tblMessage', function (err, rows, fields) {
        if (err) {
            response.status(500).send("the connection to db don t works");
            console.log(err);
        };
        response.send(JSON.stringify(rows));
    });
});

//GET db en fonction de la table  
app.get('/getDataTravel/', function (req: Request, response: Response) {

    //requete envoyer a la base de données
    connection.query('select * from tblVoyage', function (err, rows, fields) {
        if (err) {
            response.status(500).send("the connection to db don t works");
            console.log(err);
        };
        response.send(JSON.stringify(rows));
    });
});

// POST Ajouter un nouveau train dans la db 
app.post('/postMessage/', function (req: Request, response: Response) {

    let message = {
        text: req.body.text,
        user: req.body.user,
        date: getDate()
    }
    console.log("obj" + message.date)
    // requete envoyer a la db
    connection.query(
        'insert into tblmessage (mesText,mesUser,mesDate) values(?,?,?)',
        [
            message.text,
            message.user,
            message.date
        ],

        function (err, result) {
            if (err) {
                response.status(500).send("the message are not add to the db ");
            } else {
                response.status(201).send(req.body);
            }
        }
    );
});

//lancement de l api 
app.listen(port, () => {
    console.log('App server up...');
    //connection a la base de données
    connection.connect();
});

