// Comentario X
let books = [];
const booksPerPage = 12;
let currentPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get("category") || "All";

fetch('books.json')
  .then(res => res.json())
  .then(data => {
    books = data;
    books.sort((a, b) => new Date(b["publish date"]) - new Date(a["publish date"]));
    let filteredBooks = books;
    if (selectedCategory !== 'All') {
      filteredBooks = books.filter(book =>
      book.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    const welcomeSection = document.querySelector('.welcome');
    if (welcomeSection) {
      welcomeSection.style.display = selectedCategory === 'All' ? 'block' : 'none';
    }
    displayBooks(filteredBooks, currentPage);
    setupPagination(filteredBooks);
  });

function displayBooks(bookList, page) {
  const container = document.getElementById('book-container');
  document.querySelector('.book-grid')?.remove();

  const start = (page - 1) * booksPerPage;
  const end = start + booksPerPage;
  const paginatedBooks = bookList.slice(start, end);

  const bookGrid = document.createElement('div');
  bookGrid.classList.add('book-grid');

  paginatedBooks.forEach(book => {
    const card = document.createElement('div');
    card.classList.add('book');

    card.innerHTML = `
  <h2>${book.title}</h2>
  <img src="src/frontpages/${book.frontpage}" alt="${book.title} style" class="book-image">
  <p><strong>Publisher:</strong> ${book.publisher}</p>
  <p><strong>Release Date:</strong> ${new Date(book["release date"]).toLocaleDateString()}</p>
  <p><strong>Author:</strong> ${book.author}</p>
  <p><strong>Category:</strong> ${book.category}</p>
  <p><strong>Pages:</strong> ${book["pages number"]}</p>
  <p class="DescriptionJustified">${book.description}</p>

  <div class="book-footer">
    <a href="${book["download link"] !== "PENDING" ? book["download link"] : "#"}" target="_blank"> ${book["download link"] !== "PENDING" ? 
      "Download PDF" : "Coming Soon"} 
    </a>
    <p class="PubDateBy">
      <span><strong>Publish Date:</strong> ${new Date(book["publish date"]).toLocaleDateString()}</span>
      <span><strong>Shared by:</strong> ${book["shared by"]}</span>
    </p>
  </div>
`;

    bookGrid.appendChild(card);
  });

  container.appendChild(bookGrid);
}

function setupPagination(bookList) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = "";

  const totalPages = Math.ceil(bookList.length / booksPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.add('page-btn');
    if (i === currentPage) btn.classList.add('active');

    btn.addEventListener('click', () => {
      currentPage = i;
      displayBooks(bookList, currentPage);
      setupPagination(bookList);
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // Actualiza la URL con ?page=n sin recargar
      const url = new URL(window.location);
      url.searchParams.set('page', currentPage);
      window.history.pushState({}, '', url);

      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    pagination.appendChild(btn);
  }
}

/*Función de la barra de busqueda*/
function search(event) {
  event.preventDefault(); /*Línea de código encargada de realizar la busqueda con ENTER*/
  const input = document.getElementById('searchInput').value.toLowerCase();
  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(input) ||
    book.author.toLowerCase().includes(input) ||
    book.category.toLowerCase().includes(input) ||
    book.publisher.toLowerCase().includes(input)
  );
  currentPage = 1;

  // Eliminar banner si realizas una búsqueda
  const banner = document.querySelector('.category-banner');
  if (banner) banner.style.display = 'none';

  // Mostrar banner de búsqueda SIEMPRE
  const searchBannerContainer = document.querySelector('.search-banner');
  if (searchBannerContainer) searchBannerContainer.style.display = 'block';

  // Limpiar contenedor antes de mostrar resultados o mensaje
  const container = document.getElementById('book-container');
  container.innerHTML = '';


  if (filtered.length === 0) {
    // Si no hay coincidencias, mostrar mensaje
    const message = document.createElement('p');
    message.textContent = '❌ No search coincidences found ❌';
    message.style.color = 'white';
    message.style.padding = '20px';
    message.style.textAlign = 'center';
    message.style.fontSize = '56px';
    message.style.fontWeight = 'bold';
    container.appendChild(message);

    const message2 = document.createElement('p2');
    message2.textContent = 'You might try search with another keyword.';
    message2.style.color = 'white';
    message2.style.padding = '5px';
    message2.style.textAlign = 'center';
    message2.style.fontSize = '24px';
    message2.style.fontStyle = 'italic';
    container.appendChild(message2);

    // Ocultar la paginación si no hay resultados
    document.getElementById('pagination').innerHTML = '';
  } else {
    displayBooks(filtered, currentPage);
    setupPagination(filtered);
  }
  document.getElementById('searchInput').value = ''; // Limpiar el campo de búsqueda
}


// Cambiar imagen de subtitulo según la categoría seleccionada o al buscar en SearchBar
const categoryImages = {
  "All": "src/tabs titles/HOMEPAGE.webp",
  "Programming": "src/tabs titles/PROGRAMMING.webp",
  "Cybersecurity": "src/tabs titles/CYBERSECURITY.webp",
  "Databases": "src/tabs titles/DATABASES.webp",
  "OS": "src/tabs titles/OS.webp",
  "Hacking": "src/tabs titles/HACKING.webp",
  "AI": "src/tabs titles/AI.webp"
};

function updateCategoryImage(category) {
  const BannerSubtle = document.getElementById('categoryImage');
  BannerSubtle.src = categoryImages[category] || categoryImages["All"];
}

function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "All";
}

document.addEventListener("DOMContentLoaded", () => {
updateCategoryImage(getCategoryFromURL());
});

/*image attachment*/
document.getElementById("image").addEventListener("change", function() {
  const fileLabel = document.querySelector(".file-label");
  const fileText = document.getElementById("fileText");

  if (this.files.length > 0) {
    fileText.textContent = this.files[0].name;
    fileLabel.classList.add("uploaded");
  } else {
    fileText.textContent = "Attach screenshot (optional)";
    fileLabel.classList.remove("uploaded");
  }
});
