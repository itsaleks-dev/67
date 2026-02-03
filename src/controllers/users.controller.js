const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const SALT_ROUNDS = 10;

function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

function sanitizeUpdatePayload(payload = {}) {
  const update = { ...payload };

  delete update._id;
  delete update.passwordHash;
  delete update.createdAt;
  delete update.updatedAt;

  return update;
}

exports.createOne = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const normalizedEmail = normalizeEmail(email);

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
    });

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMany = async (req, res) => {
  try {
    const { users } = req.body || {};

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "users array required" });
    }

    const preparedUsers = await Promise.all(
      users.map(async (u) => {
        if (!u.email || !u.password) {
          throw new Error("each user must have email and password");
        }

        return {
          email: normalizeEmail(u.email),
          passwordHash: await bcrypt.hash(u.password, SALT_ROUNDS),
        };
      }),
    );

    const result = await User.insertMany(preparedUsers, { ordered: false });

    res.status(201).json({
      message: "Users created",
      insertedCount: result.length,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate email detected" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).sort({
      createdAt: -1,
    });

    res.json({
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findByQuery = async (req, res) => {
  try {
    const filter = {};

    if (req.query.email) {
      filter.email = normalizeEmail(req.query.email);
    }

    const users = await User.find(filter).select("-passwordHash");

    res.json({
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const update = sanitizeUpdatePayload(req.body);

    if (update.email) {
      update.email = normalizeEmail(update.email);
    }

    if (update.password) {
      update.passwordHash = await bcrypt.hash(update.password, SALT_ROUNDS);
      delete update.password;
    }

    const result = await User.updateOne({ _id: id }, { $set: update });

    res.json({
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMany = async (req, res) => {
  try {
    const { filter, update } = req.body || {};

    if (!filter || !update) {
      return res.status(400).json({ message: "filter and update required" });
    }

    const safeUpdate = sanitizeUpdatePayload(update);

    if (safeUpdate.email) {
      safeUpdate.email = normalizeEmail(safeUpdate.email);
    }

    const result = await User.updateMany(filter, { $set: safeUpdate });

    res.json({
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.replaceOne = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const replacement = {
      email: normalizeEmail(email),
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
    };

    const result = await User.replaceOne({ _id: id }, replacement);

    res.json({
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });

    res.json({
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMany = async (req, res) => {
  try {
    const result = await User.deleteMany(req.body || {});

    res.json({
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findByCursor = async (req, res) => {
  try {
    const pageSize = Math.min(Number(req.query.pageSize) || 10, 100);
    const { after } = req.query;

    const filter = {};

    if (after) {
      if (!mongoose.isValidObjectId(after)) {
        return res.status(400).json({ message: "Invalid cursor value" });
      }
      filter._id = { $gt: after };
    }

    const users = await User.find(filter)
      .select("-passwordHash -__v")
      .sort({ _id: 1 })
      .limit(pageSize + 1);

    const hasNextPage = users.length > pageSize;
    const items = hasNextPage ? users.slice(0, pageSize) : users;

    const nextCursor = hasNextPage ? items[items.length - 1]._id : null;

    res.json({
      count: items.length,
      nextCursor,
      users: items,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $project: {
          domain: {
            $arrayElemAt: [{ $split: ["$email", "@"] }, 1],
          },
          createdAt: 1,
        },
      },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                uniqueDomains: { $addToSet: "$domain" },
                firstUser: { $min: "$createdAt" },
                lastUser: { $max: "$createdAt" },
              },
            },
            {
              $project: {
                _id: 0,
                totalUsers: 1,
                uniqueDomainCount: { $size: "$uniqueDomains" },
                firstUser: 1,
                lastUser: 1,
              },
            },
          ],
          domains: [
            { $group: { _id: "$domain", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
              $project: {
                _id: 0,
                domain: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
    ]);

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
