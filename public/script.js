let img = null; // Store the uploaded image
let croppedImages = []; // Array to store the cropped image blobs

// Show or hide the download button based on cropped images
function toggleDownloadButton() {
  const downloadButton = document.querySelector(".button-5");

  // If there are cropped images, show the button, otherwise hide it
  downloadButton.style.visibility = "visible"
}

// Function to load the image
function loadImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    img = new Image();
    img.onload = function () {
      cropImage(); // Crop the image after it is loaded
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

// Function to crop the image into squares of the given size
function cropImage() {
  if (!img) return;

  const instagramHeight = 1350
  const instagramWidth = 1080

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const cols = Math.ceil(img.width / instagramWidth);

  croppedImages = []; // Reset the cropped images

  // Clear the images container
  const imagesContainer = document.getElementById("imagesContainer");
  imagesContainer.innerHTML = "";

  // Crop the image into squares
  for (let col = 0; col < cols; col++) {
    const x = col * instagramWidth;
    const y = 0;

    // Set the canvas size to the crop size
    canvas.width = instagramWidth;
    canvas.height = instagramHeight;

    // Draw the square from the image onto the canvas
    ctx.clearRect(0, 0, instagramWidth, instagramHeight); // Clear the canvas
    ctx.drawImage(img, x, y, instagramWidth, instagramHeight, 0, 0, instagramWidth, instagramHeight);

    // Convert canvas content to Blob and store it
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const imgElement = document.createElement("img");
      imgElement.src = url;
      imgElement.classList.add("cropped-image");

      // Add image to the container
      imagesContainer.appendChild(imgElement);

      // Store the blob in the array
      croppedImages.push(blob);
    }, "image/jpeg");

  }
  toggleDownloadButton();
}

// Function to download all the cropped images
function downloadImages() {
  if (croppedImages.length === 0) {
    alert("No images to download!");
    return;
  }

  const zip = new JSZip();
  const zipFileName = "cropped_images.zip";

  croppedImages.forEach((blob, index) => {
    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(blob);
    // link.download = `cropped_image_${index + 1}.jpg`;
    // link.click();
    const filename = `image_${index + 1}.jpg`;
    zip.file(filename, blob);
  });

  zip.generateAsync({ type: "blob" }).then(function (content) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = zipFileName;
    link.click();
  });
}
