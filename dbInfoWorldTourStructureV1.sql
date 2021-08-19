
create database dbInfoWorldTour;
use dbInfoWorldTour;

CREATE TABLE IF NOT EXISTS `dbInfoWorldTour`.`tblvoyage` (
  `voyId` INT(11) NOT NULL AUTO_INCREMENT,
  `voyData` longtext NULL DEFAULT NULL,
  `voyUser` VARCHAR(255) NULL DEFAULT NULL,
  `voyDate` VARCHAR(255)  NULL DEFAULT NULL,

  PRIMARY KEY (`voyId`));

CREATE TABLE IF NOT EXISTS `dbInfoWorldTour`.`tblmessage` (
  `mesId` INT(11) NOT NULL AUTO_INCREMENT,
  `mesText` LONGTEXT NULL DEFAULT NULL,
  `mesUser` VARCHAR(255) NULL DEFAULT NULL,
  `mesDate` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`mesId`));

 CREATE TABLE IF NOT EXISTS `dbInfoWorldTour`.`tbluser` (
    `useId` INT(11) NOT NULL AUTO_INCREMENT,
    `useName` VARCHAR(255) not NULL,
    `usePassword` VARCHAR(255) not NULL ,
    `userole` VARCHAR(255) NULL DEFAULT NULL,
 PRIMARY KEY (`useId`));

INSERT INTO `tblVoyage` (`voyData`,`voyUser`,`voyDate`)
VALUES ('{   
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
'ExmpleUser',
now());


insert INTO tblMessage(mesText,mesUser,mesDate)
values( "creation de la db v1",
		    "DBInsertUser",
        now());

insert into tbluser (useName,usePassword,useRole)
values(
	"admin",
	"mdp",
    "admin"
);
