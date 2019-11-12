var con = require('../lib/conexionbd');
var sql = require('sql-query');
sqlQuery = sql.Query();
var squel = require("squel");

  
  

function traerpelicula(req, res) {
    
        var año = req.query.anio;
        var genero = req.query.genero;
        var titulo = req.query.titulo;

    var sql2 = "select * from pelicula"

    var whereObject = [];
        if (año) {
            whereObject.push({anio: año});
        }
        console.log(whereObject)

        if (genero && whereObject.length>0) {
            whereObject.push({genero_id: genero});
        }else if (genero && whereObject.length==0){
            whereObject.push({genero_id: genero});
        }
        console.log(whereObject)

        if (titulo && whereObject.length>0) {
            whereObject.push({titulo: titulo});
        }else if (titulo  && whereObject.length==0){
            whereObject.push({titulo: titulo});
        }
        
        //{ col1: 1, col2: 2 }
        console.log(whereObject)
        if (whereObject.length>0) {
            var wheresentence =  JSON.stringify(whereObject[0]);
            if (whereObject.length>1) {
                for (let index = 1; index < whereObject.length; index++) {
                    wheresentence += (", " + JSON.stringify(whereObject[index]));
                }
            }
        }
        console.log(wheresentence)
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
        .build();

    //console.log(s)
    console.log(sqlSelect)

    sql2 = sql2 + " order by " + req.query.columna_orden + " " + req.query.tipo_orden + " limit " + req.query.cantidad
    con.query(sql2, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            'peliculas': resultado
        };

        res.send(JSON.stringify(response));
    });
}

function traergenero(req, res) {
    var sql = "select * from genero"
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            'generos': resultado
        };

        res.send(JSON.stringify(response));
    });
}

module.exports = {
    traerpelicula: traerpelicula,
    traergenero: traergenero
};