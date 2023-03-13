import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Invitation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public image: string

  @column()
  public numero: string

  @column()
  public reference: string

  @column()
  public isPresent: boolean

  @beforeSave()
  public static setReference(invitation: Invitation) {
    invitation.reference = invitation.name + invitation.numero
  }
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
