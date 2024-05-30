<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Coordinate, Move } from "../game/game-types"
import { Hexagon, Translate, createHexagonTranslations, createHexagons } from "./hexagon-translations";
import { IGameController } from "./interfaces";
import deepEqual from "deep-equal";

const props = defineProps<{
    gameController: IGameController,
}>()

const strokeWidth = 0.5
const translatesAllHexagons: Translate[] = createHexagonTranslations(strokeWidth)

let hexagons = ref<Hexagon[]>([])
onMounted(() => {
    redraw()
})

defineExpose({
    transition,
    redraw,
    highlightHexagon,
    undoAllhighlights
})

function transition(move: Move) {
    // For now we just redraw. Later on, we need to implement some transition for moves.
    redraw()
}

function redraw() {
    hexagons.value = createHexagons(translatesAllHexagons, props.gameController.getGameState())
}

let highlight = ref<Coordinate | null>(null)
function highlightHexagon(c: Coordinate) {
    highlight.value = c
}

function undoAllhighlights() {
    highlight.value = null
}

function onHexagonClick(q: number, r: number) {
    props.gameController.clickHexagon({ q, r })
}

</script>

<template>
    <svg viewBox="0 0 110.5 162.25" v-on:focusout="() => { props.gameController.loseFocus() }">
        <defs>
            <g id="hexagon">
                <polygon stroke="#000000" v-bind:stroke-width="strokeWidth" points="5,-9 -5,-9 -10,0 -5,9 5,9 10,0" />
            </g>
            <g id="highlight">
                <polygon stroke="yellow" v-bind:stroke-width="2" points="5,-9 -5,-9 -10,0 -5,9 5,9 10,0"
                    transform="scale(0.8)" />
            </g>
            <!-- EGG -->
            <g id="E">
                <ellipse cx="0" cy="0" rx="4" ry="6"></ellipse>
            </g>
            <!-- WARBLER -->
            <g id="W">
                <polygon points="0,-5 5,4 -5,4"></polygon>
            </g>
            <!-- CUCKOO -->
            <g id="C">
                <polygon points="0,0 0,10 10,10 10,0" transform="translate(-5, -5)"></polygon>
            </g>
        </defs>

        <g class="pod-wrap">
            <template v-for="hexagon in hexagons">
                <use v-if="deepEqual(highlight, hexagon.t.c)" href="#highlight" font-size="6px" font-family="monospace"
                    v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'" />

                <use v-if="hexagon.p1Piece !== undefined" class="p1" v-bind:href="'#' + hexagon.p1Piece.type"
                    v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'"></use>

                <use v-if="hexagon.p2Piece !== undefined" class="p2" v-bind:href="'#' + hexagon.p2Piece.type"
                    v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'"></use>

                <!-- Put the hexagon last, since we want the click to register on the entire hexagon. -->
                <use href="#hexagon" v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'"
                    v-bind:id="'hexagon_' + hexagon.t.c.q + '_' + hexagon.t.c.r"
                    v-on:click="onHexagonClick(hexagon.t.c.q, hexagon.t.c.r)" />

            </template>
        </g>
    </svg>
</template>

<style scoped>
/* grid styling */
use {
    transition: 0.4s;
    cursor: pointer;
    fill: transparent;
}

.p1 {
    fill: #007bff
}

.p2 {
    fill: #dc3545
}


/* other styling */
svg {
    width: 400px;
    flex: 1;
    background-color: white;
}

svg:focus {
    outline: none;
}
</style>
