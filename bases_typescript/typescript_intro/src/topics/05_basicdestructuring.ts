interface AudioPlayer {
    audioVolume: number;
    songDuration: number;
    song: string;
    details: Details;
}

interface Details {
    author: string;
    year: number;
}

const audioPlayer: AudioPlayer = {
    audioVolume: 90,
    songDuration: 36,
    song: "Mess",
    details: {
        author: "Skrillex",
        year: 2020
    }
}

// Desestructuracion consiste poder tomar ciertos parametros de un objeto

/*
En vez de hacer esto 

console.log('Song: ' + audioPlayer.song);
console.log('Duration: ' + audioPlayer.songDuration);
console.log('Author: ' + audioPlayer.details.author);

Se puede hacer lo siguiente
*/

// Para desestructurar un objeto dentro de un objeto se puede hacer con llaves
const { song: anotherSong, songDuration: duration, details: { author } } = audioPlayer;

console.log(anotherSong, duration, author);



// Desestructuracion de arrays

const [, , trunks = 'Not found']: string[] = ['Goku', 'Vegeta', 'Trunks'];

console.log(trunks);

export { };