var con = require('../lib/conexionbd');

function traerpelicula(req, res) {
        var año = req.query.anio;
        var genero = req.query.genero;
        var titulo = req.query.titulo;
        var pagina = req.query.pagina;
        var cantidad = parseInt(req.query.cantidad);

        if (pagina == 1) {
            var desdeRow = 0 
        }else{
            var desdeRow = (parseInt(pagina)-1) * 52
        }

    var sqlselectSentence = "select * from pelicula"

        if (año) {
            sqlselectSentence += (" where anio = " + año);
        }

        if (genero && sqlselectSentence !== "select * from pelicula") {
            sqlselectSentence += (" and genero_id = " + genero);
        }else if (genero && sqlselectSentence == "select * from pelicula"){
            sqlselectSentence += (" where genero_id = " + genero);
        }

        if (titulo && sqlselectSentence !== "select * from pelicula") {
            sqlselectSentence += (" and titulo LIKE '%" + titulo + "%'");
        }else if (titulo  && sqlselectSentence == "select * from pelicula"){
            sqlselectSentence += (" where titulo LIKE '%" + titulo + "%'");
        }
            sqlselectSentence = sqlselectSentence + " order by " + req.query.columna_orden + " " + req.query.tipo_orden + " LIMIT " + desdeRow + " , " + cantidad

    con.query(sqlselectSentence, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        let response = {
            'peliculas': resultado,
            'total': ''
        };
            //Second query for count:
                //Ubico la posición de la palabra limit para borrarla con slice posteriormente
                var sqlLIMIT = sqlselectSentence.lastIndexOf("LIMIT");
                //Elimino desde la palabra LIMIT para adelante y reemplazo * con COUNT(*)
                sql2 = sqlselectSentence.slice(0,sqlLIMIT).replace("*", "COUNT(*) AS conteoTotal")
            con.query(sql2, function(error2, resultado2, fields2) {
                if (error2) {
                    console.log("Hubo un error en la consulta", error2.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }
                response.total = resultado2[0].conteoTotal;

                res.send(JSON.stringify(response));
                })
    });
}

function traergenero(req, res) {
    var sql = "select * from genero"
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        let response = {
            'generos': resultado
        };

        res.send(JSON.stringify(response));
    });
}

function buscarpelicula(req, res) {
    var idPelicula = req.params.idPeli
    var sqlGeneral= 
        "select pelicula.id as 'peliculaId', pelicula.titulo, pelicula.duracion, pelicula.director, pelicula.anio,"
        + "pelicula.fecha_lanzamiento, pelicula.puntuacion, pelicula.poster, pelicula.trama, genero.id as 'generoId',"
        + "genero.nombre as 'generoNombre', GROUP_CONCAT(actor.nombre SEPARATOR ',') as 'actorNombre', GROUP_CONCAT(actor.id SEPARATOR ',') as 'actorId'"
        + " from pelicula join genero on pelicula.genero_id=genero.id"
        + " join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id"
        + " join actor on actor_pelicula.actor_id = actor.id where pelicula.id = " + idPelicula;

    con.query(sqlGeneral, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        let response = {
            'pelicula': resultado[0],
            'genero': resultado[0].generoNombre,
            'actores': resultado[0].actorNombre
        };

        res.send(JSON.stringify(response))
    })
}


function recomendar(req, res) {
    var genero = req.query.genero;
    var anio_inicio = req.query.anio_inicio;
    var anio_fin = req.query.anio_fin;
    var puntuacion = req.query.puntuacion;
    
        var sqlselectSentence = "select * from pelicula join genero on pelicula.genero_id=genero.id"
    
        if (genero) {
            sqlselectSentence += (" where genero.nombre = '" + genero + "'");
        }

        if (anio_inicio && sqlselectSentence !== "select * from pelicula") {
            sqlselectSentence += (" and pelicula.anio >" + anio_inicio);
        }else if (anio_inicio && sqlselectSentence == "select * from pelicula"){
            sqlselectSentence += (" where pelicula.anio >" + anio_inicio);
        }

        if (anio_fin && sqlselectSentence !== "select * from pelicula") {
            sqlselectSentence += (" and pelicula.anio <" + anio_fin);
        }else if (anio_fin && sqlselectSentence == "select * from pelicula"){
            sqlselectSentence += (" where pelicula.anio <" + anio_fin);
        }

        if (puntuacion && sqlselectSentence !== "select * from pelicula") {
            sqlselectSentence += (" and pelicula.puntuacion >" + puntuacion);
        }else if (puntuacion && sqlselectSentence == "select * from pelicula"){
            sqlselectSentence += (" where pelicula.puntuacion <" + puntuacion);
        }

        con.query(sqlselectSentence, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            let response = {
                'peliculas': resultado
            };
    
            res.send(JSON.stringify(response))
        })
}

module.exports = {
    traerpelicula: traerpelicula,
    traergenero: traergenero,
    buscarpelicula: buscarpelicula,
    recomendar: recomendar
};