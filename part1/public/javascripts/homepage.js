<script>
    const pictureContainer = document.querySelector('.picture-container');
    const dogOfTheDay = document.querySelector('.dog-of-the-day');

    fetch('https://dog.ceo/api/breeds/image/random')
        .then(response => response.json())
</script>