const Project = require('./project');

class ProjectRepository {
  async create(data) {
    const project = new Project(data);
    //convert the saving process into a boolean
    return !!(await project.save());
  }

  async findById(id) {
    return await Project.findById(id);
  }

  async findByStripeId(stripeId) {
    return await Project.findOne({stripeId});
  }

  async update(id, data) {
    return await Project.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new ProjectRepository();
