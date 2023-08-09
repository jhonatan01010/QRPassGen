const wrapper = document.querySelector(".wrapper");
const form = document.querySelector("form");
const fileInp = form.querySelector("input");
const infoText = form.querySelector("p");
const closeBtn = document.querySelector(".close");
const copyBtn = document.querySelector(".copy");

function fetchRequest(file, formData) {
    infoText.innerText = "Scanning QR Code...";
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST',
        body: formData,
    })
    .then(res => res.json())
    .then(result => {
        if (result[0] && result[0].symbol[0]) {
            const decodedData = result[0].symbol[0].data;
            infoText.innerText = "QR Code Scanned Successfully";
            document.querySelector("textarea").textContent = decodedData;
            form.querySelector("img").src = URL.createObjectURL(file);
            wrapper.classList.add("active");
        } else {
            infoText.innerText = "Couldn't scan QR Code";
        }
    })
    .catch(() => {
        infoText.innerText = "Couldn't scan QR Code";
    });
}

fileInp.addEventListener("change", async e => {
    let file = e.target.files[0];
    if (!file) return;
    let formData = new FormData();
    formData.append('file', file);
    fetchRequest(file, formData);
});

copyBtn.addEventListener("click", () => {
    let text = document.querySelector("textarea").textContent;
    navigator.clipboard.writeText(text);
});

form.addEventListener("click", () => fileInp.click());
closeBtn.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
