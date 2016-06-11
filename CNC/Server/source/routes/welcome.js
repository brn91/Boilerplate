
module.exports = function(router) {

	router.get('/Welcome', (req, res) => {
		res.status(200);
		res.json({ message: 'Hello World!' });
	});

	router.post('/Welcome/:id', (req, res) => {
		res.status(403);
		res.json({ message: 'You cannot modify ' + req.params.id });
	});

};

