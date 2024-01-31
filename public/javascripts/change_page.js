const select = document.querySelector('select');

select.addEventListener('input', (e) => {
    const id = e.target.value;
    window.location.href = `/update_role/${id}`;
});