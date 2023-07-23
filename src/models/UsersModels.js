const Sequelize = require('sequelize');
const db = require('../config')
const {v4 : uuid} = require('uuid')

const Product = require('./ProductModels');

const {DataTypes} = Sequelize;

const Users = db.define('users', {
    id : {
        type : DataTypes.UUID,
        primaryKey : true,
        // autoIncrement : true,
        allowNull : false,
        defaultValue : DataTypes.UUIDV4
    },
    name: {
        type :DataTypes.STRING(25),
        allowNull : false
    },
    email : {
        type : DataTypes.STRING(25),
        allowNull : false,
        unique : true,
        validate : {
            isEmail : true
        }
    },
    password : {
        type : DataTypes.STRING(255),
        allowNull : false
    },
    refresh_token : {
        type : DataTypes.TEXT
        
    }, 
    role : {
        type : DataTypes.ENUM(12),
        values: ['admin', 'user', 'super_admin'],
        allowNull : false 
    },
    status : {
        type : DataTypes.STRING(20),
        allowNull : false 
    }
},{
    freezeTableName : false
})



// Users.hasMany(Product, {
//     foreignKey : 'id',
//     // onDelete : 'CASCADE',
//     // onUpdate : 'CASCADE'
// })

module.exports = Users;

