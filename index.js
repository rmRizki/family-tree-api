var express = require("express")
var app = express()
var db = require("./database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

app.get("/api/keluarga", (req, res, next) => {
    var sql = "select * from keluarga"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});


app.get("/api/keluarga/:id", (req, res, next) => {
    var sql = "select * from keluarga where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

// get anak
app.get("/api/keluarga/anak/:id", (req, res, next) => {
    var sql = "select * from keluarga where parentId = ?"
    var params = [req.params.id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

// get cucu
app.get("/api/keluarga/cucu/:id", (req, res, next) => {
    var sql = `SELECT cucu.id, cucu.nama, cucu.kelamin, cucu.parentId from keluarga as cucu
     join (SELECT * from keluarga where parentId = ?) as anak where cucu.parentId = anak.id`
    var params = [req.params.id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

//get bibi
app.get("/api/keluarga/bibi/:id", (req, res, next) => {
    var sql = `select * from keluarga where parentId = (select t1.parentId from keluarga as t1 
        join (select parentId from keluarga where id = ?) as t2 where t1.id = t2.parentId) 
        and kelamin = "Perempuan"`
    var params = [req.params.id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

//get paman
app.get("/api/keluarga/paman/:id", (req, res, next) => {
    var sql = `select * from keluarga where parentId = (select t1.parentId from keluarga as t1 
        join (select parentId from keluarga where id = ?) as t2 where t1.id = t2.parentId) 
        and kelamin = "Laki-Laki"`
    var params = [req.params.id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

app.post("/api/keluarga/", (req, res, next) => {
    var errors = []
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        nama: req.body.nama,
        kelamin: req.body.kelamin,
        parentId: req.body.parentId,
    }
    var sql = 'INSERT INTO keluarga (nama, kelamin, parentId) VALUES (?,?,?)'
    var params = [data.nama, data.kelamin, data.parentId]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})



app.patch("/api/keluarga/:id", (req, res, next) => {
    var data = {
        nama: req.body.nama,
        kelamin: req.body.kelamin,
        parentId: req.body.parentId,
    }
    db.run(
        `UPDATE keluarga set
        nama = coalesce(?,nama),
        kelamin = COALESCE(?,kelamin),
        parentId = coalesce(?,parentId)
           WHERE id = ?`,
        [data.nama, data.kelamin, data.parentId, req.params.id],
        (err, result) => {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data
            })
        });
})


app.delete("/api/keluarga/:id", (req, res, next) => {
    db.run(
        'DELETE FROM keluarga WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "success", rows: this.changes })
        });
})
