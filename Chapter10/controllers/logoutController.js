const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
  // 在客户端，也要删除这accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //没有内容可以发回
  }
  const refreshToken = cookies.jwt;
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    // 删除了客户端存储的jwt cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
    return res.sendStatus(204);
  }

  // 删除数据库上的refreshToken模拟
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: '' };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  );
  // secure: true - 仅仅在https中提供服务
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
  res.sendStatus(204);
};

module.exports = { handleLogout };
