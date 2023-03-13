import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthenticationController {
  public register({ view }: HttpContextContract) {
    const user = new User()
    return view.render('auth/register', { user })
  }

  public login({ view }: HttpContextContract) {
    const user = new User()
    return view.render('auth/login', { user })
  }

  public async saveRegister({
    request,
    response,
    auth,
    session,
  }: HttpContextContract) {
    const data = await request.validate(RegisterValidator)
    const user = await User.create(data)
    await auth.login(user)
    session.flash('success', 'Vous avez été entrer.')
    return response.redirect().toRoute('home')
  }

  public async saveLogin({
    request,
    response,
    auth,
    session,
  }: HttpContextContract) {
    const { uid, password } = await request.validate(LoginValidator)

    try {
      const user = await User.query().where('email', uid).firstOrFail()
      if (!(await Hash.verify(user.password, password))) {
        return response.badRequest(
          "Mot de passe invalide. Veuillez réessaier s'il vous plait?",
        )
      }
      await auth.login(user)
    } catch (error) {
      session.flash('errors', {
        form: "Votre mot de passe ou email est incorrect. Veuillez réessaier s'il vous plait?",
      })
      return response.redirect().back()
    }

    session.flash('success', `Welcome back, ${auth.user!.name}!`)
    return response.redirect('/')
  }

  public async logout({auth, session, response}: HttpContextContract) {
    await auth.logout()

    session.flash('success', 'You have been logged out')

    return response.redirect('/')
  }
}
