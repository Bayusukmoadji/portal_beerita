// URL News API
const newsApiUrl =
  "https://newsapi.org/v2/top-headlines?category=technology&country=us&pageSize=8&apiKey=107f7e54df6e45fc926f98c205bdae6a";

// Variabel untuk menyimpan halaman yang sedang dimuat
let currentPage = 1;

// Fungsi untuk memuat artikel
function loadArticles(page) {
  const apiUrl = `${newsApiUrl}&page=${page}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const articles = data.articles;
      const carouselItems = document.getElementById("carouselItems");
      const cardGrid = document.getElementById("cardGrid");

      // Memuat artikel ke dalam carousel dan grid
      articles.forEach((article, index) => {
        const authorName = article.author ? article.author : "Tidak diketahui";
        const date = new Date(article.publishedAt).toLocaleDateString();

        // Carousel
        const carouselItem = document.createElement("a");
        carouselItem.href = article.url;
        carouselItem.innerHTML = `
          <div class="carousel-item ${
            index === 0 ? "active" : ""
          } h-100 position-relative">
            <img src="${
              article.urlToImage
            }" class="d-block w-100 h-100 object-fit-cover" alt="..." />
            <div class="card-img-overlay flex-column justify-content-end align-items-start p-3 gradient-overlay">
              <h5 class="text-white mb-3 fw-semibold">${article.title}</h5>
              <p class="text-white small m-0">Oleh: <strong>${authorName}</strong> | ${date}</p>
            </div>
          </div>
        `;
        carouselItems.appendChild(carouselItem);

        // Grid Card
        const card = document.createElement("a");
        card.href = article.url;
        card.innerHTML = `
          <div class="col">
            <div class="card h-100 bg-dark text-white rounded-4">
              <img src="${article.urlToImage}" class="card-img-top rounded-top-4" alt="..." />
              <div class="card-body p-2">
                <p class="card-text">${article.description}</p>
                <p class="text-white small mb-0" style="font-size: 0.7rem">
                  Oleh: <strong>${authorName}</strong> | ${date}
                </p>
              </div>
            </div>
          </div>
        `;
        cardGrid.appendChild(card);
      });

      // Menginisialisasi ulang carousel setelah menambahkan item baru
      const carouselElement = document.getElementById("heroCarousel");
      new bootstrap.Carousel(carouselElement);
    })
    .catch((error) => console.error("Error fetching News API data:", error));
}

// Memuat artikel pertama kali
loadArticles(currentPage);

// Tombol Load More
const loadMoreButton = document.getElementById("loadMoreButton");
loadMoreButton.addEventListener("click", () => {
  currentPage++;
  loadArticles(currentPage);
});
