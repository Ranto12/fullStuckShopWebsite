const Users = require("../../models/UsersModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// get users
const getUsers = async (req, res) => {
  const { search, limit, page } = req.query;
  try {
    let users = await Users.findAll({
      attributes: ["id", "name", "email", "role", "status"],
      limit: Number(limit) || 10,
      offset: Number(page) || 0,
    });
    // filter users === search
    if (search && typeof search !== "undefined") {
      let filteredUser = [];
      users.forEach((user) => {
        if (
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase()) ||
          user.status.toLowerCase().includes(search.toLowerCase())
        ) {
          filteredUser.push(user);
        }
      });
      users = filteredUser;
    }

    res.json({
      status: "success",
      data: users,
      total: ` ${users.length}`,
      total_page: Math.ceil((await Users.count()) / limit),
    });
  } catch (error) {
    console.log(error);
  }
};

// find users params
const findUsersId = async (req, res) => {
  const { id } = req.query;
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "role", "status"],
      where: {
        id: id,
      },
    });
    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

const Register = async (req, res) => {
  const { email, name, password, confpassword, role, status } = req.body;
  // cek password and confpassword
  if (password !== confpassword)
    return res.status(400).json({
      msg: "password dan confpassword tidak cocok",
    });
  // cek role

  if (!(role === "admin" || role === "superadmin" || role === "user"))
    return res.status(400).json({
      msg: "role tidak sesuai",
    });

  // cek mail
  const cekemail = await Users.findOne({ where: { email: email } });
  if (cekemail) return res.status(400).json({ msg: "email sudah terdaftar" });

  //change password to bcrypt
  const salt = await bcrypt.genSalt();
  const hashpassoword = await bcrypt.hash(password, salt);
  // if condition in above
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashpassoword,
      role: role,
      status: status,
    });
    res.json({
      msg: "register succes",
      data : {
        name : name,
        email : email,
        role : role,
        status : status
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//login
const login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);

    if (!match)
      return res(400).json({
        msg: "password Wrong",
      });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const role = user[0].role;
    const status = user[0].status;

    const accessToken = jwt.sign(
      {
        userId,
        name,
        email,
        role,
        status,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId,
        name,
        email,
        role,
        status,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await Users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: {
          id: userId,
        },
      }
    )
      .then((updatedRows) => {
        console.log(`Number of rows updated: ${updatedRows[0]}`);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      // secure: true,
    });

    // const cek = process.env.ACCESS_TOKEN_SECRET
    res.json({
      accessToken
    });
  } catch (error) {
    res.status(404).json({
      msg: "email tidak ditemukan",
    });
  }
};

// logout
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    {
      refresh_token: null,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

module.exports = {
  getUsers,
  Register,
  findUsersId,
  login,
  logout,
};
