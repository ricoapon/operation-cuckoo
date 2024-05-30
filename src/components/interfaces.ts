import { GameState } from "../game/game-state";
import { Coordinate, Move } from "../game/game-types";

export interface IGameView {
    /**
     * Show a move on the board.
     */
    transition(move: Move): void
    /**
     * Erase the previous state, and show the current state.
     */
    redraw(): void
    /**
     * Highlight given coordinate.
     */
    highlightHexagon(c: Coordinate): void
    /**
     * Undo all highlights.
     */
    undoAllhighlights(): void
}

export interface IGameController {
    setGameView(gameView: IGameView): void
    /**
     * If a hexagon was not already highlighted, highlight the coordinate.
     * If a previous hexagon was already highlighted, try to make a move from the highlighted
     * hexagon to the currently clicked hexagon. Always un-highlight all squares.
     */
    clickHexagon(c: Coordinate): void
    /**
     * Undo all highlights.
     */
    loseFocus(): void
    getGameState(): GameState
}