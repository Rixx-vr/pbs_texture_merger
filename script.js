
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

let merge_function = 'metallic_smooth';

function init_merger() {
    console.log(`init_merger`);
    merge_function = merge_type.value;
    merge_type.addEventListener('change', change_merge_type);

    change_merge_type(null);
}

function change_merge_type(e) {
    const aux_images = document.getElementById('drop-area-2-3');
    const merge_type = document.getElementById('merge_type');
    const text_image1 = document.getElementById('text-image1');
    const text_image2 = document.getElementById('text-image2');
    const text_image3 = document.getElementById('text-image3');
    const text_image4 = document.getElementById('text-image4');

    console.log(`change_merge_type`);
    merge_function = merge_type.value;

    switch (merge_function) {
        case 'metallic_smooth':
            text_image1.innerHTML = 'Metallic texture';
            text_image2.innerHTML = 'Roughness texture';
            aux_images.style.display = 'none';
            break;
        case 'splat_normal':
            aux_images.style.display = 'none';
            text_image1.innerHTML = 'Normal texture 1';
            text_image2.innerHTML = 'Normal texture 2';
            break;
        case 'splat_metallic':
            aux_images.style.display = '';
            text_image1.innerHTML = 'Metallic texture 1';
            text_image2.innerHTML = 'Roughness texture 1';
            text_image3.innerHTML = 'Metallic texture 2';
            text_image4.innerHTML = 'Roughness texture 2';
            break;
        case 'splat':
            aux_images.style.display = '';
            text_image1.innerHTML = 'Texture 1 (Albedo, Emisive, Height)';
            text_image2.innerHTML = 'Texture 2 (Albedo, Emisive, Height)';
            text_image3.innerHTML = 'Texture 3 (Albedo, Emisive, Height)';
            text_image4.innerHTML = 'Texture 4 (Albedo, Emisive, Height)';
            break;
        default:
            console.log(`Sorry, ${merge_function}.is not an option.`);
    }

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
  
    // Set up a function to run when the images are loaded
    function onImageLoad() {
      loadCounter++;
      if (loadCounter >= 2) { // Make sure both images are loaded

        // scale the canvas to the size of the images
        canvas.width = img1.width;
        canvas.height = img1.height;

        let imgCombined = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Draw the first image
        ctx.drawImage(img1, 0, 0);
        let imgData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  
        // Draw the second image
        ctx.drawImage(img2, 0, 0);
        let imgData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        ctx.drawImage(img3, 0, 0);
        let imgData3 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Draw the second image
        ctx.drawImage(img4, 0, 0);
        let imgData4 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        switch (merge_function) {
            case 'metallic_smooth':
                merge_metallic_smooth(imgData1, imgData2, imgCombined);
                break;
            case 'splat':
                merge_splat(imgData1, imgData2, imgData3, imgData4, imgCombined);
                break;
            case 'splat_normal':
                merge_splat_normal(imgData1, imgData2, imgCombined);
                break;   
            case 'splat_metallic':
                merge_splat_metallic(imgData1, imgData2, imgData3, imgData4, imgCombined);
                break;
            default:
                console.log(`Sorry, ${merge_function}.is not an option.`);
        }
  
        ctx.putImageData(imgCombined, 0, 0);
      }
    }
  
    // Set the src to start loading the images
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