import { expect, test } from 'vitest'
import { Direction } from './direction'

// This coordinate is the center of the board.
const c = { q: 3, r: 5 }

test('UP', () => {
    expect(Direction.UP.apply(c)).toEqual({ q: 3, r: 4 })
})
test('UP_LEFT', () => {
    expect(Direction.UP_LEFT.apply(c)).toEqual({ q: 2, r: 4 })
})
test('UP_RIGHT', () => {
    expect(Direction.UP_RIGHT.apply(c)).toEqual({ q: 4, r: 5 })
})

test('DOWN', () => {
    expect(Direction.DOWN.apply(c)).toEqual({ q: 3, r: 6 })
})
test('DOWN_LEFT', () => {
    expect(Direction.DOWN_LEFT.apply(c)).toEqual({ q: 2, r: 5 })
})
test('DOWN_RIGHT', () => {
    expect(Direction.DOWN_RIGHT.apply(c)).toEqual({ q: 4, r: 6 })
})