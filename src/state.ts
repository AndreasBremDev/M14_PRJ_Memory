export const gameState = { selectedPlayer: 1 };
interface PlayerUpdate {
    idRef: string;
    htmlIdRef: string[];
    htmlIdImgRef: string[];
}
export let playerUpdates: PlayerUpdate[] = [
    {
        idRef: '1',
        htmlIdRef: ['gamePlayer1Count', 'gameEndPlayer1Count', 'winPlayer1Count', 'losePlayer1Count'],
        htmlIdImgRef: ['gameImgPlayer1', 'gameEndImgPlayer1', 'winImgPlayer1', 'loseImgPlayer1']
    },
    {
        idRef: '2',
        htmlIdRef: ['gamePlayer2Count', 'gameEndPlayer2Count', 'winPlayer2Count', 'losePlayer2Count'],
        htmlIdImgRef: ['gameImgPlayer2', 'gameEndImgPlayer2', 'winImgPlayer2', 'loseImgPlayer2']
    }
]
export let startSectionText: string[] = ['Theme', 'Player', 'Board size']