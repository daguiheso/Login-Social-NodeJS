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

Configuramos Passport /passport.js* importando las librerías que utilizamos y las funciones que nos permiten el login.

Con seriealizeUser y deserializeUser logramos que el objeto usuario quede almacenado en la sesión de la aplicación y asi poder utilizarlo a lo largo de ella.

Con TwitterStrategy y FacebookStrategy utilizamos las estrategias de autenticación que nos proporciona Passport, les pasamos como parámetros los API Key y API secret que nos dan las plataformas cuando registramos una aplicación en ellas, y nos devuelven varios objetos, entre ellos el objeto profile que contiene toda la información del usuario que devuelve Twitter o Facebook y del que podemos sacar los atributos que queramos para nuestra aplicación (nombre, ID, foto, etc..)

```
var mongose = require('mongose');
var User = mongose.model('User');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	passport.use(new TwitterStrategy({
		consumerKey		 : config.twitter.key,
		consumerSecret	: config.twitter.secret,
		callbackURL		 : '/auth/twitter/callback'
	}, function(accessToken, refreshToken, profile, done) {
		User.findOne({provider_id: profile.id}, function(err, user) {
			if(err) throw(err);
			if(!err && user!= null) return done(null, user);
			var user = new User({
				provider_id	: profile.id,
				provider		 : profile.provider,
				name				 : profile.displayName,
				photo				: profile.photos[0].value
			});
			user.save(function(err) {
				if(err) throw err;
				done(null, user);
			});
		});
	}));

	passport.use(new FacebookStrategy({
		clientID			: config.facebook.key,
		clientSecret	: config.facebook.secret,
		callbackURL	 : '/auth/facebook/callback',
		profileFields : ['id', 'displayName', /*'provider',*/ 'photos']
	}, function(accessToken, refreshToken, profile, done) {
		User.findOne({provider_id: profile.id}, function(err, user) {
			if(err) throw(err);
			if(!err && user!= null) return done(null, user);
			var user = new User({
				provider_id	: profile.id,
				provider		 : profile.provider,
				name				 : profile.displayName,
				photo				: profile.photos[0].value
			});
			user.save(function(err) {
				if(err) throw err;
				done(null, user);
			});
		});
	}));
};
```

Una buena práctica es mantener las API Keys separadas del código fuente que subimos al repositorio, en un archivo config.js (o en las variables de entorno) que luego importamos desde donde lo necesitemos.

```
var config = {
	twitter: {
		key: TWITTER_API_KEY,
		secret: TWITTER_API_SECRET
	},
	facebook: {
		id: FACEBOOK_API_ID,
		secret: FACEBOOK_APP_SECRET
	}
};

module.exports = config;
```

