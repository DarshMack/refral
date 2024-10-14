import {
  addUser,
  getReferrals,
  removeUser,
  updateUser,
} from "../models/userqueries.js";
import { calculateReferralPoints } from "../../config/common.js";
import redisClient from "../../config/redis.js";

export const saveUserData = async (req, res) => {
  try {
    const { name, referralCode } = req.body;
    const { referralPoints, referrerPoints, referralPointsId, referrerCode } =
      await calculateReferralPoints(referralCode);
    req.body.referralPoints = referralPoints;
    req.body.referrerPoints = referrerPoints;
    req.body.referralPointsId = referralPointsId;
    req.body.referrerCode = referrerCode;

    const result = await addUser(req.body);
    await redisClient.set(`result:${result.insertId}`, result.jwtToken);

    // await redisClient.set(`user:${userId}`, username);
  } catch (error) {
    res.send(error.sqlMessage);
  }
};

export const fetchReferralUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.body;
  try {
    const referrals = await getReferrals(page, limit);
    res.status(200).json({ referrals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.user.id;
  try {
    await removeUser(id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { name, mobile, gender, technology, profilePic, dob } = req.body;
  req.body.id = req.user.id;

  try {
    await updateUser(req.body);
    res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
