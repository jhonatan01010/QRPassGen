const wrapper = document.querySelector(".wrapper");
const qrInput = wrapper.querySelector(".form input");
const generateBtn = wrapper.querySelector(".form button");
const qrImg = wrapper.querySelector(".qr-code img");
const downloadBtn = wrapper.querySelector(".download-btn");
let preValue;

generateBtn.addEventListener("click", () => {
    let qrValue = qrInput.value.trim();
    if (!qrValue || preValue === qrValue) return;
    preValue = qrValue;
    generateBtn.innerText = "Generating QR Code...";
    
    // Generar la URL del código QR
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;
    
    qrImg.src = qrCodeUrl;
    qrImg.addEventListener("load", () => {
        wrapper.classList.add("active");
        generateBtn.innerText = "Generate QR Code";
        downloadBtn.style.display = "block";
    });
});

downloadBtn.addEventListener("click", async () => {
    qrImg.style.pointerEvents = "auto"; // Habilitar clics en la imagen nuevamente
    
    // Mostrar SweetAlert con los botones "Seguir la descarga" y "Me invitas un café"
    Swal.fire({
        title: "Descargar QR",
        text: "¿Deseas descargar el QR?",
        color: "#ffff",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Seguir la descarga",
        cancelButtonText: "Hacer una donación",
    }).then(async (result) => {
        if (result.isConfirmed) {
            const qrCodeUrl = qrImg.src;
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "qr-code.png";
            link.click();
        } else if (result.dismiss === Swal.DismissReason.cancel) {  
            window.location.href = "https://www.paypal.com/donate/?hosted_button_id=D24PNRATPFSUL";
        }
    });
});

qrInput.addEventListener("keyup", () => {
    if (!qrInput.value.trim()) {
        wrapper.classList.remove("active");
        preValue = "";
        downloadBtn.style.display = "none"; // Ocultar el botón de descarga
    }
});
