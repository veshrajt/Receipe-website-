const searchBtn = document.querySelector('.Searchbtn');
const searchBox = document.querySelector('.SearchBox');
const recipeContainer = document.querySelector('.Receipe-container');
const recipeDetailsContent = document.querySelector('.receipe-details-content');
const recipeDetails = document.querySelector('.receipe-details');
const closeBtn = document.querySelector('.receipe-close-btn');

const fetchRecipes = async (query) => {
  try {
    recipeContainer.innerHTML = '<p class="loading">Loading delicious recipes...</p>';

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();

    recipeContainer.innerHTML = '';

    if (!data.meals) {
      recipeContainer.innerHTML = '<h2 style="grid-column: 1/-1; text-align:center;">No recipes found 😔</h2>';
      return;
    }

    data.meals.forEach(meal => {
      const card = document.createElement('div');
      card.classList.add('recipe');

      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea || 'International'} • ${meal.strCategory || '?'}</p>
      `;

      const btn = document.createElement('button');
      btn.textContent = 'View Recipe';
      btn.addEventListener('click', () => openRecipePopup(meal));

      card.appendChild(btn);
      recipeContainer.appendChild(card);
    });
  } catch (err) {
    recipeContainer.innerHTML = '<h2 style="grid-column: 1/-1; text-align:center;">Something went wrong... 🍳</h2>';
    console.error(err);
  }
};

const getIngredientsList = (meal) => {
  let list = '';
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();

    if (!ing) break;
    if (ing) {
      list += `<li>${measure ? measure + ' ' : ''}${ing}</li>`;
    }
  }
  return list;
};

const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="receipeName">${meal.strMeal}</h2>
    
    <h3>Ingredients</h3>
    <ul class="ingredientList">
      ${getIngredientsList(meal)}
    </ul>

    <div class="receipeinstructions">
      <h3>Instructions</h3>
      <p>${meal.strInstructions.replace(/\n/g, '<br>')}</p>
    </div>
  `;

  recipeDetails.style.display = 'flex';
};

closeBtn.addEventListener('click', () => {
  recipeDetails.style.display = 'none';
});

// Enter key support (bonus improvement)
searchBox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

searchBtn.addEventListener('click', () => {
  const query = searchBox.value.trim();
  if (!query) {
    recipeContainer.innerHTML = '<h2 style="grid-column: 1/-1; text-align:center;">Please type a recipe name 🍲</h2>';
    return;
  }
  fetchRecipes(query);
});