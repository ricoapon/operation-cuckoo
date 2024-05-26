export type Coordinate = {
    x: number,
    y: number
}

export enum PieceType {
    EGG = 'E',
    WARBLER = 'W',
    CUCKOO = 'C'
}

export type Piece = {
    type: PieceType
    c: Coordinate
}

export type Move = {
    piece: Piece
    newCoordinate: Coordinate
    isCapture: boolean
}

export enum PlayingState {
    PLAYER_1_MOVES,
    PLAYER_2_MOVES,
    PLAYER_1_WON,
    PLAYER_2_WON
}