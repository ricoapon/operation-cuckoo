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
    <div id="move-container" class="d-block bg-secondary ms-3 rounded-1 border border-secondary">
        <div class="text-center border-bottom mb-1 text-white" v-on:click="moves.push(dummyMove)">
            Moves
        </div>

        <table>
            <tr>
                <td v-for="(move, index) in moves">
                    <div class="item move px-1 rounded" v-bind:class="(index == moves.length - 1) ? 'selected' : ''">
                        {{ moveIdentifier(index) }}{{ moveToString(move) }}
                    </div>
                </td>
            </tr>
        </table>


        <div id="c" class="flex flex-wrap">
            <span class="move p-1 rounded" v-for="(move, index) in moves">{{ moveIdentifier(index) }}{{
                moveToString(move) }}</span>
        </div>
    </div>
</template>

<style scoped>

table {
    display: block;
    width: 100%;
    max-width: 400px;
}

table td {
    display: inline-block;
}

.item {
    background: white;
    display: inline-block;
}

#move-container {
    width: 15vw;
}

.move:hover {
    background-color: var(--bs-blue) !important;
    cursor: pointer;
    filter: none !important;
    color: white;
}

.selected {
    background-color: var(--bs-blue) !important;
    filter: brightness(0.70);
    color: white;
}
</style>