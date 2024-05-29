<script setup lang="ts">
import { ref } from "vue"
import { Coordinate } from "../game/game-types"

const emit = defineEmits<{
    clickHexagon: [coordinate: Coordinate]
}>()

defineExpose({
    toggleHighlight
})

export type Translate = {
    c: Coordinate
    x: number
    y: number
}

var strokeWidth = 0.5
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

function onHexagonClick(q: number, r: number) {
    const c: Coordinate = { q, r }
    emit('clickHexagon', c)
}

let highlight = ref<Coordinate>({q: -1, r: -1})
function toggleHighlight(coordinate: Coordinate) {
    const value = highlight.value
    if (value.q === coordinate.q && value.r === coordinate.r) {
        highlight.value = {q: -1, r: -1}
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
        </defs>

        <g class="pod-wrap">
            <template v-for="translate in translatesAllHexagons">
                <use href="#pod" v-bind:transform="'translate(' + translate.x + ',' + translate.y + ')'"
                    v-bind:id="'hexagon_' + translate.c.q + '_' + translate.c.r"
                    v-on:click="onHexagonClick(translate.c.q, translate.c.r)" />

                <text v-if="highlight.q === translate.c.q && highlight.r === translate.c.r" font-size="6px" font-family="monospace"
                    v-bind:transform="'translate(' + (translate.x - 6) + ',' + (translate.y + 2) + ')'">
                    {{ translate.c.q }},{{ translate.c.r }}</text>

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

.pod-wrap use:hover {
    fill: #000000;
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
