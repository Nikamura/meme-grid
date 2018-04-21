window.onload = () => {
  const styleButton = document.getElementById('style-switch');
  const preferList = 'true' === localStorage.getItem('prefer-list');
  const grid = document.getElementById('grid');

  if (preferList) {
    styleButton.innerText = 'I don\'t like lists';
  } else {
    styleButton.innerText = 'I don\'t like grids';
  }

  styleButton.addEventListener('click', () => {
    localStorage.setItem('prefer-list', (!preferList).toString());
    window.location.reload();
  });

  const memeClass = preferList
    ? 'list-meme'
    : 'meme';

  const mapImages = images => {
    return images.map(image => {
      const {title, url} = image;

      const a = document.createElement('a');
      a.target = '_blank';
      a.href = url;

      const img = document.createElement('img');
      img.classList.add(memeClass);
      img.title = title;
      img.src = url;

      a.appendChild(img);

      return a;
    });
  };

  const showImages = images => {
    const masonry = preferList ? null : new Masonry(grid, {
      percentPosition: true,
      itemSelector: `.${memeClass}`,
      columnWidth: '.meme-sizer'
    });

    imagesLoaded(images).on('progress', (instance, image) => {
      const imageWrapper = image.img.parentElement;
      grid.appendChild(imageWrapper);

      if (masonry) {
        masonry.appended(imageWrapper);
        masonry.layout();
      }
    });
  };

  fetch('/api/memes')
    .then(response => response.json())
    .then(mapImages)
    .then(showImages)
    .catch(() => {
      grid.innerText = 'Memes could not be fetched :(';
    });
};
