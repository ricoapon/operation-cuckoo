import { GameState } from "../game/game-state.ts";
import { Coordinate, Move, Piece } from "../game/game-types.ts";
import { IGameController, IGameView } from "./interfaces.ts";

export class GameController implements IGameController {
    private readonly gameState: GameState
    private gameView: IGameView | undefined;
    private highlightedCoordinate: Coordinate | undefined

    getMoves(): Move[] {
        return this.gameState.getPlayedMoves()
    }
    
    constructor(gameState: GameState) {
        this.gameState = gameState
    }

    setGameView(gameView: IGameView): void {
        this.gameView = gameView;
    }

    private highlightPieceIfItHasPossibleMoves(c: Coordinate) {
        // We only want to highlight hexagons if we selected a piece with possible moves.
        const moves = this.gameState.determinePossibleMovesForPieceOnCoordinate(c)
        if (moves.length === 0) {
            return
        }

        this.gameView!.highlightHexagon(c)
        this.highlightedCoordinate = c

        for (let possibleMove of moves) {
            this.gameView!.highlightPossibleMove(possibleMove.newCoordinate)
        }

        this.gameView!.redraw()
    }

    clickHexagon(c: Coordinate): void {
        if (this.highlightedCoordinate === undefined) {
            this.highlightPieceIfItHasPossibleMoves(c)
            return
        }

        // No matter the result, we always undo highlights.
        this.gameView!.undoAllhighlights()
        const oldC = this.highlightedCoordinate
        this.highlightedCoordinate = undefined

        // We clicked from one square to another. Check if we can make this into a move.
        let piece: Piece | undefined = (this.gameState.isP1Turn()) ? this.gameState.getP1PieceForCoordinate(oldC) :
            this.gameState.getP2PieceForCoordinate(oldC)

        // If we did not find a piece on the square of the player that needs to make a move, we don't do anything.
        if (piece === undefined) {
            return
        }

        // We found a piece, so we can try to make a move.
        const move: Move | undefined = this.gameState.findPossibleMove(piece, c)
        if (move === undefined) {
            // The move is not possible, but we found a piece. Try to highlight for this piece.
            this.highlightPieceIfItHasPossibleMoves(c)
            return
        }

        this.gameState.makeMove(move)
        this.gameView!.transition(move)
    }

    loseFocus(): void {
        this.gameView!.undoAllhighlights()
        this.highlightedCoordinate = undefined
    }

    getGameState(): GameState {
        return this.gameState
    }
}