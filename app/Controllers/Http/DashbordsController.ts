import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvitationValidator from 'App/Validators/InvitationValidator'
import { Variable } from '../../Enum/Structure'
import Invitation from 'App/Models/Invitation'
import QRCode from 'qrcode'
import Database from '@ioc:Adonis/Lucid/Database'

export default class DashbordsController {

    public async home({ view, auth, request }: HttpContextContract) {
        const variable: Variable = {
            reference: '',
            nombreDebut: 0,
            nombre: 0
        }
        const page = request.input('page', 1)
        const invitations = await Database.from(Invitation.table).paginate(page,150)
        return view.render('dashbord/home', { variable, invitations, auth })
    }

    public async generateQrCode({ request, response, session }: HttpContextContract) {
        const data = await request.validate(InvitationValidator)
        for(let i = 0; i < data.nombre; i++) {
            let numero = data.nombreDebut
            let nombre = ''
            numero += i
            if(numero < 10) {
                nombre = '000' + numero
            } else if (numero < 100) {
                nombre = '00'+ numero
            } else if(numero < 1000) {
                nombre = '0' + numero
            } else {
                nombre = `${numero}`
            }


            const filename = data.reference + nombre
            const qrcodeName = await QRCode.toDataURL(`http:192.168.88.48:3333/show/${filename}`)
            await Invitation.create({
                name: data.reference,
                image: qrcodeName,
                numero: nombre,
                reference: filename
            })
        }
        session.flash('success', 'Votre qrcode sont bioen générer')
        return response.redirect('/')
    }

    public async collection({ request, view }: HttpContextContract) {
        let keyWord: string = ''
        const variable: Variable = {
            reference: '',
            nombreDebut: 0,
            nombre: 0
        }
        const page = request.input('page', 1)
        const invitations = await Database.from(Invitation.table).paginate(page,150)
        return view.render('dashbord/collection', { keyWord, variable, invitations })
    }

    public async show({ view, params, session }: HttpContextContract) {
        const invitation = await Invitation.findBy('reference', params.reference)
        session.flash('success', "Votre Qrcode est validé!")
        return view.render('dashbord/show', { invitation })
    }

    public async delete({ params, response, session }: HttpContextContract) {
        const invitation = await Invitation.findBy('id', params.id)
        await invitation?.delete()
        session.flash('success', `L'invitation numero ${invitation?.numero} est supprimer!`)
        return response.redirect().back()
    }
}
