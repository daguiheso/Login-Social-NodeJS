# Login-Social-NodeJS
NodeJs and Passport



Para este Login Social utilizaamos Passport, este es un Middleware de autenticación para Node.js, que facilita la autenticación y registro de usuarios de una aplicación web.


http://passportjs.org


###Requisitos

* Instalar Node.js y MongoDB

###Comenzamos



#####Creamos una estructura base de aplicación con el framework Express.js

> npm install -g express

> express passport-example

> cd passport-example

> npm install

#####Instalamos las dependencias que vamos a utilizar

> npm install --save mongoose

> npm install --save passport

> npm install --save passport-twitter

> npm instal --save passport-facebook


Creamos un modelo usuario /models/user.js donde indicaremos que datos vamos a querer almacenar en la base de datos para nuestros usuarios. En este ejemplo vamos a salvar el nombre, el proveedor, un ID, la foto del usuario y un campo dónde almacenaremos la fecha en la que el usuario se registró en nuestra aplicación.

```
var mongose = require('mongose');
var Schema = mongose.Schema;

var UserSchema = new Schema({
	name: String,
	provider: String,
	provider_id: {type: String, unique: true},
	photo: String,
	createdAt: {type: Date, default: Date.now}
});

var User = mongose.model('User', UserSchema);
```
