


CREATE DATABASE QUEUER;

USE QUEUER;

CREATE TABLE parties (
	party_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	party_name  varchar(55) NOT NULL,
	party_password  varchar(60) NULL,
	party_qr varchar(55) NOT NULL,
	party_created_date datetime NOT NULL,
	party_ending_date datetime NOT NULL
);




