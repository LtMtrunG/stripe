const DonorService = require('./donorService');

class DonorController {
  // Update a donor by ID
  async updateDonor(req, res) {
    try {
      const id = req.id;
      const updatedData = req.body;
      const updatedDonor = await DonorService.updateDonor(id, updatedData);
      res.status(200).json(updatedDonor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createDonor(req, res) {
    try {
      const id = req.params.id;
      const data = req.body.data;
      const results = await DonorService.createDonor(data, id);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDonatedProjects(req, res){
    try{
      const id = req.id;
      const limit = parseInt(req.query.limit) || 10;
      const after = req.query.after || '';
      const results = await DonorService.getDonatedProjects(limit, after, id);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new DonorController();
