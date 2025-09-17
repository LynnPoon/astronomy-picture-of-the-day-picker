document.addEventListener("DOMContentLoaded", (e) => {
  loadFavPics();
});

const form = document.getElementById("form");
const pictureDate = document.getElementById("picDate");
const favPicture = document.getElementById("favorites");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let pictureDateInput = pictureDate.value;
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=0xpvjo3pFj2DhS0gZvdbMCysHOk5sxCt2kv5CJPn&date=${pictureDateInput}`
  );
  const json = await response.json();
  const showImgDiv = document.getElementById("showImg");
  showImgDiv.innerHTML = "";
  const picDiv = createPicDiv(json);
  showImgDiv.append(picDiv);
});

function createPicDiv(json) {
  const picDiv = document.createElement("div");
  picDiv.classList.add("picDiv");

  const picBox = document.createElement("div");
  picBox.classList.add("picBox");

  const img = document.createElement("img");
  img.src = json["url"];
  img.addEventListener("click", () => {
    window.open(json["hdurl"], "_blank");
  });
  picBox.appendChild(img);
  picDiv.appendChild(picBox);

  const title = document.createElement("h3");
  title.textContent = json["title"];

  const date = document.createElement("h4");
  date.textContent = json["date"];

  const description = document.createElement("div");
  description.classList.add("description");
  description.textContent = json["explanation"];

  const picSaveBtn = document.createElement("button");
  picSaveBtn.setAttribute("id", "picSaveBtn");
  picSaveBtn.textContent = "Save to Favorites";

  picSaveBtn.addEventListener("click", () => {
    saveToFavorites(json);
  });

  const clearButton = document.createElement("button");
  clearButton.classList.add("clearFavBtn");
  clearButton.textContent = "Delete";
  clearButton.addEventListener("click", () => {
    removeFavorite(json, picDiv);
  });

  const picInfo = document.createElement("div");
  picInfo.classList.add("picInfo");
  picInfo.append(title, date, description, picSaveBtn, clearButton);
  picDiv.append(picInfo);

  return picDiv;
}

function saveToFavorites(json) {
  // Get existing favPic from local storage
  const existingFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if the pic is already saved as a favorite
  const isAlreadyFavorite = existingFavorites.some(
    (fav) => fav.url === json.url
  );

  if (!isAlreadyFavorite) {
    // Add the current pic to the favorites
    existingFavorites.push(json);
    // Updated favorites are saved back to local storage
    localStorage.setItem("favorites", JSON.stringify(existingFavorites));

    const picDiv = createPicDiv(json);
    favPicture.appendChild(picDiv);
  }
}

function removeFavorite(json, picDiv) {
  const existingFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Remove the current picture from the favorites
  const updatedFavorites = existingFavorites.filter(
    (fav) => fav.url !== json.url
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

  // Remove the picDiv from the favorites section
  favPicture.removeChild(picDiv);
}

function loadFavPics() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.forEach((json) => {
    const picDiv = createPicDiv(json);
    favPicture.appendChild(picDiv);
  });
}
