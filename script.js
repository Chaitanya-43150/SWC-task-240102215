const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
let currentRecipe = null;

async function searchRecipes() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Please enter a dish name!");

  const res = await fetch(API_URL + query);
  const data = await res.json();

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!data.meals) {
    resultsDiv.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  data.meals.forEach(meal => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="card-body">
        <h3>${meal.strMeal}</h3>
        <button onclick="viewDetails(${meal.idMeal})">View Details</button>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}

async function viewDetails(id) {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
  const data = await res.json();
  const meal = data.meals[0];
  currentRecipe = meal;

  document.getElementById("recipeTitle").innerText = meal.strMeal;
  document.getElementById("recipeImage").src = meal.strMealThumb;

  const ingredientsList = document.getElementById("ingredientsList");
  ingredientsList.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      let li = document.createElement("li");
      li.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
      ingredientsList.appendChild(li);
    }
  }

  document.getElementById("instructions").innerText = meal.strInstructions;
  document.getElementById("recipeModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("recipeModal").style.display = "none";
}

function saveFavorite() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(currentRecipe);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Recipe saved to favorites!");
}
