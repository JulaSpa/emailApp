import express from 'express';
import { where } from 'sequelize';
import emailValidation from '../validation/emailValid'
const router = express.Router();
import Emails from '../models/model'
import auth from '../validation/tokenValidMiddle'
import sgMail from '@sendgrid/mail'

//Get emails
router
  .get('/', async(req, res)=>{
    try{
      const allEmails = await Emails.Email.findAll({include: {model: Emails.Users, attributes:['email']}});
      return res.status(200).json({
        msg: 'status 200',
        data: allEmails,
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

//Get an email
router
  .get('/yourEmails',auth, async(req, res)=>{
    const getEmailById = await Emails.Email.findAll({where:{uId:req.user.uId}})
    try{
      if(getEmailById){
        res.status(200).json({
          msg: 'Status 200',
          data: getEmailById,
          error: false,
        });
      }if (!getEmailById) {
        res.status(404).json({
          msg: 'Status 404: User not found with id',
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
  })

//Post emails
 //Api Key
 sgMail.setApiKey('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')
      
router
    .post('/', auth, emailValidation, async(req, res)=>{
    try{
      const countEmails = await Emails.Email.findAndCountAll({where:{
        uId: req.user.uId
      }})
      const number = countEmails.count
      if(number+1<1000){
       await sgMail.send({
          to:  req.body.emailto, // Change to your recipient
          from:  req.user.userName, // Change to your verified sender
          subject: req.body.title,
          text: req.body.content,
          html: 'Email sent!',
      })
        const data = Emails.Email.build({
          emailto: req.body.emailto,
          title: req.body.title,
          content: req.body.content,
          uId: req.user.uId,
          numberOfEmails: number + 1
        });
        const rta = await data.save();
        return res.status(201).json({
          msg:'status 201',
          data: data,
          error: false,
        })
      }else{
        return res.status(201).json({
          msg:'status 201',
          data: 'you are over the limit of 1000 emails per day, your quota will be reset in 24hs',
          error: false,
        })
      }
     
    }catch(error){
      return res.status(500).json({
      msg: 'Status 500: internal server error',
      data: error,
      error: true,
      })
    }
    
    }
    )
    
//Delete an email
router
    .delete('/:id', async(req, res)=>{
      const del = await Emails.Email.destroy({where:{'id':req.params.id}});
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
export default router;