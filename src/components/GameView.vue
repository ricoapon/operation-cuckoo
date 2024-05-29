<script setup lang="ts">
import { Ref, ref } from "vue"
import { GameState } from "../game/game-state";
import BoardView from './BoardView.vue'
import { Coordinate } from "../game/game-types";

const props = defineProps<{
    gameState: GameState
}>()

const boardView: Ref<typeof BoardView | null> = ref(null)

const clicked = ref<number[]>([])
function onHexagonClick(c: Coordinate) {
    clicked.value = [c.q, c.r]
    boardView.value!.toggleHighlight(c)
}
</script>

<template>
    <BoardView ref="boardView" v-bind:game-state="props.gameState" @clickHexagon="onHexagonClick" />
</template>
