document.addEventListener("DOMContentLoaded", () => {
  const loadMoreButton = document.getElementById("loadMoreButton");

  // NewsAPI URL untuk artikel teknologi
  const newsApiUrl =
    "https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=25&apiKey=107f7e54df6e45fc926f98c205bdae6a";

  // TechCrunch API untuk artikel dari TechCrunch langsung
  const techCrunchApiUrl =
    "https://newsapi.org/v2/everything?sources=techcrunch&language=en&pageSize=25&apiKey=107f7e54df6e45fc926f98c205bdae6a";

  let currentPage = 1;
  const carouselCount = 3; // Jumlah artikel di carousel
  const articlesPerLoad = 8; // Jumlah artikel per klik "Load More"
  let combinedArticles = []; // Array untuk menyimpan artikel yang digabungkan
  const carouselItems = document.getElementById("carouselItems");
  const cardGrid = document.getElementById("cardGrid");
  const carouselElement = document.getElementById("heroCarousel");
  const carousel = new bootstrap.Carousel(carouselElement);

  // Fungsi untuk menggabungkan artikel dari dua API
  function loadArticles(page) {
    const apiUrls = [
      `${newsApiUrl}&page=${page}`,
      `${techCrunchApiUrl}&page=${page}`,
    ];

    // Reset artikel grid ketika pertama kali load
    if (page === 1) {
      combinedArticles = [];
      carouselItems.innerHTML = ""; // Hapus carousel lama
      cardGrid.innerHTML = ""; // Hapus grid lama
    }

    // Ambil artikel dari kedua URL API
    Promise.all(
      apiUrls.map((apiUrl) =>
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            combinedArticles = [...combinedArticles, ...data.articles]; // Gabungkan hasil dari kedua API
          })
          .catch((error) => console.error("Error fetching data:", error))
      )
    ).then(() => {
      // Tampilkan artikel pertama di carousel (3 artikel pertama dari page 1)
      if (page === 1) {
        combinedArticles.slice(0, carouselCount).forEach((article, index) => {
          const authorName = article.author || "Tidak diketahui";
          const date = new Date(article.publishedAt).toLocaleDateString();

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
        });
      }

      // Tampilkan artikel lainnya di grid (mulai dari artikel ke-4 dan seterusnya)
      const gridArticles = combinedArticles.slice(
        carouselCount + (page - 1) * articlesPerLoad,
        carouselCount + page * articlesPerLoad
      );

      gridArticles.forEach((article) => {
        const authorName = article.author || "Tidak diketahui";
        const date = new Date(article.publishedAt).toLocaleDateString();

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

      // Periksa jika ada artikel berikutnya
      if (combinedArticles.length > carouselCount + page * articlesPerLoad) {
        loadMoreButton.style.display = "block"; // Tampilkan tombol "Load More"
      } else {
        loadMoreButton.style.display = "none"; // Sembunyikan tombol "Load More" jika tidak ada artikel lagi
      }

      // Inisialisasi ulang carousel
      new bootstrap.Carousel(carouselElement);
    });
  }

  // Load artikel pertama kali (11 artikel: 3 di carousel dan 8 di grid)
  loadArticles(currentPage);

  // Klik tombol "Load More" untuk memuat artikel berikutnya
  loadMoreButton.addEventListener("click", () => {
    currentPage++; // Update halaman
    loadArticles(currentPage); // Load artikel pada halaman berikutnya
  });
});
