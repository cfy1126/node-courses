const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({
      message: 'Username and Password are required.',
    });
  }
  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) {
    return res.status(409).json({
      'message': 'The current user already exists.'
    }); //冲突：用户已经存在
  }
  try {
    // 哈希加密密码
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = {
      username: user,
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    );
    res.status(201).json({
      success: `New user ${user} created!`,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { handleNewUser };
