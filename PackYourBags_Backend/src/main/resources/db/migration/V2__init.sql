CREATE TABLE trails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    county VARCHAR(255),
    activityType VARCHAR(255),
    description TEXT,
    difficulty VARCHAR(255),
    lengthKm INT,
    completionTime VARCHAR(100),
    ascentMetres INT,
    SI_website VARCHAR(255), /*SI->Sports Ireland*/
    links TEXT,
    plannedActivityDate DATE,
   CONSTRAINT fk_trail_user
       FOREIGN KEY (idUser)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);