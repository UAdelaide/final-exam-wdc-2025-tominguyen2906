const pictureContainer = document.querySelector('.picture-container');
fetch('https://dog.ceo/api/breeds/image/random')
    .then(response => response.json())
    .then(data => {
        const img = document.createElement('img');
        img.src = data.message;
        pictureContainer.appendChild(img);
    })
    .catch(error => console.error('Error:', error));
