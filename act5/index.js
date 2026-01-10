document.getElementById('boton').addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value.toLowerCase().trim();
    
    if (!nombre) {
        showError('Por favor ingresa el nombre de un Pokémon');
        return;
    }
    
    showLoading();
    BuscarPKM(nombre);
});

document.getElementById('nombre').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('boton').click();
    }
});

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('carta').classList.remove('show');
}

function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('error').textContent = message;
    document.getElementById('carta').classList.remove('show');
}

function showPokemon() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('carta').classList.add('show');
}

function clearPokemonData() {
    document.getElementById('encabezado').innerHTML = '';
    document.getElementById('imagen').innerHTML = '';
    document.getElementById('datos').innerHTML = '';
    document.getElementById('stats').innerHTML = '';
}

function BuscarPKM(nombre) {
    clearPokemonData();
    
    fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            return response.json();
        })
        .then(datos => {
            // Header de la tarjeta (nombre y HP)
            const cardHeader = document.createElement('div');
            cardHeader.className = 'pokemon-card-header';
            
            const pokemonName = document.createElement('div');
            pokemonName.className = 'pokemon-name';
            pokemonName.textContent = datos.name;
            
            const pokemonHP = document.createElement('div');
            pokemonHP.className = 'pokemon-hp';
            pokemonHP.innerHTML = `PS ${datos.stats[0].base_stat} ⚡`;
            
            cardHeader.appendChild(pokemonName);
            cardHeader.appendChild(pokemonHP);
            document.getElementById('encabezado').appendChild(cardHeader);

            // Imagen del Pokémon
            const imagen = document.createElement('img');
            imagen.className = 'pokemon-image';
            imagen.src = datos.sprites.front_default || datos.sprites.front_shiny;
            imagen.alt = datos.name;
            document.getElementById('imagen').appendChild(imagen);

            // Línea de información (como en las cartas TCG)
            const infoLine = document.createElement('div');
            infoLine.className = 'pokemon-info-line';
            const tipos = datos.types.map(type => type.type.name).join(', ');
            infoLine.textContent = `N.° ${datos.id.toString().padStart(4, '0')} Pokémon ${tipos} Altura: ${(datos.height / 10).toFixed(1)} m Peso: ${(datos.weight / 10).toFixed(1)} kg`;
            document.getElementById('datos').appendChild(infoLine);

            // Ataques (simulando movimientos de TCG)
            const attacksContainer = document.createElement('div');
            attacksContainer.className = 'pokemon-attacks';
            
            // Primer ataque basado en la estadística más alta
            const maxStat = datos.stats.reduce((max, stat) => stat.base_stat > max.base_stat ? stat : max);
            const attack1 = document.createElement('div');
            attack1.className = 'attack';
            attack1.innerHTML = `
                <div class="attack-name">⚡ ${translateStatName(maxStat.stat.name)}</div>
                <div class="attack-damage">${Math.floor(maxStat.base_stat / 2)}</div>
                <div class="attack-description">Ataque basado en la estadística más alta de ${datos.name}.</div>
            `;
            attacksContainer.appendChild(attack1);

            // Segundo ataque basado en el ataque
            const attackStat = datos.stats.find(stat => stat.stat.name === 'attack');
            const attack2 = document.createElement('div');
            attack2.className = 'attack';
            attack2.innerHTML = `
                <div class="attack-name">⚡⚡ Ataque Especial</div>
                <div class="attack-damage">${attackStat.base_stat}</div>
                <div class="attack-description">Lanza un poderoso ataque que puede causar daño considerable al oponente.</div>
            `;
            attacksContainer.appendChild(attack2);

            document.getElementById('stats').appendChild(attacksContainer);

            // Footer de la tarjeta
            const footer = document.createElement('div');
            footer.className = 'pokemon-footer';
            footer.innerHTML = `
                <span>Debilidad: ${getWeakness(datos.types)} ×2</span>
                <span>Resistencia: ${getResistance(datos.types)}</span>
                <span>Retirada: ⭐</span>
            `;
            document.getElementById('carta').appendChild(footer);

            showPokemon();
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Pokémon no encontrado. Verifica el nombre e intenta nuevamente.');
        });
}

function translateStatName(statName) {
    const translations = {
        'hp': 'Vitalidad',
        'attack': 'Fuerza',
        'defense': 'Defensa',
        'special-attack': 'Ataque Esp.',
        'special-defense': 'Defensa Esp.',
        'speed': 'Velocidad'
    };
    return translations[statName] || statName;
}

function getWeakness(types) {
    const weaknesses = {
        'fire': '💧',
        'water': '⚡',
        'grass': '🔥',
        'electric': '🌍',
        'psychic': '👻',
        'ice': '🔥',
        'dragon': '❄️',
        'dark': '✨',
        'fairy': '☠️'
    };
    return weaknesses[types[0].type.name] || '❓';
}

function getResistance(types) {
    const resistances = {
        'fire': '🌱',
        'water': '🔥',
        'grass': '💧',
        'electric': '✈️',
        'psychic': '⚔️',
        'ice': '💧',
        'dragon': '🔥',
        'dark': '⚔️',
        'fairy': '👻'
    };
    return resistances[types[0].type.name] || '—';
}