//importation des modules
import { Request, Response } from "express";
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import {createConnection} from "mysql";
import {auth} from 'express-openid-connect';
import { config as dotenvConfig } from 'dotenv';
import {requiresAuth} from 'express-openid-connect';

import {resolve} from "dns";
dotenvConfig();

//auth0 config
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,//'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENTID,//'2uDUJsvrZa2HXV55DVrGSne1k4RXJJNa',
    issuerBaseURL: 'https://dev-thibcott.eu.auth0.com'
};


//parametre pour la connection a la base de données
const connection = createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DBNAME
});

const port = process.env.SERVER_PORT;//port de l'api

//cors
const allowedOrigins = ['http://localhost']; /*process.env.SERVER_HOST*/

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: "DELETE,GET,POST,PUT",
    allowedHeaders: ['Content-Type', 'Authorization'],
};

//instentation de l api express
const app = express();
app.use(express.json());
app.use(cors(options));
app.use(auth(config));

app.get('/', (req: Request, res: Response) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/callback', requiresAuth(), (req: Request, response: Response) => {
    response.send("Salut");
});
app.get('/profile', requiresAuth(), (req: Request, response: Response) => {
    response.send(JSON.stringify(req.oidc.user));
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
    return date;
}

// GET dateDuJour
app.get('/dateDuJour/',/*requiresAuth(),*/ function (req: Request, response: Response) {
    let date = getDate().toString()
    response.send({ "date": date });
});

//GET db en fonction de la table  
app.get('/getMessages/', requiresAuth(), function (req: Request, response: Response) {

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
app.get('/getDataTravel/', requiresAuth(), function (req: Request, response: Response) {

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
app.post('/postMessage/', requiresAuth(), function (req: Request, response: Response) {

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
app.post('/postDataTravel/', requiresAuth(),function (req: Request, response: Response) {
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

