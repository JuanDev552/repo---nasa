$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const apodId = urlParams.get('id');

    // Obtener los datos del APOD
    fetch(`http://localhost:3000/api/nasa/apod?id=${apodId}`)
        .then(response => response.json())
        .then(apod => {
            $('#title').val(apod.title);
            $('#explanation').val(apod.explanation);
            $('#date').val(apod.date);
            $('#url').val(apod.url);
            $('#media_type').val(apod.media_type);
            $('#copyright').val(apod.copyright || '');
        })
        .catch(error => console.error('Error al obtener el APOD:', error));

    // Manejar el envío del formulario de edición
    $('#edit-apod-form').submit(async function (e) {
        e.preventDefault();

        const formData = new FormData();
        const imageFile = $('#image')[0].files[0];

        if (imageFile) {
            formData.append('image', imageFile);

            // Subir la imagen al backend
            const uploadResponse = await fetch('http://localhost:3000/api/nasa/upload', {
                method: 'POST',
                body: formData
            });

            const uploadData = await uploadResponse.json();
            const imageUrl = uploadData.imageUrl;

            // Actualizar el APOD con la nueva URL de la imagen
            const updatedAPOD = {
                title: $('#title').val(),
                explanation: $('#explanation').val(),
                date: $('#date').val(),
                url: imageUrl, // Usar la nueva URL de la imagen
                media_type: $('#media_type').val(),
                copyright: $('#copyright').val()
            };

            fetch(`http://localhost:3000/api/nasa/apod?id=${apodId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAPOD)
            })
            .then(response => response.json())
            .then(data => {
                alert('APOD actualizado correctamente');
                window.location.href = 'admin.html'; // Redirigir al panel de administración
            })
            .catch(error => console.error('Error al actualizar el APOD:', error));
        } else {
            // Si no se subió una imagen, actualizar el APOD sin cambiar la URL
            const updatedAPOD = {
                title: $('#title').val(),
                explanation: $('#explanation').val(),
                date: $('#date').val(),
                url: $('#url').val(),
                media_type: $('#media_type').val(),
                copyright: $('#copyright').val()
            };

            fetch(`http://localhost:3000/api/nasa/apod?id=${apodId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAPOD)
            })
            .then(response => response.json())
            .then(data => {
                alert('APOD actualizado correctamente');
                window.location.href = 'admin.html'; // Redirigir al panel de administración
            })
            .catch(error => console.error('Error al actualizar el APOD:', error));
        }
    });
});