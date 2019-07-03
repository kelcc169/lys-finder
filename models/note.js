'use strict';
module.exports = (sequelize, DataTypes) => {
  const note = sequelize.define('note', {
    usersLocationsId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});
  note.associate = function(models) {
    // associations can be defined here
    models.note.belongsTo(models.favorite)
  };
  return note;
};