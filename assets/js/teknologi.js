// ------------------------ URL API TechCrunch ------------------------
const techCrunchApiUrl =
  "https://techcrunch.com/wp-json/wp/v2/posts?per_page=11&_embed";

// ------------------------ Variabel Global ------------------------
let allFetchedPosts = [];
let displayedPostIds = new Set();

// ------------------------ Dapatkan Elemen DOM ------------------------
const carouselItemsContainer = document.getElementById("carouselItems");
const cardGridContainer = document.getElementById("cardGrid");
const searchInput = document.getElementById("searchInputTeknologi");
const noResultsMessage = document.getElementById("noResultsMessageTeknologi");
const loadMoreButton = document.getElementById("loadMoreButton");

// ------------------------ Fungsi untuk Format Waktu Relatif ------------------------
function formatTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const secondsPast = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (secondsPast < 60) {
    return "Baru saja";
  }
  const minutesPast = Math.floor(secondsPast / 60);
  if (minutesPast < 60) {
    return `sekitar ${minutesPast} menit yang lalu`;
  }
  const hoursPast = Math.floor(minutesPast / 60);
  if (hoursPast < 24) {
    return `sekitar ${hoursPast} jam yang lalu`;
  }
  const daysPast = Math.floor(hoursPast / 24);
  if (daysPast === 1) {
    return "Kemarin";
  }
  if (daysPast < 7) {
    return `sekitar ${daysPast} hari yang lalu`;
  }
  return past.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ------------------------ Fungsi untuk Merender Berita ------------------------
function renderNewsItems(postsToRender) {
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

  postsToRender.slice(0, 3).forEach((post) => {
    const imageUrl =
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "https://via.placeholder.com/500x300?text=No+Image";
    const title = post.title.rendered;
    const link = post.link;

    let authorName = "TechCrunch"; // Default fallback
    if (post._embedded?.author?.[0]?.name) {
      // Cek jika 'name' ada dan valid
      authorName = post._embedded.author[0].name;
    } else if (post._embedded?.author?.[0]?.code === "rest_no_route") {
      console.warn(
        `Author details not found for post ID ${post.id} (API error: rest_no_route). Using fallback: ${authorName}.`
      );
      // Tetap menggunakan fallback "TechCrunch" atau bisa diubah misal "Unknown Author"
    } else if (post._embedded?.author) {
      // Kondisi lain jika _embedded.author ada tapi tidak sesuai format yang diharapkan
      console.warn(
        `Author data for post ID ${post.id} is not in expected format. Using fallback: ${authorName}.`,
        post._embedded.author
      );
    }

    const timeAgo = formatTimeAgo(post.date);

    if (carouselItemsContainer && itemsInCarousel < 3) {
      const carouselItemAnchor = document.createElement("a");
      carouselItemAnchor.href = link;
      carouselItemAnchor.target = "_blank";

      const carouselItemDiv = document.createElement("div");
      carouselItemDiv.className = `carousel-item ${
        itemsInCarousel === 0 ? "active" : ""
      } h-100 position-relative`;

      carouselItemDiv.innerHTML = `
        <img src="${imageUrl}" class="d-block w-100 h-100 object-fit-cover" alt="${title}" loading="lazy"/>
        <div class="card-img-overlay flex-column justify-content-end align-items-start p-3 gradient-overlay">
          <h5 class="text-white mb-3 fw-semibold">${title}</h5>
          <p class="text-white small m-0">Author: <strong>${authorName}</strong> | ${timeAgo}</p>
        </div>
      `;
      carouselItemAnchor.appendChild(carouselItemDiv);
      carouselItemsContainer.appendChild(carouselItemAnchor);
      itemsInCarousel++;
    }
  });

  postsToRender.slice(3).forEach((post) => {
    const imageUrl =
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "https://via.placeholder.com/500x300?text=No+Image";
    const title = post.title.rendered;
    const excerpt = post.excerpt.rendered;
    const link = post.link;

    let authorName = "TechCrunch"; // Default fallback
    if (post._embedded?.author?.[0]?.name) {
      // Cek jika 'name' ada dan valid
      authorName = post._embedded.author[0].name;
    } else if (post._embedded?.author?.[0]?.code === "rest_no_route") {
      console.warn(
        `Author details not found for post ID ${post.id} (API error: rest_no_route). Using fallback: ${authorName}.`
      );
    } else if (post._embedded?.author) {
      console.warn(
        `Author data for post ID ${post.id} is not in expected format. Using fallback: ${authorName}.`,
        post._embedded.author
      );
    }

    const timeAgo = formatTimeAgo(post.date);

    if (cardGridContainer) {
      const cardColumn = document.createElement("div");
      cardColumn.className = "col";

      const cardAnchor = document.createElement("a");
      cardAnchor.href = link;
      cardAnchor.target = "_blank";

      const cardDiv = document.createElement("div");
      cardDiv.className = "card h-100 bg-dark text-white rounded-4";

      cardDiv.innerHTML = `
        <img src="${imageUrl}" class="card-img-top rounded-top-4" alt="${title}" loading="lazy"/>
        <div class="card-body p-2 d-flex flex-column">
          <p class="card-text news-title" style="font-weight: bold;">${title}</p>
          <p class="card-text-excerpt" style="font-size: 0.8rem; opacity: 0.8;">${
            excerpt.substring(0, 100) + "..."
          }</p>
          <p class="text-white small mt-auto mb-0" style="font-size: 0.7rem">Author: <strong>${authorName}</strong> | ${timeAgo}</p>
        </div>
      `;
      cardAnchor.appendChild(cardDiv);
      cardColumn.appendChild(cardAnchor);
      cardGridContainer.appendChild(cardColumn);
    }
  });
}

// ------------------------ Fungsi untuk Mengambil Data Awal ------------------------
function fetchInitialNews() {
  fetch(techCrunchApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((posts) => {
      const uniquePosts = posts.filter((post) => {
        if (!displayedPostIds.has(post.id)) {
          displayedPostIds.add(post.id);
          return true;
        }
        return false;
      });
      allFetchedPosts = uniquePosts;
      renderNewsItems(allFetchedPosts);
    })
    .catch((error) => {
      console.error("Error fetching TechCrunch API data:", error);
      if (carouselItemsContainer) carouselItemsContainer.innerHTML = "";
      if (cardGridContainer)
        cardGridContainer.innerHTML = `<p class="text-danger text-center">Gagal memuat berita. Silakan coba lagi nanti.</p>`;
    });
}

// ------------------------ Event Listener untuk Pencarian ------------------------
if (searchInput) {
  searchInput.addEventListener("keyup", function (event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === "") {
      renderNewsItems(allFetchedPosts);
    } else {
      const filteredPosts = allFetchedPosts.filter((post) => {
        const title = post.title.rendered.toLowerCase();
        return title.includes(searchTerm);
      });
      renderNewsItems(filteredPosts);
    }
  });
}

// ------------------------ Panggil Fungsi untuk Mengambil Berita Saat Halaman Dimuat ------------------------
document.addEventListener("DOMContentLoaded", () => {
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

// ------------------------ Logika Tombol Load More (Pagination) ------------------------
if (loadMoreButton) {
  let currentPage = 1;
  const postsPerPage = 8;

  loadMoreButton.addEventListener("click", function () {
    currentPage++;
    const nextPageApiUrl = `https://techcrunch.com/wp-json/wp/v2/posts?per_page=${postsPerPage}&page=${currentPage}&_embed`;

    loadMoreButton.disabled = true;
    loadMoreButton.textContent = "Memuat...";

    fetch(nextPageApiUrl)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            console.warn(
              `No more posts found or invalid page number (status 400) for page ${currentPage}.`
            );
            return [];
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((newPosts) => {
        const trulyNewPosts = newPosts.filter((post) => {
          if (!displayedPostIds.has(post.id)) {
            displayedPostIds.add(post.id);
            return true;
          }
          return false;
        });

        if (trulyNewPosts.length > 0) {
          allFetchedPosts = allFetchedPosts.concat(trulyNewPosts);
          const currentSearchTerm = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";
          if (currentSearchTerm !== "") {
            const newlyFilteredPosts = allFetchedPosts.filter((post) =>
              post.title.rendered.toLowerCase().includes(currentSearchTerm)
            );
            renderNewsItems(newlyFilteredPosts);
          } else {
            renderNewsItems(allFetchedPosts);
          }
          loadMoreButton.disabled = false;
          loadMoreButton.textContent = "Load More";
        } else {
          loadMoreButton.textContent = "Tidak ada berita lagi";
        }
      })
      .catch((error) => {
        console.error("Error fetching more posts:", error);
        loadMoreButton.textContent = "Gagal memuat";
      });
  });
}
