
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
        let parent = dropArea.parentNode;
        let control = parent.getElementsByClassName('control');

        console.log(input[0]);
        console.log(file);
        console.log(input[0].src);

        img.src = reader.result;

        let deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.classList.add('delete-btn');

        deleteBtn.onclick = () => {
            let slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.value = '0';
            slider.id = 'value';
            img.remove();
            input[0].value = '';
            control[0].innerHTML = '';
            control[0].appendChild(slider);
        };
    
        dropArea.querySelector('.preview').innerHTML = '';
        dropArea.querySelector('.preview').appendChild(img);

        control[0].innerHTML = '';
        control[0].appendChild(deleteBtn);
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

