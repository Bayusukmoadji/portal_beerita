document.addEventListener("DOMContentLoaded", () => {
  const carouselItems = document.getElementById("carouselItems");
  const cardGrid = document.getElementById("cardGrid");
  const loadMoreButton = document.getElementById("loadMoreButton");
  const noResultsMessageSport = document.getElementById(
    "noResultsMessageTeknologi"
  ); // Perhatikan: ID HTML tetap sama, tapi kita gunakan untuk pesan olahraga

  const apiKey = "107f7e54df6e45fc926f98c205bdae6a"; // Ganti dengan API Key NewsAPI Anda
  const apiUrl =
    "https://newsapi.org/v2/top-headlines?country=id&category=sport&pageSize=5&apiKey=" +
    apiKey; // Mengambil 5 berita utama olahraga dari Indonesia
  let currentPage = 1;
  const pageSizeGrid = 8; // Jumlah card yang ditampilkan per halaman grid
  let totalResultsGrid = 0;
  let allGridArticles = [];

  // Fungsi untuk memformat tanggal menjadi "x waktu yang lalu"
  function timeAgo(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " tahun yang lalu";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " bulan yang lalu";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " hari yang lalu";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " jam yang lalu";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " menit yang lalu";
    }
    return Math.floor(seconds) + " detik yang lalu";
  }

  // Fungsi untuk membuat elemen carousel item
  function createCarouselItem(article, isActive) {
    const item = document.createElement("div");
    item.classList.add("carousel-item", "h-100");
    if (isActive) {
      item.classList.add("active");
    }

    const link = document.createElement("a");
    link.href = article.url;
    link.target = "_blank";
    link.classList.add("h-100", "d-block");

    const img = document.createElement("img");
    img.src =
      article.urlToImage || "https://via.placeholder.com/900x500?text=No+Image"; // Placeholder jika tidak ada gambar
    img.classList.add("d-block", "w-100", "h-100", "object-fit-cover");
    img.alt = article.title;

    const overlay = document.createElement("div");
    overlay.classList.add(
      "card-img-overlay",
      "d-flex",
      "flex-column",
      "justify-content-end",
      "gradient-overlay",
      "p-3"
    );

    const title = document.createElement("h5");
    title.classList.add("card-title", "mb-1");
    title.textContent = article.title;

    const source = document.createElement("small");
    source.classList.add("text-light");
    source.textContent =
      article.source.name + " - " + timeAgo(article.publishedAt);

    overlay.appendChild(title);
    overlay.appendChild(source);
    link.appendChild(img);
    link.appendChild(overlay);
    item.appendChild(link);

    return item;
  }

  // Fungsi untuk mengambil dan menampilkan berita carousel
  async function fetchCarouselNews() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.status === "ok" && data.articles.length > 0) {
        data.articles.forEach((article, index) => {
          carouselItems.appendChild(createCarouselItem(article, index === 0));
        });
      } else {
        carouselItems.innerHTML =
          '<div class="carousel-item active h-100"><div class="d-flex justify-content-center align-items-center h-100"><p class="text-white">Gagal memuat berita utama olahraga.</p></div></div>';
      }
    } catch (error) {
      console.error("Error fetching carousel news:", error);
      carouselItems.innerHTML =
        '<div class="carousel-item active h-100"><div class="d-flex justify-content-center align-items-center h-100"><p class="text-white">Terjadi kesalahan saat memuat berita utama olahraga.</p></div></div>';
    }
  }

  // Fungsi untuk membuat elemen card berita grid
  function createGridCard(article) {
    const col = document.createElement("div");
    col.classList.add("col");

    const card = document.createElement("div");
    card.classList.add("card", "bg-dark", "shadow-sm");

    const link = document.createElement("a");
    link.href = article.url;
    link.target = "_blank";

    const img = document.createElement("img");
    img.src =
      article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image"; // Placeholder jika tidak ada gambar
    img.classList.add("card-img-top");
    img.alt = article.title;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const title = document.createElement("h6");
    title.classList.add("news-title", "card-title", "mb-2");
    title.textContent = article.title;

    const excerpt = document.createElement("p");
    excerpt.classList.add("card-text", "card-text-excerpt", "mb-auto");
    excerpt.textContent = article.description || "Tidak ada deskripsi.";

    const publishedAt = document.createElement("small");
    publishedAt.classList.add("text-muted", "time-ago");
    publishedAt.textContent = timeAgo(article.publishedAt);

    cardBody.appendChild(title);
    cardBody.appendChild(excerpt);
    cardBody.appendChild(publishedAt);
    link.appendChild(img);
    link.appendChild(cardBody);
    card.appendChild(link);
    col.appendChild(card);

    return col;
  }

  // Fungsi untuk mengambil dan menampilkan berita grid
  async function fetchGridNews(page) {
    try {
      const gridApiUrl = `https://newsapi.org/v2/everything?q=sport&language=id&sortBy=publishedAt&pageSize=${pageSizeGrid}&page=${page}&apiKey=${apiKey}`;
      const response = await fetch(gridApiUrl);
      const data = await response.json();

      if (data.status === "ok" && data.articles.length > 0) {
        totalResultsGrid = data.totalResults;
        allGridArticles = allGridArticles.concat(data.articles);
        displayGridArticles(allGridArticles.slice(0, page * pageSizeGrid));

        if (page * pageSizeGrid >= totalResultsGrid) {
          loadMoreButton.disabled = true;
          loadMoreButton.textContent = "No More News";
        } else {
          loadMoreButton.disabled = false;
          loadMoreButton.textContent = "Load More";
        }
        noResultsMessageSport.style.display = "none";
      } else {
        if (cardGrid.children.length === 0) {
          noResultsMessageSport.textContent =
            '"Tidak ada berita olahraga yang sesuai."';
          noResultsMessageSport.style.display = "block";
        }
        loadMoreButton.style.display = "none";
      }
    } catch (error) {
      console.error("Error fetching grid news:", error);
      const errorMessage = document.createElement("div");
      errorMessage.classList.add("col-12", "text-center", "text-danger", "p-3");
      errorMessage.textContent = "Gagal memuat berita olahraga.";
      cardGrid.appendChild(errorMessage);
      loadMoreButton.style.display = "none";
    }
  }

  // Fungsi untuk menampilkan artikel grid
  function displayGridArticles(articles) {
    cardGrid.innerHTML = ""; // Bersihkan grid sebelum menambahkan artikel baru
    articles.forEach((article) => {
      cardGrid.appendChild(createGridCard(article));
    });
  }

  // Event listener untuk tombol "Load More"
  loadMoreButton.addEventListener("click", () => {
    currentPage++;
    fetchGridNews(currentPage);
  });

  // Initial fetch
  fetchCarouselNews();
  fetchGridNews(currentPage);
});
