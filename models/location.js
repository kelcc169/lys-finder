'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    ravId: DataTypes.INTEGER
  }, {});
  location.associate = function(models) {
    // associations can be defined here
    models.location.belongsToMany(models.user, {through: "favorite"})
  };
  return location;
};