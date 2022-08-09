const express = require("express");
const router = express.Router();

const mysqlConnection = require("../database.js");

// Obtener todos los usuarios
router.get("/get", (req, res) => {
  mysqlConnection.query("SELECT * FROM recompensas", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// Obtener un usuario
router.get("/count/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "Select count(*) as recompensa from recompensa_usuario where idusuario = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        if (rows != "") {
          res.json(rows[0]);
        } else {
          res.json({ status: "User not found" });
        }
      } else {
        console.log(err);
      }
    }
  );
});

// Obtener un usuario
router.get("/get/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT * FROM recompensa_usuario INNER JOIN recompensas on recompensas.idRecompensa = recompensa_usuario.idRecompensa WHERE idusuario = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        if (rows != "") {
          res.json(rows);
        } else {
          res.json({ status: "User not found" });
        }
      } else {
        console.log(err);
      }
    }
  );
});

// Obtener un usuario
router.get("/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "SELECT * FROM recompensas WHERE idRecompensa = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        if (rows != "") {
          res.json(rows[0]);
        } else {
          res.json({ status: "User not found" });
        }
      } else {
        console.log(err);
      }
    }
  );
});

// Ruta para hacer el login
router.post("/login", (req, res) => {
  let correo = req.body.correo;
  let password = req.body.password;

  query = `SELECT * FROM usuarios WHERE correo = '${correo}' AND password = '${password}'`;

  mysqlConnection.query(query, (err, rows, fields) => {
    if (!err) {
      if (rows != "") {
        res.json(rows[0]);
      } else {
        res.json({ status: "User not found" });
      }
    } else {
      return res.status(500).json({
        message: "Error",
        error: err,
      });
    }
  });
});

// // DELETE An User
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "DELETE FROM usuarios WHERE idUsuario = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ status: "User Deleted" });
      } else {
        console.log(err);
      }
    }
  );
});

// // INSERT An User
router.get("/phone/:idRecompensa/:idusuario", (req, res) => {
  const { idRecompensa, idusuario } = req.params;

  mysqlConnection.query(
    "SELECT * FROM puntos INNER JOIN usuarios on usuarios.idUsuario = ? INNER JOIN recompensas on recompensas.idRecompensa = ?",
    [idusuario,idRecompensa],
    (err, rows, fields) => {
      if (!err) {
        if (rows != "") {
          if(rows[0].puntosDisponibles >= rows[0].precio){

            const totalNew = rows[0].puntosDisponibles - rows[0].precio

            mysqlConnection.query(
              "INSERT INTO `recompensa_usuario` (`idRecompensa`,`idusuario`) VALUES (?,?)",
              [idRecompensa,idusuario],
              (err, row, fields) => {
                mysqlConnection.query(
                  "UPDATE `puntos` SET `puntosDisponibles` = ? WHERE (`idUsuario` = ?)",
                  [totalNew,idusuario],
                  (err, row, fields) => {
                    res.json({ status: "Gracias por tu compra" });
                  });
              });
          }else{
            res.json({ status: "No alcanza" });
          }
        } else {
          res.json({ status: "Not found" });
        }
      } else {
        console.log(err);
      }
  });
});

// //  Update User
router.put("/:id", (req, res) => {
  const { nombre, correo, password, idTipo } = req.body;
  const { id } = req.params;

  mysqlConnection.query(
    "UPDATE `usuarios` SET `nombre` = ?, `correo` = ?, `password` = ?, `idTipo` = ? WHERE `idUsuario` = ? ",
    [nombre, correo, password, idTipo, id],
    (err, rows, fields) => {
      if (!err) {
        res.json({ status: "Usuario actualizado" });
      } else {
        console.log(err);
      }
    }
  );
});

module.exports = router;
