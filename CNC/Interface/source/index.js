
/*
 * REST API
 */

// var _SERVER = 'http://botnet.artificial.engineering:8080';
var _SERVER = 'http://localhost:8080';



var toggle_status = function(id) {

	var label = this.querySelector('span');


	_REST({
		method: 'POST',
		path:   '/api/Status',
		data:   {
			id:     id,
			status: label.className === 'icon-start'
		}
	}, function(response) {

		if (response instanceof Object) {

			if (response.message === 'OK') {
				label.className = label.className === 'icon-start' ? 'icon-pause' : 'icon-start';
			}

		}

	});

};

var _REST = function(options, callback) {

	options  = options || {};
	callback = callback instanceof Function ? callback : function(result) { console.info('Response from ' + path + ':', result); };


	var method = options.method || 'GET';
	var path   = options.path   || null;
	var data   = options.data   || null;


	if (path !== null) {

		var xhr = new XMLHttpRequest();


		xhr.open(method, _SERVER + path);
		xhr.responseType = 'json';
		xhr.setRequestHeader('Content-Type', 'application/json');


		if (options.headers instanceof Object) {

			for (var key in settings.headers) {
				xhr.setRequestHeader(key, settings.headers[key]);
			}

		}

		xhr.onload = function() {
			callback(xhr.response);
		};

		xhr.onerror = xhr.ontimeout = function() {
			callback(null);
		};


		if (data !== null) {
			xhr.send(JSON.stringify(data));
		} else {
			xhr.send(null);
		}

	}

};



/*
 * DOM SHIT
 */

var menu = document.querySelector('menu');
if (menu !== null) {

	var _set_active = function(self, elements) {

		for (var e = 0, el = elements.length; e < el; e++) {

			var element = elements[e];
			if (element === self) {
				element.className = 'active';
			} else if (element.className === 'active') {
				element.className = '';
			}

		}

	};


	var items = [].slice.call(menu.querySelectorAll('li'));
	if (items.length > 0) {

		items.forEach(function(item) {

			item.onclick = function(event) {

				if (event.target.tagName === 'A') {
					_set_active(this, items);
				}

			};

		});

	}


	var hash = document.location.hash;
	if (hash !== '') {

		var active = document.querySelector('menu li a[href="' + hash + '"]');
		if (active !== null) {
			_set_active(active.parentNode, items);
		}

	}

}



(function(section) {

	var tbody  = section.querySelector('table tbody');
	var render = function(response) {

		var code = '';

		if (response instanceof Array) {

			code += response.map(function(bot) {

				var chunk = '';

				chunk += '<tr>';
				chunk += '<td>#' + bot.id       + '</td>';
				chunk += '<td>'  + bot.ip       + '</td>';
				chunk += '<td>#' + bot.task     + '</td>';
				chunk += '<td>'  + bot.workload + '</td>';

				if (bot.workload === 0) {
					chunk += '<td><button onclick="toggle_status.call(this, ' + bot.id + ');"><span class="icon-start"></span></button></td>';
				} else {
					chunk += '<td><button onclick="toggle_status.call(this, ' + bot.id + ');"><span class="icon-pause"></span></button></td>';
				}

				chunk += '</tr>';

				return chunk;

			}).join('\n');

		} else {

			code += '<tr><td colspan="5">No BOTS active :(</td></tr>';

		}

		tbody.innerHTML = code;

	};

	var button = section.querySelector('div.action-bar button');
	if (button !== null) {

		button.onclick = function() {

			_REST({
				method: 'GET',
				path:   '/api/Status'
			}, render);

		};

	}

	document.addEventListener('DOMContentLoaded', function() {
		button.click();
	});

})(document.querySelector('#status'));



(function(section) {

	var tbody  = section.querySelector('table tbody');
	var render = function(response) {

		var code = '';

		if (response instanceof Array) {

			code += response.map(function(task) {

				var chunk = '';

				chunk += '<tr>';
				chunk += '<td>#' + task.id          + '</td>';
				chunk += '<td>'  + task.type        + '</td>';
				chunk += '<td>'  + task.data.input  + '</td>';
				chunk += '<td>'  + task.data.output + '</td>';
				chunk += '<td></td>';
				chunk += '</tr>';

				return chunk;

			}).join('\n');

		} else {

			code += '<tr><td colspan="5">No TASKS active :(</td></tr>';

		}

		tbody.innerHTML = code;

	};

	var button = section.querySelector('div.action-bar button');
	if (button !== null) {

		button.onclick = function() {

			_REST({
				method: 'GET',
				path:   '/api/Tasks'
			}, render);

		};

	}

	var submit = section.querySelector('div.action-form button');
	if (submit !== null) {

		submit.onclick = function() {

			var type  = section.querySelector('div.action-form select');
			var input = section.querySelector('div.action-form input');


			_REST({
				method: 'POST',
				path:   '/api/Tasks',
				data:   {
					id:   null,
					type: type.value,
					data: {
						input:  input.value,
						output: null
					}
				}
			});

		};

	}


	document.addEventListener('DOMContentLoaded', function() {
		button.click();
	});

})(document.querySelector('#tasks'));

