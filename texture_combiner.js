
function invert(pixel) {
    return 0xff - pixel
}

function average(pixel1, pixel2, pixel3) {
    return (pixel1 + pixel2 + pixel3) / 3
}

function merge_metallic_smooth(imgData1, imgData2, imgData3, imgData4, imgCombined) {
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = average(imgData1.data[i], imgData1.data[i+1], imgData1.data[i+2]);
        imgCombined.data[i + 1] = 0;
        imgCombined.data[i + 2] = 0;
        imgCombined.data[i + 3] = invert(average(imgData2.data[i], imgData2.data[i+1], imgData2.data[i+2]));
    }
}

function merge_splat(imgData1, imgData2, imgData3, imgData4, imgCombined) {
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = average(imgData1.data[i], imgData1.data[i+1], imgData1.data[i+2]);
        imgCombined.data[i + 1] = average(imgData2.data[i], imgData2.data[i+1], imgData2.data[i+2]);
        imgCombined.data[i + 2] = average(imgData3.data[i], imgData3.data[i+1], imgData3.data[i+2]);
        imgCombined.data[i + 3] =  average(imgData4.data[i], imgData4.data[i+1], imgData4.data[i+2]);
    }
}

function merge_splat_normal(imgData1, imgData2, imgData3, imgData4, imgCombined) {
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = imgData1.data[i];
        imgCombined.data[i + 1] = imgData1.data[i + 1];
        imgCombined.data[i + 2] = imgData2.data[i];
        imgCombined.data[i + 3] =  imgData2.data[i + 1];
    }
}

function merge_splat_metallic(imgData1, imgData2, imgData3, imgData4, imgCombined) {
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = average(imgData1.data[i], imgData1.data[i+1], imgData1.data[i+2]);
        imgCombined.data[i + 1] = invert(average(imgData2.data[i], imgData2.data[i+1], imgData2.data[i+2]));
        imgCombined.data[i + 2] = (imgData3.data[i] + imgData3.data[i+1] + imgData3.data[i+2]) / 3;
        imgCombined.data[i + 3] =  invert(average(imgData4.data[i], imgData4.data[i+1], imgData4.data[i+2]));
    }
}

function arm_to_metallic_smooth(imgData1, imgData2, imgData3, imgData4, imgCombined){
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = imgData1.data[i+2];
        imgCombined.data[i + 1] = 0;
        imgCombined.data[i + 2] = 0;
        imgCombined.data[i + 3] =  invert(imgData1.data[i+1]);
    }
}

function arm_to_metallic_smooth_combined(imgData1, imgData2, imgData3, imgData4, imgCombined) {
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = imgData1.data[i+2];
        imgCombined.data[i + 1] = invert(imgData1.data[i+1]);;
        imgCombined.data[i + 2] = imgData2.data[i+2];;
        imgCombined.data[i + 3] =  invert(imgData2.data[i+1]);
    }
}

function arm_to_ao(imgData1, imgData2, imgData3, imgData4, imgCombined) {
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = imgData1.data[i];
        imgCombined.data[i + 1] = imgData1.data[i];
        imgCombined.data[i + 2] = imgData1.data[i];
        imgCombined.data[i + 3] = 0xff;
    }
}

let merge_function = 'metallic_smooth';

let merge_algorithm = {
    'metallic_smooth': {
        'function' : merge_metallic_smooth,
        'description' : ['Metallic texture', 'Roughness texture'],
        'image': 'image_metallic_smooth',
        'load_counter': 2
    },
    'splat': {
        'function' : merge_splat,
        'description' : ['Texture 1 (Albedo, Emisive, Height)', 'Texture 2 (Albedo, Emisive, Height)', 'Texture 3 (Albedo, Emisive, Height)', 'Texture 4 (Albedo, Emisive, Height)'],
        'image': 'image_splat',
        'load_counter': 1
    },
    'splat_normal': {
        'function' : merge_splat_normal,
        'description' : ['Normal texture 1', 'Normal texture 2'],
        'image': 'image_splat_normal',
        'load_counter': 2
    },
    'splat_metallic': {
        'function' : merge_splat_metallic,
        'description' : ['Metallic texture 1', 'Roughness texture 1', 'Metallic texture 2', 'Roughness texture 2'],
        'image': 'image_splat_metallic',
        'load_counter': 2
    },
    'arm_metallic_smooth': {
        'function' : arm_to_metallic_smooth,
        'description' : ['ARM Texture (Ambient Occlusion, Roughness, Metallic)'],
        'image': 'image_arm_metallic_smooth',
        'load_counter': 1
    },
    'arm_metallic_smooth_combined': {
        'function' : arm_to_metallic_smooth_combined,
        'description' : ['ARM Texture (Ambient Occlusion, Roughness, Metallic)', 'ARM Texture (Ambient Occlusion, Roughness, Metallic)'],
        'image': 'image_arm_metallic_smooth_combined',
        'load_counter': 1
    },
    'arm_ao': {
        'function' : arm_to_ao,
        'description' : ['ARM Texture (Ambient Occlusion, Roughness, Metallic)'],
        'image': 'image_arm_ao',
        'load_counter': 1
    }
};

function init_merger() {
    merge_function = merge_type.value;
    merge_type.addEventListener('change', change_merge_type);

    for (const key in merge_algorithm) {
        merge_algorithm[key].image = document.getElementById(merge_algorithm[key].image);
    }

    change_merge_type(null);
}

function change_merge_type(e) {
    const merge_type = document.getElementById('merge_type');

    merge_function = merge_type.value;

    const aux_images = document.getElementById('drop-area-2-3');
    const second_image = document.getElementById('drop-area-2');

    const text_image = [
        document.getElementById('text-image1'),
        document.getElementById('text-image2'),
        document.getElementById('text-image3'),
        document.getElementById('text-image4')
    ];

    for (const key in merge_algorithm) {
        merge_algorithm[key].image.style.display = 'none';
    }

    second_image.style.display = '';

    let algorithm = merge_algorithm[merge_function];

    aux_images.style.display = algorithm.description.length > 2 ? '' : 'none';
    second_image.style.display = algorithm.description.length > 1 ? '' : 'none';

    algorithm.image.style.display = '';

    for (let i = 0; i < text_image.length; i++) {
        if (i < algorithm.description.length) {
            text_image[i].innerHTML = algorithm.description[i];
        } else {
            text_image[i].innerHTML = '';
        }
    }
}

function download_output() {
    const canvas = document.getElementById('canvas');
    const merge_type = document.getElementById('merge_type');

    var dataURL = canvas.toDataURL('image/png');
    var downloadLink = document.createElement('a');

    downloadLink.href = dataURL;
    downloadLink.download = merge_type.value + '_combined.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


function mergeImages() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imgInput = [
        document.getElementById('image1'),
        document.getElementById('image2'),
        document.getElementById('image3'),
        document.getElementById('image4')
    ];

    const valueInput = [
        document.getElementById('value1'),
        document.getElementById('value2'),
        document.getElementById('value3'),
        document.getElementById('value4')
    ];

    const img = [new Image() , new Image(), new Image(), new Image()];

    const result = document.getElementById('result');
    let loadCounter = 0;

    let algorithm = merge_algorithm[merge_function];

    function onImageLoad() {
        let has_finished = false;
        let imgData = [null, null, null, null];

        loadCounter++;

        canvas.width = Math.max(img[0].width, img[1].width, img[2].width, img[3].width, 64);
        canvas.height = Math.max(img[0].height, img[1].height, img[2].height, img[3].height, 64);

        let imgCombined = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < img.length; i++) {
            if (img[i].src != '') {
                ctx.drawImage(img[i], 0, 0);
            } else {
                let color = 0xff * valueInput[i].value / 100.0;
                ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
                ctx.fillRect(0,0,canvas.width, canvas.height);
            }
            imgData[i] = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if(loadCounter >= algorithm.load_counter) {
            algorithm.function(imgData[0], imgData[1], imgData[2], imgData[3], imgCombined);
            has_finished = true;
        }

        if (has_finished) {
            ctx.putImageData(imgCombined, 0, 0);

            result.style.display = '';
        }
    }

    for (let i = 0; i < img.length; i++) {
        img[i].onload = onImageLoad;

        if (imgInput[i].files && imgInput[i].files[0]) {
            img[i].src = URL.createObjectURL(imgInput[i].files[0]);
          } else {
              loadCounter++;
          }
    }

    if (loadCounter >= 4) {
        onImageLoad();
    }
}