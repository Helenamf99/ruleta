-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: abp
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_cat` int NOT NULL AUTO_INCREMENT,
  `nombre_cat` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id_cat`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Geografia',''),(2,'Historia',''),(3,'Musica',''),(4,'Informatica',''),(5,'Entretenimiento',''),(6,'Deportes',''),(7,'nueva','nombre');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partida`
--

DROP TABLE IF EXISTS `partida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partida` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime(6) DEFAULT NULL,
  `puntos` int DEFAULT NULL,
  `tiempo` time(6) DEFAULT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtmaxxk00hoolj2hd5hq034je3` (`usuario_id`),
  CONSTRAINT `FKtmaxxk00hoolj2hd5hq034je3` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partida`
--

LOCK TABLES `partida` WRITE;
/*!40000 ALTER TABLE `partida` DISABLE KEYS */;
/*!40000 ALTER TABLE `partida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidas`
--

DROP TABLE IF EXISTS `partidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidas` (
  `id_partida` int NOT NULL AUTO_INCREMENT,
  `id_jugador` int NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tiempo_partida` time DEFAULT NULL,
  `puntos` int DEFAULT '0',
  PRIMARY KEY (`id_partida`),
  KEY `id_jugador` (`id_jugador`),
  CONSTRAINT `partidas_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `usuarios` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidas`
--

LOCK TABLES `partidas` WRITE;
/*!40000 ALTER TABLE `partidas` DISABLE KEYS */;
/*!40000 ALTER TABLE `partidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pregunta`
--

DROP TABLE IF EXISTS `pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pregunta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enunciado` varchar(500) NOT NULL,
  `categoria_id` int NOT NULL,
  `categoria_id_cat` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4rxxkkvae7r6khm32skir3pl4` (`categoria_id_cat`),
  CONSTRAINT `FK4rxxkkvae7r6khm32skir3pl4` FOREIGN KEY (`categoria_id_cat`) REFERENCES `categoria` (`id_cat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pregunta`
--

LOCK TABLES `pregunta` WRITE;
/*!40000 ALTER TABLE `pregunta` DISABLE KEYS */;
/*!40000 ALTER TABLE `pregunta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preguntas`
--

DROP TABLE IF EXISTS `preguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas` (
  `id_pregunta` int NOT NULL AUTO_INCREMENT,
  `id_cat` int NOT NULL,
  `enunciado` text NOT NULL,
  PRIMARY KEY (`id_pregunta`),
  KEY `id_cat` (`id_cat`),
  CONSTRAINT `preguntas_ibfk_1` FOREIGN KEY (`id_cat`) REFERENCES `categoria` (`id_cat`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas`
--

LOCK TABLES `preguntas` WRITE;
/*!40000 ALTER TABLE `preguntas` DISABLE KEYS */;
INSERT INTO `preguntas` VALUES (1,1,'¿Que pais empieza por la letra A y tiene la bandera tri-color azul, amarillo y rojo?'),(2,1,'¿Cual es la capital de catalunya?'),(3,2,'¿Que pintor austriaco mando durante el Tercer Reich ?'),(4,3,'¿Qué legendaria banda de rock australiana es famosa por temazos como Back in Black y Highway to Hell?'),(5,3,'¿Qué legendaria banda británica de Liverpool de los años 60 fue mundialmente conocida?'),(6,4,'¿Como se llama uno de los mayores fabricantes de Procesadores y tarjetas Graficas'),(7,4,'¿Que tipo de dato de programacion muchas veces es representado como 1 o 0?'),(8,5,'¿Qué saga de videojuegos de simulación de vida de Nintendo te permite mudarte a una isla desierta, pescar, cazar bichos y convivir con vecinos animales?'),(9,5,'¿Como se llama el Jefe de robin en la ciudad del Crimen Gotham?'),(10,6,'¿Como se llama el equipo que ha ganado la Premier League en la temporada 2025/26?'),(11,6,'¿Cual es el equipo con más deudas de España?'),(12,2,'¿Como se llamaba la emperatriz egipcia que fue conocida como la Reina del Nilo ?'),(13,1,'Con la C cómo se llama la línea imaginaria que divide a la Tierra en dos hemisferios (Norte y Sur)?'),(14,1,'¿Cuál es la capital de Irlanda, famosa por su ambiente, su río Liffey y San Patricio?'),(15,1,'¿Cómo se llama el estrecho de agua que separa el extremo sur de España del norte de África, conectando el océano Atlántico con el mar Mediterráneo?'),(16,1,'¿Qué país europeo es famoso por albergar la región de Laponia, tener miles de lagos y ser considerado habitualmente el país más feliz del mundo?'),(17,1,'¿Cuál es la isla más grande del mundo (que no se considera continente), cubierta casi por completo de hielo y perteneciente a Dinamarca?'),(18,1,'¿Qué gran cordillera asiática contiene las montañas más altas del planeta, incluyendo el monte Everest?'),(19,1,'¿Qué país insular nórdico es famoso por sus volcanes, géiseres, termas y campos de lava, ubicado en el Atlántico Norte?'),(20,1,'¿Qué país de Oriente Próximo alberga la milenaria ciudad arqueológica de Petra, excavada en roca?'),(21,1,'¿Qué país insular de Asia Oriental es conocido como \"La tierra del sol naciente\" y tiene su capital en Tokio?'),(22,1,'¿Qué famoso país de África Oriental es conocido por sus safaris, el parque Masái Mara y su capital, Nairobi?'),(23,1,'¿Cuál es la capital de Reino Unido, atravesada por el río Támesis?'),(24,1,'¿Qué mar interior está rodeado por Europa, África y Asia, y conecta con el océano Atlántico a través del estrecho de Gibraltar?'),(25,1,'¿Qué país europeo es famoso por sus fiordos, el cabo Norte y por ser uno de los mejores lugares para ver auroras boreales?'),(26,1,'¿Qué término geográfico define a un espacio con vegetación y a veces manantiales que se encuentra aislado en medio de un desierto?'),(27,1,'¿Qué canal artificial, inaugurado en 1914, corta el continente americano para unir el océano Atlántico con el océano Pacífico?'),(28,1,'¿Qué pequeño y rico país de la península arábiga, con capital en Doha, organizó el Mundial de Fútbol en 2022?'),(29,1,'¿Cuál es el país más grande del mundo por extensión territorial, que abarca parte de Europa Oriental y todo el norte de Asia?'),(30,1,'¿Qué país alpino europeo tiene cuatro idiomas oficiales (alemán, francés, italiano y romanche) y es famoso por sus quesos y chocolates?'),(31,1,'¿Qué país sudamericano, con capital en Montevideo, es famoso por sus playas como Punta del Este y por ser el segundo más pequeño del subcontinente?'),(32,1,'¿Qué país caribeño y sudamericano cuenta con el Salto Ángel, la cascada de agua más alta del mundo?'),(33,1,'¿Cómo se llama en ingles la parte del territorio de Reino Unido cuya capital es Cardiff y tiene al dragón rojo en su bandera?'),(34,1,'¿Qué importante río de China (también conocido como rílo de las Perlas) fluye por el sur del país y pasa por Cantón?'),(35,1,'¿Qué península mexicana separa el golfo de México del mar Caribe y es famosa por sus ruinas mayas como Chichén Itzá?'),(36,1,'¿Qué gran río africano es famoso por albergar las espectaculares Cataratas Victoria en la frontera entre Zambia y Zimbabue?');
/*!40000 ALTER TABLE `preguntas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respuesta`
--

DROP TABLE IF EXISTS `respuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respuesta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `correcta` bit(1) NOT NULL,
  `texto` varchar(500) NOT NULL,
  `pregunta_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd9oyrwyjw1otr38btjeevanif` (`pregunta_id`),
  CONSTRAINT `FKd9oyrwyjw1otr38btjeevanif` FOREIGN KEY (`pregunta_id`) REFERENCES `pregunta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuesta`
--

LOCK TABLES `respuesta` WRITE;
/*!40000 ALTER TABLE `respuesta` DISABLE KEYS */;
/*!40000 ALTER TABLE `respuesta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respuestas`
--

DROP TABLE IF EXISTS `respuestas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respuestas` (
  `id_respuesta` int NOT NULL AUTO_INCREMENT,
  `id_pregunta` int NOT NULL,
  `texto_respuesta` varchar(255) NOT NULL,
  `correcta` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_respuesta`),
  KEY `id_pregunta` (`id_pregunta`),
  CONSTRAINT `respuestas_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuestas`
--

LOCK TABLES `respuestas` WRITE;
/*!40000 ALTER TABLE `respuestas` DISABLE KEYS */;
INSERT INTO `respuestas` VALUES (1,1,'Andorra',1),(2,1,'Colombia',0),(3,1,'Bandera',0),(4,1,'Austria',0),(5,2,'Barcelona',1),(6,2,'Murcia',0),(7,2,'Tarragona',0),(8,2,'Girona',0),(9,3,'Adolf Hitler',1),(10,3,'Karl Marx',0),(11,3,'Adolfo Hitler',0),(12,3,'Antonio Rüdiger',0),(13,4,'AC/DC',1),(14,4,'CD/AC',0),(15,4,'Antes y despues de cristo',0),(16,4,'Los Beatles',0),(17,5,'The Beatles',1),(18,5,'The Rolling Stones',0),(19,5,'The Kinks',0),(20,5,'Cream',0),(21,6,'AMD',1),(22,6,'ARM',0),(23,6,'Apple',0),(24,6,'Intel',0),(25,7,'BOOL/BOOLEAN',1),(26,7,'B00LEAN',0),(27,7,'Double/float',0),(28,7,'b00l',0),(29,8,'AnimalCrossing',1),(30,8,'Mario Party',0),(31,8,'The Legend of Zelda: Breath of the Wild',0),(32,8,'Pokemon:Blanco',0),(33,13,'Ecuador',0),(34,13,'Linea del medio',0),(35,13,'Pangea',0),(36,13,'Cirsculo Polar',1);
/*!40000 ALTER TABLE `respuestas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `fecha_registro` datetime(6) DEFAULT NULL,
  `mejor_tiempo` time(6) DEFAULT NULL,
  `nombre_completo` varchar(255) DEFAULT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `puntos_maximos` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`),
  UNIQUE KEY `UKpuhr3k3l7bj71hb7hk7ktpxn0` (`nombre_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(30) NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `date_creation` date NOT NULL DEFAULT (curdate()),
  `email` varchar(30) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','Admin123.','2026-05-21','danielivina01@gmail.com',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-21 11:49:17
