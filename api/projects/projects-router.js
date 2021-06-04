// Write your "projects" router here!
const express = require('express');
const Project = require('./projects-model');
const {validateProject, validateProjectId} = require('../middleware/middleware')
const router = express.Router();

router.get('/', (req, res, next) => {
    Project.get()
    .then((projects) => res.json(projects))
    .catch(next);
})

router.get('/:id', validateProjectId, (req, res, next) => {
res.json(req.project)
})

router.post('/',validateProject, (req, res, next) => {
Project.insert(req.body)
.then(({ id }) => {
    return Project.get(id)
})
.then((newProject) => {
    res.status(201).json(newProject)
})
.catch(next);
})


router.put('/:id',validateProjectId, validateProject, (req, res, next) => {
    Project.get(req.params.id)
    .then(() => {
        return Project.update(req.params.id, req.body);
    })
    .then(() => {
        return Project.get(req.params.id);
    })
    .then((project) => {
        res.json(project);
    })
    .catch(next);
})

router.delete("/:id", validateProjectId, async (req, res, next) => {
try{
    await Project.remove(req.params.id)
    res.json(req.project)
}
catch(err){
    next(err)
}
})

router.get("/:id/actions", validateProjectId, (req, res, next) => {
    Project.getProjectActions(req.params.id)
    .then((projects) => {
        res.json(projects)
    })
    .catch(next);

})
module.exports = router