//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var controller = require('./controladores/controlador')
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/peliculas',controller.traerpelicula);
app.get('/peliculas/:idPeli',controller.buscarpelicula);
app.get('/generos',controller.traergenero);
app.get('/recomendacion',controller.recomendar);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8081';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

