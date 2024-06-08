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

function moveIdentifier(index: number): string {
    if (index % 2 !== 0) {
        return ''
    }
    return '' + (index / 2) + '.'
}
</script>

<template>
    <div class="move-container d-block bg-secondary rounded-1 border border-secondary overflow-y-auto overflow-x-hidden">
        <div class="text-center border-bottom mb-1 text-white" v-on:click="moves.push(dummyMove)">
            Moves
        </div>

        <div id="c" class="d-flex flex-wrap">
            <span v-for="(move, index) in moves" class="move px-1 me-1 rounded bg-white" v-bind:class="(index == moves.length - 1) ? 'selected' : ''">
                {{ moveIdentifier(index) }}{{ moveToString(move) }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.move-container {
    width: 30%;
}

.move {
    font-size: 12px;
    margin-bottom: 3px;
}

.move:hover {
    background-color: var(--bs-blue) !important;
    cursor: pointer;
    filter: none !important;
    color: var(--bs-white);
}

.selected {
    background-color: var(--bs-blue) !important;
    filter: brightness(0.70);
    color: white;
}
</style>