import { describe, expect, test } from 'vitest'
import { PieceType } from './game-types'
import { determinePossibleMoves } from './moves'

describe('capture moves', () => {
    test('all forward 1-move captures are found for player 1', () => {
        // Given
        let piece = { type: PieceType.EGG, c: { q: 3, r: 3 } }
        let p1Pieces = [piece]
        let p2Pieces = [
            { type: PieceType.EGG, c: { q: 2, r: 3 } },
            { type: PieceType.EGG, c: { q: 3, r: 4 } },
            { type: PieceType.EGG, c: { q: 4, r: 4 } },
        ]

        // When
        let result = determinePossibleMoves(p1Pieces, p2Pieces, true)

        // Then
        expect(result).toEqual(p2Pieces.map((x) => {
            return { piece, newCoordinate: x.c, isCapture: true }
        }))
    })

    test('all backwards 2-move captures are found for player 1', () => {
        // Given
        let piece = { type: PieceType.CUCKOO, c: { q: 3, r: 3 } }
        let p1Pieces = [piece]
        let p2Pieces = [
            { type: PieceType.EGG, c: { q: 1, r: 1 } },
            { type: PieceType.EGG, c: { q: 3, r: 2 } },
            { type: PieceType.EGG, c: { q: 5, r: 3 } },
        ]

        // When
        let result = determinePossibleMoves(p1Pieces, p2Pieces, true)

        // Then
        expect(result).toEqual(p2Pieces.map((x) => {
            return { piece, newCoordinate: x.c, isCapture: true }
        }))
    })

    test('cannot capture over own pieces with 2-move piece', () => {
        // Given
        let p1Pieces = [
            { type: PieceType.CUCKOO, c: { q: 0, r: 0 } },
            { type: PieceType.EGG, c: { q: 0, r: 1 } },
            { type: PieceType.EGG, c: { q: 1, r: 1 } },
        ]
        let p2Pieces = [
            { type: PieceType.EGG, c: { q: 0, r: 2 } },
            { type: PieceType.EGG, c: { q: 2, r: 2 } },
        ]

        // When
        let result = determinePossibleMoves(p1Pieces, p2Pieces, true)

        // Then
        expect(result.filter((move) => move.piece.type === PieceType.CUCKOO)).toEqual([])
    })
})

describe('non-capture moves', () => {
    test('moves that go off-grid are not returned', () => {
        // Given
        let piece1 = { type: PieceType.EGG, c: { q: 0, r: 0 } }
        let piece2 = { type: PieceType.EGG, c: { q: 6, r: 3 } }
        let p2Pieces = [piece1, piece2]

        // When
        let result = determinePossibleMoves([], p2Pieces, false)

        // Then
        expect(result).toEqual([
            { piece: piece1, newCoordinate: { q: 1, r: 0 }, isCapture: false },
            { piece: piece2, newCoordinate: { q: 5, r: 2 }, isCapture: false },
        ])
    })

    test('cannot move over own piece with 2-move piece', () => {
        // Given
        let p2Pieces = [{ type: PieceType.WARBLER, c: { q: 3, r: 9 } }, 
            { type: PieceType.EGG, c: { q: 2, r: 8 } },
            { type: PieceType.EGG, c: { q: 3, r: 8 } },
            { type: PieceType.EGG, c: { q: 4, r: 9 } },
        ]

        // When
        let result = determinePossibleMoves([], p2Pieces, false)

        // Then
        expect(result.filter((move) => move.piece.type === PieceType.WARBLER)).toEqual([])
    })
})