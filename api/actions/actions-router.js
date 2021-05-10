// Write your "actions" router here!
const express = require('express');
const Action = require('./actions-model');
const router = express.Router();
router.get('/', (req, res) => {
    Action.get()
    .then((actions) => res.json(actions))
    .catch(() => res.status(500).json(
        { message: 'The actions information could not be retrieved'}
    ));
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    Action.get(id)
    .then(action => {
        if(!action) {
            res.status(404).json(
                { message: 'The action with the specified ID does not exist' }
            )
        } else res.json(action)
    })
    .catch(() => res.status(500).json(
        { message: 'The action information could not be retrieved'}
    ))
})

router.post('/', (req, res) => {
    const newAction = req.body
    if (!newAction.description || !newAction.notes || !newAction.project_id) {
        res.status(400).json(
            { message: "Please provide project id, description and notes for the action"}
        )
    } else {
        Action.insert(newAction)
        .then(({ id }) => {
            return Action.get(id)
        })
        .then(project => res.status(201).json(project))
        .catch(() => res.status(500).json({ message: "There was an error while saving the action to the database" }))
    }
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const action = req.body;
    if(!action.notes || !action.description || !action.project_id) {
        res.status(400).json({ message: "Please provide project id, description and notes for the action" })
    } else {
        Action.get(id)
        .then(actionId => {
            if(!actionId) {
                res.status(404).json({ message: "The action with the specified ID does not exist"})
            } else {
                return Action.update(id, action)
            }
        })
        .then(action => {
            if(action){
                return Action.get(id)
            }
        })
        .then(action => {
            if(action){
                res.json(action)
            }
        })
        .catch(() => res.status(500).json({ message: "The action information could not be modified"}))
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const actionsID = await Action.get(id)
            if(!actionsID) {
                res.status(404).json({ message: "The action with the specified ID does not exist" })
            } else {
                await Action.remove(id)
                res.json(actionsID)
            }
    } catch(err) {
        res.status(500).json({ message: "The action information could not be modified"})
    }
})
