const { User, Provider, Role, Permission, User_Role, Role_Permission } = require('../models/index');
const { string } = require('yup');
const error_author = require('../utils/error_author');

module.exports = {
    manage_role: async (req, res) => {
        const pers = req.permission;
        error_author(req, res, pers.role_display);

        const roles = await Role.findAll({
            order: [['id', 'asc']],
        });

        return res.render('authorization/manage_role', {
            layout: 'layouts/admin_layout',
            roles,
            pers
        });
    },

    create_role: async (req, res) => {
        const pers = req.permission;
        error_author(req, res, pers.role_create);

        const role_create_error = req.flash('role_create_error')[0];
        const role_create_success = req.flash('role_create_success')[0];

        return res.render('authorization/create_role', {
            layout: 'layouts/admin_layout',
            req,
            role_create_error,
            role_create_success,
        });
    },

    handle_create_role: async (req, res, next) => {
        const { name, permission } = req.body;

        let permissions;
        if (permission) permissions = Array.isArray(permission) ? permission : [permission];
            
        const body = await req.validate(req.body, {
            name: string().min(5, 'Nhập tên ít nhất 5 kí tự'),
        });

        if (body) {
            try {
                const [role_data, role_check] = await Role.findOrCreate({
                    where: {
                        name,
                    },
                    default: {
                        name,
                    }
                });
                if (!role_check) {
                    req.flash('role_create_error', 'Vai trò đã tồn tại!');
                    return res.redirect('/create_role');
                }

                if (permissions && permissions.length) {
                    for(element of permissions) {
                        await Permission.findOrCreate({
                            where: {
                                value: element,
                            },
                            default: {
                                value: element,
                            }
                        });
                    }

                    const permissionInstance = await Promise.all(
                        permissions.map((permission) => Permission.findOne({
                            where: {
                                value: permission,
                            }
                        }))
                    );

                    await role_data.addPermissions(permissionInstance);
                }

                req.flash('role_create_success', 'Thêm mới vai trò thành công!');
            }
            catch(e) {
                return next(e);
            }
        }

        return res.redirect('/create_role');
    },

    update_role: async (req, res, next) => {
        const pers = req.permission;
        error_author(req, res, pers.role_edit);

        const { id: id_param } = req.params;

        try {
            const roles = await Role.findAll();

            const role = await Role.findOne({
                where: {
                    id: id_param
                },
                include: [
                    {
                        model: Permission
                    }
                ]
            });

            return res.render('authorization/update_role', {
                layout: 'layouts/admin_layout',
                roles,
                role,
                id_param,
                req
            });
        }
        catch(e) {
            return next(e);
        }
    },

    handle_update_role: async (req, res, next) => {
        const { id } = req.params;
        const { name, permission } = req.body;

        let permissions;
        if (permission) permissions = Array.isArray(permission) ? permission : [permission];

        const body = await req.validate(req.body, {
            name: string().min(5, 'Nhập tên ít nhất 5 kí tự'),
        });

        if (body) {
            try {
                const count = await Role.update(
                    { name },
                    { where: { id } }
                );

                if (!count.length) {
                    req.flash('role_update_error', 'Lỗi cập nhật vai trò!');
                    return res.redirect(`/update_role/${id}`);
                }

                const role = await Role.findOne({
                    where: { id }
                });

                if (permissions && permissions.length) {
                    for(element of permissions) {
                        await Permission.findOrCreate({
                            where: {
                                value: element,
                            },
                            default: {
                                value: element,
                            }
                        });
                    }

                    const permissionInstance = await Promise.all(
                        permissions.map((permission) => Permission.findOne({
                            where: {
                                value: permission,
                            }
                        }))
                    );

                    await role.setPermissions(permissionInstance);
                }
                else {
                    await role.setPermissions([]);
                }

                return res.redirect('/manage_role');
            }
            catch(e) {
                return next(e);
            }
        }
        else {
            return res.redirect(`/update_role/${id}`);
        }
    },

    handle_delete_role: async (req, res) => {
        const { id } = req.params;
        
        const role = await Role.findByPk(id);
        await role.setUsers([]);
        await role.setPermissions([]);
        await Role.destroy({
            where: {
                id,
            }
        })

        return res.redirect('/manage_role');
    }
}