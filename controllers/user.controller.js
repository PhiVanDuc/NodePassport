const { User, Provider, Role, Permission, User_Role, Role_Permission } = require('../models/index');

module.exports = {
    index: (req, res) => {
        return res.render('index', {
            layout: 'layouts/admin_layout',
            req,
        });
    },

    manage_user: async (req, res) => {
        const users = await User.findAll();

        return res.render('authorization/manage_user', {
            layout: 'layouts/admin_layout',
            users,
        });
    },

    author_user: async (req, res) => {
        const { id } = req.params;

        const roles = await Role.findAll();
        const user = await User.findOne({
            where: { id },
            include: [
                {
                    model: Role,
                }
            ]
        });

        return res.render('authorization/author_user', {
            layout: 'layouts/admin_layout',
            id,
            roles,
            user,
        });
    },

    handle_author_user: async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;
        let roles;
        if (role) roles = Array.isArray(role) ? role : [role];

        if (roles && roles.length) {
            const user = await User.findOne({
                where: { id }
            });

            const roleInstance = await Promise.all(
                roles.map((role) => Role.findOne({
                    where: {
                        name: role,
                    }
                }))
            );

            user.setRoles(roleInstance);
        }

        return res.redirect(`/manage_user`);
    }
}