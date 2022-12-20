//import emailjs from 'emailjs-com'
//import {SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY, PRIVATE_KEY} from '../utils/const'

const {Type} = require('../models/models')
const {Product} = require('../models/models')
const ApiError = require('../error/ApiError')
//var email = require("emailjs");
//import emailjs from 'emailjs'

class OrderController{

    

    async send(req,res){

        let {name, phone, email, order } = req.body
        console.log(req.body)

        var templateParams = {
            name: 'James',
            notes: 'Check this out!'
        };
         
        //emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY, PRIVATE_KEY)
        //.then((result) => {
        //    console.log(result.text);
        //}, (error) => {
        //    console.log(error.text);
        //});

        return res.json(templateParams)
        
    }

}

module.exports = new OrderController()