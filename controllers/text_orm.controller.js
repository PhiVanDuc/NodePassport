const { User, Provider } = require('../models/index');

module.exports = {
    index: async (req, res) => {
        const users = await User.findAll({
            include: Provider
        });

        return res.json({ users });
    }
}