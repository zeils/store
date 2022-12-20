const uuid = require('uuid')
const path = require('path')
const {Product, ProductInfo,Picture} = require('../models/models')
const ApiError = require('../error/ApiError')
const db = require('../db')

class ProductController {
    async create(req,res,next){
        console.log('попытка создания')
        try {
            let {name, price, brandId, typeId, info} = req.body

            console.log('FFFFFFFFFFFFFF')
            //console.log(req)

            //console.log(req.files)
            console.log('создание1')

            const img = req.files 
            console.log('создание2')

            
            
            //let intPrice = parseInt(price)
            //console.log('int price ' + intPrice+ ' ' + typeof(intPrice))
            //console.log(' price ' + price + ' ' + typeof(price))
            //console.log(' brand ' + brandId + ' ' + typeof(brandId))
            //console.log(' type ' + typeId + ' ' + typeof(typeId))


            console.log('добавление в базу1')
            console.log(img)
            console.log('добавление в базу2')
            //console.log(JSON.stringify(img.img))



            
            console.log('Добавление товара')
            const product = await Product.create({name, price, brandId, typeId})
            console.log('Добавлено id ' + product.id)
            for  (var i in img.img) {
                if (i){
                    console.log('Добавление картинки!')
                    let pic
                    console.log(img.img.length)
                    if(img.img.length) {
                        pic = img.img[i]
                    }
                    else{
                        pic = img.img
                    }
                    //console.log('Добавление картинки!')
                    //console.log(img.img[i])
                     
                    let fileName= uuid.v4() + ".jpg"
                    pic.mv(path.resolve(__dirname, '..', 'static', fileName))

                    await Picture.create({img: fileName, productId: product.id})

                }
                

            }
            console.log('Картинки добавлены')

      
            
            if (info){

                info = JSON.parse(info)
                for (var i in info) {
                    ProductInfo.create({
                        title: info[i].title,
                        description:  info[i].description,
                        productId:  product.id

                    })
                }

        
            }

            
            return res.json(product)
        } catch(e){
            console.log('ошибка ' + e)

            next(ApiError.badRequest(e.message))
        }

    }
    async getAll(req,res){
        try {
            
        
        const {brandId, typeId, limit, page} = req.query
        let products;
        if (!brandId && !typeId) {

            products = await Product.findAll()
        }
        if (brandId && !typeId) {

            products = await Product.findAll({where:{brandId}})
        }
        if (!brandId && typeId) {

            products = await Product.findAll({where:{typeId}})
        }
        if (brandId && typeId) {

            products = await Product.findAll({where:{typeId, brandId}})
        }

        for (let product of products){
            
                const pics = await Picture.findAll({where:{productId: product.id}})

                let img 
                if (pics.length > 0) {
                    img = {img: pics[0].dataValues.img}

                }else{
                    img = {img: ''}

                }

                Object.assign(product.dataValues, img )

              }


        return res.json(products)
        } catch (e) {
            console.log('ошибка ' + e)

            next(ApiError.badRequest(e.message))
            
        }
 
    }


    async getOne(req,res){
        try {
            
        

        const {id} = req.params
        const dbproduct = await Product.findOne(
            {
                where: {id},
                include: [{model: ProductInfo, as: 'info'}]
            },
        )
        const pics = await Picture.findAll({where:{productId: dbproduct.id}})
        const picsNames =[]

        for (let i=0; i<pics.length; i++) {
            picsNames.push(pics[i].dataValues.img)
        }
        console.log ('еее ' + JSON.stringify(dbproduct) )
        console.log ('info' + JSON.stringify(dbproduct.info))

        const product = {
            id: dbproduct.id,
            name: dbproduct.name,
            price: dbproduct.price,
            rating: dbproduct.rating,
            createdAt: dbproduct.id,
            updatedAt: dbproduct.id,
            typeId: dbproduct.typeId,
            brandId: dbproduct.brandId,
            img: pics[0].dataValues.img,
            info: (dbproduct.info)
            
        }
        console.log ('товар ' + JSON.stringify(product) )
        

        return res.json({product,picsNames})
        }
            catch (e) {
                console.log('ошибка ' + e)

            next(ApiError.badRequest(e.message))
            
        }
        
    }

    async delete(req,res){
        try {
            
        

        const productId = parseInt(Object.values(req.body)[0]) 
        await Product.destroy({
            where: {
                id: productId
            }
        })

        await Picture.destroy({
            where: {
                productId: productId
            }
        })

        return res.json(productId)
        } catch (e) {
            console.log('ошибка ' + e)

            next(ApiError.badRequest(e.message))
            
        }

    }


}

module.exports = new ProductController()