const CharityService = require('./charityService');

class CharityController {

  // Update a Charity by ID
  async updateCharity(req, res) {
    try {
      const id = req.id;
      const updatedData = req.body;
      const updatedCharity = await CharityService.updateCharity(id, updatedData);
      res.status(200).json(updatedCharity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update the card for receiving money
  async updateCard(req, res) {
    try {
      const id = req.id;
      const updatedData = req.body;
      const updatedCard = await CharityService.updateCard(id, updatedData);
      res.status(200).json(updatedCard);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new CharityController();
