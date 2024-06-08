<script setup lang="ts">
import { Ref, onMounted, ref } from "vue"
import BoardView from './BoardView.vue'
import MoveView from './MovesView.vue'
import { GameController } from "./game-controller"
import { IGameView } from "./interfaces"
import { GameState } from "../game/game-state";

const gameController = new GameController(new GameState())
const boardView: Ref<typeof BoardView | null> = ref(null)

onMounted(() => {
    if (boardView.value !== null) {
        gameController.setGameView((boardView.value as unknown) as IGameView)
    }
})

</script>

<template>
    <div class="d-flex gap-2 square">
        <BoardView ref="boardView" v-bind:game-controller="gameController" />
        <MoveView v-bind:game-controller="gameController" />
    </div>
</template>

<style scoped>
.square {
    height: min(80vb, 80vi);
    width: min(80vb, 80vi);
    margin: 0 auto;
}
</style>
