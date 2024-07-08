// Get the elements
const generateButton = document.getElementById('generate-button');
const styleSelect = document.getElementById('style-select');
const mapContainer = document.getElementById('map-container');

// Add event listener to the generate button
generateButton.addEventListener('click', () => {
  const cityStyle = styleSelect.value;
  fetch(`/generate-map?style=${cityStyle}`)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const image = document.createElement('img');
      image.src = url;
      mapContainer.appendChild(image);
    })
    .catch(error => console.error(error));
});
