import { BoardState } from "./board-state"
import { Move, Piece } from "./game-types"

/**
 * Data-class containing the state of an ongoing game.
 */
export class GameState {
    private boardState = BoardState.createInitialBoardState()
    private playedMoves: Move[] = []

    makeMove(move: Move) {
        this.playedMoves.push(move)
        this.boardState = this.boardState.makeMove(move)
    }

    /**
     * Returns true if the game did not end yet.
     */
    isStillPlaying(): boolean {
        return this.boardState.isStillPlaying()
    }

    /**
     * Returns true if player 1 should move. If the game has ended, this always returns false.
     */
    isP1Turn(): boolean {
        return this.boardState.isP1Turn()
    }

    getP1Pieces(): Piece[] {
        return this.boardState.getP1Pieces()
    }

    getP2Pieces(): Piece[] {
        return this.boardState.getP2Pieces()
    }

    getPlayedMoves(): Move[] {
        return this.playedMoves
    }
}