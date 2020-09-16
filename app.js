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

const createPokemonDataPage = (results, image) => {
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
            <li data-type=${move} class="move-list"> ${move} </li>        
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
        <ul> <span class="attack-list">Attacks:</span> ${moves}</ul>
        <ul> <span class="ability-list">Abilities:</span> 
            <li class="ability-li">${abilities}</li>
        </ul>
        <div> <img src="${image} alt="poke pic"> </div>
    </div>`
    )
}

const landingPageText = (`
    <p> Welcome to the Pokémon Podédex! Click on the Pokédex to learn about over 800 Pokémon! Including their types, species, attacks, etc. You can choose by name, id number, or click the Pokédex for a random Pokémon! </p>
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

const getApiImage = (query, data) => {
    console.log('fetching poke image')

    const options = {
        type: 'GET', 
        "url": `${query}`,
        success: image => {
            renderPokemonResults(data, image)
            console.log('Success, image')
        },
        catch: err => console.log(err)
    }

    $.ajax(options)
}

const getApiData = (query) => {
    console.log('user input:', query)

    const options = {
        type: 'GET', 
        "url": `https://pokeapi.co/api/v2/pokemon/${query}`,
        success: data => {
            console.log('Success, data:', data.sprites.front_default)
            const image = data.sprites.front_default
            getApiImage(image, data)
        },
        catch: err => console.log(err)
    }

    $.ajax(options);
}

/* ---------- EVENT HANDLERS---------- */

const aboutHandler = () => {
    console.log('about clicked')
    setState({ route: 'landingPage' })
}

const pokedexHandler = () => {
    const randomNumber = Math.floor(Math.random() * 893)
    getApiData(randomNumber);
    setState({ route: 'pokemonPage' });
}

const attackMoveHandler = (event) => {
    console.log('clicked', this);
    // const attackMove = $(this).attr("data-type");
    // const attackMove = $(event.currentTarget);
    const attackMove = $("li").data("type")

    console.log('attackMove', attackMove)
}

const inputHandler = event => {
    event.preventDefault();
    const userInput = $(event.currentTarget).find('.input').val();
    console.log(userInput)
    if (userInput == ""){
        getApiData(userInput);
    } else {
        toastr.warning('Please fill in field with a pokemon or No. from 1 to 893');
    }
}

/* ---------- EVENT LISTENERS ---------- */

$('header').on('click', '#nav-button-about', () => aboutHandler());
$('header').on('click', '#nav-button-pokedex', () => pokedexHandler());
$('body').on('click', '.move-list', (event) => attackMoveHandler(event));

$('body').on('submit', '.form', event => inputHandler(event));

/* ---------- LOAD PAGE ---------- */
$(render)
