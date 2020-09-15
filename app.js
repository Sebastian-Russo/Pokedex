const STATE = {
    route: 'landingPage'
}

/* ---------- CHECK/UPDATE STATE ---------- */
const setState = (newItem, currentState=STATE) => {
    const newState = Object.assign({}, currentState, newItem);
    Object.assign(currentState, newState)

    render();
}

/* ---------- TEMPLATE HELPERS ---------- */

const createPokemonDataPage = results => {
    const pokemon = results.name;
    const type = results.types.map(type => type.type.name);
    const pokeNumber = results.id;
    const attacks = results.moves.map(move => move.move.name);
    const abilities = results.abilities.map(object => object.ability.name).join("");
    const species = results.species.name;
    const weight = results.weight;

    let moveList = [];
        for (let i = 0; i < 10; i++) {
            moveList.push(attacks[i])
        }
    const moves = moveList.map(move => {
        return (`
            <a href="#"><li> ${move} </li></a>        
        `)
    }).join("");

    return (`
    <div class="container">
        <form class="form">
            <label for="input" class="form-label">Choose your fav Pokemon! </label>
            <input type="text" class="input" placeholder="pokemon name or #" required>
            <button type="submit" class="submit-button">Search</button>
        </form>
    </div>

    <div class="container-2">
        <p> I choose you <span class="name">${pokemon} !</span> </p>
        <p> Pokemon No. ${pokeNumber} </p>
        <p> Type: ${type} </p>
        <p> Species: ${species} <p>
        <p> Weight: ${weight} </p>
        <ul> <span class="attack-list">Attacks:</span> 
            <li class="attack-li">${moves}</li>
        </ul>
        <ul> <span class="ability-list">Abilities:</span> 
            <li class="ability-li">${abilities}</li>
        </ul>
    </div>`
    )
}

const landingPageText = (`
    <div> Welcome to the pokemon site! </div>
`)

const formPage = (`
    <div class="container">
        <form class="form">
            <label for="input" class="form-label">Choose your fav Pokemon! </label>
            <input type="text" class="input" placeholder="pokemon name or #" required>
            <button type="submit" class="submit-button">Search</button>
        </form>
    </div>
`)

/* ---------- RENDER FUNCTION ---------- */
const element = $('#page');

const renderPokemonResults = response => {    
    const pokemonDataPage = createPokemonDataPage(response);
    element.html(pokemonDataPage)
}

const renderPokemonPage = () => {
    $('#page').html('');
    $('#page').html(formPage);
}

const renderLandingPage = () => {
    $('#page').html('');
    $('#page').html(landingPageText);
}

const render = () => {
    if (STATE.route === 'pokemonPage') {
        renderPokemonPage();
    } else {
        renderLandingPage();   
    }
}

/* ---------- AJAX REQUEST ---------- */
const getApiData = (query) => {
    console.log('user input:', query)

    const options = {
        type: 'GET', 
        "url": `https://pokeapi.co/api/v2/pokemon/${query}?limit=20&offset=20`,
        success: data => {
            console.log('Success, data:', data)
            renderPokemonResults(data)
        }
    }

    $.ajax(options);
}

/* ---------- EVENT HANDLERS---------- */

const userAboutHandler = () => {
    console.log('about clicked')
    setState({ route: 'landingPage' })
}

const userRandomPokemonHandler = () => {
    const randomNumber = Math.floor(Math.random() * 893)
    getApiData(randomNumber);
    setState({ route: 'pokemonPage' });
}

const userInputHandler = event => {
    event.preventDefault();
    const userInput = $(event.currentTarget).find('.input').val();
    console.log(userInput)
    getApiData(userInput);
}

/* ---------- EVENT LISTENERS ---------- */

$('header').on('click', '#nav-button-about', () => userAboutHandler());
$('header').on('click', '#nav-button-random', () => userRandomPokemonHandler());
$('body').on('submit', '.form', event => userInputHandler(event));

/* ---------- LOAD PAGE ---------- */
$(render)
