// News API URL and API Key
const newsApiUrl =
  "https://newsapi.org/v2/top-headlines?category=technology&apiKey=107f7e54df6e45fc926f98c205bdae6a";

// TechCrunch API URL (assuming it returns JSON)
const techCrunchApiUrl =
  "https://techcrunch.com/wp-json/wp/v2/posts?per_page=5";

// Fetch data from News API
fetch(newsApiUrl)
  .then((response) => response.json())
  .then((data) => {
    const articles = data.articles;
    const carouselItems = document.getElementById("carouselItems");
    const cardGrid = document.getElementById("cardGrid");

    // Populate carousel items
    articles.forEach((article, index) => {
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
            <p class="text-white small m-0">Oleh: <strong>Admin</strong> | ${new Date(
              article.publishedAt
            ).toLocaleDateString()}</p>
          </div>
        </div>
      `;
      carouselItems.appendChild(carouselItem);

      // Populate grid cards
      const card = document.createElement("a");
      card.href = article.url;
      card.innerHTML = `
        <div class="col">
          <div class="card h-100 bg-dark text-white rounded-4">
            <img src="${
              article.urlToImage
            }" class="card-img-top rounded-top-4" alt="..." />
            <div class="card-body p-2">
              <p class="card-text">${article.description}</p>
              <p class="text-white small mb-0" style="font-size: 0.7rem">Oleh: <strong>Admin</strong> | ${new Date(
                article.publishedAt
              ).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      `;
      cardGrid.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching News API data:", error));

// Fetch data from TechCrunch API
fetch(techCrunchApiUrl)
  .then((response) => response.json())
  .then((posts) => {
    const cardGrid = document.getElementById("cardGrid");

    // Populate grid cards for TechCrunch articles
    posts.forEach((post) => {
      const card = document.createElement("a");
      card.href = post.link;
      card.innerHTML = `
        <div class="col">
          <div class="card h-100 bg-dark text-white rounded-4">
            <img src="${
              post.featured_media_src_url
            }" class="card-img-top rounded-top-4" alt="..." />
            <div class="card-body p-2">
              <p class="card-text">${post.excerpt.rendered}</p>
              <p class="text-white small mb-0" style="font-size: 0.7rem">Oleh: <strong>Admin</strong> | ${new Date(
                post.date
              ).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      `;
      cardGrid.appendChild(card);
    });
  })
  .catch((error) =>
    console.error("Error fetching TechCrunch API data:", error)
  );
