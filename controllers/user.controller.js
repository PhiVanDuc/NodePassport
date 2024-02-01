const { User, Provider, Role, Permission, User_Role, Role_Permission } = require('../models/index');
const error_author = require('../utils/error_author');

module.exports = {
    index: (req, res) => {
        return res.render('index', {
            layout: 'layouts/admin_layout',
            req,
        });
    },

    manage_user: async (req, res) => {
        const pers = req.permission;
        error_author(req, res, pers.user_display);

        const users = await User.findAll();

        return res.render('authorization/manage_user', {
            layout: 'layouts/admin_layout',
            users,
            current_id: req.user.id,
            pers
        });
    },

    author_user: async (req, res) => {
        const pers = req.permission;
        error_author(req, res, pers.user_edit);

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

        const user = await User.findOne({
            where: { id }
        });

        if (roles && roles.length) {

            const roleInstance = await Promise.all(
                roles.map((role) => Role.findOne({
                    where: {
                        name: role,
                    }
                }))
            );

            user.setRoles(roleInstance);
        }
        else {
            user.setRoles([]);
        }

        return res.redirect(`/manage_user`);
    }
}