const Charity = require('./charity');

class CharityRepository {
  async create(data) {
    const charity = new Charity(data);
    return await charity.save();
  }

  async findById(id) {
    return await Charity.findById(id);
  }

  async update(id, data) {
    return await Charity.findByIdAndUpdate(id, data, { new: true });
  }

  async getAll(page, limit, filters) {
    const { search, type } = filters;
    const query = {};

    if (type) query.type = type;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    const offset = (page - 1) * limit;
    return {
      results: await Charity.find(query) 
            .skip(offset)  
            .limit(limit),
      totalCharities: await Charity.countDocuments(query)
    }
  }

  async searchByName(search) {
    const query = { companyName: { $regex: search, $options: 'i' } };
    const charityIds = await Charity.find(query).select('_id');
    return charityIds.map(charity => charity._id);
  }
}

module.exports = new CharityRepository();
