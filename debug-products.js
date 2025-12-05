const axios = require("axios");

const API_URL = "http://localhost:3000/api/products";

async function debugProducts() {
  try {
    console.log("Fetching all products...");
    const productsResponse = await axios.get(API_URL);
    const products = productsResponse.data.data;

    console.log(`\nTotal products: ${products.length}`);
    console.log("\nProducts by category:");

    const productsByCategory = {};
    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push(product.name);
    });

    for (const [category, productNames] of Object.entries(productsByCategory)) {
      console.log(`\n${category}:`);
      productNames.forEach((name) => console.log(`  - ${name}`));
    }

    console.log("\nFetching categories...");
    const categoriesResponse = await axios.get(`${API_URL}/categories/all`);
    const categories = categoriesResponse.data.data;

    console.log("\nAvailable categories:", categories);

    // Test filtering by Electronics
    console.log("\nTesting Electronics filter...");
    const electronicsResponse = await axios.get(
      `${API_URL}?category=Electronics`
    );
    console.log(
      `Electronics products found: ${electronicsResponse.data.data.length}`
    );
    electronicsResponse.data.data.forEach((product) => {
      console.log(`  - ${product.name} (Category: ${product.category})`);
    });
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

debugProducts();
