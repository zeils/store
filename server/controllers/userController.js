const ApiError = require('../error/ApiError');
var bcrypt   = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')



const generateJwt = (id, email, role) => {
    return jwt.sign(

        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )

}


class UserController {

    async registration(req,res){
        const {email, password, role} = req.body
        if (!email || !password){
            return next(ApiError.badRequest('Некоректный email или пароль'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})

    }
    async login(req,res,next){
        const {email, password} = req.body
        const user = await User.findOne({where:{email}})
        if (!user){
            return next(ApiError.internal('Неверный логин или пароль'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Неверный логин или пароль'))
        }
        
        const token = generateJwt(user.id, user.email, user.role)
        const role = (await User.findByPk(user.id)).role
        return res.json({token,role})
        
    }
    async check(req,res,next){
        try{
            const token = generateJwt(req.user.id, req.user.email, req.user.role)
        //console.log ('USER !!!!!!!')
       
            const role = (await User.findByPk(req.user.id)).role
        //const user = 'ADMIN'
        //console.log('РООООООООЛЬ ' + role)
            return res.json({token, role})
    
        } catch (e) {
            console.log(e)
        }
        
        
        


        
    }

}

module.exports = new UserController()