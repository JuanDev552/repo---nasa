$(document).ready(() => {
    // Obtener el parámetro "date" de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('date');

    // Verificar si el parámetro "date" está presente
    if (!date) {
        alert('Fecha no especificada. Redirigiendo a la página principal.');
        window.location.href = 'admin.html'; // Redirigir si no hay fecha
        return;
    }

    console.log('Fecha obtenida de la URL:', date); // Depuración

    // Obtener los datos del APOD
    fetch(`http://localhost:3000/api/nasa/apod?date=${date}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(apod => {
            // Llenar el formulario con los datos del APOD
            $('#title').val(apod.title);
            $('#explanation').val(apod.explanation);
            $('#date').val(apod.date);
            $('#url').val(apod.url);
            $('#media_type').val(apod.media_type);
            $('#copyright').val(apod.copyright || '');
        })
        .catch(error => {
            console.error('Error al obtener el APOD:', error);
            alert('No se pudo obtener el APOD. Por favor, inténtalo de nuevo.');
            window.location.href = 'admin.html'; // Redirigir en caso de error
        });

    // Manejar el envío del formulario de edición
    $('#edit-apod-form').submit(async function (e) {
        e.preventDefault();

        const formData = new FormData();
        const imageFile = $('#image')[0].files[0];

        try {
            let imageUrl = $('#url').val(); // Usar la URL actual por defecto

            // Si se subió una imagen, actualizar la URL
            if (imageFile) {
                const uploadResponse = await fetch('http://localhost:3000/api/nasa/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!uploadResponse.ok) {
                    throw new Error(`Error al subir la imagen: ${uploadResponse.statusText}`);
                }

                const uploadData = await uploadResponse.json();
                imageUrl = uploadData.imageUrl; // Usar la nueva URL de la imagen
            }

            // Actualizar el APOD
            const updatedAPOD = {
                title: $('#title').val(),
                explanation: $('#explanation').val(),
                date: $('#date').val(),
                url: imageUrl, // Usar la URL actualizada o la existente
                media_type: $('#media_type').val(),
                copyright: $('#copyright').val()
            };

            const updateResponse = await fetch(`http://localhost:3000/api/nasa/apod?date=${date}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAPOD)
            });

            if (!updateResponse.ok) {
                throw new Error(`Error al actualizar el APOD: ${updateResponse.statusText}`);
            }

            const data = await updateResponse.json();
            alert('APOD actualizado correctamente');
            window.location.href = 'admin.html'; // Redirigir al panel de administración
        } catch (error) {
            console.error('Error al actualizar el APOD:', error);
            alert('No se pudo actualizar el APOD. Por favor, inténtalo de nuevo.');
        }
    });
});