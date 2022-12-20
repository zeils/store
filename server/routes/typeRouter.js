const Router = require('express')
const typeController = require('../controllers/typeController')
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/',  typeController.create)
router.get('/',typeController.getAll)
router.delete('/', checkRole('ADMIN'), typeController.delete )

module.exports = router