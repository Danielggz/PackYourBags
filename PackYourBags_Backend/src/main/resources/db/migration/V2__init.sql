CREATE TABLE trails (
   id INT AUTO_INCREMENT PRIMARY KEY,
   idUser INT NOT NULL,
   name VARCHAR(255) NOT NULL,
   county VARCHAR(255),
   activityType VARCHAR(255),
   description VARCHAR(255),
   difficulty VARCHAR(255),
   lengthKm INT,
   completionTime INT,
   ascentMetres INT,
   SI_website VARCHAR(255),
   links VARCHAR(255),
   CONSTRAINT fk_trail_user
       FOREIGN KEY (idUser)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);