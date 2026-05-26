create database abp;
use abp;
CREATE TABLE categoria (
    id_cat INT AUTO_INCREMENT,
    nombre_cat VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_cat)
);

CREATE TABLE Usuarios (
    id_user INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    user_name VARCHAR(30) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Equivalente a SYSDATE en MySQL
    PRIMARY KEY (id_user)
);

CREATE TABLE preguntas (
    id_pregunta INT AUTO_INCREMENT,
    id_cat INT NOT NULL,
    enunciado TEXT NOT NULL, -- Añadido el campo para escribir la pregunta en sí
    PRIMARY KEY (id_pregunta),
    FOREIGN KEY (id_cat) REFERENCES categoria(id_cat) ON DELETE CASCADE
);

CREATE TABLE respuestas (
    id_respuesta INT AUTO_INCREMENT,
    id_pregunta INT NOT NULL,
    texto_respuesta VARCHAR(255) NOT NULL, -- Añadido el campo para escribir la respuesta
    correcta BOOLEAN NOT NULL DEFAULT FALSE, -- Tu campo "check" (TRUE/FALSE)
    PRIMARY KEY (id_respuesta),
    FOREIGN KEY (id_pregunta) REFERENCES preguntas(id_pregunta) ON DELETE CASCADE
);

CREATE TABLE partidas (
    id_partida INT AUTO_INCREMENT,
    id_jugador INT NOT NULL, -- Se conecta con id_user de la tabla Usuarios
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tiempo_partida TIME, -- Para guardar la duración (HH:MM:SS)
    puntos INT DEFAULT 0,
    PRIMARY KEY (id_partida),
    FOREIGN KEY (id_jugador) REFERENCES Usuarios(id_user)
);

-- Inserts Cateorias
insert into categoria( nombre_cat) values ("Geografia"), ("Historia"), ("Musica"), ("Informatica"), ("Entretenimiento"), ("Deportes");

-- Inserts Preguntas

Insert into preguntas(id_cat, enunciado) values 
(1, '¿Que pais empieza por la letra A y tiene la bandera tri-color azul, amarillo y rojo?'),
(1, '¿Cual es la capital de catalunya?'),
(2, '¿Como se llamaba la emperatriz egipcia que fue conocida como la Reina del Nilo ?'),
(2, '¿Que pintor austriaco mando durante el Tercer Reich ?'),
(3, '¿Qué legendaria banda de rock australiana es famosa por temazos como Back in Black y Highway to Hell?'),
(3, '¿Qué legendaria banda británica de Liverpool de los años 60 fue mundialmente conocida?'),
(4, '¿Como se llama uno de los mayores fabricantes de Procesadores para movil?'),
(4, '¿Que tipo de dato de programación muchas veces es representado como 1 o 0?'),
(5, '¿Qué saga de videojuegos de simulación de vida de Nintendo te permite mudarte a una isla desierta, pescar, cazar bichos y convivir con vecinos animales?'),
(5, '¿Como se llama el Jefe de robin en la ciudad del Crimen Gotham?'),
(6, '¿Como se llama el equipo que ha ganado la Premier League en la temporada 2025/26?'),
(6, '¿Cual es el equipo con más deudas de España?');


-- Inserts Respuestas
Insert into respuestas(id_pregunta, texto_respuesta, correcta) values
(1, 'Andorra', true), (1, 'Colombia', false), (1, 'Bandera', false), (1, 'Austria', false),
(2, 'Barcelona', true), (2, 'Tarraggona', false), (2, 'Murcia', false), (2, 'Girona', false),
(3, 'Adolf Hitler', true), (3, 'Karl Marx', false), (3, 'Adolfo Hitler', false), (3, 'Antonio Rüdiger', false),
(4, 'AC/DC', true), (4, 'CD/AC', false), (4, 'Antes y despues de cristo', false), (4, 'los Beatles', false),
(5, 'The Beatles', true), (5, 'The Rolling Stones', false), (5, 'The Kinks', false), (5, 'Cream', false),
(6, 'AMD', true), (6, 'ARM', false), (6, 'Apple', false), (6, 'Intel', false),
(7, 'BOOL/BOOLEAN', true), (7, 'B00LEAN', false), (7, 'Doouble/float', false), (7, 'B00L', false),
(8, 'Animal Crossing', true), (8, 'Mario Party', false), (8, 'The Legend of Zelda: Breath Of the Wild', false), (8, 'Pokemon: Blanco', false);