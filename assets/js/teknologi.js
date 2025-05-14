// URL API TechCrunch
const techCrunchApiUrl =
  "https://techcrunch.com/wp-json/wp/v2/posts?per_page=8&_embed"; // Ambil 8 berita awal, Anda bisa sesuaikan jumlahnya

// Variabel global untuk menyimpan semua data post dari API
let allFetchedPosts = [];

// Dapatkan elemen DOM
const carouselItemsContainer = document.getElementById("carouselItems");
const cardGridContainer = document.getElementById("cardGrid");
const searchInput = document.getElementById("searchInputTeknologi"); // Pastikan ID ini ada di HTML Anda
const noResultsMessage = document.getElementById("noResultsMessageTeknologi"); // Pastikan ID ini ada di HTML Anda
const loadMoreButton = document.getElementById("loadMoreButton");

// Fungsi untuk membuat dan merender item berita
function renderNewsItems(postsToRender) {
  // Kosongkan kontainer sebelum menambahkan item baru
  if (carouselItemsContainer) carouselItemsContainer.innerHTML = "";
  if (cardGridContainer) cardGridContainer.innerHTML = "";

  let itemsInCarousel = 0;

  if (
    postsToRender.length === 0 &&
    searchInput &&
    searchInput.value.trim() !== ""
  ) {
    if (noResultsMessage) noResultsMessage.style.display = "block";
  } else {
    if (noResultsMessage) noResultsMessage.style.display = "none";
  }

  postsToRender.forEach((post, index) => {
    const imageUrl =
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "https://via.placeholder.com/500x300?text=No+Image";
    const title = post.title.rendered;
    const excerpt = post.excerpt.rendered;
    const link = post.link;
    const date = new Date(post.date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Carousel (ambil 3 pertama dari postsToRender)
    if (carouselItemsContainer && itemsInCarousel < 3) {
      const carouselItemAnchor = document.createElement("a");
      carouselItemAnchor.href = link;
      carouselItemAnchor.target = "_blank"; // Buka di tab baru

      const carouselItemDiv = document.createElement("div");
      carouselItemDiv.className = `carousel-item ${
        itemsInCarousel === 0 ? "active" : ""
      } h-100 position-relative`; // news-item dan news-title bisa ditambahkan di sini jika carousel juga mau dicari dengan cara yang sama

      carouselItemDiv.innerHTML = `
        <img src="${imageUrl}" class="d-block w-100 h-100 object-fit-cover" alt="${title}" loading="lazy"/>
        <div class="card-img-overlay flex-column justify-content-end align-items-start p-3 gradient-overlay">
          <h5 class="text-white mb-3 fw-semibold">${title}</h5>
          <p class="text-white small m-0">Oleh: <strong>TechCrunch</strong> | ${date}</p>
        </div>
      `;
      carouselItemAnchor.appendChild(carouselItemDiv);
      carouselItemsContainer.appendChild(carouselItemAnchor);
      itemsInCarousel++;
    }

    // Grid Cards
    if (cardGridContainer) {
      const cardColumn = document.createElement("div");
      // Setiap kartu akan menjadi satu kolom, ini yang akan di show/hide jika menggunakan logika filter DOM langsung
      // Namun karena kita re-render, elemen ini akan dibuat ulang sesuai hasil filter.
      cardColumn.className = "col"; // Bootstrap column class

      const cardAnchor = document.createElement("a");
      cardAnchor.href = link;
      cardAnchor.target = "_blank"; // Buka di tab baru
      // Beri class pada anchor jika ingin menargetkan anchor sebagai 'news-item'
      // atau lebih baik pada 'cardDiv' di bawahnya

      const cardDiv = document.createElement("div");
      cardDiv.className = "card h-100 bg-dark text-white rounded-4"; // news-item bisa ditambahkan di sini jika diperlukan

      cardDiv.innerHTML = `
        <img src="${imageUrl}" class="card-img-top rounded-top-4" alt="${title}" loading="lazy"/>
        <div class="card-body p-2 d-flex flex-column">
          <p class="card-text news-title">${title}</p> <p class="card-text-excerpt" style="font-size: 0.8rem; opacity: 0.8;">${
        excerpt.substring(0, 100) + "..."
      }</p>
          <p class="text-white small mt-auto mb-0" style="font-size: 0.7rem">Oleh: <strong>TechCrunch</strong> | ${date}</p>
        </div>
      `;
      cardAnchor.appendChild(cardDiv);
      cardColumn.appendChild(cardAnchor);
      cardGridContainer.appendChild(cardColumn);
    }
  });
}

// Fungsi untuk mengambil data awal
function fetchInitialNews() {
  fetch(techCrunchApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((posts) => {
      allFetchedPosts = posts; // Simpan data asli
      renderNewsItems(allFetchedPosts); // Render semua berita saat pertama kali load
    })
    .catch((error) => {
      console.error("Error fetching TechCrunch API data:", error);
      if (cardGridContainer)
        cardGridContainer.innerHTML = `<p class="text-danger text-center">Gagal memuat berita. Silakan coba lagi nanti.</p>`;
      if (carouselItemsContainer) carouselItemsContainer.innerHTML = ""; // Kosongkan carousel juga jika error
    });
}

// Event listener untuk input pencarian
if (searchInput) {
  searchInput.addEventListener("keyup", function (event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === "") {
      renderNewsItems(allFetchedPosts); // Jika searchbox kosong, tampilkan semua berita
    } else {
      const filteredPosts = allFetchedPosts.filter((post) => {
        const title = post.title.rendered.toLowerCase();
        return title.includes(searchTerm);
      });
      renderNewsItems(filteredPosts); // Render berita yang sudah difilter
    }
  });
}

// Panggil fungsi untuk mengambil berita saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Pastikan ID searchInputTeknologi dan noResultsMessageTeknologi ada di HTML teknologi.html Anda
  if (!document.getElementById("searchInputTeknologi")) {
    console.warn("Element dengan ID 'searchInputTeknologi' tidak ditemukan.");
  }
  if (!document.getElementById("noResultsMessageTeknologi")) {
    console.warn(
      "Element dengan ID 'noResultsMessageTeknologi' tidak ditemukan."
    );
  }
  fetchInitialNews();
});

// Logika untuk Tombol Load More (Perlu pengembangan lebih lanjut dengan pagination API)
if (loadMoreButton) {
  let currentPage = 1; // Halaman saat ini
  const postsPerPage = 8; // Sesuaikan dengan per_page di URL API awal

  loadMoreButton.addEventListener("click", function () {
    currentPage++;
    const nextPageApiUrl = `https://techcrunch.com/wp-json/wp/v2/posts?per_page=${postsPerPage}&page=${currentPage}&_embed`;

    loadMoreButton.disabled = true; // Cegah klik ganda
    loadMoreButton.textContent = "Memuat...";

    fetch(nextPageApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((newPosts) => {
        if (newPosts.length > 0) {
          allFetchedPosts = allFetchedPosts.concat(newPosts); // Tambahkan berita baru ke yang sudah ada
          // Jika sedang ada filter aktif, filter ulang termasuk data baru
          const currentSearchTerm = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";
          if (currentSearchTerm !== "") {
            const newlyFilteredPosts = allFetchedPosts.filter((post) =>
              post.title.rendered.toLowerCase().includes(currentSearchTerm)
            );
            renderNewsItems(newlyFilteredPosts);
          } else {
            renderNewsItems(allFetchedPosts); // Render semua berita (termasuk yang baru)
          }
        } else {
          loadMoreButton.textContent = "Tidak ada berita lagi";
          // Tidak perlu men-disable secara permanen, mungkin ada berita baru nanti
          // Tapi untuk sesi ini, tidak ada lagi.
        }
      })
      .catch((error) => {
        console.error("Error fetching more posts:", error);
        loadMoreButton.textContent = "Gagal memuat";
      })
      .finally(() => {
        if (
          loadMoreButton.textContent !== "Tidak ada berita lagi" &&
          loadMoreButton.textContent !== "Gagal memuat"
        ) {
          loadMoreButton.disabled = false;
          loadMoreButton.textContent = "Load More";
        }
      });
  });
}
