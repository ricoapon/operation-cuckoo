import { Move, Piece, PieceType, PlayingState } from "./game-types"
import { determinePieceOnCoordinate, determinePossibleMoves } from "./moves"

/**
 * Immutable data-class representing all the pieces located on the board.
 */
export class GameState {
    // Player 1 has all the pieces on the top of the board (coordinates with x = 0),
    // and player 2 at the bottom of the board (coordinates with x = 8).
    private readonly p1Pieces: Piece[]
    private readonly p2Pieces: Piece[]
    private readonly playingState: PlayingState
    private readonly possibleMoves: Move[]

    static createInitialBoardState(): GameState {
        let p1Pieces = [
            { type: PieceType.WARBLER, c: { q: 1, r: 0 } },
            { type: PieceType.CUCKOO, c: { q: 3, r: 1 } },
            { type: PieceType.WARBLER, c: { q: 5, r: 2 } },
        ]
        for (let i = 0; i < 8; i++) {
            const r0 = Math.ceil(i / 2)
            p1Pieces.push({ type: PieceType.EGG, c: { q: i, r: r0 } })
            p1Pieces.push({ type: PieceType.EGG, c: { q: i, r: r0 + 1 } })
        }

        let p2Pieces = [
            { type: PieceType.WARBLER, c: { q: 1, r: 8 } },
            { type: PieceType.CUCKOO, c: { q: 3, r: 9 } },
            { type: PieceType.WARBLER, c: { q: 5, r: 10 } },
        ]
        for (let i = 0; i < 8; i++) {
            const r0 = Math.ceil(i / 2) + 6
            p2Pieces.push({ type: PieceType.EGG, c: { q: i, r: r0 } })
            p2Pieces.push({ type: PieceType.EGG, c: { q: i, r: r0 + 1 } })
        }

        return new GameState(p1Pieces, p2Pieces, PlayingState.PLAYER_1_MOVES)
    }

    constructor(p1Pieces: Piece[], p2Pieces: Piece[], playingState: PlayingState) {
        this.p1Pieces = structuredClone(p1Pieces)
        this.p2Pieces = structuredClone(p2Pieces)
        this.playingState = playingState
        this.possibleMoves = determinePossibleMoves(p1Pieces, p2Pieces, this.isP1Turn())
    }

    makeMove(move: Move): GameState {
        if (!this.isStillPlaying()) {
            throw new Error('Cannot execute a move, because the game has already ended')
        }
        const givenMove = this.findPossibleMove(move)
        if (givenMove == undefined || this.possibleMoves.indexOf(givenMove) == -1) {
            throw new Error('Cannot execute move (' + move + '), because it is not in the list of possible moves (' + this.possibleMoves + ')')
        }

        let newP1Pieces = structuredClone(this.p1Pieces)
        let newP2Pieces = structuredClone(this.p2Pieces)
        let movingPlayerPieces = (this.isP1Turn()) ? newP1Pieces : newP2Pieces
        let otherPlayerPieces = (this.isP1Turn()) ? newP2Pieces : newP1Pieces

        // Update the existing piece, and if needed delete the captured piece.
        this.getPiece(givenMove.piece, movingPlayerPieces).c = givenMove.newCoordinate
        if (givenMove.isCapture) {
            let capturedPiece = determinePieceOnCoordinate(givenMove.newCoordinate, otherPlayerPieces)
            if (capturedPiece === undefined) {
                throw Error('Could not find piece to capture on coordinate (' + givenMove.newCoordinate + ') in the list of other player pieces (' + otherPlayerPieces + ')')
            }
            otherPlayerPieces.splice(otherPlayerPieces.indexOf(capturedPiece), 1)
        }

        return new GameState(newP1Pieces, newP2Pieces, (this.isP1Turn()) ? PlayingState.PLAYER_2_MOVES : PlayingState.PLAYER_1_MOVES)
    }

    /**
     * We are cloning many objects, so two move objects are probably not equal, but have the same content. This method
     * returns the move from the array possibleMoves that matches the given move.
     */
    private findPossibleMove(move: Move): Move | undefined {
        const moveAsString = JSON.stringify(move)
        for (let possibleMove of this.possibleMoves) {
            if (moveAsString === JSON.stringify(possibleMove)) {
                return possibleMove
            }
        }
        return undefined
    }

    /**
     * Returns true if the game did not end yet.
     */
    isStillPlaying(): boolean {
        return this.playingState === PlayingState.PLAYER_1_MOVES || this.playingState === PlayingState.PLAYER_2_MOVES
    }

    /**
     * Returns true if player 1 should move. If the game has ended, this always returns false.
     */
    isP1Turn(): boolean {
        return this.playingState === PlayingState.PLAYER_1_MOVES;
    }

    getP1Pieces(): Piece[] {
        return structuredClone(this.p1Pieces)
    }

    getP2Pieces(): Piece[] {
        return structuredClone(this.p2Pieces)
    }


    /**
     * Returns the piece object from the array that is the same as the given piece object.
     * Note that objects are cloned, so indexOf does not work. That is why we need this method.
     */
    private getPiece(pieceToFind: Piece, playerPieces: Piece[]) {
        for (let piece of playerPieces) {
            if (piece.type === pieceToFind.type && piece.c.q === pieceToFind.c.q && piece.c.r === pieceToFind.c.r) {
                return piece
            }
        }
        throw Error('Could not find piece (' + pieceToFind + ') in list of pieces (' + playerPieces + ')')
    }
}