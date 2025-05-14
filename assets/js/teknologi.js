const techCrunchApiUrl =
  "https://techcrunch.com/wp-json/wp/v2/posts?per_page=8&_embed";

fetch(techCrunchApiUrl)
  .then((response) => response.json())
  .then((posts) => {
    setTimeout(() => {
      const carouselItems = document.getElementById("carouselItems");
      const cardGrid = document.getElementById("cardGrid");

      posts.forEach((post, index) => {
        const imageUrl =
          post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
          "https://via.placeholder.com/500x300?text=No+Image";

        // Carousel (ambil 3 pertama)
        if (index < 3) {
          const carouselItem = document.createElement("a");
          carouselItem.href = post.link;
          carouselItem.innerHTML = `
            <div class="carousel-item ${
              index === 0 ? "active" : ""
            } h-100 position-relative">
              <img src="${imageUrl}" class="d-block w-100 h-100 object-fit-cover" alt="..." />
              <div class="card-img-overlay flex-column justify-content-end align-items-start p-3 gradient-overlay">
                <h5 class="text-white mb-3 fw-semibold">${
                  post.title.rendered
                }</h5>
                <p class="text-white small m-0">Oleh: <strong>Admin</strong> | ${new Date(
                  post.date
                ).toLocaleDateString()}</p>
              </div>
            </div>
          `;
          carouselItems.appendChild(carouselItem);
        }

        // Grid Cards
        const card = document.createElement("a");
        card.href = post.link;
        card.innerHTML = `
          <div class="col">
            <div class="card h-100 bg-dark text-white rounded-4">
              <img src="${imageUrl}" class="card-img-top rounded-top-4" alt="..." />
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
    }, 1000); // Delay render 2 detik
  })
  .catch((error) =>
    console.error("Error fetching TechCrunch API data:", error)
  );
