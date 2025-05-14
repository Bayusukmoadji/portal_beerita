document.addEventListener("DOMContentLoaded", () => {
  const loadMoreButton = document.getElementById("loadMoreButton");

  const newsApiUrl =
    "https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=25&apiKey=107f7e54df6e45fc926f98c205bdae6a";

  const techCrunchApiUrl =
    "https://techcrunch.com/wp-json/wp/v2/posts?per_page=5";

  let currentPage = 1;
  const carouselCount = 3;
  const articlesPerLoad = 8;
  let combinedArticles = [];
  let articleUrlsSet = new Set(); // Untuk mendeteksi duplikat

  const carouselItems = document.getElementById("carouselItems");
  const cardGrid = document.getElementById("cardGrid");
  const carouselElement = document.getElementById("heroCarousel");
  const carousel = new bootstrap.Carousel(carouselElement);

  function loadArticles(page) {
    const apiUrls = [
      `${newsApiUrl}&page=${page}`,
      `${techCrunchApiUrl}&page=${page}`,
    ];

    if (page === 1) {
      combinedArticles = [];
      articleUrlsSet.clear();
      carouselItems.innerHTML = "";
      cardGrid.innerHTML = "";
    }

    Promise.all(
      apiUrls.map((apiUrl) =>
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            const filtered = data.articles.filter((article) => {
              const isValid =
                article &&
                article.title &&
                article.url &&
                article.publishedAt &&
                !articleUrlsSet.has(article.url); // Cek duplikat berdasarkan URL

              if (isValid) {
                articleUrlsSet.add(article.url); // Tandai sebagai sudah ditambahkan
              }

              return isValid;
            });

            combinedArticles = [...combinedArticles, ...filtered];
          })
          .catch((error) => console.error("Error fetching data:", error))
      )
    ).then(() => {
      // Tampilkan 3 artikel pertama di carousel
      if (page === 1) {
        combinedArticles.slice(0, carouselCount).forEach((article, index) => {
          const authorName = article.author || "Tidak diketahui";
          const date = new Date(article.publishedAt).toLocaleDateString();
          const imageUrl = article.urlToImage || "default-image.jpg";
          const title = article.title || "Judul tidak tersedia";

          const carouselItem = document.createElement("a");
          carouselItem.href = article.url;
          carouselItem.innerHTML = `
            <div class="carousel-item ${
              index === 0 ? "active" : ""
            } h-100 position-relative">
              <img src="${imageUrl}" class="d-block w-100 h-100 object-fit-cover" alt="..." />
              <div class="card-img-overlay flex-column justify-content-end align-items-start p-3 gradient-overlay">
                <h5 class="text-white mb-3 fw-semibold">${title}</h5>
                <p class="text-white small m-0">Author: <strong>${authorName}</strong> | ${date}</p>
              </div>
            </div>
          `;
          carouselItems.appendChild(carouselItem);
        });
      }

      // Tampilkan artikel di grid
      const gridArticles = combinedArticles.slice(
        carouselCount + (page - 1) * articlesPerLoad,
        carouselCount + page * articlesPerLoad
      );

      gridArticles.forEach((article) => {
        const authorName = article.author || "Tidak diketahui";
        const date = new Date(article.publishedAt).toLocaleDateString();
        const imageUrl = article.urlToImage || "default-image.jpg";
        const title = article.title || "Judul tidak tersedia";
        const description = article.description || "Deskripsi tidak tersedia";

        const card = document.createElement("a");
        card.href = article.url;
        card.innerHTML = `
          <div class="col">
            <div class="card h-100 bg-dark text-white rounded-4">
              <img src="${imageUrl}" class="card-img-top rounded-top-4" alt="..." />
              <div class="card-body p-2">
                <p class="card-text">${description}</p>
                <p class="text-white small mb-0" style="font-size: 0.7rem">
                  Author: <strong>${authorName}</strong> | ${date}
                </p>
              </div>
            </div>
          </div>
        `;
        cardGrid.appendChild(card);
      });

      // Tampilkan atau sembunyikan tombol Load More
      if (combinedArticles.length > carouselCount + page * articlesPerLoad) {
        loadMoreButton.style.display = "block";
      } else {
        loadMoreButton.style.display = "none";
      }

      new bootstrap.Carousel(carouselElement);
    });
  }

  loadArticles(currentPage);

  loadMoreButton.addEventListener("click", () => {
    currentPage++;
    loadArticles(currentPage);
  });
});
