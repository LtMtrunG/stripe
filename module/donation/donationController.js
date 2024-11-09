const donationService = require('./donationService');
const DonationService = require('./donationService');

class ProjectController {

    // Method to call donate
    async donate(req, res) {
        try {
            const donateData = req.body;
            const donorId = req.id;
            const url = await DonationService.donate(donorId, donateData);
            return res.status(200).json(url);
            // return res.redirect(303, url);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }

    // Get all Donations
    async getAllDonations(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const after = req.query.after || ''; 
            const results = await DonationService.getAllDonations(limit, after);
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMyDonations(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const after = req.query.after || '';
            const donorId = req.id;
            const results = await DonationService.getMyDonations(limit, after, donorId);
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = new ProjectController();
