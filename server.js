const express = require('express');
const projectRouter = require('./projects/projectRouter.js');
const actionRouter = require('./actions/actionRouter.js');

const server = express();

server.use(express.json());
server.use(logger);

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', logger, (req, res) => {
	res.send('<h2>You have been logged.</h2>')
})

// Logger

function logger(req, res, next) {
	console.log(`[${new Date().toISOString()}] ${ req.method } to ${ req.originalUrl } from ${ req.get('Origin') }`
	);
	next();
};

module.exports = server