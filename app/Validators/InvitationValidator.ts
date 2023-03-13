import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InvitationValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    reference: schema.string({trim: true}),
    nombreDebut: schema.number(),
    nombre: schema.number()
  })

  public messages: CustomMessages = {
    'name.regex': 'Le nom doit être une lettre alphanumerique avec -, ., ou _',
  }
}
