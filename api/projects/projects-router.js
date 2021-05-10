// Write your "projects" router here!
const express = require('express');
const Project = require('./projects-model');
const router = express.Router();

router.get('/', (req, res) => {
    Project.get()
    .then((projects) => res.json(projects))
    .catch(() => res.status(500).json(
        { message: 'The projects information could not be retrieved'}
    ));
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    Project.get(id)
    .then(project => {
        if(!project) {
            res.status(404).json(
                { message: 'The project with the specified ID does not exist' }
            )
        } else res.json(project)
    })
    .catch(() => res.status(500).json(
        { message: 'The project information could not be retrieved'}
    ))
})

router.post('/', (req, res) => {
    const newProject = req.body
    if (!newProject.name || !newProject.description ) {
        res.status(400).json(
            { message: "Please provide name and description for the project"}
        )
    } else {
        Project.insert(newProject)
        .then(({ id }) => {
            return Project.get(id)
        })
        .then(project => res.status(201).json(project))
        .catch(() => res.status(500).json({ message: "There was an error while saving the project to the database" }))
    }
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const project = req.body;
    if(!project.name || !project.description) {
        res.status(400).json({ message: "Please provide name and description for the project"})
    } else {
        Project.get(id)
        .then(projectId => {
            if(!projectId) {
                res.status(404).json({ message: "The project with the specified ID does not exist"})
            } else {
                return Project.update(id, project)
            }
        })
        .then(project => {
            if(project){
                return Project.get(id)
            }
        })
        .then(project => {
            if(project){
                res.json(project)
            }
        })
        .catch(() => res.status(500).json({ message: "The project information could not be modified"}))
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const projectID = await Project.get(id)
            if(!projectID) {
                res.status(404).json({ message: "The project with the specified ID does not exist" })
            } else {
                await Project.remove(id)
                res.json(projectID)
            }
    } catch(err) {
        res.status(500).json({ message: "The project information could not be modified"})
    }
})

router.get("/:id/actions", async (req, res) => {
    try {
        const id = req.params.id;
        const project = await Project.get(id)
        if(!project) {
            res.status(404).json({
                message: "The project with the specified ID does not exist"
            })
        } else {
            const actions = await Project.getProjectActions(id)
            res.json(actions)
        }
    } catch(err) {
        res.status(500).json({ message: "The actions information could not be retrieved" })
    }
})