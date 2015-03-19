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