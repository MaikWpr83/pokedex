//creating the background color of the respective Pokemon type
function getBackgroundColor(species1, species2){
    let speciesArray = [species1, species2];

    for (let i = 0; i < speciesArray.length; i++){
        switch (speciesArray[i]){
            case 'grass':
                return 'rgb(89, 229, 79)';
            case 'fire':
                return 'rgb(255, 128, 0)';
            case 'water':
                return 'rgb(0, 130, 255';
            case 'bug':
                return 'rgb(204, 102, 0)';
            case 'normal':
                return 'rgb(128, 97, 160)';
            case 'poison':
                return 'rgb(4, 255, 147)';
            case 'electric':
                return 'rgb(240, 240, 24)';
            case 'ground':
                return 'rgb(145, 145, 138)';
            case 'fairy':
                return 'rgb(196, 35, 196)';
            case 'fighting':
                return 'rgb(175, 63, 69';
            case 'psychic':
                return 'rgb(147, 221, 247)';
            case 'rock':
                return 'rgb(179, 171, 171)';
            case 'flying':
                return 'rgb(6, 195, 201) ';
        }
    }
    return '';
}

