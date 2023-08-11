const express = require("express");
const NewUserRoute = express.Router();

// validation lib
const Joi = require("@hapi/joi");

// prisma
const { PrismaClient } = require("@prisma/client");

const schema = Joi.object({
  uid: Joi.string().max(120).required(),
  name: Joi.string().max(255).required(),
  email: Joi.string().max(255).required(),
});

NewUserRoute.post("/", async (req, res) => {
  const prisma = new PrismaClient();
  const { uid, name, email } = req.body;

  // joi validation body data
  try {
    const validation = await schema.validateAsync(req.body);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, code: "bad" });
    return;
  }

  // search if user already exist
  try {
    const isExist = await prisma.user.findFirst({
      where: {
        uid: uid,
      },
    });

    if (isExist) {
      return res.status(400).json({
        message: `user already exist usr001`,
        code: "bad",
      });
    }

    // if not create a new user
    const user = await prisma.user.create({
      data: {
        uid,
        email,
        name,
      },
    });

    // success message
    return res.status(201).json({
      message: `user created successfully`,
      code: "ok",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: `error creating user db001`,
      code: "bad",
    });
  }
});

module.exports = NewUserRoute;
