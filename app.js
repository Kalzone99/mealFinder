//Section of Dom selections
const button_2 = document.querySelector("#btn_2");
const search = document.querySelector("#search");
const thumbText = document.querySelector("#thumbText");
// const mealsDropdown = document.querySelector("#mealsDropdown");
const thumbDiv = document.querySelector("#thumb");
const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modal-title");
const ingredientsList = document.querySelector("#ingredients-list");
const recipeText = document.querySelector("#recipe-text");
const reset = document.querySelector("#reset");

// API URLs
const meal_search = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

//Enter pressed to act as a click event on the search button
search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("btn_2").click();
  }
});
// Event listener for the search button
button_2.addEventListener("click", () => {
  const searchValue = search.value;
  console.log("Searching for:", searchValue);
  fetch(meal_search + searchValue)
    .then((response) => response.json())
    .then((meal_query) => {
      console.log(meal_query);
      displayMeals(meal_query.meals);
    });
});

// Function to display meals
function displayMeals(meals) {
  //mealsDropdown.innerHTML = ""; // Clear dropdown
  thumbDiv.innerHTML = ""; // Clear thumbnails
  thumbText.textContent = ""; // Clear thumb text

  if (meals) {
    meals.forEach((meal) => {
      /* // Create dropdown option
      const option = document.createElement("option");
      option.value = meal.idMeal;
      option.textContent = meal.strMeal;
      mealsDropdown.appendChild(option);*/

      // Create a wrapper div for each meal
      const mealBox = document.createElement("div");
      mealBox.className = "meal-box";

      // Create image element
      const img = document.createElement("img");
      img.src = meal.strMealThumb;
      img.alt = meal.strMeal;
      img.title = meal.strMeal;
      img.className = "meal-image"; // Optional class for styling
      img.style.width = "100px";
      img.style.margin = "5px";

      // Add click event to the image
      img.addEventListener("click", () => openModal(meal.idMeal));

      // Create a meal name element
      const mealName = document.createElement("p");
      mealName.innerHTML = meal.strMeal;

      // Append image and name to the meal box
      mealBox.appendChild(img);
      mealBox.appendChild(mealName);

      // Append meal box to the thumbDiv
      thumbDiv.appendChild(mealBox);
    });
  } else {
    alert("not recipe related input!");
  }
}

// Function to open modal and fetch meal details
function openModal(mealId) {
  // Fetch meal details by meal's Id
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      modalTitle.textContent = meal.strMeal;

      // Clear previous ingredients
      ingredientsList.innerHTML = "";
      for (let i = 1; i <= 20; i++) {
        // Up to 20 ingredients
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
          const li = document.createElement("li");
          li.textContent = `${measure} ${ingredient}`;
          ingredientsList.appendChild(li);
        }
      }
      //this is how to format the format given from the api for instructions (changing a set of /\r/n or /g to break lines)
      const apiRecipe = meal.strInstructions;
      const formatRecipe = apiRecipe.replace(/\r\n/g, "<br>");
      //this doesn't work with .textContent it would return a <br> written as such instead of doing the break line
      recipeText.innerHTML = formatRecipe;
      modal.style.display = "block"; // Show the modal originaly hidden with display: none;
    });
}

// Close the modal when the user clicks on the close button
document.getElementById("close").onclick = function () {
  modal.style.display = "none";
};

// Close the modal when the user clicks outside of it (here the modal around the container)
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
// this is the reset button function
const refreshPage = () => {
  location.reload();
};

reset.addEventListener("click", refreshPage);
