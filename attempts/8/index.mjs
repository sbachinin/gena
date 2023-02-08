import { controller } from '../../controller.mjs'
import { get_tile_from_point } from './get_tile_from_point.mjs'
import { get_klee_colors } from './colors.mjs'
import {
    random_of_arr,
} from './utils.mjs'

import { draw_circle } from './draw_circle.mjs'


const w = 1300,
    h = 1700



const draw_triangle = (
    xi,
    yi,
    tiles,
    ctx
) => {
    const tile = tiles[yi][xi]


    ctx.fillStyle = 'white'
    ctx.beginPath()

    let size = Math.min(tile.w, tile.h) * (Math.pow(tile.shape_size_ratio, 1.5))
    if (size < 55) return

    const dir = Math.round(Math.random() * 4)

    if (dir === 0) {
        ctx.moveTo(tile.x, tile.y + tile.h / 2 - size / 2)
        ctx.lineTo(tile.x, tile.y + tile.h / 2 + size / 2)
        ctx.lineTo(tile.x + size, tile.y + tile.h / 2)
    } else if (dir === 1) {
        ctx.moveTo(tile.x + tile.w / 2 - size / 2, tile.y)
        ctx.lineTo(tile.x + tile.w / 2 + size / 2, tile.y)
        ctx.lineTo(tile.x + tile.w / 2, tile.y + size)
    } else if (dir === 2) {
        ctx.moveTo(tile.x + tile.w, tile.y + tile.h / 2 - size / 2)
        ctx.lineTo(tile.x + tile.w, tile.y + tile.h / 2 + size / 2)
        ctx.lineTo(tile.x + tile.w - size, tile.y + tile.h / 2)
    } else {
        ctx.moveTo(tile.x + tile.w / 2 - size / 2, tile.y + tile.h)
        ctx.lineTo(tile.x + tile.w / 2 + size / 2, tile.y + tile.h)
        ctx.lineTo(tile.x + tile.w / 2, tile.y + tile.h - size)
    }
    ctx.fill()
}


const draw_line = () => {
    ctx.beginPath()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 6
    if (Math.random() > 0.5) {
        ctx.moveTo(tile.x + tile.w / 2, tile.y + tile.h)
        ctx.lineTo(tile.x + tile.w / 2, tile.y)
    } else {
        ctx.moveTo(tile.x, tile.y + tile.h / 2)
        ctx.lineTo(tile.x + tile.w, tile.y + tile.h / 2)
    }
    ctx.stroke()
}

const shapes = {
    // sroke?
    triangle: draw_triangle,
    circle: draw_circle,
}


////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)

    let tile_gap = 0
    // if (Math.random() > 0.7) {
    //     tile_gap = 20 + Math.random() * 20
    // }

    const x_count = 5 + Math.round(Math.random() * 4)
    const w_per_slot = (w - tile_gap) / x_count
    const max_y_count = Math.floor(h / w_per_slot)
    const min_y_count = Math.floor(h / (w_per_slot * 1.5))
    const y_count = min_y_count + Math.round(Math.random() * (max_y_count - min_y_count))

    const h_per_slot = (h - tile_gap) / y_count

    const slots = Array.from(Array(x_count * y_count)).map(_ => null)
    const tiles = []


    const get_tile_rect = (slots_of_tile) => {
        const xi = Math.min(slots_of_tile) % x_count
        const yi = Math.floor(Math.min(slots_of_tile) / x_count)

        const x = tile_gap / 2 + w_per_slot * xi
        const y = tile_gap / 2 + h_per_slot * yi
        const w = w_per_slot * slots_of_tile.length
        const h = h_per_slot * slots_of_tile.length

        return [
            Math.floor(x) - 0.5,
            Math.floor(y) - 0.5,
            Math.ceil(w),
            Math.ceil(h)
        ]
    }

    while (true) {
        const first_free_slot_index = slots.findIndex(s => s === null)
        if (first_free_slot_index === -1) {
            break
        }

        // TODO sometimes draw all white tiles with thin black borders

        const tile = {
            color: random_of_arr(get_klee_colors()),
            slots: [first_free_slot_index],
        }
        tiles.push(tile)
        slots[first_free_slot_index] = tiles.length - 1

        const tile_rect = get_tile_rect(tile.slots)

        ctx.fillStyle = tile.color
        ctx.fillRect(...tile_rect)

        // draw a border to prevent microgaps on the edges
        ctx.lineWidth = 1
        ctx.strokeStyle = tile.color
        ctx.strokeRect(...tile_rect)

        if (tile_gap) {
            // draw a thicker border; otherwise there is a small gap btw triangle's white and tile_gap' white
            ctx.lineWidth = tile_gap / 2
            ctx.strokeStyle = '#fff'
            ctx.strokeRect(...tile_rect)
        }


        // check in which directions can extend
        // if none, try make another tile

        /* 
                if (Math.random() > 0.5) { // paint n neighbors in random direction in same color
                    // TODO need to check if there's space to grow on the right or bottom
                    if (Math.random() > 0.5) {
                        // extend right
                        tile.w = tile.w * 2 + tile_gap
                    } else {
                        // extend down
                        tile.h = tile.h * 2 + tile_gap
                    }
                    // extending "backwards" (top & left is forbidden for it caused minor glitches like eating the neighbor which was extended too)
                } */

    }





    Array.from(Array(Math.round((x_count * y_count) / 30))).forEach(
        _ => {
            const tile = get_tile_from_point([Math.round(Math.random() * (w - 1)), Math.round(Math.random() * (h - 1))], ctx)
            ctx.beginPath()
            ctx.strokeStyle = 'white'
            const line_width = 5 + Math.random() * (tile.width / 6)
            ctx.lineWidth = line_width
            ctx.strokeRect(tile.left + line_width / 2, tile.top + line_width / 2, tile.width - line_width + 1, tile.height - line_width + 1)
        }
    )


    const circles_count = Math.round((x_count * y_count) / 7)
    Array.from(Array(circles_count)).forEach(
        _ => {
            draw_circle(
                get_tile_from_point([Math.round(Math.random() * (w - 1)), Math.round(Math.random() * (h - 1))], ctx),
                ctx)
        }
    )

    // var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);


    // for (let xi = 0; xi < x_count; xi++) {
    //     for (let yi = 0; yi < y_count; yi++) {

    //         if (tiles[yi][xi] === undefined) continue

    //         if (get_luma(tiles[yi][xi].color) > 120) continue // don't draw shapes over light tiles

    //         const shape = random_of_arr(Object.keys(shapes))

    //         const is_on_edge = xi === 0 || xi === x_count - 1 || yi === 0 || yi === y_count - 1

    //         const get_neighbor_tiles = (x_i, y_i) => ([
    //             tiles[y_i - 1]?.[x_i - 1],
    //             tiles[y_i - 1]?.[x_i],
    //             tiles[y_i - 1]?.[x_i + 1],
    //             tiles[y_i][x_i - 1],
    //             tiles[y_i][x_i + 1],
    //             tiles[y_i + 1]?.[x_i - 1],
    //             tiles[y_i + 1]?.[x_i],
    //             tiles[y_i + 1]?.[x_i + 1],
    //         ])

    //         if (shape === 'circle') {
    //             if (
    //                 is_on_edge
    //                 || (
    //                     // in 75% cases forbid drawing circles next to other shapes
    //                     Math.random() > 0.25
    //                     && get_neighbor_tiles(xi, yi).find(t => t && t.shape)
    //                 )
    //             ) {
    //                 continue
    //             } else {
    //                 tiles[yi][xi].shape = 'circle'

    //             }
    //         }

    //         if (shape === 'triangle') {
    //             if (get_neighbor_tiles(xi, yi).find(t => t && t.shape)) {
    //                 // forbid neighbor triangles
    //                 continue
    //             } else {
    //                 tiles[yi][xi].shape = 'triangle'
    //             }
    //         }



    // const size_ratio = centerness_ratio + (1 - centerness_ratio) / 3
    // tiles[yi][xi].shape_size_ratio = size_ratio
    //     }
    // }




    // tiles.forEach((row, yi) => {
    //     row.forEach((tile, xi) => {

    //         if (tile === undefined) return

    //         ctx.fillStyle = tile.color
    //         ctx.fillRect(
    //             tile.x,
    //             tile.y,
    //             tile.w,
    //             tile.h
    //         )
    //         // draw a border to prevent microgaps on the edges
    //         ctx.lineWidth = 1
    //         ctx.strokeStyle = tile.color
    //         ctx.strokeRect(tile.x,
    //             tile.y,
    //             tile.w,
    //             tile.h)


    //         if (tile.shape) {
    //             shapes[tile.shape](
    //                 xi,
    //                 yi,
    //                 tiles,
    //                 ctx
    //             )
    //         }


    //         if (tile_gap) {
    //             // draw a thicker border; otherwise there is a small gap btw triangle's white and tile_gap' white
    //             ctx.lineWidth = 4
    //             ctx.strokeStyle = '#fff'
    //             ctx.strokeRect(tile.x,
    //                 tile.y,
    //                 tile.w,
    //                 tile.h)
    //         }
    //     })
    // })



}

controller.init(draw)
