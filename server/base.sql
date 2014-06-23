CREATE database thief_login;
use thief_login;

CREATE TABLE ip(
	id INT NOT NULL AUTO_INCREMENT,
	address VARCHAR(255) NOT NULL,
	dateFirstConnection DATE NOT NULL,
	CONSTRAINT pk_idIp PRIMARY KEY (id)
);

CREATE TABLE website(
	id INT NOT NULL AUTO_INCREMENT,
	address VARCHAR(255) NOT NULL,
	CONSTRAINT pk_idWebsite PRIMARY KEY (id)
);

CREATE TABLE login(
	id INT NOT NULL AUTO_INCREMENT,
	`date` DATE NOT NULL,
	idIp INT NOT NULL,
	idWebsite INT NOT NULL,
	CONSTRAINT pk_idLogin PRIMARY KEY (id)
);

CREATE TABLE enregistrement(
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(500) NOT NULL,
	`value` VARCHAR(1000) NOT NULL,
	idLogin INT NOT NULL,
	CONSTRAINT pk_idEnregistrement PRIMARY KEY (id)
);

ALTER TABLE login
	ADD CONSTRAINT fk_idIpLogin
	FOREIGN KEY (idIp)
	REFERENCES ip(id),
	ADD CONSTRAINT fk_idWebsiteLogin
    FOREIGN KEY (idWebsite)
    REFERENCES website(id);

ALTER TABLE enregistrement
	ADD CONSTRAINT fk_idLoginEnregistrement
	FOREIGN KEY (idLogin)
	REFERENCES login(id);