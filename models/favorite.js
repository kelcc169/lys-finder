'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorite = sequelize.define('favorite', {
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
  favorite.associate = function(models) {
    // associations can be defined here
    models.favorite.hasMany(models.comment)
  };
  return favorite;
};