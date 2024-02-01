module.exports = (req, res, boolean) => {
    if (!Object.keys(req.permission).length || !boolean) {
        return res.render('error_custom', {
            layout: 'layouts/admin_layout',
            error: 'Bạn không được phép vào trang này!',
        });
    }
}