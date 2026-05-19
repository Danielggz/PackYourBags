CREATE TABLE equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    itemId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    checked BOOLEAN NOT NULL,
    CONSTRAINT fk_equipment_user
        FOREIGN KEY (idUser)
            REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);