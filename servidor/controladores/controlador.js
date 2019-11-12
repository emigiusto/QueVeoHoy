var con = require('../lib/conexionbd');

/*var sql = require('sql-query');
sqlQuery = sql.Query();
var squel = require("squel");*/

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
                                    /*//{ col1: 1, col2: 2 }
                                    console.log(whereObject)
                                    if (whereObject.length>0) {
                                        var wheresentence =  JSON.stringify(whereObject[0]);
                                        if (whereObject.length>1) {
                                            for (let index = 1; index < whereObject.length; index++) {
                                                wheresentence += (", " + JSON.stringify(whereObject[index]));
                                            }
                                        }
                                    }
                                var s = squel.select()
                                        .from("pelicula")
                                        .where("anio = " + año)
                                        .where("genero_id = " + genero)
                                        .where("titulo = '% " + titulo + " %'")
                                        .toString()



                                var sqlSelect = sqlQuery.select()
                                    .from('pelicula')
                                    .where(wheresentence)
                                    .order(req.query.columna_orden, req.query.tipo_orden)
                                    .limit(req.query.cantidad)
                                    .build();*/

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

module.exports = {
    traerpelicula: traerpelicula,
    traergenero: traergenero
};