import { DataTypes, Op} from "sequelize";
import db from '../config/database'

const Email = db.define('em',{
    emailto:{
        type: DataTypes.STRING
    },
    title:{
        type: DataTypes.STRING
    },
    content:{
        type: DataTypes.STRING
    },
    uId:{
        type: DataTypes.INTEGER
    },
    numberOfEmails:{
        type: DataTypes.INTEGER
    }

},{
    tableName:'em',
    timestamps: false
});
const Users = db.define('us', {
    userName:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    role:{
        type: DataTypes.STRING,
        defaultValue:'user'
    }
    },
    {
        tableName:'us',
        timestamps: false
    }
)
//Users has many emails
Users.hasMany(Email);
//Email has one user
Email.belongsTo(Users);



db.sync({ alter: true }).then(()=>{
    //update
}).catch((err)=>{
    console.log(err)
})

export default {Users, Email}

