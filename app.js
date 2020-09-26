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
    const abilities = results.abilities.length < 1 ? "unknown" : results.abilities.map(object => object.ability.name).join("");
    const species = results.species.name;
    const weight = results.weight;
    
    console.log('IMAGE', image)

    let moveList = [];
    for (let i = 0; i < attacks.length; i++) {
        moveList.push(attacks[i])
    }   

    const moves = moveList[0] === undefined ? "unknown" : moveList.map(move => {
        return (`
            <li data-type=${move} class="move-list"> ${move} </li>        
        `)
    }).join("");

    return (`
            <div class="container-2">
                <p> I choose you <span class="name">${pokemon} !</span> </p>
                <p> Pokemon No. ${pokeNumber} </p>
                <div class="sprite-container">
                    <img class="sprite-image" src="sprites-master/sprites/pokemon/${pokeNumber}.png" alt="pokemon" />
                </div>
                <p> Type: ${type} </p>
                <p> Species: ${species} <p>
                <p> Weight: ${weight} lb</p>
                <ul id="attack-list"> <span class="attack-list">Attacks:</span> ${moves}</ul>
                <ul> Abilities: 
                    <li class="ability-li">${abilities}</li>
                </ul>

            </div>
        </div>`
    )
}

/* ---------- TEMPLATES ---------- */


const landingPageText = (`
    <div class="container-3">
        <p> Welcome to the Pokémon Podédex! <span class="landing-text">Click the Pokédex</span> to learn about over 800 Pokémon! Including their types, species, attacks, etc. You can choose by name, id number, or click the Pokédex for a random Pokémon! </p>
        <div><img src="pokedex.png" alt="pokedex" id="pokedex-image-1"></div>    
    
    </div>
    `)

const pokedexPage = (`
    <div class="container-1">
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
    $('#search').html('');
    $('#attack-move').html('');
    $('#search').html(pokedexPage);
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
//     console.log('sprite URL, fetching image', query)

//     const options = {
//         type: 'GET', 
//         "url": `https://pokeapi.co/api/v2/pokemon-form/${query}`,
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
            // const urlImage = data.sprites.front_default;
            // getApiImage(urlImage, data)
            renderPokemonResults(data)
            // console.log('Sprite data:', data.sprites.front_default)
            console.log('All DATA', data)
        },
        error: err => {
            if(err.status === 404) {
                toastr.error('Pokemon does not exist! Enter No. 1 to 893 or type name');
            }
        }
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
        error: err => console.log(err)
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
    getApiData(userInput);

}

/* ---------- EVENT LISTENERS ---------- */

$('header').on('click', '#nav-button-about', () => aboutHandler());
$('header').on('click', '#nav-button-pokedex', () => pokedexHandler());
$('body').on('click', '#pokedex-image-1', () => pokedexHandler());
$('body').on('click', '.move-list', event => attackMoveHandler(event));

$('body').on('submit', '.form', event => inputHandler(event));

/* ---------- LOAD PAGE ---------- */
$(render)
