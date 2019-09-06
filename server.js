const express = require('express')

const server = express();

server.use(express.json());
server.use(logger);

server.get('/', logger, (req, res) => {
	console.log(logger(req, res));
})

module.exports = server;

function logger(req, res, next) {
	console.log(`[${new Date().toISOString()}] ${ req.method } to ${ req.originalUrl } from ${ req.get('Origin') }`
	);
	next();
};