function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();
    });
}

let signaturePad = null;

window.addEventListener('load', async () => {

    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let nombres_apellidos = document.getElementById('nombres').value;
        let dni= document.getElementById('dni').value;
        var pregunta01 = document.querySelector('input[name="pregunta01"]:checked').value;
        let pregunta02 = document.querySelector('input[name="pregunta02"]:checked').value;
        let pregunta03 = document.querySelector('input[name="pregunta03"]:checked').value;
        let pregunta04 = document.querySelector('input[name="pregunta04"]:checked').value;
        let pregunta05 = document.querySelector('input[name="pregunta05"]:checked').value;

        generatePDF(nombres_apellidos, dni, pregunta01, pregunta02, pregunta03, pregunta04, pregunta05);
    })

});

async function generatePDF(nombres_apellidos, dni, pregunta01, pregunta02, pregunta03, pregunta04, pregunta05) {
    const image = await loadImage("img/formulario.jpg");
    const check = await loadImage("img/check.png")
    const signatureImage = signaturePad.toDataURL();

    const pdf = new jsPDF('p', 'pt', 'letter');
    pdf.addImage(image, 'PNG', 20, 10, 550, 780);
    pdf.addImage(signatureImage, 'PNG', 185, 680, 300, 60);

    pdf.setFontSize(15);
    pdf.text(nombres_apellidos, 90, 560);

    const date = new Date();
    let mesActual = new Intl.DateTimeFormat('es-ES',{month: 'long'}).format(new Date());
    pdf.text(date.getDate().toString(), 265, 650);
    pdf.text(mesActual, 360, 650);

    pdf.setFontSize(15);
    pdf.text(dni, 90, 582);
    pdf.setFillColor(0,0,0);
    

    if (parseInt(pregunta01) === 0) {
        pdf.addImage(check, 'PNG', 470,230,20,20)
    } else {
        pdf.addImage(check, 'PNG', 365,230,20,20)
    }

    if (parseInt(pregunta02) === 0) {
        pdf.addImage(check, 'PNG', 470,270,20,20)

    } else {
        pdf.addImage(check, 'PNG', 365,270,20,20)
    }

    if (parseInt(pregunta03) === 0) {
        pdf.addImage(check, 'PNG', 470,310,20,20)

    } else {
        pdf.addImage(check, 'PNG', 365,310,20,20)
    }

    if (parseInt(pregunta04) === 0) {
        pdf.addImage(check, 'PNG', 470,385,20,20)

    } else {
        pdf.addImage(check, 'PNG', 365,385,20,20)
    }

    if (parseInt(pregunta05) === 0) {
        pdf.addImage(check, 'PNG', 470,450,20,20)

    } else {
        pdf.addImage(check, 'PNG', 365,450,20,20)
    }
    const nombre = dni + "_" + date.getDate().toString() + "/"+ mesActual + "/"+ date.getFullYear().toString()+".pdf"
    pdf.save(nombre);
}