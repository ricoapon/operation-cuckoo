<script setup lang="ts">
import { ref } from "vue"
import { Coordinate } from "../game/game-types"
import { Translate, createHexagonTranslations } from "./hexagon-translations";

const emit = defineEmits<{
    clickHexagon: [coordinate: Coordinate]
}>()

defineExpose({
    toggleHighlight
})

const strokeWidth = 0.5
var translatesAllHexagons: Translate[] = createHexagonTranslations(strokeWidth)

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
