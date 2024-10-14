import jwt from "jsonwebtoken";
import connection from "./database.js";

export const authenticateToken = (req, res, next) => {
  const bearerToken = req.header("Authorization");

  const token = bearerToken.split(" ")[1];
  if (!token) return res.status(401).send("Access denied.");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = user;
    next();
  });
};

export const calculateReferralPoints = (referralCode) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM tbl_user WHERE referralCode = ? LIMIT 1`;
    connection.query(query, [referralCode], (err, results) => {
      if (err) {
        reject(err);
      } else {
        var possible =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var text = "";
        for (var i = 0; i < 6; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        if (results.length > 0) {
          resolve({
            referralPoints: 10,
            referrerPoints: 20,
            referralPointsId: results[0].id,
            referrerCode: text,
          });
        } else {
          resolve({
            referralPoints: 0,
            referrerPoints: 0,
            referralPointsId: 0,
            referrerCode: text,
          });
        }
      }
    });
  });
};
