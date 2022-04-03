import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    // get data from request
    const email = request.input('email')
    const password = request.input('password')
    try {
      // validate data
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '24hours',
      })
      return response.status(200).json({
        success: true,
        message: 'Login Successful',
        data: token.toJSON(),
      })
    } catch {
      return response.status(400).json({
        success: false,
        message: 'User with provided credentials could not be found',
      })
    }
  }

  public async register({ request, response }: HttpContextContract) {
    // make validation rules
    const validations = await schema.create({
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.confirmed(), rules.minLength(6)]),
    })
    // get payload from request
    const payload = await request.validate({ schema: validations })
    const user = await User.create(payload)

    return response.status(200).json({
      success: true,
      message: 'Registration successful',
      data: user,
    })
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()
    await auth.logout()
    return response.status(200).json({
      success: true,
      message: 'Logout successful',
    })
  }
}
