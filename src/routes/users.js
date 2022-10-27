import express from 'express';
import { where } from 'sequelize';
import { Op } from 'sequelize';
const router = express.Router();
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import userValid from '../validation/userValid'
import Users from '../models/model'
import auth from '../validation/tokenValidMiddle'
import authRole from '../validation/roleValidation'
dotenv.config({ path: './.env' });
//Get users
router
  .get('/stats', auth, authRole, async(req, res)=>{
    try{
      const allUsers = await Users.Users.findAll({
         include: {
            model: Users.Email,
            attributes:['numberOfEmails'],
            where:{numberOfEmails: {[Op.gte]:1} }
         }
      })
     
      return res.status(200).json({
        msg: req.user.role,
        data: allUsers,
        error: false,
      });
    }catch (error) {
      return res.status(500).json({
        msg: 'Status 500: internal server error',
        data: undefined,
        error: true,
      });
    }
  }
  )

router 
  .get('/:id', auth, async(req, res)=>{
    const getUserById = await Users.Users.findByPk(req.params.id,{
      include: {
         model: Users.Email,
         attributes:['emailto','title','content']
     } 
   })
  const userId = getUserById.dataValues.id
    try{
      if(userId===req.user.uId){
        //console.log(userId)
        res.status(200).json({
          msg: 'Status 200',
          data: getUserById,
          error: false,
        });
      }else {
        res.status(404).json({
          msg: 'Status 401: Access denied',
          data: undefined,
          error: true,
        });
      }
    } catch(error){
      if (error) {
        res.status(500).json({
          msg: 'Status 500: internal server error',
          data: undefined,
          error: true,
        });
      }
    }
  }
)


//Post Users
router
    .post('/register',userValid, async(req, res)=>{
        //Checking if email user exist
    const userExist = await Users.Users.findOne({where: { userName: req.body.userName }});
    if (userExist) {
        return res.status(400).json({
          msg: 'Email already exist',
        });
  }
     //Hashing password
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(req.body.password, salt)
    const data = Users.Users.build({ //whit CREATE METHOD IS NOT NECESARY TO SAVE DATA, with BUILD METHOD YES.
      userName: req.body.userName,
        password: hashPass
      });
    const rta =  await data.save()
    try{
      res.send({data: data.id})
    }catch(error){
      return res.status(500).json({
      msg: 'Status 500: internal server error',
      data: undefined,
      error: true,
      })
    }
    
    }
    )

//Delete an User
router
.delete('/:id', async(req, res)=>{
  const del = await Users.Users.destroy({where:{'id':req.params.id}});
  try{
      if(del){
        res.status(200).json({
          msg: 'Status 200',
          data: undefined,
          error: false,
        });
      }
   if (!del) {
    res.status(404).json({
      msg: 'Status 404: Employee not found',
      data: undefined,
      error: true,
    });
}
}catch(error){
  if (error) {
    res.status(500).json({
      msg: 'Status 500: internal server error',
      data: undefined,
      error: true,
    });
  }
}
}
)

//USER LOGIN
router
.post('/login', (req, res)=>{
    //CHECK EMAIL
     Users.Users.findOne({where: { userName: req.body.userName }}).then(user=>{
      if(!user){
        return res.status(400).json({
          msg: 'userName or password is wrong',
        });
      }else{
        if(bcrypt.compare(req.body.password, user.password)){
          //return token
          let token = jwt.sign({uId: user.id, role:user.role, userName:user.userName}, `${process.env.TOKEN_SECRET}`,{noTimestamp: true, expiresIn:'1 hour'})
          res.json({uId: user.id, role:user.role, userName:user.userName, token: token})
        }else{
          return res.status(400).send('indalid password')
        }
      }
    }).catch(err=>{
      res.status(500).json(err)
    });
})




export default router
