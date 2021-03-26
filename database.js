var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE keluarga (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama text,
            kelamin text,
            parentId INTEGER 
            )`,
            (err) => {
                if (err) {
                    console.log('Table already created');
                } else {
                    var insert = 'INSERT INTO keluarga (id, nama, kelamin, parentId) VALUES (?,?,?,?)'
                    db.run(insert, [1, "Budi", "Laki-Laki", null])
                    db.run(insert, [2, "Dedi", "Laki-Laki", 1])
                    db.run(insert, [3, "Dodi", "Laki-Laki", 1])
                    db.run(insert, [4, "Dede", "Laki-Laki", 1])
                    db.run(insert, [5, "Dewi", "Perempuan", 1])
                    db.run(insert, [6, "Feri", "Laki-Laki", 2])
                    db.run(insert, [7, "Farah", "Perempuan", 2])
                    db.run(insert, [8, "Gugus", "Laki-Laki", 3])
                    db.run(insert, [9, "Gandi", "Laki-Laki", 3])
                    db.run(insert, [10, "Hani", "Perempuan", 4])
                    db.run(insert, [11, "Hana", "Perempuan", 4])
                }
            });
    }
});


module.exports = db

// Semua anak budi : SELECT * FROM 'keluarga' where parentId = 1
// Cucu dari budi : SELECT cucu.id, cucu.nama, cucu.kelamin, cucu.parentId from keluarga as cucu join (SELECT * from keluarga where parentId = 1) as anak where cucu.parentId = anak.id
// Cucu Perempuan dari budi : SELECT cucu.id, cucu.nama, cucu.kelamin, cucu.parentId from keluarga as cucu join (SELECT * from keluarga where parentId = 1) as anak where cucu.parentId = anak.id AND cucu.kelamin = "Perempuan"
// Bibi dari farah : select * from keluarga where parentId = (select t1.parentId from keluarga as t1 join (select parentId from keluarga where id = 7) as t2 where t1.id = t2.parentId) and kelamin = "Perempuan"
// Sepupu Laki-laki hani : select t1.id, t1.nama, t1.kelamin, t1.parentId from keluarga as t1 join (select * from keluarga where parentId = (select t1.parentId from keluarga as t1 join (select parentId from keluarga where id = 7) as t2 where t1.id = t2.parentId)) as t2 on t1.parentId = t2.id where t1.kelamin = "Laki-Laki"