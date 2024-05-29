import { describe, expect, test } from 'vitest'
import { PieceType, PlayingState } from './game-types'
import { GameState } from './game-state'

describe('GameState is immutable', () => {
    // Given for each test.
    const p1Pieces = [{ type: PieceType.CUCKOO, c: { q: 3, r: 1 } }]
    const p2Pieces = [{ type: PieceType.CUCKOO, c: { q: 3, r: 9 } }]
    const gameState = new GameState(p1Pieces, p2Pieces, PlayingState.PLAYER_1_MOVES)

    function expectBoardToNotBeModified() {
        expect(gameState.getP1Pieces()).toEqual([{ type: PieceType.CUCKOO, c: { q: 3, r: 1 } }])
        expect(gameState.getP2Pieces()).toEqual([{ type: PieceType.CUCKOO, c: { q: 3, r: 9 } }])
    }

    test('construtor variables are immutable', () => {
        p1Pieces[0].type = PieceType.WARBLER
        p1Pieces.push({ type: PieceType.WARBLER, c: { q: 1, r: 0 } })
        p2Pieces[0].type = PieceType.WARBLER
        p2Pieces.push({ type: PieceType.WARBLER, c: { q: 1, r: 8 } })

        expectBoardToNotBeModified()
    })

    test('getter return values are immutable', () => {
        gameState.getP1Pieces().push({ type: PieceType.WARBLER, c: { q: 1, r: 0 } })
        gameState.getP1Pieces()[0].c = { q: 10, r: 10 }
        gameState.getP2Pieces().push({ type: PieceType.WARBLER, c: { q: 1, r: 8 } })
        gameState.getP2Pieces()[0].c = { q: 10, r: 10 }

        expectBoardToNotBeModified()
    })
})

describe('movement', () => {
    test('throw error if move is not allowed', () => {
        // Given
        const p1Pieces = [{ type: PieceType.CUCKOO, c: { q: 3, r: 1 } }]
        const p2Pieces = [{ type: PieceType.CUCKOO, c: { q: 3, r: 9 } }]
        const gameState = new GameState(p1Pieces, p2Pieces, PlayingState.PLAYER_1_MOVES)

        // When and then
        expect(() => gameState.makeMove({
            piece: p1Pieces[0],
            newCoordinate: { q: 6, r: 10 },
            isCapture: false
        })).toThrowError()
    })

    test('throw error if capture move does not land on an opponent piece', () => {
        // Given
        const p1Pieces = [{ type: PieceType.CUCKOO, c: { q: 3, r: 1 } }]
        const p2Pieces = [{ type: PieceType.CUCKOO, c: { q: 3, r: 9 } }]
        const gameState = new GameState(p1Pieces, p2Pieces, PlayingState.PLAYER_1_MOVES)

        // When and then
        expect(() => gameState.makeMove({
            piece: p1Pieces[0],
            newCoordinate: { q: 3, r: 3 },
            isCapture: true
        })).toThrowError()
    })

    test('throw error if wrong player plays a move', () => {
        // Given
        const p1Pieces = [{ type: PieceType.CUCKOO, c: { q: 3, r: 1 } }]
        const p2Pieces = [{ type: PieceType.CUCKOO, c: { q: 3, r: 9 } }]
        const gameState = new GameState(p1Pieces, p2Pieces, PlayingState.PLAYER_2_MOVES)

        // When and then
        expect(() => gameState.makeMove({
            piece: p1Pieces[0],
            newCoordinate: { q: 5, r: 3 },
            isCapture: false
        })).toThrowError()
    })

    test('move works', () => {
        // Given
        const p1Piece = { type: PieceType.CUCKOO, c: { q: 3, r: 1 } }
        const p2Pieces = [{ type: PieceType.CUCKOO, c: { q: 3, r: 9 } }]
        const gameState = new GameState([p1Piece], p2Pieces, PlayingState.PLAYER_1_MOVES)

        // When
        const result = gameState.makeMove({
            piece: p1Piece,
            newCoordinate: { q: 5, r: 3 },
            isCapture: false
        })

        // Then
        expect(result.getP2Pieces()).toEqual(p2Pieces)
        expect(result.getP1Pieces()).toEqual([
            { type: PieceType.CUCKOO, c: { q: 5, r: 3 } }
        ])
    })

    test('capture works', () => {
        // Given
        const p1Pieces = [
            { type: PieceType.CUCKOO, c: { q: 3, r: 1 } },
            { type: PieceType.EGG, c: { q: 2, r: 4 } },
        ]
        const p2Pieces = [
            { type: PieceType.CUCKOO, c: { q: 3, r: 9 } },
            { type: PieceType.EGG, c: { q: 2, r: 5 } },
        ]
        const gameState = new GameState(p1Pieces, p2Pieces, PlayingState.PLAYER_2_MOVES)

        // When
        const result = gameState.makeMove({
            piece: p2Pieces[1],
            newCoordinate: { q: 2, r: 4 },
            isCapture: true
        })

        // Then
        expect(result.getP2Pieces()).toEqual([
            { type: PieceType.CUCKOO, c: { q: 3, r: 9 } },
            { type: PieceType.EGG, c: { q: 2, r: 4 } },
        ])
        expect(result.getP1Pieces()).toEqual([p1Pieces[0]])
    })
})
