CREATE DATABASE queveohoy;

USE queveohoy;

CREATE TABLE `pelicula` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `duracion` int(5) NOT NULL,
  `director` varchar(400) NOT NULL,
  `anio` int(5) NOT NULL,
  `fecha_lanzamiento` datetime,
  `puntuacion` int(2),
  `poster` varchar(300),
  `trama` varchar(700),
  PRIMARY KEY (`id`)
);

