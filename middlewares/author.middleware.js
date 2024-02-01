const { User, Role, Permission } = require('../models/index');

module.exports = async (req, res, next) => {
    if (req.user) {
        const user = req.user;
        const roles = await Role.findAll({
            include: [
                {
                    model: User,
                    where: { id: user.id }
                }
            ]
        });

        if (!roles.length) {
            req.permission = {}
        } else {
            const new_roles = roles.map((role) => {
                return role.name;
            });

            const permissions = await Promise.all(
                new_roles.map((role) => {
                    return Permission.findAll({
                        include: [
                            {
                                model: Role,
                                where: { name: role }
                            }
                        ]
                    });
                })
            );

            const flat_permissions = permissions.flat().map((permission) => {
                return permission.value;
            });

            const unique_permission = flat_permissions.filter((value, index, self) => {
                return self.includes(value, index + 1) === false;
            });
            
            req.permission = unique_permission.reduce((acc, curr) => {
                acc[curr] = curr;
                return acc;
            }, {});
        }
    }

    return next();
}