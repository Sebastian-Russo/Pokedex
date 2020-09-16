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

const createAttackMoveData = results => {
    const accuracy = results.accuracy;
    const damageClass = results.damage_class.name;
    const name = results.name;
    const power = results.power;
    const pp = results.pp;
    const target = results.target.name;
    const type = results.type.name;

    return (`
        <div class="container-2">
            <p>Name: ${name}</p>
            <p>Power: ${power}</p>
            <p>PP: ${pp}</p>
            <p>Accuracy: ${accuracy}</p>
            <p>Type: ${type}</p>
            <p>Damage Class: ${damageClass}</p>
            <p>Target: ${target}</p>
        </div>
    `)
}

const createPokemonData = (results, image) => {
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

        </div>`
    )
}

/* ---------- TEMPLATES ---------- */


const landingPageText = (`
    <p> Welcome to the Pokémon Podédex! Click on the Pokédex to learn about over 800 Pokémon! Including their types, species, attacks, etc. You can choose by name, id number, or click the Pokédex for a random Pokémon! </p>
`)

const pokedexPage = (`
    <div class="container">
        <form class="form">
            <label for="input" class="form-label">Choose your fav Pokemon! </label>
            <input type="text" class="input" placeholder="pokemon name or #" required>
            <button type="submit" class="submit-button">Search</button>
        </form>
    </div>
`)

/* ---------- RENDER FUNCTION ---------- */

const renderAttackMoveResults = response => {
    const attackMove = createAttackMoveData(response)
    $('#attack-move').html(attackMove)
}

const renderPokemonResults = response => {    
    const pokemonData = createPokemonData(response);
    $('#page').html(pokemonData)
}

const renderPokemonPage = () => {
    $('#page').html('');
    $('#page').html(pokedexPage);
}

const renderLandingPage = () => {
    $('#attack-move').html('');
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

// const getApiImage = (query, data) => {
//     console.log('fetching poke image')

//     const options = {
//         type: 'GET', 
//         "url": `${query}`,
//         success: image => {
//             renderPokemonResults(data, image)
//             console.log('Success, image')
//         },
//         catch: err => console.log(err)
//     }

//     $.ajax(options)
// }

const getApiData = (query) => {
    console.log('user input:', query)

    const options = {
        type: 'GET', 
        "url": `https://pokeapi.co/api/v2/pokemon/${query}`,
        success: data => {
            console.log('Success, data:', data.sprites.front_default)
            const image = data.sprites.front_default
            // getApiImage(image, data)
            renderPokemonResults(data)
        },
        catch: err => console.log(err)
    }

    $.ajax(options);
}

const getApiAttackMove = query => {
    console.log('getting attack move data')

    const options = {
        type: 'GET',
        "url": `https://pokeapi.co/api/v2/move/${query}`,
        success: data => {
            console.log('attack move info', data)
            renderAttackMoveResults(data);
        },
        catch: err => console.log(err)
    }

    $.ajax(options)
}

/* ---------- EVENT HANDLERS---------- */

const aboutHandler = () => {
    setState({ route: 'landingPage' })
}

const pokedexHandler = () => {
    const randomNumber = Math.floor(Math.random() * 893)
    getApiData(randomNumber);
    setState({ route: 'pokemonPage' });
}

const attackMoveHandler = event => {
    const selected = $(event.target)
    const type = selected.data('type')
    getApiAttackMove(type)
}

const inputHandler = event => {
    event.preventDefault();
    const userInput = $(event.currentTarget).find('.input').val();
    console.log(userInput)
    if (userInput == "") {
        getApiData(userInput);
    } else {
        toastr.warning('Please fill in field with a pokemon or No. from 1 to 893');
    }
}

/* ---------- EVENT LISTENERS ---------- */

$('header').on('click', '#nav-button-about', () => aboutHandler());
$('header').on('click', '#nav-button-pokedex', () => pokedexHandler());
$('body').on('click', '.move-list', event => attackMoveHandler(event));

$('body').on('submit', '.form', event => inputHandler(event));

/* ---------- LOAD PAGE ---------- */
$(render)
