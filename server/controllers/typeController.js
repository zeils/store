
const {Type} = require('../models/models')
const {Product} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    

    async create(req,res){
        const {name} = req.body
        const type = await Type.create({name})
        return res.json(type)

    }
    async getAll(req,res){
        const types = await Type.findAll()
        return res.json(types)
        
    }

    async delete(req,res){

        const typeId = parseInt(Object.values(req.body)[0]) 

        await Product.destroy({
            where: {
                typeId: typeId
            }
        })

        await Type.destroy({
            where: {
                id: typeId
            }
        })

        return res.json(typeId)

    }


}

module.exports = new TypeController()