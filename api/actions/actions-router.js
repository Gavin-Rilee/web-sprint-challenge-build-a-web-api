// Write your "actions" router here!
const express = require('express');
const Action = require('./actions-model');
const { validateActionId, validateAction } = require('../middleware/middleware')
const router = express.Router();

router.get('/', (req, res, next) => {
    Action.get()
    .then((actions) => res.json(actions))
    .catch(next);
})

router.get('/:id', validateActionId, (req, res, next) => {
res.json(req.action)
})

router.post('/',validateAction, (req, res, next) => {
    Action.insert(req.body)
    .then(({ id }) => {
        return Action.get(id)
    })
    .then((newAction) => {
        res.status(201).json(newAction)
    })
    .catch(next);
    })
    
    router.put('/:id',validateAction, validateActionId, (req, res, next) => {
        Action.get(req.params.id)
        .then(() => {
            return Action.update(req.params.id, req.body);
        })
        .then(() => {
            return Action.get(req.params.id);
        })
        .then((project) => {
            res.json(project);
        })
        .catch(next);
    })   


    router.delete("/:id", validateActionId, async (req, res, next) => {
        try{
            await Action.remove(req.params.id)
            res.json(req.action)
        }
        catch(err){
            next(err)
        }
        })

module.exports = router