//importation des modules
import { NextFunction, Request, response, Response } from "express";
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from "mysql";
const jwt = require('jsonwebtoken');

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();


//parametre pour la connection a la base de données
const connection = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBNAME
});  

const port = process.env.SERVER_PORT;//port de l'api

//cors
const allowedOrigins = [process.env.SERVER_HOST];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: "DELETE,GET,POST,PUT",
    allowedHeaders: ['Content-Type', 'Authorization'],
};

//instentation de l api express
const app = express();
app.use(express.json());
app.use(bodyParser.json());

//app.use();
app.use(cors(options));

//GET default 
app.get('/', function (req: Request, response: Response) {
    console.log("it works");
    response.send("it works");
});

var t:string = ""

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


//test login

const accessTokenSecret =  process.env.TOKEN_SECRET;

const users = [
    {
        username:"thibaut",
        password:"mdp",
        role:"admin"
    }
];


app.post('/login', (req:Request, res:Response) => {
    // Read username and password from request body
    const { username, password } = req.body;

    // Filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret);
        // console.log("post : "+accessToken);
        res.json({
            accessToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});
const authenticateJWT = (req:any, res:any, next:any) => {
    const authHeader = req.headers.authorization;
    // console.log("authenticateJWT : " + authHeader);

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err:any, user:any) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
// app.get('/books', authenticateJWT, (req, res) => {
//     res.json(books);
// });

//GET db en fonction de la table  
app.get('/getMessage/',authenticateJWT, function (req: Request, response: Response) {

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
app.get('/getDataTravel/',authenticateJWT, function (req: Request, response: Response) {

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
app.post('/postMessage/',authenticateJWT, function (req: Request, response: Response) {

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

//POST ajouter des donner dans la tblvoyage
app.post('/postDataTravel/',authenticateJWT, function (req: Request, response: Response) {
    let voyageJSON = {
        "Ville":req.body.data.Ville,
        "Pays":req.body.data.Pays,
        "NomHebergement":req.body.data.NomHebergement,
        "TelHebergement":req.body.data.TelHebergement,
        "DateArriver":req.body.data.DateArriver,
        "DateDepart":req.body.data.DateDepart,
        "Divers":req.body.data.Divers
    }
    console.log(voyageJSON)

    let data = {
        voyage: JSON.stringify(voyageJSON),
        user: req.body.user,
        date: getDate()
    }
    // requete envoyer a la db
    connection.query(
        'insert into tblVoyage (voyData, voyUser, voyDate) values(?,?,?)',
        [
            data.voyage,
            data.user,
            data.date
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

