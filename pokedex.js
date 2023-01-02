/**
 * Nate Chen
 * 2/17/22
 * Section AE
 * 
 * JS file of my HW3 submission for managing Pokedex and battle behavior.
 */

"use strict";
(function() {

  const BASE_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";
  const POKEDEX_URL = BASE_URL + "pokedex.php";
  const SPRITE_URL = BASE_URL + "sprites/";
  const GAME_URL = BASE_URL + "game.php";

  window.addEventListener('load', init);

  /**
   * Page initializer function. Initializes the Pokedex with sprites, and ...
   */
  function init() {
    // GET request to get all pokemon sprites, with starters initialized as found
    initPokedex();
    id("start-btn").classList.add("hidden");
  }

  /**
   * Initializes the Pokedex view by displaying all sprites.
   */
  function initPokedex() {
    let url = POKEDEX_URL + "?pokedex=all";
    fetch(url)
      .then(statusCheck)
      .then(res => res.text())
      .then(displaySprites)
      .catch(console.error);
  }

  /**
   * Displays all sprites in the Pokedex when the page is loaded. Only Bulbasaur, Charmander, and
   * Squirtle start with non-silhouette sprites.
   * @param {String} res - the plaintext response from the API request
   */
  function displaySprites(res) {
    // parses response to retrieve array of Pokemon short names
    let pokemonNamePairs = res.split(/\n/); // array of Name:shortname
    let pokedexView = id("pokedex-view");
    for (let i = 0; i < pokemonNamePairs.length; i++) {
      let name = pokemonNamePairs[i].split(":")[0];
      let shortName = pokemonNamePairs[i].split(":")[1];
      let sprite = document.createElement("img");
      sprite.classList.add("sprite");
      sprite.src = SPRITE_URL + shortName + ".png";
      sprite.alt = "Pokemon sprite of " + name;
      sprite.id = shortName;
      pokedexView.appendChild(sprite);
      if (name === "Bulbasaur" || name === "Charmander" || name === "Squirtle") {
        foundPokemon(shortName);
      }
    }
  }

  /**
   * Reveals the sprite of the Pokemon in the Pokedex, and allows for displaying of its card with
   * stats and information shown.
   * @param {String} name - the Pokemon short name 
   */
  function foundPokemon(name) {
    let pokemon = id(name);
    console.log(pokemon);
    pokemon.classList.add("found");
    pokemon.addEventListener("click", () => {
      let url = POKEDEX_URL + "?pokemon=" + name;
      fetch(url)
        .then(statusCheck)
        .then(res => res.json())
        .then(showPokemonData)
        .catch(console.error);
    });
  }

  function showPokemonData(json) {
    qs("#p1 .name").textContent = json.name;
    let pokemonImage = qs("#p1 .pokepic");
    pokemonImage.src = BASE_URL + json.images.photo;
    pokemonImage.alt = "Pokemon illustration of " + json.name;

    // Set type icons
    setTypeImage(qs("#p1 .type"), json.images.typeIcon, json.info.type);
    setTypeImage(qs("#p1 .weakness"), json.images.weaknessIcon, json.info.weakness);

    qs("#p1 .hp").textContent = json.hp + "HP";
    qs("#p1 .info").textContent = json.info.description;

    let moveButtons = qsa("#p1 .moves button"); // array of buttons
    let moves = qsa("#p1 .move"); // array of moves
    let moveDP = qsa("#p1 .dp"); // array of DP spans
    let moveTypeIcons = qsa("#p1 .moves img"); // array of type icon img

    // Remove hidden class from moves if needed
    for (let i = 0; i < moveButtons.length; i++) {
      moveButtons[i].classList.remove("hidden");
    }
    for (let i = 0; i < json.moves.length; i++) {
      moves[i].textContent = json.moves[i].name; // set move name
      let type = json.moves[i].type; // set move type icon
      setTypeImage(moveTypeIcons[i], "icons/" + type + ".jpg", type);
      if (json.moves[i].dp) { // set move DP if it exists
        moveDP[i].textContent = json.moves[i].dp + " DP";
      }
    }
    // Hide unused moves
    for (let i = json.moves.length; i < moveButtons.length; i++) {
      moveButtons[i].classList.add("hidden");
    }
  }

  /**
   * Sets an input img element's type based on the input. Pokemon type and icon path must match.
   * @param {HTMLElement} element - the img element to be set with a type image
   * @param {String} icon - the path to the icon JPG
   * @param {String} type - the Pokemon type of the icon
   */
  function setTypeImage(element, icon, type) {
    element.setAttribute("src", BASE_URL + icon);
    element.setAttribute("alt", type + " type icon");
  }

  /**
   * Status checker for fetch requests. Throws an error if something goes wrong in the fetch
   * request.
   * @param {Response} res - the response of the fetch request
   * @returns {Response} - the response if no error is thrown
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Provided helper function. Retrieves the HTML element with the given ID.
   * @param {String} id - the input ID
   * @returns {HTMLElement} - the element matching the input ID
   */
   function id(id) {
    return document.getElementById(id);
  }

  /**
   * Provided helper function. Retrieves the first HTML element matching the given CSS selector.
   * @param {String} selector - the input CSS selector
   * @returns {HTMLElement} - the first element matching the input CSS selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Provided helper function. Retrieves all HTML elements matching the given CSS selector.
   * @param {String} selector - the input CSS selector
   * @returns {NodeList} - an array of all HTML elements matching the input CSS selector
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();