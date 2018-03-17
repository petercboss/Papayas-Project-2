'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 30] }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 60] }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 30] }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 30] }
    }
  });
  return User;
};