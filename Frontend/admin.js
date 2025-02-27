$(document).ready(() => {
    // Obtener todos los APODs
    fetch('http://localhost:3000/api/nasa/apods')
        .then(response => response.json())
        .then(apods => {
            const tableBody = $('#apods-table');
            tableBody.empty(); // Limpiar la tabla antes de llenarla

            apods.forEach(apod => {
                const row = `
                    <tr>
                        <td>${apod._id}</td>
                        <td>${apod.title}</td>
                        <td>${apod.date}</td>
                        <td>${apod.media_type}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-btn" data-id="${apod._id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${apod._id}">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });
        })
        .catch(error => console.error('Error al obtener los APODs:', error));
});

$(document).on('click', '.delete-btn', function () {
    const apodId = $(this).data('id');

    if (confirm('¿Estás seguro de que quieres eliminar este APOD?')) {
        fetch(`http://localhost:3000/api/nasa/apod?id=${apodId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); // Recargar la página para actualizar la tabla
        })
        .catch(error => console.error('Error al eliminar el APOD:', error));
    }
});

$(document).on('click', '.edit-btn', function () {
    const apodId = $(this).data('id');
    window.location.href = `edit.html?id=${apodId}`;
});