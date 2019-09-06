const express = require('express');
const Action = require('../data/helpers/actionModel.js');
const Project = require('../data/helpers/projectModel.js');

const router = express.Router();

router.post('/project/:project_id', (req, res) => {
	
})

router.get('/project/:project_id', (req, res) => {
	const { project_id } = req.params;
	Project.getProjectActions(project_id)
		.then(actions => {
				res.status(200).json(actions)	
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Server could not retrieve actions' })
		})
})



module.exports = router;