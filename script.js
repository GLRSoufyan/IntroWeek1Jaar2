const pages = document.querySelectorAll('.page');
let currentPage = 0;

const updatePages = () => {
  pages.forEach((page, index) => {
    if (index < currentPage) {
      page.style.transform = 'rotateY(-180deg)';
    } else if (index === currentPage) {
      page.style.transform = 'rotateY(0deg)';
    } else {
      page.style.transform = 'rotateY(180deg)';
    }
  });
};

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentPage < pages.length - 1) {
    currentPage++;
    updatePages();
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    updatePages();
  }
});

updatePages();