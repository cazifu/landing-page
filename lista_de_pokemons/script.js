window.addEventListener('load', cargarTodosLosPokemon);

async function cargarTodosLosPokemon() {
    const grid = document.getElementById('pokemon-grid');
    const loading = document.getElementById('loading');
    
    try {
        // Cargar los primeros 151 Pokémon (Kanto) + algunos más populares
        const totalPokemon = 200;
        
        for (let i = 1; i <= totalPokemon; i++) {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                const pokemon = await response.json();
                
                const card = crearTarjetaPokemon(pokemon);
                grid.appendChild(card);
                
                // Actualizar contador cada 10 pokémon
                if (i % 10 === 0) {
                    loading.textContent = `Cargando Pokémon... ${i}/${totalPokemon}`;
                }
                
            } catch (error) {
                console.error(`Error cargando Pokémon ${i}:`, error);
            }
        }
        
        loading.style.display = 'none';
        
    } catch (error) {
        console.error('Error general:', error);
        loading.textContent = 'Error al cargar los Pokémon';
    }
}

function crearTarjetaPokemon(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    
    const tipos = pokemon.types.map(type => type.type.name);
    const stats = pokemon.stats;
    
    card.innerHTML = `
        <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
        <div class="pokemon-name">${pokemon.name}</div>
        <img class="pokemon-image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        
        <div class="pokemon-types">
            ${tipos.map(tipo => `
                <span class="type-badge" style="background: ${getTypeColor(tipo)}">${tipo}</span>
            `).join('')}
        </div>
        
        <div class="pokemon-stats">
            <div class="stat">
                <span>HP</span>
                <span>${stats[0].base_stat}</span>
            </div>
            <div class="stat">
                <span>Ataque</span>
                <span>${stats[1].base_stat}</span>
            </div>
            <div class="stat">
                <span>Defensa</span>
                <span>${stats[2].base_stat}</span>
            </div>
            <div class="stat">
                <span>Velocidad</span>
                <span>${stats[5].base_stat}</span>
            </div>
            <div class="stat">
                <span>Altura</span>
                <span>${(pokemon.height / 10).toFixed(1)}m</span>
            </div>
            <div class="stat">
                <span>Peso</span>
                <span>${(pokemon.weight / 10).toFixed(1)}kg</span>
            </div>
        </div>
    `;
    
    return card;
}

function getTypeColor(type) {
    const colors = {
        'fire': '#ff6b6b',
        'water': '#4ecdc4',
        'grass': '#6bcf7f',
        'electric': '#ffd93d',
        'psychic': '#ff8c42',
        'ice': '#74c0fc',
        'dragon': '#9c88ff',
        'dark': '#495057',
        'fairy': '#ffc9c9',
        'fighting': '#d63031',
        'poison': '#a29bfe',
        'ground': '#fdcb6e',
        'flying': '#74b9ff',
        'bug': '#6c5ce7',
        'rock': '#636e72',
        'ghost': '#2d3436',
        'steel': '#b2bec3',
        'normal': '#ddd'
    };
    return colors[type] || '#999';
}