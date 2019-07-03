'use strict';
module.exports = (sequelize, DataTypes) => {
  const usersLocations = sequelize.define('usersLocations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    visited: DataTypes.BOOLEAN
  }, {});
  usersLocations.associate = function(models) {
    // associations can be defined here
    models.usersLocations.hasMany(models.note)
  };
  return usersLocations;
};