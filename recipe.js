  
  const meals = document.getElementById('meals');
  const favouriteContainer = document.getElementById('fav-meals');
  const searchTerm = document.getElementById('search-term');
  const searchBtn = document.getElementById('search');
  
  getRandomMeal();
  fetchFavMeals();
  
  async function getRandomMeal() {

    const resp =  await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    
    // console.log(randomMeal);
    addMeal(randomMeal, true); 

    
}


async function getMealById(id) { 
const resp =  await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
const respData = await resp.json();
const meals = respData.meals[0];
return meals;


}

async function getMealsBySearch(term) {
const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
const respData = await resp.json();

const meals = respData.meals;

// notice we did not call meal[0]; because its a search so we arent dealing with the first array alone.
return meals;


}


function addMeal(mealData, random = false) {
const meal  = document.createElement('div');
meal.classList.add('meal');
meal.innerHTML = ` 
<div class="meal-header">
${random ? ` <span class="random">Random Recipe</span>` : ''}

<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
</div>
<div class="meal-body">
<h4 class="title">${mealData.strMeal}</h4>
<button class="fav-btn"> <i class="fas fa-heart"></i>
  </button>
</div>
<p class="retouch">${mealData.strInstructions} </p>
<button class="watch-btn"><a href="${mealData.strYoutube}" class="watch-link"> watch tutorial</a> </button>

`;
const btn = meal.querySelector('.meal-body .fav-btn');
btn.addEventListener('click', () => {
if (btn.classList.contains('active')) {
    removeMealFromLs(mealData.idMeal);
    btn.classList.remove('active');
}

else {
    addMealsToLS(mealData.idMeal)
    btn.classList.add('active');
}
// clean the container 

fetchFavMeals();
    
});
meals.appendChild(meal);
}

// ********remove meals#######################
function removeMealFromLs(mealId) {
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealsIds', JSON.stringify(mealIds.filter(id => id !== mealId)));

}

// ***********ADD MEALS*****
function addMealsToLS(mealId) {
const mealIds = getMealsFromLS();

localStorage.setItem('mealsIds', JSON.stringify([...mealIds, mealId]));
}


// *********Get meals************
function getMealsFromLS() {
const mealIds = JSON.parse(localStorage.getItem('mealsIds'));
return mealIds === null ? [] : mealIds;
}

 async function fetchFavMeals() {
    // clear the container
    favouriteContainer.innerHTML = "";

    const mealIds = getMealsFromLS();
    const meals = [];
    for(let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
     meal =    await getMealById(mealId);
     addMealFav(meal);
    }
    // console.log(meals);

    // add them to the screen.
}



function addMealFav(mealData) {
    
    
    const favMeal  = document.createElement('li');
    
    favMeal.innerHTML = ` 
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i> </button> 
    `;

    // we had to create a button which we will be used to remove the item from the list

    const btn = favMeal.querySelector('.clear');
    btn.addEventListener('click', () => {
        // we call the remove meals because its a function that removes the meal from favourite based on the id input.
        removeMealFromLs(mealData.idMeal);
        fetchFavMeals();
    });

    favouriteContainer.appendChild(favMeal);
    }

searchBtn.addEventListener('click', async() => {
    // we need to get the value from the input
const search = searchTerm.value;
  const meals = await getMealsBySearch(search);
  

   meals.forEach(meal => {
    addMeal(meal);
   });

});



