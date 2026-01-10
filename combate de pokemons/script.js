let pokemon1Data = null;
let pokemon2Data = null;

// Event listeners para Enter
document.getElementById('pokemon1-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarPokemon(1);
});

document.getElementById('pokemon2-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarPokemon(2);
});

async function buscarPokemon(numero) {
    const inputId = `pokemon${numero}-input`;
    const cardId = `pokemon${numero}-card`;
    const contentId = `pokemon${numero}-content`;
    
    const nombre = document.getElementById(inputId).value.toLowerCase().trim();
    
    if (!nombre) {
        alert('Por favor ingresa el nombre de un Pokémon');
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
        
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        
        const data = await response.json();
        
        if (numero === 1) {
            pokemon1Data = data;
        } else {
            pokemon2Data = data;
        }
        
        mostrarPokemon(data, contentId);
        document.getElementById(cardId).classList.add('show');
        
        // Si ambos pokémon están cargados, mostrar comparación
        if (pokemon1Data && pokemon2Data) {
            compararPokemons();
        }
        
    } catch (error) {
        alert('Error: Pokémon no encontrado. Verifica el nombre.');
    }
}

function mostrarPokemon(data, contentId) {
    const stats = data.stats;
    const tipos = data.types.map(type => type.type.name);
    const tipoColor = getTypeColor(tipos[0]);
    const maxStat = getMaxStat(stats);
    const attackStat = stats.find(s => s.stat.name === 'attack');
    
    const html = `
        <div class="pokemon-stage">BÁSICO</div>
        
        <div class="card-header">
            <div class="pokemon-name">${data.name}</div>
            <div class="pokemon-hp">PS ${stats[0].base_stat} ⚡</div>
        </div>
        
        <img class="pokemon-image" src="${data.sprites.front_default}" alt="${data.name}">
        
        <div class="ability-section">
            <div class="ability-label">🔮 Habilidad</div>
            <div class="ability-name">${translateStatName(maxStat.stat.name)}</div>
            <div class="ability-description">
                Una vez durante tu turno, puedes usar la estadística más alta de ${data.name} para obtener ventaja en combate.
            </div>
        </div>
        
        <div class="attacks-section">
            <div class="attack">
                <div class="attack-cost">
                    <div class="energy-icon" style="background: ${tipoColor};">⚡</div>
                </div>
                <div class="attack-header">
                    <div class="attack-name">${translateStatName(maxStat.stat.name)}</div>
                    <div class="attack-damage">${Math.floor(maxStat.base_stat / 2)}</div>
                </div>
                <div class="attack-description">
                    Ataque rápido basado en la mejor estadística de ${data.name}.
                </div>
            </div>
            
            <div class="attack">
                <div class="attack-cost">
                    <div class="energy-icon" style="background: ${tipoColor};">⚡</div>
                    <div class="energy-icon" style="background: ${tipoColor};">⚡</div>
                    <div class="energy-icon" style="background: #999;">✦</div>
                </div>
                <div class="attack-header">
                    <div class="attack-name">Ataque Devastador</div>
                    <div class="attack-damage">${attackStat.base_stat}</div>
                </div>
                <div class="attack-description">
                    Durante el próximo turno de tu rival, este Pokémon no puede atacar.
                </div>
            </div>
        </div>
        
        <div class="card-footer">
            <div class="weakness">Debilidad: ${getWeakness(tipos)} ×2</div>
            <div class="resistance">Resistencia: ${getResistance(tipos)}</div>
            <div class="retreat">Retirada: ⭐⭐</div>
        </div>
    `;
    
    document.getElementById(contentId).innerHTML = html;
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

function getMaxStat(stats) {
    return stats.reduce((max, stat) => stat.base_stat > max.base_stat ? stat : max);
}

function translateStatName(statName) {
    const translations = {
        'hp': 'Vitalidad Suprema',
        'attack': 'Fuerza Brutal',
        'defense': 'Escudo Férreo',
        'special-attack': 'Poder Místico',
        'special-defense': 'Barrera Psíquica',
        'speed': 'Velocidad Luz'
    };
    return translations[statName] || statName;
}

function calcularPuntajeTotal(stats) {
    return stats.reduce((total, stat) => total + stat.base_stat, 0);
}

function compararPokemons() {
    const puntaje1 = calcularPuntajeTotal(pokemon1Data.stats);
    const puntaje2 = calcularPuntajeTotal(pokemon2Data.stats);
    
    let ganador, mensaje;
    
    if (puntaje1 > puntaje2) {
        ganador = pokemon1Data.name;
        mensaje = `🏆 ${pokemon1Data.name.toUpperCase()} GANA!`;
        document.getElementById('pokemon1-card').style.position = 'relative';
        document.getElementById('pokemon1-card').innerHTML += '<div class="winner-indicator">🏆 GANADOR</div>';
    } else if (puntaje2 > puntaje1) {
        ganador = pokemon2Data.name;
        mensaje = `🏆 ${pokemon2Data.name.toUpperCase()} GANA!`;
        document.getElementById('pokemon2-card').style.position = 'relative';
        document.getElementById('pokemon2-card').innerHTML += '<div class="winner-indicator">🏆 GANADOR</div>';
    } else {
        mensaje = '🤝 ¡EMPATE ÉPICO!';
    }
    
    // Mostrar comparación detallada
    const comparacionDetallada = compararEstadisticas();
    
    document.getElementById('winner-announcement').innerHTML = `
        <div style="font-size: 2.2rem; margin-bottom: 25px; color: #d4af37;">${mensaje}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; text-align: left;">
            <div style="background: rgba(255,215,0,0.1); padding: 15px; border-radius: 10px;">
                <h4 style="color: #b8860b; margin-bottom: 10px;">${pokemon1Data.name.toUpperCase()}</h4>
                <p><strong>Puntaje Total:</strong> ${puntaje1}</p>
                <p><strong>Estadísticas ganadas:</strong> ${comparacionDetallada.ganadas1}/6</p>
                <p><strong>Tipo:</strong> ${pokemon1Data.types.map(t => t.type.name).join('/')}</p>
            </div>
            <div style="background: rgba(255,215,0,0.1); padding: 15px; border-radius: 10px;">
                <h4 style="color: #b8860b; margin-bottom: 10px;">${pokemon2Data.name.toUpperCase()}</h4>
                <p><strong>Puntaje Total:</strong> ${puntaje2}</p>
                <p><strong>Estadísticas ganadas:</strong> ${comparacionDetallada.ganadas2}/6</p>
                <p><strong>Tipo:</strong> ${pokemon2Data.types.map(t => t.type.name).join('/')}</p>
            </div>
        </div>
        <div style="margin-top: 20px; background: rgba(0,0,0,0.05); padding: 15px; border-radius: 10px;">
            <h4 style="margin-bottom: 10px; color: #333;">📊 Análisis Detallado:</h4>
            ${comparacionDetallada.detalles}
        </div>
    `;
    
    document.getElementById('comparison').classList.add('show');
}

function compararEstadisticas() {
    let ganadas1 = 0;
    let ganadas2 = 0;
    let detalles = '';
    
    const statNames = ['HP', 'Ataque', 'Defensa', 'At. Especial', 'Def. Especial', 'Velocidad'];
    
    for (let i = 0; i < pokemon1Data.stats.length; i++) {
        const stat1 = pokemon1Data.stats[i];
        const stat2 = pokemon2Data.stats[i];
        const statName = statNames[i];
        
        if (stat1.base_stat > stat2.base_stat) {
            ganadas1++;
            detalles += `<p style="color: #28a745;">✅ ${statName}: <strong>${pokemon1Data.name}</strong> (${stat1.base_stat}) vs ${pokemon2Data.name} (${stat2.base_stat})</p>`;
        } else if (stat2.base_stat > stat1.base_stat) {
            ganadas2++;
            detalles += `<p style="color: #dc3545;">✅ ${statName}: <strong>${pokemon2Data.name}</strong> (${stat2.base_stat}) vs ${pokemon1Data.name} (${stat1.base_stat})</p>`;
        } else {
            detalles += `<p style="color: #6c757d;">🤝 ${statName}: Empate perfecto (${stat1.base_stat})</p>`;
        }
    }
    
    return { ganadas1, ganadas2, detalles };
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
        'fairy': '☠️',
        'fighting': '👻',
        'poison': '🌍',
        'ground': '💧',
        'flying': '⚡',
        'bug': '🔥',
        'rock': '💧',
        'ghost': '👻',
        'steel': '🔥',
        'normal': '⚔️'
    };
    return weaknesses[types[0]] || '❓';
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
        'fairy': '👻',
        'fighting': '🌱',
        'poison': '⚔️',
        'ground': '⚡',
        'flying': '⚔️',
        'bug': '🌱',
        'rock': '🔥',
        'ghost': '—',
        'steel': '🌱',
        'normal': '—'
    };
    return resistances[types[0]] || '—';
}