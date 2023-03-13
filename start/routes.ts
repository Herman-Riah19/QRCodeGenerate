import Route from '@ioc:Adonis/Core/Route'

Route.get('/register', 'AuthenticationController.register').as(
  'auth.register.show',
)
Route.post('/register', 'AuthenticationController.saveRegister').as(
  'auth.register',
)
Route.get('/login', 'AuthenticationController.login').as('auth.login.show')
Route.post('/login', 'AuthenticationController.saveLogin').as('auth.login')
Route.get('/logout', 'AuthenticationController.logout').as('auth.logout')

Route.get('/', 'DashbordsController.home').as('home')
Route.get('/show/:reference', 'DashbordsController.show').as('home.code.show')
Route.get('/code/:id', 'DashbordsController.delete').as('home.code.delete').middleware('auth')
Route.post('/', 'DashbordsController.generateQrCode')
  .as('home.generate')
  .middleware('auth')
Route.get('/collection', 'DashbordsController.collection')
  .as('home.collection')
  .middleware('auth')
