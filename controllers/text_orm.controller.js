const { User, Provider, Role, Permission } = require('../models/index');

module.exports = {
    index: async (req, res) => {
        const user = await User.findOne({
            where: {
                id: 2
            },
            include: [
                {
                    model: Role
                }
            ]
        });

        return res.json(user);
    }
}