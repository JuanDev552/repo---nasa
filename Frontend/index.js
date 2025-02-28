"use strict";

// Devuelve una cadena de fecha en formato AAAA-MM-DD
const getDateString = data => 
    `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;

const displayPicture = data => {
    let html = "";
    if(data.error) {        // Mostrar si hay error
        html += `<span class="error">${data.error.message}</span>`;
    }
    else if (data.code) {   // Si hay problemas mostrar el mensaje
        html += `<span class="error">${data.msg}</span>`;
    }
    else {                  // Éxito mostrar datos de imagen/vídeo
        html += `<h3>${data.title}</h3>`;
        const width = 700;
        switch (data.media_type) {
            case "image":
                html += `<img src="${data.url}" width="${width}"
                alt="NASA foto">`;
                break;
            case "video":
                html += `<iframe src=${data.url}
                frameborder="0"
                allowfullscreen></iframe>`;
                break;
            default:
                html += `<img src="https://via.placeholder.com/700x400?text=Imagen+no+disponible" width="${width}" alt="NASA foto">`;
        }

        // Fecha y derechos de autor
        html += `<div>${data.date}`;
        if (data.copyright) {
            html += `<span class="right">&copy; ${data.copyright}</span>`;
        }
        html += `</div>`;

        // Descripción
        html += `<p>${data.explanation}</p>`;
    }

    // Mostrar en la página
    $("#display").html(html);
};

const displayError = error => {
    let html = `<span class="error">${error.message}</span>`;
    $("#display").html(html);
};

$(document).ready(() => {

    // Al cargar obtener la fecha de hoy 
    const today = new Date();
    let dateStr = getDateString(today);

    // Mostrar la fecha en el campo de entrada
    const dateTextbox = $("#date");
    dateTextbox.val(dateStr);
    dateTextbox.focus();

    $("#view_button").click(() => {

        // Obtener fecha del cuadro de texto
        dateStr = $("#date").val();
        const dateObj = new Date(dateStr);

        // Comprobar si la fecha es válida
        if (isNaN(dateObj.getTime())) {
            const msg = "Por favor, introduzca una fecha válida.";
            $("#display").html(`<span class="error">${msg}</span>`);
        }
        else {
            // Me aseguro de que la cadena de fecha tenga el formato adecuado
            dateStr = getDateString(dateObj);

            // Hacer la solicitud al backend
            const url = `http://localhost:3000/api/nasa/apod?date=${dateStr}`;

            fetch(url)
                .then(response => response.json())
                .then(json => displayPicture(json))
                .catch(e => displayError(e));
        }
        $("#date").focus();
    });
});