
const dropAreas = document.querySelectorAll('.drop-area');

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    e.currentTarget.classList.add('highlight');
}

function unhighlight(e) {
    e.currentTarget.classList.remove('highlight');
}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files, e.currentTarget);
}

function handleFiles(files, dropArea) {
    ([...files]).forEach(file => uploadFile(file, dropArea));
}

function uploadFile(file, dropArea) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
    let img = document.createElement('img');
    img.src = reader.result;
    dropArea.nextElementSibling.appendChild(img);
    };
}

dropAreas.forEach(dropArea => {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);
    dropArea.addEventListener('click', () => dropArea.querySelector('input').click(), false);
});

