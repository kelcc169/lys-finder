'use strict';
module.exports = (sequelize, DataTypes) => {
  const usersLocations = sequelize.define('usersLocations', {
    userId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    visited: DataTypes.BOOLEAN
  }, {});
  usersLocations.associate = function(models) {
    // associations can be defined here
  };
  return usersLocations;
};