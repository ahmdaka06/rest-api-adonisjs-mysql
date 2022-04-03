import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async index({ response, auth }: HttpContextContract) {
    return response.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: auth.user,
    })
  }

  public async changeProfile({ request, response, auth }: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        email: schema.string.nullable({}, [rules.email()]),
        new_password: schema.string.optional({}, [rules.confirmed(), rules.minLength(6)]),
      }),
    })

    return response.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: auth.user,
    })
  }
}
