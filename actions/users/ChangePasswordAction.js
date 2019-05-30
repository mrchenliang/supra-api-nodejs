const Joi = require('@hapi/joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const authModule = require('../../services/auth')

class ChangePasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:change-password'
  }

  static get validationRules () {
    return {
      body: Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
      })
    }
  }

  static async run (req) {
    const { currentUser } = req

    const userModel = await UserDAO.BaseGetById(currentUser.id)
    await authModule.checkPasswordService(req.body.oldPassword, userModel.passwordHash)
    const newHash = await authModule.makePasswordHashService(req.body.newPassword)
    const data = await UserDAO.BaseUpdate(currentUser.id, { passwordHash: newHash })

    return this.result({ data })
  }
}

module.exports = ChangePasswordAction
