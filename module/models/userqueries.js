import connection from "../../config/database.js";
import jwt from "jsonwebtoken";

export const addUser = (req) => {
  return new Promise((resolve, reject) => {
    var params = {
      name: req.name,
      mobile: req.mobile,
      referralCode: req.referrerCode,
      gender: req.gender,
      technology: JSON.stringify(req.technology),
      profilePic: JSON.stringify(req.profilePic),
      dob: req.dob,
      points: req.referrerPoints,
    };
    connection.query(`INSERT INTO tbl_user SET ?`, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const jwtToken = jwt.sign(
          { id: result.insertId },
          process.env.JWT_SECRET
        );
        result.jwtToken = jwtToken;
        if (req.referralPointsId == 0) {
          resolve(result);
        } else {
          connection.query(
            "UPDATE tbl_user SET points = points + " +
              req.referralPoints +
              ' WHERE id ="' +
              req.referralPointsId +
              '"',
            function (err1, result1) {
              resolve(result);
            }
          );
        }
      }
    });
  });
};

export const getReferrals = (page, limit) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM tbl_user LIMIT ?, ?`;
    connection.query(query, [offset, parseInt(limit)], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

export const removeUser = (id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM tbl_user WHERE id = ?`;
    connection.query(query, [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const updateUser = (req) => {
  return new Promise((resolve, reject) => {
    var params = {
      name: req.name,
      mobile: req.mobile,
      gender: req.gender,
      technology: JSON.stringify(req.technology),
      profilePic: JSON.stringify(req.profilePic),
      dob: req.dob,
    };

    const query = `UPDATE tbl_user SET ? WHERE id = '` + req.id + `'`;
    connection.query(query, params, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
