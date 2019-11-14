USE queveohoy;

ALTER TABLE pelicula
ADD `genero_id` int(11) NOT NULL;

CREATE TABLE `genero` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
);

