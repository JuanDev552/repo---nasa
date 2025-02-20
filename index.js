"use strict";

//devuelve una cadena de fecha en formato AAAA-MM-DD
const getDateString = data => 
    `${data.getFullYear()}-${(data.getMonth() + 1)}-${data.getDate()}`;

const displayPicture = data => {
    let html = "";
    if(data.error) {        //mostrar si hay error
        html += `<span class="error">${data.error.message}</span>`;
    }
    else if (data.code) {   //si hay problemas mostrar el mensaje
        html += `<span class="error">${data.msg}</span>`;
    }
    else {                  //éxito mostrar datos de imagen/vídeo
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
                html += `<img src="images/notavailable.jpg" 
                width="${width}" alt="NASA foto">`;
        }

        //fecha y derechos de autor
        html += `<div>${data.date}`;
        if (data.copyright) {
            html += `<span class="right">&copy; ${data.copyright}</span>`;
        }
        html += `</div>`;

        //descripción
        html += `<p>${data.explanation}</p>`;
    }

    //mostrar en la página
    $("#display").html(html);
};

const displayError = error => {
    let html = `<span class="error">${error.message}</span>`;
    $("#display").html(html);
};

$(document).ready(() => {

    //al cargar obtener la fecha de hoy 
    const today = new Date();
    let dateStr = getDateString(today);

    //mostrar la fecha en el campo de entrada
    const dateTextbox = $("#date");
    dateTextbox.val(dateStr);
    dateTextbox.focus();

    $("#view_button").click(() => {

        //obtener fecha del cuadro de texto
        dateStr = $("#date").val();
        const dateObj = new Date(dateStr);

        //comprobar si la fecha es válida
        if (dateObj == "Dato invalido") {
            const msg = "Por favor, introduzca una fecha válida.";
            $("#display").html(`<span class="error">${msg}</span>`);
        }
        else {
            //Me aseguro de que la cadena de fecha tenga el formato adecuado
            dateStr = getDateString(dateObj);

            //URL de la API de la NASA
            const domain = `https://api.nasa.gov/planetary/apod`;
            const request = `?api_key=DEMO_KEY&date=${dateStr}`;
            const url = domain + request;

            fetch(url)
                .then(response => response.json())
                .then(json => displayPicture(json))
                .catch(e => displayError(e));
        }
        $("#date").focus();
    });
});