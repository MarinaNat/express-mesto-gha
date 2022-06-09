const userRouter = require('express').Router();
const {
  getUsers,
  createUsers,
  getUser,
  putchUserProfile,
  putchUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUser);
userRouter.post('/users', createUsers);
userRouter.patch('/users/me', putchUserProfile);
userRouter.patch('/users/me/avatar', putchUserAvatar);

module.exports = userRouter;
