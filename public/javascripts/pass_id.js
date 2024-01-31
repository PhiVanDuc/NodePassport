const btn_delete = document.querySelectorAll('.btn-delete');
const btn_cancel = document.querySelector('.btn-cancel');
const form_delete_role = document.querySelector('.form-delete-role');

btn_delete.forEach((btn) => {
    btn.addEventListener("click", function(e) {
        const id = e.target.getAttribute("data-id");
        form_delete_role.action = `/delete_role/${id}`;
    });
});