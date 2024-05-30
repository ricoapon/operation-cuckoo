<script setup lang="ts">
import { ref, watch } from "vue"
import { Coordinate } from "../game/game-types"
import { Hexagon, Translate, createHexagonTranslations, createHexagons } from "./hexagon-translations";
import { GameState } from "../game/game-state";

const props = defineProps<{
    gameState: GameState,
}>()

const emit = defineEmits<{
    clickHexagon: [coordinate: Coordinate]
}>()

defineExpose({
    toggleHighlight
})

const strokeWidth = 0.5
const translatesAllHexagons: Translate[] = createHexagonTranslations(strokeWidth)

let hexagons: Hexagon[] = createHexagons(translatesAllHexagons, props.gameState)
watch(() => props.gameState, (selection, prevSelection) => {
    createHexagons(translatesAllHexagons, selection)
})

function onHexagonClick(q: number, r: number) {
    const c: Coordinate = { q, r }
    emit('clickHexagon', c)
}

// TODO: include highlight into the hexagon type. And also recalculate hexagons.
let highlight = ref<Coordinate>({ q: -1, r: -1 })
function toggleHighlight(coordinate: Coordinate) {
    const value = highlight.value
    if (value.q === coordinate.q && value.r === coordinate.r) {
        highlight.value = { q: -1, r: -1 }
    } else {
        highlight.value = coordinate
    }
}

</script>

<template>
    <svg viewBox="0 0 110.5 162.25" v-on:focusout="console.log('losing focus')">
        <defs>
            <g id="pod">
                <polygon stroke="#000000" v-bind:stroke-width="strokeWidth" points="5,-9 -5,-9 -10,0 -5,9 5,9 10,0" />
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
                <use href="#pod" v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'"
                    v-bind:id="'hexagon_' + hexagon.t.c.q + '_' + hexagon.t.c.r"
                    v-on:click="onHexagonClick(hexagon.t.c.q, hexagon.t.c.r)" />

                <text v-if="highlight.q === hexagon.t.c.q && highlight.r === hexagon.t.c.r" font-size="6px"
                    font-family="monospace"
                    v-bind:transform="'translate(' + (hexagon.t.x - 6) + ',' + (hexagon.t.y + 2) + ')'">
                    {{ hexagon.t.c.q }},{{ hexagon.t.c.r }}</text>

                <use v-if="hexagon.p1Piece !== undefined" class="p1" v-bind:href="'#' + hexagon.p1Piece.type"
                    v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'"></use>

                <use v-if="hexagon.p2Piece !== undefined" class="p2" v-bind:href="'#' + hexagon.p2Piece.type"
                    v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'"></use>
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
