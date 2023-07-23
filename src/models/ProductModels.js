const Sequelize = require('sequelize');
const db = require('../config')
const {v4 : uuid} = require('uuid');
const Users = require('./UsersModels');

const {DataTypes} = Sequelize;

const Product = db.define('product',{
    id : {
        type : DataTypes.UUID,
        primaryKey : true,
        // autoIncrement : true,
        allowNull : false,
        defaultValue : DataTypes.UUIDV4
    },
    name : {
        type : DataTypes.STRING(25),
        allowNull : false 
    },
    price : {
        type : DataTypes.INTEGER(10),
        allowNull : false 
    },
    stock : {
        type : DataTypes.INTEGER(10),
        allowNull : false 
    },
    image : {
        type : DataTypes.STRING(30),
        allowNull : false 
    },
    imagePath : {
        type : DataTypes.STRING(255),
        allowNull : false
    },
    description : {
        type : DataTypes.STRING(255),
        allowNull : false 
    }
},{
    freezeTableName : true
})

// Product.belongsTo(Users, {
//     foreignKey : 'id',
//     // onDelete : 'CASCADE',
//     // onUpdate : 'CASCADE'
// })



module.exports = Product