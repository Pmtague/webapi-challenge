const express = require('express');
const Action = require('../data/helpers/actionModel.js');
const Project = require('../data/helpers/projectModel.js');

const router = express.Router();

router.post('/project/:project_id', validateProjectId, validateAction, (req, res) => {
	const action = req.body;
	Action.insert(action)
		.then(action => {
			res.status(201).json(action)
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Could not add action to the database' })
		})
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

router.delete('/project/:project_id/:id', (req, res) => {
	const { id } = req.params;
	Action.remove(id)
		.then(action => {
			res.status(204).end()
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Server could not delete action' })
		})
})

router.put('/project/:project_id/:id', (req, res) => {
	const { id } = req.params;
	const { project_id, description, notes, completed } =req.body
	Action.update(id, { project_id, description, notes, completed })
		.then(updated => {
			if (updated) {
				Action.get(id)
					.then(action => {
						res.status(200).json(updated)
					})
					.catch(err => {
						console.log(err)
						res.status(500).json({ error: 'Error retreiving action' })
					})
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Server could not update action' })
		})
})

function validateProjectId(req, res, next) {
	const { id }= req.params;
	Project.get(id)
		.then(project => {
			if (project) {
				req.project = project;
				next();
			} else {
				res.status(404).json({ error:`Project with id ${ id } does not exist` })
			}
		})
}

function validateAction(req, res, next) {
	const { project_id, description, notes } = req.body;
	if (!project_id) {
		return res.status(400).json({ error: 'Project ID is required' })
	}
	if(!description) {
		return res.status(400).json({ error: 'Please describe your action' })
	}
	if(!notes) {
		return res.status(400).json({ error: 'Please provide some notes' })
	}
	next();
}

module.exports = router;