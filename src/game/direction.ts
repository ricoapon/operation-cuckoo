import { Coordinate } from "./game-types"

export class Direction {
    static UP = new Direction((c: Coordinate) => { return { q: c.q, r: c.r - 1 } })
    static UP_LEFT = new Direction((c: Coordinate) => { return { q: c.q - 1, r: c.r - 1 } })
    static UP_RIGHT = new Direction((c: Coordinate) => { return { q: c.q + 1, r: c.r } })
    static DOWN = new Direction((c: Coordinate) => { return { q: c.q, r: c.r + 1 } })
    static DOWN_LEFT = new Direction((c: Coordinate) => { return { q: c.q - 1, r: c.r } })
    static DOWN_RIGHT = new Direction((c: Coordinate) => { return { q: c.q + 1, r: c.r + 1 } })

    readonly f: (c: Coordinate) => Coordinate

    private constructor(f: (c: Coordinate) => Coordinate) {
        this.f = f
    }

    apply(c: Coordinate) {
        return this.f(c)
    }
}
