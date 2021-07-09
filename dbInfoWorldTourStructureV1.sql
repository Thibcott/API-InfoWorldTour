
create database dbInfoWorldTour;
use dbInfoWorldTour;

CREATE TABLE IF NOT EXISTS `dbInfoWorldTour`.`tblvoyage` (
  `voyId` INT(11) NOT NULL AUTO_INCREMENT,
  `voyData` longtext NULL DEFAULT NULL,
  `voyUser` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`voyId`));
  

CREATE TABLE IF NOT EXISTS `dbInfoWorldTour`.`tblmessage` (
  `mesId` INT(11) NOT NULL AUTO_INCREMENT,
  `mesText` LONGTEXT NULL DEFAULT NULL,
  `mesUser` VARCHAR(255) NULL DEFAULT NULL,
  `mesDate` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`mesId`));


INSERT INTO tblVoyage (voyData, voyUser)
VALUES (
'{   
    "Ville":"",
    "Pays":"",
    "HeureLocal":"",
    "NomHebergement":"",
    "TelHebergement":"",
    "DateArriver":"",
    "DateDepart":"",
    "NbrJours":"",
    "Divers":""
}',
'ExmpleUser');

insert INTO tblMessage(mesText,mesUser,mesDate)
values( "creation de la db v1",
		    "DBInsertUser",
        now());