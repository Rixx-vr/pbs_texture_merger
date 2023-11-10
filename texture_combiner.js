
function invert(pixel) {
    return 0xff - pixel
}

function average(pixel1, pixel2, pixel3) {
    return (pixel1 + pixel2 + pixel3) / 3
}

function merge_metallic_smooth(imgData1, imgData2, imgCombined) {
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

function merge_splat_normal(imgData1, imgData2, imgCombined) {
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

function arm_to_metallic_smooth(imgData1, imgCombined) {
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = imgData1.data[i+2];
        imgCombined.data[i + 1] = 0;
        imgCombined.data[i + 2] = 0;
        imgCombined.data[i + 3] =  invert(imgData1.data[i+1]);
    }
}

function arm_to_metallic_smooth_combined(imgData1, imgData2, imgCombined) {
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = imgData1.data[i+2];
        imgCombined.data[i + 1] = invert(imgData1.data[i+1]);;
        imgCombined.data[i + 2] = imgData2.data[i+2];;
        imgCombined.data[i + 3] =  invert(imgData2.data[i+1]);
    }
}

function arm_to_ao(imgData1, imgCombined) {
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgCombined.data[i] = imgData1.data[i];
        imgCombined.data[i + 1] = imgData1.data[i];
        imgCombined.data[i + 2] = imgData1.data[i];
        imgCombined.data[i + 3] = 0xff;
    }
}

let merge_function = 'metallic_smooth';

function init_merger() {
    console.log(`init_merger`);
    merge_function = merge_type.value;
    merge_type.addEventListener('change', change_merge_type);

    change_merge_type(null);
}

function change_merge_type(e) {
    const aux_images = document.getElementById('drop-area-2-3');
    const second_image = document.getElementById('drop-area-2');
    const merge_type = document.getElementById('merge_type');
    const text_image1 = document.getElementById('text-image1');
    const text_image2 = document.getElementById('text-image2');
    const text_image3 = document.getElementById('text-image3');
    const text_image4 = document.getElementById('text-image4');

    const image_metallic_smooth = document.getElementById('image_metallic_smooth');
    const image_splat = document.getElementById('image_splat');
    const image_splat_metallic = document.getElementById('image_splat_metallic');
    const image_splat_normal = document.getElementById('image_splat_normal');
    const image_arm_metallic_smooth = document.getElementById('image_arm_metallic_smooth');
    const image_arm_metallic_smooth_combined = document.getElementById('image_arm_metallic_smooth_combined');
    const image_arm_ao = document.getElementById('image_arm_ao');

    image_metallic_smooth.style.display = 'none';
    image_splat.style.display = 'none';
    image_splat_metallic.style.display = 'none';
    image_splat_normal.style.display = 'none';
    image_arm_metallic_smooth.style.display = 'none';
    image_arm_metallic_smooth_combined.style.display = 'none';
    image_arm_ao.style.display = 'none';

    merge_function = merge_type.value;

    second_image.style.display = '';

    switch (merge_function) {
        case 'metallic_smooth':
            aux_images.style.display = 'none';
            image_metallic_smooth.style.display = '';
            text_image1.innerHTML = 'Metallic texture';
            text_image2.innerHTML = 'Roughness texture';
            break;
        case 'splat_normal':
            aux_images.style.display = 'none';
            image_splat_normal.style.display = '';
            text_image1.innerHTML = 'Normal texture 1';
            text_image2.innerHTML = 'Normal texture 2';
            break;
        case 'splat_metallic':
            aux_images.style.display = '';
            image_splat_metallic.style.display = '';
            text_image1.innerHTML = 'Metallic texture 1';
            text_image2.innerHTML = 'Roughness texture 1';
            text_image3.innerHTML = 'Metallic texture 2';
            text_image4.innerHTML = 'Roughness texture 2';
            break;
        case 'splat':
            aux_images.style.display = '';
            image_splat.style.display = '';
            text_image1.innerHTML = 'Texture 1 (Albedo, Emisive, Height)';
            text_image2.innerHTML = 'Texture 2 (Albedo, Emisive, Height)';
            text_image3.innerHTML = 'Texture 3 (Albedo, Emisive, Height)';
            text_image4.innerHTML = 'Texture 4 (Albedo, Emisive, Height)';
            break;
        case 'arm_metallic_smooth':
            aux_images.style.display = 'none';
            second_image.style.display = 'none';
            image_arm_metallic_smooth.style.display = '';
            text_image1.innerHTML = 'ARM Texture (Ambient Occlusion, Roughness, Metallic)';
            break;
        case 'arm_metallic_smooth_combined':
            aux_images.style.display = 'none';
            second_image.style.display = '';
            image_arm_metallic_smooth_combined.style.display = '';
            text_image1.innerHTML = 'ARM Texture (Ambient Occlusion, Roughness, Metallic)';
            text_image2.innerHTML = 'ARM Texture (Ambient Occlusion, Roughness, Metallic)';
            break;
        case 'arm_ao':
            aux_images.style.display = 'none';
            second_image.style.display = 'none';
            image_arm_ao.style.display = '';
            text_image1.innerHTML = 'ARM Texture (Ambient Occlusion, Roughness, Metallic)';
        default:
            console.log(`Sorry, ${merge_function}.is not an option.`);
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
    const img1Input = document.getElementById('image1');
    const img2Input = document.getElementById('image2');
    const img3Input = document.getElementById('image3');
    const img4Input = document.getElementById('image4');
    merge_function = merge_type.value;

    const img1 = new Image();
    const img2 = new Image();
    const img3 = new Image();
    const img4 = new Image();
    let loadCounter = 0;


    function onImageLoad() {
        let has_finished = false;
        loadCounter++;
        canvas.width = img1.width;
        canvas.height = img1.height;

        console.log(`loadCounter: ${loadCounter}`);

        let imgCombined = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img1, 0, 0);
        let imgData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img2, 0, 0);
        let imgData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img3, 0, 0);
        let imgData3 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img4, 0, 0);
        let imgData4 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        switch (merge_function) {
            case 'metallic_smooth':
                if (loadCounter >= 2) {
                    console.log(`metallic_smooth`);
                    merge_metallic_smooth(imgData1, imgData2, imgCombined);
                    has_finished = true;
                }
                break;
            case 'splat':
                if (loadCounter >= 1) {
                    merge_splat(imgData1, imgData2, imgData3, imgData4, imgCombined);
                    has_finished = true;
                }
                break;
            case 'splat_normal':
                if (loadCounter >= 2) {
                    merge_splat_normal(imgData1, imgData2, imgCombined);
                    has_finished = true;
                }
                break;
            case 'splat_metallic':
                if (loadCounter >= 2) {
                    merge_splat_metallic(imgData1, imgData2, imgData3, imgData4, imgCombined);
                    has_finished = true;
                }
                break;
            case 'arm_metallic_smooth':
                if (loadCounter >= 1) {
                    arm_to_metallic_smooth(imgData1, imgCombined);
                    has_finished = true;
                }
                break;
            case 'arm_metallic_smooth_combined':
                if (loadCounter >= 1) {
                    arm_to_metallic_smooth_combined(imgData1, imgData2, imgCombined);
                    has_finished = true;
                }
                break;
            case 'arm_ao':
                if (loadCounter >= 1) {
                    arm_to_ao(imgData1, imgCombined);
                    has_finished = true;
                }
                break;
            default:
                console.log(`Sorry, ${merge_function}.is not an option.`);
        }

        if (has_finished) {
            console.log(`has_finished: ${has_finished}`);
            ctx.putImageData(imgCombined, 0, 0);
        }
    }


    img1.onload = onImageLoad;
    img2.onload = onImageLoad;
    img3.onload = onImageLoad;
    img4.onload = onImageLoad;

    if (img1Input.files && img1Input.files[0]) {
      img1.src = URL.createObjectURL(img1Input.files[0]);
    }

    if (img2Input.files && img2Input.files[0]) {
        img2.src = URL.createObjectURL(img2Input.files[0]);
    }

    if (img3Input.files && img3Input.files[0]) {
    img3.src = URL.createObjectURL(img3Input.files[0]);
    }

    if (img4Input.files && img4Input.files[0]) {
    img4.src = URL.createObjectURL(img4Input.files[0]);
    }
}