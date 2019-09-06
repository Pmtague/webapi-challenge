const express = require('express')
const Action = require('../data/helpers/actionModel.js');
const Project = require('../data/helpers/projectModel.js');

const router = express.Router();


router.get('/', (req, res) => {
	Project.get()
	.then(projects => {
		res.status(200).json(projects)
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({ error: 'Server could not retrieve projects' })
	})
});

router.post('/', validateProject, (req, res) => {
	const project = req.body

	Project.insert(project)
		.then(post => {
			res.status(201).json(project)
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Error saving to the database' })
		})
})

router.get('/:id', validateProjectId, (req, res) => {
	const { id } = req.params;
	Project.get(id)
		.then(project => {
			res.status(200).json(project)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ error: `Server could not retrieve project with id ${ id }` })
		})
});

router.delete('/:id', validateProjectId, (req, res) => {
	const { id } = req.params;
	Project.remove(id)
		.then(project => {
			res.status(204).end()
		})
		.catch(err => {
			console.log(err);
			res.send(500).json({ error: `Server was unable to delete project with id ${ id }` })
		})
});

router.put('/:id', validateProjectId, (req, res) => {
	const { id } = req.params;
	const { name, description, completed } = req.body
	Project.update(id, { name, description, completed })
		.then(updated => {
			if (updated) {
				Project.get(id)
					.then(project => {
						res.status(200).json(updated)
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({ error: `Error retreiving project with id ${ id }` })
					})
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Server could not update project' })
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

function validateProject(req, res, next) {
	const { name, description } = req.body;
	if (!name) {
		return res.status(400).json({ error: 'Name is a required field' })
	}
	if (typeof name !== 'string') {
		return res.status(400).json({ error: 'Name must be a string' })
	}
	if(!description) {
		return res.status(400).json({ error: 'Please provide a project description' })
	}
	next();
}

module.exports = router;