import deepEqual from "deep-equal"
import { BoardState } from "./board-state"
import { Coordinate, Move, Piece } from "./game-types"

/**
 * Data-class containing the state of an ongoing game.
 */
export class GameState {
    private boardState = BoardState.createInitialBoardState()
    private playedMoves: Move[] = []

    findPossibleMove(piece: Piece, newCoordinate: Coordinate): Move | undefined {
        return this.boardState.getPossibleMoves().find((possibleMove) => 
            deepEqual(possibleMove.piece, piece) && deepEqual(possibleMove.newCoordinate, newCoordinate))
    }

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

    /**
     * Returns the piece object from the array that is the same as the given piece object.
     * Note that objects are cloned, so indexOf does not work. That is why we need this method.
     */
    private _getP1PieceForCoordinate(coordinate: Coordinate, playerPieces: Piece[]): Piece | undefined {
        for (let piece of playerPieces) {
            if (piece.c.q === coordinate.q && piece.c.r === coordinate.r) {
                return piece
            }
        }
        return undefined
    }

    getP1PieceForCoordinate(coordinate: Coordinate): Piece | undefined {
        return this._getP1PieceForCoordinate(coordinate, this.getP1Pieces())
    }

    getP2PieceForCoordinate(coordinate: Coordinate): Piece | undefined {
        return this._getP1PieceForCoordinate(coordinate, this.getP2Pieces())
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