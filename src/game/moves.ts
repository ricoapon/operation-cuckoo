import { Coordinate, Move, Piece, PieceType } from "./game-types";
import { Direction } from "./direction";
import deepEqual from "deep-equal";

export function determinePossibleMoves(p1Pieces: Piece[], p2Pieces: Piece[], isP1Turn: boolean): Move[] {
    let movingPlayerPieces = (isP1Turn) ? p1Pieces : p2Pieces

    // If there are any capture moves, we return only the capture moves.
    let captureMoves = movingPlayerPieces.flatMap((piece) => determineAllCaptureMovesForSinglePiece(piece, p1Pieces, p2Pieces, isP1Turn))
    if (captureMoves.length > 0) {
        return captureMoves
    }
    
    // No capture moves, so we return all non-capture moves.
    return movingPlayerPieces.flatMap((piece) => determineAllNonCaptureMovesForSinglePiece(piece, p1Pieces, p2Pieces, isP1Turn))
}

/**
 * Returns a list of all the moves that are a capture.
 */
function determineAllCaptureMovesForSinglePiece(piece: Piece, p1Pieces: Piece[], p2Pieces: Piece[], isP1Turn: boolean): Move[] {
    let captureMoves: Move[] = []

    // We have to check all directions, since we can capture backwards.
    let directions = [Direction.UP_LEFT, Direction.UP, Direction.UP_RIGHT, Direction.DOWN_LEFT, Direction.DOWN, Direction.DOWN_RIGHT]
    let movingPlayerPieces = (isP1Turn) ? p1Pieces : p2Pieces
    let opponentPieces = (isP1Turn) ? p2Pieces : p1Pieces

    // Note that we do not need to check if the coordinate in that direction exists on the board.
    // If it doesn't exist on the board, it will never contain a piece of the opponent.
    for (let direction of directions) {
        let newCoordinate = direction.apply(piece.c)
        let movingPlayerPiece = determinePieceOnCoordinate(newCoordinate, movingPlayerPieces)
        let opponentPiece = determinePieceOnCoordinate(newCoordinate, opponentPieces)

        if (piece.type !== PieceType.EGG && opponentPiece == undefined && movingPlayerPiece == undefined) {
            // This piece can make a step of two moves, and there is no piece in the way.
            // So we can make another step in that direction.
            let newCoordinate2 = direction.apply(newCoordinate)
            let opponentPieceTwoMoves = determinePieceOnCoordinate(newCoordinate2, opponentPieces)
            if (opponentPieceTwoMoves != undefined) {
                captureMoves.push({ piece: piece, newCoordinate: newCoordinate2, isCapture: true })
            }
        } else if (opponentPiece != undefined) {
            captureMoves.push({ piece: piece, newCoordinate: newCoordinate, isCapture: true })
        }
    }

    return captureMoves
}

/**
 * Determines all possible moves for a single piece that do not include a capture.
 */
function determineAllNonCaptureMovesForSinglePiece(piece: Piece, p1Pieces: Piece[], p2Pieces: Piece[], isP1Turn: boolean): Move[] {
    let moves: Move[] = []
    let directions = (isP1Turn) ? [Direction.DOWN_LEFT, Direction.DOWN, Direction.DOWN_RIGHT] :
        [Direction.UP_LEFT, Direction.UP, Direction.UP_RIGHT]
    // Since we exclude any capture, we can treat any piece as a piece that stands in the way.
    let allPieces = p1Pieces.concat(p2Pieces)

    for (let direction of directions) {
        let newCoordinate = direction.apply(piece.c)
        if (isCoordinateOnGrid(newCoordinate) && determinePieceOnCoordinate(newCoordinate, allPieces) === undefined) {
            moves.push({ piece: piece, newCoordinate: newCoordinate, isCapture: false })

            if (piece.type !== PieceType.EGG) {
                let newCoordinate2 = direction.apply(newCoordinate)
                if (isCoordinateOnGrid(newCoordinate2) && determinePieceOnCoordinate(newCoordinate2, allPieces) === undefined) {
                    moves.push({ piece: piece, newCoordinate: newCoordinate2, isCapture: false })
                }
            }
        }
    }

    return moves
}

function isCoordinateOnGrid(coordinate: Coordinate): boolean {
    let q = coordinate.q, r = coordinate.r

    // The q-coordinate looks like the x-axis of a normal grid. So we check this normally.
    if (q < 0 || q > 6) {
        return false
    }

    // We need to check constraints for r, which is different for each column.
    // We can probably construct a formula for this, but this if-tree works fine.
    if (q == 0 && (r < 0 || r > 7)) {
        return false
    } else if (q == 1 && (r < 0 || r > 8)) {
        return false
    } else if (q == 2 && (r < 1 || r > 8)) {
        return false
    } else if (q == 3 && (r < 1 || r > 9)) {
        return false
    } else if (q == 4 && (r < 2 || r > 9)) {
        return false
    } else if (q == 5 && (r < 2 || r > 10)) {
        return false
    } else if (q == 6 && (r < 3 || r > 10)) {
        return false
    }

    return true
}

/**
 * Returns the piece of the given player on given coordinate if it exists.
 */
export function determinePieceOnCoordinate(coordinate: Coordinate, playerPieces: Piece[]): Piece | undefined {
    return playerPieces.find((piece) => deepEqual(piece.c, coordinate))
}
