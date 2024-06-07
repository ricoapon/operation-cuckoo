<script setup lang="ts">
import { Coordinate, Move, PieceType } from '../game/game-types';
import { GameController } from './game-controller';

const props = defineProps<{
    gameController: GameController
}>()

const moves = props.gameController.getMoves()

const dummyMove: Move = {
    piece: { type: PieceType.WARBLER, c: { q: 1, r: 10 } },
    newCoordinate: { q: 1, r: 10 },
    isCapture: false
}

function getIterableTwoMoves(): Move[][] {
    const moves = props.gameController.getMoves()

    if (moves === undefined) {
        return []
    }

    const result = []
    for (let i = 0; i < moves.length; i += 2) {
        const temp = []
        temp.push(moves[i])
        if (i + 1 < moves.length) {
            temp.push(moves[i + 1])
        }
        result.push(temp)
    }

    return result
}

function coordinateAsString(c: Coordinate): string {
    return String.fromCharCode(98 + c.q) + c.r
}

function moveToString(move: Move): string {
    const pieceAsString = move.piece.type as string
    const fromCoordinateAsString = coordinateAsString(move.piece.c)
    const captureAsString = move.isCapture ? "x" : ""
    const toCoordinateAsString = coordinateAsString(move.newCoordinate)

    return pieceAsString + fromCoordinateAsString + captureAsString + toCoordinateAsString
}
</script>

<template>
    <div class="d-block bg-secondary ms-3 rounded-1 border border-secondary">
        <div class="header"  v-on:click="moves.push(dummyMove)">
            Moves
        </div>

        <div v-for="moves in getIterableTwoMoves()" class="d-flex">
            <div class="move px-3 py-1 text-bg-dark flex-fill" >
                {{ moveToString(moves[0]) }}
            </div>
            <div class="move px-3 py-1 bg-dark text-bg-dark flex-fill" v-bind:class="(moves.length == 2) ? '' : 'hidden'">
                {{ moveToString((moves.length == 2) ? moves[1] : dummyMove) }}
            </div>
        </div>

        <!-- Add two hidden moves, so that the width of the bar is always the same. -->
        <div class="d-flex">
            <div class="move px-3 py-1 text-bg-dark hidden">
                {{ moveToString(dummyMove) }}
            </div>
            <div class="move px-3 py-1 text-bg-dark hidden">
                {{ moveToString(dummyMove) }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.hidden {
    visibility: hidden;
}

.move:hover {
    background-color: var(--bs-blue) !important;
    cursor: pointer;
    filter: none !important;
}

.selected {
    background-color: var(--bs-blue) !important;
    filter: brightness(0.50);
}
</style>