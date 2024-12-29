const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
// 加载环境变量配置文件 .env 中的变量，并将它们添加到 process.env 对象中
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({
      message: 'Username and Password are required.',
    });
  }
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) {
    return res.sendStatus(401); //Unauthorized
  }
  // 比较密码
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // 创建jwt（令牌数据，令牌密钥，令牌配置）
    const accessToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = {
      ...foundUser,
      refreshToken,
    };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    );
    // （key,value,options)
    res.cookie('jwt', refreshToken, {
      // 只能通过HTTP(S)协议传输，不能通过JavScript访问这个cookie
      httpOnly: true,
      // 请求可以在跨站请求中发送。通常用于跨域请求
      sameSite: 'None',
      // cookie 有效期(毫秒)
      maxAge: 24 * 60 * 60 * 1000,
      // 是否只能通过HTTPS协议传输
      // secure: true
    });
    res.json({
      accessToken,
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
