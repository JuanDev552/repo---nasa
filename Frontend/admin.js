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
                        <td>${apod.date}</td>
                        <td>${apod.title}</td>
                        <td>${apod.media_type}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-btn" data-date="${apod.date}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-date="${apod.date}">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });
        })
        .catch(error => console.error('Error al obtener los APODs:', error));
});

// Función para eliminar un APOD
async function eliminarAPOD(date) {
    try {
        const response = await fetch(`http://localhost:3000/api/nasa/apod?date=${date}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            location.reload(); // Recargar la página para actualizar la tabla
        } else {
            alert("Error al eliminar el APOD.");
        }
    } catch (error) {
        console.error("Error al eliminar APOD:", error);
    }
}

// Función para redirigir a la página de edición
function editarAPOD(date) {
    window.location.href = `edit.html?date=${date}`; // Redirige con la fecha
}

// Agregar eventos a los botones de eliminar y editar
$(document).ready(() => {
    // Evento para eliminar
    $(document).on('click', '.delete-btn', function () {
        const date = $(this).data('date'); // Obtener la fecha del botón

        if (confirm('¿Estás seguro de que quieres eliminar este APOD?')) {
            eliminarAPOD(date); // Llamar a la función para eliminar
        }
    });

    // Evento para editar
    $(document).on('click', '.edit-btn', function () {
        const date = $(this).data('date'); // Obtener la fecha del botón
        editarAPOD(date); // Llamar a la función para editar
    });
});