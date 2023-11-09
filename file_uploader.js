
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
    e.currentTarget.querySelector('input').files = files;
}

function handleFiles(files, dropArea) {
    ([...files]).forEach(file => uploadFile(file, dropArea));
}

function uploadFile(file, dropArea) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        let img = document.createElement('img');
        let input = dropArea.getElementsByTagName('input')

        console.log(input[0]);
        console.log(file);
        console.log(input[0].src);

        img.src = reader.result;

        dropArea.querySelector('.preview').innerHTML = '';
        dropArea.querySelector('.preview').appendChild(img);
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

