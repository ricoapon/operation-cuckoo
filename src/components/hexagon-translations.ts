import deepEqual from "deep-equal"
import { GameState } from "../game/game-state"
import { Coordinate, Piece } from "../game/game-types"

export type Hexagon = {
    t: Translate
    p1Piece: Piece | undefined
    p2Piece: Piece | undefined
    highlightType: HighlightType | undefined
}

export type Translate = {
    c: Coordinate
    x: number
    y: number
}

export type Highlight = {
    c: Coordinate,
    type: HighlightType
}

export enum HighlightType {
    HEXAGON,
    POSSIBLE_MOVE
}

export function createHexagons(translatesAllHexagons: Translate[], gameState: GameState, highlights: Highlight[]): Hexagon[] {
    let hexagons = []
    for (let translate of translatesAllHexagons) {
        const highlight = highlights?.find((highlight) => deepEqual(highlight.c, translate.c))
        hexagons.push({
            t: translate,
            p1Piece: gameState.getP1PieceForCoordinate(translate.c),
            p2Piece: gameState.getP2PieceForCoordinate(translate.c),
            highlightType: highlight !== undefined ? highlight.type : undefined
        })
    }
    return hexagons
}

export function createHexagonTranslations(strokeWidth: number): Translate[] {
    var x0 = 10 + (strokeWidth / 2)
    var y0_bottom = 18 + (strokeWidth / 2)
    var y0_top = 9 + (strokeWidth / 2)

    // Translate X by this amount, and the hexagon will be in the next row.
    // Note that you still have to adjust Y, since the next hexagon is slightly up or down as well.
    var dX_right = 15
    // If you translate Y by this, you get the next hexagon below it.
    var dY_downwards = 18

    // This list contains the top hexagons. From these we can translate them downwards to get the entire row.
    var startingHexagons = []
    for (let i = 0; i < 7; i++) {
        startingHexagons.push({
            x: x0 + i * dX_right,
            y: (i % 2 == 0) ? y0_bottom : y0_top
        })
    }

    // The list of all translates to get all hexagons.
    var translatesAllHexagons: Translate[] = []

    for (let i = 0; i < startingHexagons.length; i++) {
        var translate0 = startingHexagons[i]
        var nrOfHexagonsToDraw = (i % 2 == 0) ? 8 : 9

        for (var j = 0; j < nrOfHexagonsToDraw; j++) {
            translatesAllHexagons.push({
                c: { q: i, r: j + Math.floor(i / 2) },
                x: translate0.x,
                y: translate0.y + j * dY_downwards
            })
        }
    }

    return translatesAllHexagons
}

