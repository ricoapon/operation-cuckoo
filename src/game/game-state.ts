import deepEqual from "deep-equal"
import { BoardState } from "./board-state"
import { Coordinate, Move, Piece } from "./game-types"
import { reactive } from "vue"

/**
 * Data-class containing the state of an ongoing game.
 */
export class GameState {
    private boardState = BoardState.createInitialBoardState()
    // Needs to be reactive, because otherwise changes in this array doesn't update on the screen.
    private playedMoves: Move[] = reactive([])

    findPossibleMove(piece: Piece, newCoordinate: Coordinate): Move | undefined {
        return this.boardState.getPossibleMoves().find((possibleMove) => 
            deepEqual(possibleMove.piece, piece) && deepEqual(possibleMove.newCoordinate, newCoordinate))
    }

    makeMove(move: Move) {
        this.playedMoves.push(move)
        this.boardState = this.boardState.makeMove(move)
    }

    determinePossibleMovesForPieceOnCoordinate(c: Coordinate): Move[] {
        const playingPieces = (this.isP1Turn()) ? this.getP1Pieces() : this.getP2Pieces()
        const piece = this._getPieceForCoordinate(c, playingPieces)
        if (piece === undefined) {
            return []
        }

        let moves: Move[] = []

        for (let move of this.boardState.getPossibleMoves()) {
            if (deepEqual(move.piece, piece)) {
                moves.push(move)
            }
        }

        return moves
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
    private _getPieceForCoordinate(coordinate: Coordinate, playerPieces: Piece[]): Piece | undefined {
        for (let piece of playerPieces) {
            if (piece.c.q === coordinate.q && piece.c.r === coordinate.r) {
                return piece
            }
        }
        return undefined
    }

    getP1PieceForCoordinate(coordinate: Coordinate): Piece | undefined {
        return this._getPieceForCoordinate(coordinate, this.getP1Pieces())
    }

    getP2PieceForCoordinate(coordinate: Coordinate): Piece | undefined {
        return this._getPieceForCoordinate(coordinate, this.getP2Pieces())
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