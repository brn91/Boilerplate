
var polyfill = require('babel-polyfill');
var Koa      = require('koa');


const app = new Koa();



app.use(async (ctx, next) => {

	try {

		await next();

	} catch(err) {

		ctx.body   = { message: err.message };
		ctx.status = err.status || 500;

	}

});


app.use(async (ctx, next) => {

	ctx.body = 'Hello World';

});



module.exports = {

	listen: function(port) {

		port = typeof port === 'number' ? (port | 0) : null;


		if (port !== null) {

			app.listen(port);


			return true;

		} else {

			throw "listen(Number port): port is not a Number";

		}


		return false;

	}

}
