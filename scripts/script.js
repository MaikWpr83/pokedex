let pokemonAmount = 30;
let allPokemon = [];
let pokemonNames = [];
let matchingPokemonNames = [];
let pokemonStats = [];
let currentPokemonIndex = 0;
let isLoadingResults = false;

async function rendern(){
    for (let i = 1; i <= pokemonAmount; i++) { // repeats loadPokemon 30x
        await loadPokemon(i);
    }
}

async function loadPokemon(id){
    let url = `https://pokeapi.co/api/v2/pokemon/${id}/`; // the data records of the PokeAPI start numbered consecutively at 1, id is therefore 1 on the first run and 2 on the second, etc.
    let response = await fetch(url);
    let currentPokemon = await response.json();
    pokemonNames.push(currentPokemon['name']);
    allPokemon.push(currentPokemon);
    renderPokemonInfo(currentPokemon);
}

function renderPokemonInfo(currentPokemon){
    let card = document.getElementById('pokemonList');
    card.innerHTML += createPokemonCard(currentPokemon);
}

function getPokemonSpecies(currentPokemon){
    let species1 = currentPokemon['types']['0']['type']['name'];
    let species2 = '';
    if (currentPokemon['types'].length > 1) {
        species2 = currentPokemon['types']['1']['type']['name'];
    }
    return { species1, species2 };
}

function createPokemonCard(currentPokemon){
    let { species1, species2 } = getPokemonSpecies(currentPokemon);
    let backgroundColor = getBackgroundColor(species1);
    let backgroundColor2 = getBackgroundColor(species2);
    let pokemonImageHTML = createPokemonImageHTML(currentPokemon);
    let pokemonNameHTML = createPokemonNameHTML(currentPokemon);
    let pokemonSpeciesIdHTML = createPokemonSpeciesIdHTML(backgroundColor, backgroundColor2, species1, species2, currentPokemon);
    return createPokemonCardHTML(currentPokemon, species1, species2, backgroundColor, pokemonImageHTML, pokemonNameHTML, pokemonSpeciesIdHTML);
}

function createPokemonImageHTML(currentPokemon){
    return `
    <img id="pokemonImage" src="${currentPokemon['sprites']['other']['home']['front_default']}"></img>
    `;
}

function createPokemonNameHTML(currentPokemon){
    return `
    <h2 id="pokemonName">${currentPokemon['name']}</h2>
    `;
}

function createPokemonSpeciesIdHTML(backgroundColor, backgroundColor2, species1, species2, currentPokemon){
    return `
    <div class="species-id">
        <div class="species">
            <div id="pokemonSpecies1" style="background-color: ${backgroundColor}">${species1}</div>
            <div id="pokemonSpecies2" style="background-color: ${backgroundColor2}">${species2}</div>
        </div>
        <div id="pokemonID">#${currentPokemon['id']}</div>
    </div>
    `;
}

function createPokemonCardHTML(currentPokemon, species1, species2, backgroundColor, pokemonImageHTML, pokemonNameHTML, pokemonSpeciesIdHTML){
    return `
    <div class="pokedex-wrapper" id="pokedexWrapper" onclick="openBigPokemonCard('${backgroundColor}', ${currentPokemon.id})">
        <div id="pokedex" style="background-color: ${backgroundColor}">
            ${pokemonImageHTML}
        </div>
        <div class="info-container">
            ${pokemonNameHTML}
            ${pokemonSpeciesIdHTML}
        </div>
    </div>
    `;
}

function hideLoadMoreButton(){
    document.getElementById('btn').classList.add('d-none');
}

function showLoadMoreButton(){
    document.getElementById('btn').classList.remove('d-none');
}

async function loadMorePokemon(){
    hideLoadMoreButton();
    pokemonAmount += 20;
    for (let i = pokemonAmount - 20 + 1; i <= pokemonAmount; i++) {
        await loadPokemon(i);
    }
    showLoadMoreButton();
}

function searchPokemonBigCard(){
    document.getElementById('searchButton').addEventListener("click", () =>
    {
        document.getElementById('input').focus();
    });
    if (isLoadingResults) return;
    searchPokemon();
}

function searchPokemon(){
    let input = document.getElementById('input').value.trim().toLowerCase();
    let button = document.getElementById('btn');
    if (input.length >= 3) {
        findMatchingPokemon(input);
        showMatchingPokemon();
        button.classList.add('d-none');
    } else {
        alert('Please enter at least three letters');
    }
}

function findMatchingPokemon(input){
    matchingPokemonNames = []; // resetting the matching Pokémon names
    for (let i = 0; i < pokemonNames.length; i++) {
        let searchedPokemonName = pokemonNames[i];
        if (searchedPokemonName.includes(input)) {
            matchingPokemonNames.push(searchedPokemonName);
        }
    }
}

function showMatchingPokemon(){
    let card = document.getElementById('pokemonList');
    card.innerHTML = '';
    if (matchingPokemonNames.length > 0) {
        displayMatchingPokemon(card);
    } else {
        displayNoResultHTML(card);
    }
}

function removeDuplicates(array){
    let uniquePokemonNames = []; // Array for saving the unique Pokémon names
    array.forEach(pokemonName => {
        if (!uniquePokemonNames.includes(pokemonName)) { // checks whether the Pokemon name already exists in the array
            uniquePokemonNames.push(pokemonName); // adds the name, if it does not exist in the array
        }
    });
    return uniquePokemonNames; // returns the array with the unique Pokémon names
}

function displayMatchingPokemon(card){
    card.innerHTML = '';
    if (matchingPokemonNames.length > 0) {
        let uniquePokemonNames = removeDuplicates(matchingPokemonNames);
        uniquePokemonNames.forEach(pokemonName => { // display the unique matching Pokémon
            let pokemonIndex = pokemonNames.indexOf(pokemonName);
            if (pokemonIndex >= 0) {
                loadPokemon(pokemonIndex + 1);
            }
        });
    } else {
        displayNoResultHTML(card);
    }
}

function displayNoResultHTML(card){
    card.innerHTML = `<div class="no-result-div">No matching Pokémon found</div>`;
}

function deleteSearchbar(){
    let input = document.getElementById('input');
    let button = document.getElementById('btn');
    input.value = '';
    matchingPokemonNames = [];
    pokemonNames = [];
    allPokemon = [];
    let card = document.getElementById('pokemonList');
    card.innerHTML = '';
    button.classList.remove('d-none');
    currentPokemonIndex = 0;
    rendern();
}

function openBigPokemonCard(backgroundColor, id){
    document.body.classList.add('hide-scrollbar'); // adds overflow-y: hidden to the Body to hide the scrollbar
    let cardBig = document.getElementById('backgroundCard');
    cardBig.classList.remove('d-none');
    cardBig.classList.add('center-element');
    let currentPokemon = findPokemonById(id);
    if (currentPokemon) {
        createBigPokemonCart(cardBig, backgroundColor, currentPokemon);
        currentPokemonIndex = allPokemon.findIndex(pokemon => pokemon.id === id);
    }
    if (currentPokemonIndex === 0) {
        document.getElementById('arrowLeft').classList.add('opacity-0');
    }
}

function findPokemonById(id){
    for (let i = 0; i < allPokemon.length; i++) {
        if (allPokemon[i].id === id) {
            pokemonStats = [];
            pokemonStats.push(allPokemon[i]['stats']);
            return allPokemon[i];
        }
    }
}

function createBigPokemonCart(cardBig, backgroundColor, currentPokemon){
    let species1 = currentPokemon['types']['0']['type']['name'];
    let species2 = '';
    if (currentPokemon['types'].length > 1) {
        species2 = currentPokemon['types']['1']['type']['name'];
    }
    let bigSpeciesIdHTML = createBigSpeciesIdHTML(species1, species2, currentPokemon);
    let bigHeadlinesHTML = createBigHeadlinesHTML();
    let bigTableHTML = createBigTableHTML(currentPokemon);
    let bigChartHTML = createBigChartHTML();
    cardBig.innerHTML = createBigPokemonCardHTML(backgroundColor, currentPokemon, bigSpeciesIdHTML, bigHeadlinesHTML, bigTableHTML, bigChartHTML);
}

function createBigSpeciesIdHTML(species1, species2, currentPokemon){
    let species2HTML = '';
    if (species2) {
        species2HTML = `<div class="pokemon-species">${species2}</div>`;
    }
    return `
    <div class="species-id">
        <div class="species">
            <div class="pokemon-species">${species1}</div>
            ${species2HTML}
        </div>
        <div id="pokemonID">#${currentPokemon['id']}</div>
     </div>
    `;
}

function createBigHeadlinesHTML(){
    return `
    <div class="headlines">
        <img id="arrowLeft" class="arrow-left" src="./img/arrow.png" onclick="previousPokemon()"</img>
        <h3 class="headline1" onclick="openContentTable()">About</h3>
        <h3 class="headline2" onclick="openContentChart()">Statistic</h3>
        <img class="arrow-right" src="./img/arrow.png" onclick="nextPokemon()"</img>
    </div>
    `;
}

function createBigTableHTML(currentPokemon){
    return `
    <table class="content-table" id="contentTable">
        ${createTableRow('Height', `${(currentPokemon['height'] * 30.48).toFixed(2)}cm`)}
        ${createTableRow('Weight', `${(currentPokemon['weight'] / 2.205).toFixed(2)}kg`)}
        ${createTableRow('Base Experience', currentPokemon['base_experience'])}
    </table>
    `;
}

function createTableRow(name, value){
    return `
    <tr class="pd-top-20">
        <td class="first-td">${name}:</td>
        <td>${value}</td>
    </tr>
    `;
}

function createBigTableContentHTML(currentPokemon){
    let content = document.getElementById('contentTable');
    content.innerHTML = ``;
}

function createBigChartHTML(){
    return `
    <div id="contentChart" class="d-none">
        <canvas id="myChart"></canvas>
    </div>
    `;
}

function createBigPokemoncardHeaderHTML(backgroundColor, currentPokemon, bigSpeciesIdHTML){
    return `
    <div class="card-header" style="background-color: ${backgroundColor}">
        <h2 class="pokemon-name">${currentPokemon['name']}</h2>
        ${bigSpeciesIdHTML}
        <img class="pokemon-image-big" src="${currentPokemon['sprites']['other']['home']['front_default']}"></img>
    </div>
    `;
}

function createBigPokemoncardContentHTML(bigHeadlinesHTML, bigTableHTML, bigChartHTML){
    return `
    <div class="card-content">
        ${bigHeadlinesHTML} 
        <div id="content">
            ${bigTableHTML}
            ${bigChartHTML}
        </div>
    </div>
    `;
}

function createBigPokemonCardHTML(backgroundColor, currentPokemon, bigSpeciesIdHTML, bigHeadlinesHTML, bigTableHTML, bigChartHTML){
    let bigPokemonCardHeaderHTML = createBigPokemoncardHeaderHTML(backgroundColor, currentPokemon, bigSpeciesIdHTML);
    let bigPokemonCardContentHTML = createBigPokemoncardContentHTML(bigHeadlinesHTML, bigTableHTML, bigChartHTML);
    return `
    <div class="card-big-wrapper" id="popupWrapper">
        <div>
            ${bigPokemonCardHeaderHTML}
            ${bigPokemonCardContentHTML}
        </div>
    </div>`;
}

function openContentTable(){
    document.getElementById('contentTable').classList.remove('d-none');
    document.getElementById('contentChart').classList.add('d-none');
}

function openContentChart(){
    document.getElementById('contentTable').classList.add('d-none');
    document.getElementById('contentChart').classList.remove('d-none');
    renderChart();
}

function closeBigPokemonCard(event){
    if (event.target.id === 'backgroundCard') { // checks whether the element that was clicked on (= event.target) contains the id backgroundCard
        document.getElementById('backgroundCard').classList.add('d-none');
        document.getElementById('popupWrapper').classList.add('d-none');
        document.body.classList.remove('hide-scrollbar');
        currentPokemonIndex = -1;
    }
}

function previousPokemon(){
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
    } else {
        currentPokemonIndex = allPokemon.length - 1;
    }
    let previousPokemon = allPokemon[currentPokemonIndex];
    openBigPokemonCard(getBackgroundColor(previousPokemon['types'][0]['type']['name']), previousPokemon['id']);
}

async function nextPokemon(){
    if (currentPokemonIndex < allPokemon.length - 1) {
        currentPokemonIndex++;
    } else {
        await loadMorePokemon();
    }
    let nextPokemon = allPokemon[currentPokemonIndex];
    openBigPokemonCard(getBackgroundColor(nextPokemon['types'][0]['type']['name']), nextPokemon['id']);
}