<script lang="ts">
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { Coordinate, Move } from "../game/game-types"
import { Hexagon, Translate, Highlight, HighlightType, createHexagonTranslations, createHexagons } from "./hexagon-translations";
import { IGameController, IGameView } from "./interfaces";

@Component
export class BoardView extends Vue implements IGameView {
    @Prop({ required: true }) gameController!: IGameController;
    readonly strokeWidth = 0.5
    readonly translatesAllHexagons: Translate[] = createHexagonTranslations(this.strokeWidth)
    hexagons: Hexagon[] = []
    highlights: Highlight[] = []

    mounted() {
        this.gameController.setGameView(this)
        this.redraw()
    }

    transition(_: Move) {
        // For now we just redraw. Later on, we need to implement some transition for moves.
        this.redraw()
    }

    redraw() {
        this.hexagons = createHexagons(this.translatesAllHexagons, this.gameController.getGameState(), this.highlights)
    }

    highlightHexagon(c: Coordinate) {
        this.highlights.push({ c, type: HighlightType.HEXAGON })
    }

    highlightPossibleMove(c: Coordinate) {
        // There can be many highlights at the same time, so don't redraw yet.
        this.highlights.push({ c, type: HighlightType.POSSIBLE_MOVE })
    }

    undoAllhighlights() {
        this.highlights = []
        this.redraw()
    }

    onHexagonClick(q: number, r: number) {
        this.gameController.clickHexagon({ q, r })
    }

    // Constants needed for the template.
    readonly HighlightTypeHexagon = HighlightType.HEXAGON
    readonly HighlightTypePossibleMove = HighlightType.POSSIBLE_MOVE
}
export default toNative(BoardView)

</script>

<template>
    <svg viewBox="0 0 110.5 162.25" v-on:focusout="() => { gameController.loseFocus() }" class="rounded-1">
        <defs>
            <g id="hexagon">
                <polygon stroke="var(--bs-gray)" v-bind:stroke-width="strokeWidth" points="5,-9 -5,-9 -10,0 -5,9 5,9 10,0" />
            </g>
            <g id="highlight">
                <polygon stroke="var(--bs-success)" v-bind:stroke-width="2" points="5,-9 -5,-9 -10,0 -5,9 5,9 10,0"
                    transform="scale(0.8)" />
            </g>

            <g id="highlight-move-empty-hex">
                <circle fill="var(--bs-success)" cx="0" cy="0" r="3" />
            </g>

            <g id="highlight-move-filled-hex">
                <polygon stroke="var(--bs-success)" v-bind:stroke-width="2" points="5,-9 -5,-9 -10,0 -5,9 5,9 10,0"
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
                <use v-if="hexagon.highlightType === HighlightTypeHexagon" href="#highlight" font-size="6px"
                    font-family="monospace" v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'" />

                <use v-if="hexagon.highlightType === HighlightTypePossibleMove && hexagon.p1Piece === undefined && hexagon.p2Piece === undefined"
                    href="#highlight-move-empty-hex" font-size="6px" font-family="monospace"
                    v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'" />

                <use v-if="hexagon.p1Piece !== undefined" class="p1" v-bind:href="'#' + hexagon.p1Piece.type"
                    v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'"></use>

                <use v-if="hexagon.p2Piece !== undefined" class="p2" v-bind:href="'#' + hexagon.p2Piece.type"
                    v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'"></use>

                <use v-if="hexagon.highlightType === HighlightTypePossibleMove && (hexagon.p1Piece !== undefined || hexagon.p2Piece !== undefined)"
                    href="#highlight-move-filled-hex" font-size="6px" font-family="monospace"
                    v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'" />

                <!-- Put the hexagon last, since we want the click to register on the entire hexagon. -->
                <use href="#hexagon" v-bind:transform="'translate(' + hexagon.t.x + ',' + hexagon.t.y + ')'"
                    v-bind:id="'hexagon_' + hexagon.t.c.q + '_' + hexagon.t.c.r"
                    v-on:click="onHexagonClick(hexagon.t.c.q, hexagon.t.c.r)" />
            </template>
        </g>
    </svg>
</template>

<style scoped>
use {
    transition: 0.4s;
    cursor: pointer;
    fill: transparent;
}

.p1 {
    fill: var(--bs-blue);
}

.p2 {
    fill: var(--bs-red);
}

svg {
    background-color: var(--bs-dark);
}

svg:focus {
    outline: none;
}
</style>
