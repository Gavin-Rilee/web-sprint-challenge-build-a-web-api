const Actions = require("../actions/actions-model");
const Projects = require("../projects/projects-model");

function logger(req, res, next) {
  console.log(`${[req.method]} request to ${req.url} endpoint!
   req.body  ${JSON.stringify(req.body)}
   req.params.id ${req.params.id}
   `);
}

function validateProject(req, res, next) {
  const { name, description } = req.body;
  if (!description || !name) {
    res
      .status(400)
      .json({ message: "missing required name and description field" });
  } else {
    next();
  }
}

function validateAction(req, res, next) {
  const { project_id, description, notes } = req.body;
  if (!project_id || !description || !notes) {
    res
      .status(400)
      .json({
        message: "missing required project_id and description field and notes",
      });
  } else {
    next();
  }
}

async function validateProjectId(req, res, next) {
  try {
    const project = await Projects.get(req.params.id);
    if (!project) {
      res.status(404).json({
        message: "project not found",
      });
    } else {
      req.project = project;
      next();
    }
  } catch (err) {
    next();
  }
}

async function validateActionId(req, res, next) {
  try {
    const action = await Actions.get(req.params.id);
    if (!action) {
      res.status(404).json({
        message: "action not found",
      });
    } else {
      req.action = action;
      next();
    }
  } catch (err) {
    next();
  }
}
module.exports = { logger, validateProject, validateAction, validateProjectId, validateActionId };
