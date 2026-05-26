DROP DATABASE IF EXISTS ABP;
CREATE DATABASE ABP;
USE ABP;

DROP TABLE IF EXISTS partidas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS respuestas;
DROP TABLE IF EXISTS preguntas;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS categoria;


CREATE TABLE categorias (
    id_cat INT AUTO_INCREMENT,
    nombre_cat VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_cat)
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email varchar(255) not null,
    isAdmin boolean default false,
    nombre_completo VARCHAR(100) default NULL,
    mejor_tiempo int default null,
    puntos_maximo int default '0',
    PRIMARY KEY (id)
);

CREATE TABLE preguntas (
    id_pregunta INT AUTO_INCREMENT,
    id_cat INT NOT NULL,
    enunciado TEXT NOT NULL, 
    letra char(1) NOT NULL DEFAULT '',
    PRIMARY KEY (id_pregunta),
    FOREIGN KEY (id_cat) REFERENCES categorias(id_cat) ON DELETE CASCADE
);

CREATE TABLE respuestas (
    id_respuesta INT AUTO_INCREMENT,
    id_pregunta INT NOT NULL,
    texto_respuesta VARCHAR(255) NOT NULL,
    correcta BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_respuesta),
    FOREIGN KEY (id_pregunta) REFERENCES preguntas(id_pregunta) ON DELETE CASCADE
);

CREATE TABLE partidas (
    id_partida INT AUTO_INCREMENT,
    id_jugador INT NULL, 
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tiempo_partida TIME default null, 
    puntos INT DEFAULT '0',
    PRIMARY KEY (id_partida),
    FOREIGN KEY (id_jugador) REFERENCES usuarios(id)
);

-- Inserts Cateorias
insert into categorias(nombre_cat) values 
("Geografia"),-- 1
("Historia"),-- 2
("Musica"),-- 3
("Informatica"),-- 4
("Entretenimiento"),-- 5
("Deportes");-- 6

-- Insert de Administrador
Insert into usuarios (nombre_usuario, password,email, isAdmin, nombre_completo) values ('Administrador', 'Admin123.','danielivina01@gmail.com', true, 'Administrador');


















-- Preguntas Geografía
INSERT INTO PREGUNTAS(id_cat, enunciado, letra)values
(1,'¿Que pais empieza por la letra A y tiene la bandera tri-color azul, amarillo y rojo?','A'), -- ANDORRA
(1,'¿Cual es la capital de catalunya?','B'),-- BARCELONA
(1,'¿Cuál es el país más largo y estrecho del mundo, ubicado en el cono sur de América, entre la cordillera de los Andes y el océano Pacífico?','C'),-- CHILE
(1,'¿Cuál es la capital de Irlanda, famosa por su ambiente, su río Liffey y San Patricio?','D'),-- DUBLIN 
(1,'¿Cómo se llama el estrecho de agua que separa el extremo sur de España del norte de África, conectando el océano Atlántico con el mar Mediterráneo?', 'E'), -- ESTRECHO DE GIBRALTAR
(1,'¿Qué país europeo es famoso por albergar la región de Laponia, tener miles de lagos y ser considerado habitualmente el país más feliz del mundo?','F'),-- FINLANDIA
(1,'¿Cuál es la isla más grande del mundo (que no se considera continente), cubierta casi por completo de hielo y perteneciente a Dinamarca?','G'),-- GROENLANDIA
(1,'¿Qué gran cordillera asiática contiene las montañas más altas del planeta, incluyendo el monte Everest?','H'),-- HIMALAYA
(1,'¿Qué país insular nórdico es famoso por sus volcanes, géiseres, termas y campos de lava, ubicado en el Atlántico Norte?','I'), -- ISLANDIA
(1,'¿Qué país insular de Asia Oriental es conocido como "La tierra del sol naciente" y tiene su capital en Tokio?','J'),-- JAPON
(1,'¿Qué famoso país de África Oriental es conocido por sus safaris, el parque Masái Mara y su capital, Nairobi?','K'), -- KENIA
(1,'¿Cuál es la capital de Reino Unido, atravesada por el río Támesis?','L'), -- LONDRES
(1,'¿Qué mar interior está rodeado por Europa, África y Asia, y conecta con el océano Atlántico a través del estrecho de Gibraltar?','M'), -- MEDITERRANEO
(1,'¿Qué país europeo es famoso por sus fiordos, el cabo Norte y por ser uno de los mejores lugares para ver auroras boreales?','N'),-- NORUEGA
(1,'¿Qué término geográfico define a un espacio con vegetación y a veces manantiales que se encuentra aislado en medio de un desierto?','O'),-- OASIS
(1,'¿Qué país tiene un canal artificial, inaugurado en 1914, corta el continente americano para unir el océano Atlántico con el océano Pacífico?','P'),-- PANAMA
(1,'¿Qué pequeño y rico país de la península arábiga, con capital en Doha, organizó el Mundial de Fútbol en 2022?','Q'), -- QATAR
(1,'¿Cuál es el país más grande del mundo por extensión territorial, que abarca parte de Europa Oriental y todo el norte de Asia?','R'),-- RUSIA
(1,'¿Qué país alpino europeo tiene cuatro idiomas oficiales (alemán, francés, italiano y romanche) y es famoso por sus quesos y chocolates?','S'),-- SUIZA
(1,'¿Qué gran isla al sur de Australia es famosa por albergar a un peculiar mamífero marsupial "demonio" del mismo nombre?','T'),-- TASMANIA
(1,'¿Qué país sudamericano, con capital en Montevideo, es famoso por sus playas como Punta del Este y por ser el segundo más pequeño del subcontinente?','U'),-- URUGUAY
(1,'¿Qué país caribeño y sudamericano cuenta con el Salto Ángel, la cascada de agua más alta del mundo?','V'),-- VENEZUELA
(1,'¿Cómo se llama en ingles la parte del territorio de Reino Unido cuya capital es Cardiff y tiene al dragón rojo en su bandera?','W'),-- WALES
(1,'¿Qué importante río de China (también conocido como rílo de las Perlas) fluye por el sur del país y pasa por Cantón?','X'),-- XI JIANG
(1,'¿Qué península mexicana separa el golfo de México del mar Caribe y es famosa por sus ruinas mayas como Chichén Itzá?','Y'),-- YUCATAN
(1,'¿Qué gran río africano es famoso por albergar las espectaculares Cataratas Victoria en la frontera entre Zambia y Zimbabue?','Z');-- ZAMBEZE

-- Preguntas Historia
INSERT INTO PREGUNTAS(id_cat, enunciado, letra) values 
(2, '¿Que pintor austriaco mando durante el Tercer Reich ?','A'), -- Adolf 
(2,'¿Qué imperio medieval, que era la mitad oriental del antiguo Imperio Romano, sobrevivió mil años más con su capital en Constantinopla hasta 1453?','B'), -- BIZANTINO
(2,'¿Qué navegante de origen genovés lideró la expedición que llegó a las costas de América en 1492 bajo el patrocinio de los Reyes Católicos?','C'), -- CRISTOBAL COLON
(2,'¿Qué título político (que hoy asociamos a regímenes totalitarios) ostentaban en la Antigua Roma ciertos magistrados a los que se les otorgaba poder absoluto de forma temporal durante situaciones de extrema crisis?','D'), -- DICTADOR
(2,'¿Qué civilización de la antigüedad floreció a orillas del río Nilo, famosa por sus faraones, momias y por construir las pirámides de Giza?','E'), -- EGIPCIA
(2,'¿Qué título político y religioso de carácter absoluto ostentaban los gobernantes del Antiguo Egipto, considerados la encarnación terrestre del dios Horus?','F'), -- FARAON
(2,'¿Qué astrónomo y físico italiano del siglo XVII fue juzgado por la Inquisición debido a su defensa del heliocentrismo (que la Tierra gira alrededor del Sol)?','G'), -- GALILEO GALILEI
(2,'¿Qué historiador griego del siglo V a.C. es tradicionalmente considerado el "Padre de la Historia" por sus relatos sobre las Guerras Médicas?','H'),-- Heródoto
(2,'¿Qué gran imperio precolombino se extendía a lo largo de la cordillera de los Andes, con su centro neurálgico en la ciudad de Cusco, antes de la conquista española?','I'),-- INCA
(2,'¿Qué joven campesina francesa del siglo XV afirmó recibir visiones divinas, lideró a las tropas de su país en la Guerra de los Cien Años y acabó quemada en la hoguera por herejía?','J'),-- JUANA DE ARCO
(2,'¿Qué influyente filósofo y economista prusiano del siglo XIX escribió, junto a Friedrich Engels, el Manifiesto Comunista en 1848?','K'),-- KARL MARX
(2,'¿Qué revolucionario y político fue el principal líder de la Revolución Bolchevique de 1917 y el primer dirigente de la Unión Soviética (URSS)?','L'), -- LENIN
(2,'¿Qué periodo histórico de Occidente se sitúa tradicionalmente entre la caída del Imperio Romano de Occidente (siglo V) y el descubrimiento de América (siglo XV)?','M'),-- MEDIEVO
(2,'¿En qué ciudad alemana se celebraron los famosos juicios entre 1945 y 1946 para procesar y castigar a los líderes supervivientes del régimen nazi por crímenes de guerra?','N'),-- Núremberg
(2,'¿Qué imperio, fundado por tribus turcas en Anatolia a finales del siglo XIII, conquistó Constantinopla en 1453 y se disolvió tras la Primera Guerra Mundial?','O'), -- Omaní
(2,'¿Qué famosa ciudad del Imperio Romano quedó completamente enterrada y preservada bajo las cenizas tras la violenta erupción del volcán Vesubio en el año 79 d.C.?','P'), -- POMPEYA
(2,'¿Qué dinastía de origen manchú gobernó el Imperio Chino desde 1644 hasta la abolición de la monarquía y la proclamación de la República en 1912?','Q'), -- QUING DINASTIA
(2,'¿Qué violento proceso político comenzó en París en 1789, derrocó al rey Luis XVI, abolió el absolutismo y sentó las bases de las democracias modernas bajo el lema "Libertad, Igualdad, Fraternidad"?','R'), -- REVOLUCION FRANCESA
(2,'¿Qué filósofo clásico de Atenas es considerado uno de los fundadores de la filosofía occidental?','S'),-- SOCRATES
(2,'¿Qué faraón de la dinastía XVIII del Antiguo Egipto es mundialmente famoso porque su tumba en el Valle de los Reyes fue descubierta casi intacta por Howard Carter en 1922?','T'), -- TUTANKAMON
(2,'¿Qué gigantesco Estado federal socialista existió en Eurasia entre 1922 y 1991, rival geopolítico de Estados Unidos durante la Guerra Fría?','U'),-- URSS/ UNION SOVIETICA
(2,'¿Qué civilización marítima de exploradores y guerreros originarios de Escandinavia saqueó y comerció por toda Europa entre los siglos VIII y XI?','V'),-- VIKINGOS
(2,'¿Qué militar y político británico lideró a las tropas aliadas anglo-portuguesas y prusianas que derrotaron definitivamente a Napoleón en la batalla de Waterloo?','W'), -- DUQUE DE WELLINGTON
(2,'¿Qué antigua dinastía china (considerada tradicionalmente la primera de su historia, aunque a caballo entre el mito y la arqueología) empieza por esta letra en la transliteración pinyin?','X'), -- DINASTIA XIA
(2,'¿Qué dinastía de origen mongol, fundada por Kublai Khan (nieto de Gengis Khan), gobernó China durante el siglo XIII y XIV y recibió al viajero Marco Polo?','Y'),-- DINASTIA YUAN
(2,'¿Cual es el nombre de la dinastía que gobernó China antes de la unificación en el año 221 A.C?','Z');-- DINASTIA ZHOU 

-- Preguntas de música
INSERT INTO preguntas(id_cat, enunciado,letra) values
(3,'¿Qué cuarteto sueco arrasó en los 70 con temazos como Mamma Mia y Dancing Queen?','A'),-- A, ABBA
(3,'¿Qué instrumento de percusión, compuesto por platillos, bombos y tambores, es el encargado de llevar el ritmo en una banda de rock?','B'),-- B, BATERÍA
(3,'¿Qué famosísimo compositor clásico polaco es el rey absoluto de las composiciones para piano, como sus célebres Nocturnos?','C'), -- C,CHOPIN
(3,'¿Cómo se llama la persona encargada de mezclar las canciones en una discoteca o festival de música?','D'),-- D, DJ
(3,'¿A qué legendario cantante estadounidense de los años 50 se le conoce mundialmente como "El Rey del Rock and Roll"?','E'),-- E, ELVIS PRESLEY
(3,'¿Qué género musical tradicional del sur de España es famoso por su cante, su toque de guitarra, sus palmas y su baile lleno de pasión?','F'), -- F, FLAMENCO
(3,'¿Qué instrumento de cuerda, que puede ser clásica, acústica o eléctrica, es el más popular del mundo para rasguear acordes junto a una fogata?','G'),-- G, GUITARRA
(3,'¿Qué compositor clásico alemán del periodo barroco es mundialmente famoso por su majestuosa obra coral El Mesías (y su archiconocido Aleluya)?','H'),-- H, Händel
(3,'¿Qué cantante español es el artista latino que más discos ha vendido en la historia, padre de otro famoso cantante llamado Enrique?','I'), -- I, IGLESIAS
(3,'¿Qué rey del pop estadounidense revolucionó el baile con su "paso de la luna" (Moonwalk) y firmó el álbum más vendido de la historia, Thriller?','J'), -- J, JACKSON MICHAEL
(3,'¿Qué estilo de música pop, originario de Corea del Sur, se ha convertido en un fenómeno global gracias a bandas como BTS o Blackpink?','K'), -- K, K-POP
(3,'¿Qué espectacular diva neoyorquina del pop es famosa por sus videoclips extravagantes, sus vestidos locos y temazos como Bad Romance o Poker Face?','L'), -- L, LADY GAGA
(3,'¿Qué niño prodigio y genio austriaco del siglo XVIII compuso algunas de las sinfonías y óperas más famosas de la historia de la música clásica?','M'), -- M, MOZART
(3,'¿Qué palabra italiana usamos en música para referirnos a cada uno de los sonidos individuales que forman una melodía (Do, Re, Mi, Fa, Sol, La, Si)?','N'), -- N, NOTA
(3,'¿Qué gran grupo de músicos que tocan juntos instrumentos de cuerda, madera, metal y percusión está dirigido por un director con batuta?','O'),-- O, ORQUESTA
(3,'¿Cómo llamamos al género musical más comercial, pegadizo y enfocado a las masas, que domina las listas de éxitos de la radio?','P'),-- P, POP
(3,'¿Qué legendaria banda británica de rock, liderada por Freddie Mercury, nos regaló himnos de estadio como We Will Rock You y We Are the Champions?', 'Q'),-- Q, QUEEN
(3,'¿Qué cantante caribeña nacida en Barbados ha conquistado el pop mundial con éxitos como Umbrella, Diamonds y su espectacular show de la Super Bowl?','R'),-- R, Rihanna
(3,'¿Qué famoso instrumento de metal, rey del jazz y del blues, fue inventado por el belga Adolphe Sax en el siglo XIX?','S'),-- S, Saxofón
(3,'¿Qué velocidad o pulso lleva una pieza musical, que puede ir desde muy lento (adagio) hasta muy rápido (allegro)?','T'),-- T, TEMPO
(3,'¿Qué pequeño instrumento de cuatro cuerdas, originario de Hawái y parecido a una guitarra diminuta, se ha puesto superde moda en los últimos años?','U'),-- Ukelele
(3,'¿Qué compositor e instrumentista italiano del periodo barroco, apodado "El cura rojo", es el autor de los celebérrimos conciertos para violín Las cuatro estaciones?','V'),-- V, VIOLIN
(3,'¿Qué festival de rock e historia de la contracultura, celebrado en 1969 en el estado de Nueva York, reunió a medio millón de personas bajo el lema "Paz y Música"?','W'),-- W, Woodstock
(3,'¿Qué instrumento de percusión está formado por láminas de madera ordenadas como las teclas de un piano que se golpean con unas baquetas con punta de goma o fieltro?','X'), -- X, Xilófono
(3,'¿Qué artista conceptual e integrante de la vanguardia artística es mundialmente conocida por haber sido la esposa y colaboradora musical de John Lennon?','Y'), -- Y, Yoko Ono
(3,'¿Qué estilo de baile y género musical folclórico, de ritmo alegre y saltado, es originario de las regiones andinas de Sudamérica?','Z'); -- Z, Zamba


-- Preguntas Informatica
INSERT INTO PREGUNTAS(id_cat, enunciado, letra)values 
(4,'¿Como se llama uno de los mayores fabricantes de Procesadores y tarjetas Graficas','A'), -- A, AMD
(4,'¿Que tipo de dato de programacion muchas veces es representado como 1 o 0?','B'), -- B, BOOLEAN
(4,'¿Como se llama el Cerebro del ordenador?','C'), -- C, CPU
(4,'¿Como se llama el componente donde se almacena permanentemente la información de los Dispositivos?','D'),-- D, DISCO DURO
(4,'¿Que metodo de mensajería se usa más en corporaciones y es laevolución de un metodo antiguo de cartas?','E'),-- E, EMAIL
(4,'¿Qué red social (ahora parte de la empresa Meta) fue creada por Mark Zuckerberg para conectar a estudiantes universitarios?','F'), -- F, FACEBOOK 
(4,'¿Qué unidad de medida de almacenamiento (que equivale a unos 1000 Megabytes) usamos hoy en día para saber cuánta memoria tiene un móvil?','G'),-- G, Gigabyte O GIGA
(4,'¿Cómo se conoce popularmente a los piratas informáticos que intentan colarse en sistemas ajenos?','H'), -- H, HACKERS
(4,'¿Qué gigantesca red mundial descentralizada nos permite conectar ordenadores, ver vídeos en YouTube y leer esta respuesta?','I'),-- I, INTERNET
(4,'¿Qué accesorio con palanca y botones se utiliza principalmente para jugar a videojuegos en el ordenador o la consola?','J'), -- J, JOYSTICK
(4,'¿Como se llama en ingles el periférico o accesorio que usamos para escribir letras y números en la pantalla?','K'), -- K, KEYBORD
(4,'¿Qué sistema operativo gratuito y de código abierto tiene como mascota a un simpático pingüino llamado Tux?','L'),-- L, LINUX
(4,'¿Qué empresa tecnológica americana creó el paquete Office?','M'), -- MICROSOFT
(4,'¿Cómo llamamos al espacio virtual en internet donde guardamos archivos sin que ocupen sitio en nuestro disco duro?','N'), -- N, NUBE
(4,'¿Cómo se llama la acción de estar conectado a internet?','O'), -- O, ONLINE
(4,'¿Cómo llamamos al pequeño punto de luz de la pantalla que, al juntarse por millones con otros, forma la imagen que estamos viendo?','P'), -- P, PIXEL
(4,'¿Qué teclado estándar usamos en España e Hispanoamérica, llamado así por las primeras seis letras de su fila superior?','Q'), -- Q, QWERTY
(4,'¿Qué tipo de memoria ultra rápida del ordenador almacena los datos de los programas abiertos en ese mismo instante?','R'), -- R, RAM
(4,'¿Cómo llamamos al mensaje molesto o correo electrónico publicitario no deseado que inunda nuestra bandeja de entrada?','S'), -- S, SPAM
(4,'¿Qué red social de hilos de texto, cuyo logotipo pasó de ser un pájaro azul a una letra equis, te permite publicar mensajes cortos?','T'), -- T, TWITTER
(4,'¿Qué término en inglés (dirección web) es la cadena de caracteres que escribes en la barra del navegador para entrar a un sitio (ej: [www.google.com](https://www.google.com))?','U'), -- U, URL
(4,'¿Qué tipo de programa informático malicioso se "contagia" de ordenador en ordenador con el fin de dañar el sistema o robar información?','V'), -- V, VIRUS
(4,'¿Qué tecnología inalámbrica nos permite conectar el móvil o el portátil a internet en casa sin necesidad de usar cables?','W'), -- W, WIFI
(4,'¿Qué consola de videojuegos doméstica fabrica Microsoft para competir directamente con la PlayStation de Sony?','X'), -- X, XBOX
(4,'¿Qué unidad de almacenamiento masivo teórica (gigantesca, por encima del Terabyte y el Petabyte) empieza por esta letra?','Y'), -- Y, YOTTABYTE
(4,'¿Qué famosa aplicación de videollamadas se volvió indispensable en todo el mundo para teletrabajar y dar clases online?','Z'); -- Z, ZOOM



--  Preguntas Entretenimiento
INSERT INTO preguntas(id_cat, enunciado, letra) values 
(5, '¿Qué saga de videojuegos de simulación de vida de Nintendo te permite mudarte a una isla desierta, pescar, cazar bichos y convivir con vecinos animales?','A'), -- A, ANIMAL CROSSING
(5,'¿Como se llama el Jefe de robin en la ciudad del Crimen Gotham?','B'),-- B, BATMAN
(5, '¿Cómo se llama el canal de televisión infantil por cable donde nacieron series de animación míticas como El laboratorio de Dexter, Las Supernenas o Ben 10?','C'),-- C, CARTOON NETWORK
(5, '¿Qué gigante del entretenimiento mundial es el creador de Mickey Mouse y dueño de franquicias como Star Wars, Marvel y Pixar?','D'),-- D, DISNEY
(5, '¿Qué entrañable y pacífico extraterrestre de una película de Steven Spielberg de los 80 se hace amigo de un niño llamado Elliott y quiere "llamar a su casa"?','E'),-- E,ET
(5, '¿La saga de acción y conducción protagonizada por Vin Diesel?','F'),-- F, FAST & FURIOUS
(5, '¿Como se llama el lagarto gigante y gran rival de King Kong?','G'), -- G, GODZILLA
(5, '¿Qué joven mago con una cicatriz en forma de rayo en la frente asiste al Colegio Hogwarts de Magia y Hechicería en los libros y películas?','H'),-- H, HARRY POTTER
(5, '¿Qué película de Christopher Nolan de 2014 nos lleva a un viaje espacial a través de un agujero de gusano para buscar un nuevo hogar para la humanidad?','I'),-- I , INTERESETELLAS
(5, '¿Qué agente secreto británico del MI6, también conocido como el código 007, es famoso por pedir su Martini "agitado, no batido"?','J'),-- J, JAMES BOND
(5, '¿Qué redondo y simpático personaje rosa de Nintendo es capaz de tragarse a sus enemigos para copiar sus habilidades?','K'),-- K,KIRBY
(5, '¿Como se llama la famosa serie de la compañia Warner Bros que reune a personajes míticos como Bugs Bunny, Pato Lucas o Píolin?','L'),-- L, LOONEY TUNES
(5, '¿Qué ratón animado con pantalones cortos rojos y guantes blancos es la mascota oficial de la compañía Disney desde 1928?','M'),-- M, MICKEY MOUSE
(5, '¿Qué plataforma de streaming, famosa por su característico sonido de inicio "Tudum", popularizó el fenómeno de ver series enteras del tirón en casa?','N'),-- N NETFLIX
(5, '¿Como se llamaba el muñeco de nieve que aparece en la pelicula animada de Disney que cuenta con una reina del Hielo?','O'),-- O, OLAF
(5, '¿Qué saga de películas de piratas de Disney está protagonizada por el excéntrico capitán Jack Sparrow a bordo de la Perla Negra?','P'),-- P, PIRATAS DEL CARIBE
(5, '¿Qué aclamado director de cine estadounidense es famoso por sus películas llenas de acción, diálogos ingeniosos y mucha sangre, como Pulp Fiction o Kill Bill?','Q'),-- Q, QUENTIN TARANTINO
(5, '¿Cuál es el nombre del gladiador y héroe de acción de los 80 interpretado por Sylvester Stallone?','R'),-- R, RAMBO
(5, '¿Qué mítica saga de ciencia ficción espacial creada por George Lucas nos narra la eterna lucha entre los Jedi y los Sith en una galaxia muy, muy lejana?','S'),-- S, STAR WARS
(5, '¿Qué colosal barco transatlántico protagoniza la oscarizada película de 1997 donde Leonardo DiCaprio y Kate Winslet viven un romance trágico?','T'),-- T, TITANIC 
(5, '¿Qué película de animación de Pixar de 2009 nos muestra a un cascarrabias anciano que hace volar su casa atando miles de globos de colores para viajar a Sudamérica?','U'), -- U,UP
(5, '¿Qué espectacular y violenta serie de televisión histórica narra las expediciones, saqueos y conquistas del legendario guerrero Ragnar Lothbrok y sus hijos?','V'), -- V, VIKINGOS
(5, '¿Qué famosa compañía de cine es conocida por sus siglas WB y tiene como logotipo un escudo dorado en el que nacieron superhéroes como Batman y personajes como Piolín?','W'), -- W, WARNER BROS
(5, '¿Cómo se llama el grupo de superhéroes mutantes de Marvel, liderados por el Profesor Charles Xavier, que incluye a Lobezno, Cíclope y Tormenta?','X'),-- X , X-MEN
(5, '¿Qué famoso juego de cartas coleccionables y serie de anime japonesa gira en torno a combates de monstruos de duelo utilizando cartas mágicas y de trampa?','Y'), -- Y,YU-GI-OH!
(5, '¿Qué criatura terrorífica de la cultura pop (famosa por series como The Walking Dead o películas como Guerra Mundial Z) consiste en un muerto viviente que busca alimentarse de los vivos?','Z');-- Z, ZOMBIE



-- Preguntas Deportes
INSERT INTO PREGUNTAS(id_cat, enunciado,letra) values
(6,'¿Como se llama el equipo que ha ganado en la Premier League en la temporada 2025/26?','A'),-- A, Arsenal
(6,'¿Qué club de fútbol de la liga española, conocido mundialmente por sus colores azul y grana, juega sus partidos en el Camp Nou?', 'B'), -- B, Barsa
(6,'¿Qué competición de fútbol europeo es el torneo de clubes más prestigioso del continente europeo, cuya final paraliza el planeta cada año?','C'), -- C, Champions League
(6,'¿Qué jugador de baloncesto es considerado el mejor de la historia de Eslovenia, brilló en los Dallas Mavericks de la NBA y jugó en el Real Madrid?', 'D'), -- D, Doncic, Luka
(6,'¿Qué país europeo ha ganado la Eurocopa de fútbol masculino en cuatro ocasiones (1964, 2008, 2012 y 2024)?','E'), -- E, España
(6,'¿Cuál es la principal competición de automovilismo internacional y el campeonato de deportes  de motor más popular y prestigioso del mundo?','F'),-- F, F1
(6,'¿Qué duo de hermanos catalanes llegaron a la NBA y consiguieron ganar ambos mínimmo un anillo?','G'), -- G, GASOL
(6,'¿Qué deporte olímpico de equipo se juega en una pista de hielo o sobre patines, donde los jugadores usan un palo curvado (stick) para meter un disco o pelota en la portería contraria?','H'), -- H, HOCKEY
(6,'¿Qué mítico portero madrileño fue el capitán de la selección española que levantó la Copa del Mundo en Sudáfrica 2010 y las Eurocopas de 2008 y 2012?','I'), -- I, IKER CASILLAS
(6,'¿Qué deporte de combate de origen japonés, que consiste en derribar al oponente usando su propia fuerza?','J'), -- J, JUDO
(6,'¿Circuito de carreras de coches pequeños donde empiezan todos los pilotos de F1?','K'),-- K,KART
(6,'¿Qué astro argentino del fútbol mundial es el máximo goleador histórico del FC Barcelona y de la selección argentina, ganador de múltiples Balones de Oro?','L'),-- L, LEO MESSI
(6,'¿Qué piloto de motociclismo catalán ha hecho historia al ganar 8 títulos mundiales de velocidad (6 de ellos en la máxima categoría, MotoGP)?','M'),-- M, Marc Marquez
(6,'¿Qué deporte olímpico e individual consiste en avanzar por el agua utilizando los brazos y las piernas, y tiene estilos tan conocidos como crol, espalda, braza o mariposa?','N'),-- N, NATACION
(6,'¿Qué gran evento deportivo multidisciplinar se celebra cada cuatro años, reuniendo a atletas de todo el mundo, y tuvo una edición histórica en Barcelona 1992?','O'), -- O, OLIMPIADAS
(6,'¿Que Jugador catálan jugó toda su vida para el FC Barcelona con el número 5 en la espalda y fue campéon de la Eurocopa de 2008?','P'), -- P, PUYOL
(6,'¿Qué pequeño estado de la península arábiga acogió el polémico Mundial de Fútbol de la FIFA en el año 2022, donde Argentina se coronó campeona?','Q'),-- Q, QATAR
(6,'¿Cuál es el nombre del Grandioso y Jugador número 1 de la Historia del futbol, que jugó de delantero para el Real Madrid y Bayern de Munich?','R'), -- R, RONALDO
(6,'¿Qué famosísimo deporte de tabla consiste en deslizarse y hacer giros sobre las olas del mar, y es todo un símbolo de la cultura playera en lugares como Hawái o California?','S'), -- S, SURF
(6,'¿Qué prestigiosa carrera ciclista por etapas se disputa cada julio en las carreteras francesas, considerada la más importante del mundo?','T'),-- T, TOUR DE FRANCIA
(6,'¿Qué máxima organización del fútbol europeo se encarga de organizar la Champions League y la Eurocopa?','U'),-- U, UEFA 
(6,'¿Qué deporte de equipo olímpico se juega golpeando un balón por encima de una red alta en una pista de parqué o en la arena de la playa?','V'),-- V, VOLEY
(6,'¿Cuál es el apellido de las famosas hermanas tenistas que acabaron teniendo una pelicula inspirada en su vida Protagonizada por Will Smith?','W'),-- W, WILLIAMS
(6,'¿Qué exjugador de fútbol donostiarra, que brilló en la Real Sociedad, Liverpool, Real Madrid y Bayern de Múnich, y que también ganó el Mundial de 2010?','X'), -- X, XABI ALONSO
(6,'¿Como es conocida la mítica franquicia de béisbol de Nueva York?','Y'),-- Y, YANKEES
(6,'¿Qué genial exfutbolista francés, de elegancia máxima con el balón, lideró al Real Madrid de los Galácticos como jugador y luego ganó 3 Champions seguidas como entrenador del club?','Z');-- Z, ZINEDINE, ZIDANE
