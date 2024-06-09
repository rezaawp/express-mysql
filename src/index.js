const express = require("express");
const bodyParser = require("body-parser");
const { dbConnection } = require("./db");
const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.send("hello world");
});

app.get("/tes-connection", (req, res) => {
  dbConnection.query(
    "SELECT 1 + 1 AS solution",
    function (err, result, fields) {
      try {
        if (err) throw err;

        return res.json({
          result: result[0].solution,
          fields,
        });
      } catch (e) {
        return res.status(500).json({
          err: e,
        });
      }
    }
  );
});

app.get("/siswa", (req, res) => {
  dbConnection.query("SELECT * from sisa", (err, result, fields) => {
    try {
      if (err) throw err;
      return res.json({
        result,
        // type: typeof result,
      });
    } catch (e) {
      if (e.errno == 1146) {
        return res.status(500).json({
          message: "nama table di database tidak ditemukan",
        });
      }
      return res.status(500).json({
        err: e,
      });
    }
  });
});

app.post("/siswa", (req, res) => {
  // return res.send("ini adalah endpoint post /siswa");
  // return res.json(req.body);
  const {
    nama_lengkap_siswa,
    no_induk,
    alamat,
    jenis_kelamin,
    id_kelas,
    tanggal_input,
  } = req.body;

  dbConnection.query(
    "INSERT INTO siswa SET ?",
    {
      nama_siswa: nama_lengkap_siswa,
      no_induk,
      alamat,
      jenis_kelamin,
      id_kelas,
      tanggal_input,
    },
    (err, result, fields) => {
      try {
        if (err) throw err;

        return res.json({
          result,
        });
      } catch (e) {
        return res.status(500).json({
          err: e,
        });
      }
    }
  );
});

app.put('/siswa', (req, res) => {

})

app.listen(PORT, () => {
  dbConnection.connect();

  console.log("Server running in localhost:" + PORT);
});
