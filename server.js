import express from "express";
import mysql from "mysql";
import cors from "cors";
import path from "path";



const app = express();
app.use(cors());
app.use(express.json());

const dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(dirname, "build")));

app.get("*", function (_, res) {
  res.sendFile(
    path.join(dirname, "build", "index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup",
});

// SIGN UP ROUTE
app.post("/signup", (req, res) => {
  const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.info(err)
      return res.json("Error");

      
    }
    return res.json(data);
  });
});

// LOGIN ROUTES FOR USERS
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("Success");
    } else {
      return res.json("Failed");
    }
  });
});

//LOGIN ROUTE FOR ADMIN
app.post("/admin-login", (req, res) => {
  const sql =
    "SELECT * FROM login WHERE `email` = ? AND `password` = ? AND `role` = 'admin'";

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("Success");
    } else {
      return res.json("Failed");
    }
  });
});

app.get("/", (req, res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error");
    return res.json(data);
  });
});

// POST
app.post("/create", (req, res) => {
  const sql = "INSERT INTO user set `name` = ?, `content` = ?, `category` = ?";

  const values = [req.body.name, req.body.content, req.body.category];
  db.query(sql, values, (err, data) => {
    if (err) return res.json("Error");
    return res.json(data);
  });
});

// UPDATE
app.put("/update/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    // ID is not a number, so insert a new record
    const sql =
      "INSERT INTO user (`name`, `content`, `category`) VALUES (?, ?, ?)";

    const values = [req.body.name, req.body.content, req.body.category];

    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json(data);
    });
  } else {
    // ID is a number, so update the existing record
    const sql =
      "UPDATE user SET `name` = ?, `content` = ?, `category` = ? WHERE id = ?";

    const values = [req.body.name, req.body.content, req.body.category, id];

    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json(data);
    });
  }
});

// DELETE
app.delete("/USER/:id", (req, res) => {
  const sql = "DELETE FROM user WHERE id = ?";

  const id = req.params.id;
  db.query(sql, [id], (err, data) => {
    if (err) return res.json("Error");
    return res.json(data);
  });
});

app.listen(8081, () => {
  console.log("listening");
});
