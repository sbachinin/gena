import { controller } from '../../controller.mjs'

const w = 1300,
    h = 1700

const get_random_arr_index = (max) => {
    return Math.floor(Math.random() * max)
}
const random_of_arr = (arr) => {
    return arr[get_random_arr_index(arr.length)]
}


const draw_circle = (
    xi,
    yi,
    tiles,
    ctx
) => {
    const tile = tiles[yi][xi]

    const size_ratio = Math.pow(tile.shape_size_ratio, 2)
    ctx.fillStyle = 'white'
    ctx.beginPath()
    const rad = Math.min(tile.w, tile.h) / 2
    ctx.arc(
        tile.x + tile.w / 2,
        tile.y + tile.h / 2,
        rad * .90 * size_ratio,
        0,
        360
    )
    ctx.fill()

    // if (Math.random() > 0.8) {
    //     ctx.beginPath()
    //     ctx.strokeStyle = 'white'
    //     ctx.lineWidth = 6
    //     ctx.moveTo(tile.x + tile.w / 2, tile.y + tile.h)
    //     ctx.lineTo(tile.x + tile.w / 2, tile.y + tile.h / 2)
    //     ctx.stroke()
    // }
}

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


const klee_colors = [
    '#EA4916',
    '#1E6A83',
    '#4C6666',
    '#356D75',
    '#1A6980',
    '#55655B',
    '#55655B',
    '#1F6B80',
    '#347F9C',
    '#25718D',
    '#C88334',
    '#EED76B',
    '#EAA27F',
    '#D49F88',
    '#6A1A25',
    '#CBBAA6',
    '#11121B',
    '#12342D',
    '#262537',
    '#262537'
]

const get_luma = c => {
    var c = c.substring(1)      // strip #
    var rgb = parseInt(c, 16)   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff  // extract red
    var g = (rgb >> 8) & 0xff  // extract green
    var b = (rgb >> 0) & 0xff  // extract blue

    return 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
}

////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#fff'
    ctx.fillRect(
        0, 0, w, h
    )


    let tile_gap = 0
    if (Math.random() > 0.7) {
        tile_gap = 6 + Math.random() * 6
    }

    const x_count = 5 + Math.round(Math.random() * 4)
    const tile_width = (w - tile_gap) / x_count
    const max_y_count = Math.floor(h / tile_width)
    const min_y_count = Math.floor(h / (tile_width * 1.5))
    const y_count = min_y_count + Math.round(Math.random() * (max_y_count - min_y_count))

    const tiles = []

    for (let xi = 0; xi < x_count; xi++) {
        for (let yi = 0; yi < y_count; yi++) {
            let color = random_of_arr(klee_colors)
            tiles[yi] = tiles[yi] || []
            tiles[yi][xi] = {
                color,
                shape_size_ratio: 1,
                x: tile_gap / 2 + (w - tile_gap) / x_count * xi + tile_gap / 2,
                y: tile_gap / 2 + (h - tile_gap) / y_count * yi + tile_gap / 2,
                w: (w - tile_gap) / x_count - tile_gap,
                h: (h - tile_gap) / y_count - tile_gap
            }
        }
    }


    for (let xi = 0; xi < x_count; xi++) {
        for (let yi = 0; yi < y_count; yi++) {

            if (tiles[yi][xi] === undefined) continue

            if (get_luma(tiles[yi][xi].color) > 120) continue // don't draw shapes over light tiles

            const shape = random_of_arr(Object.keys(shapes))

            const is_on_edge = xi === 0 || xi === x_count - 1 || yi === 0 || yi === y_count - 1

            const get_neighbor_tiles = (x_i, y_i) => ([
                tiles[y_i - 1]?.[x_i - 1],
                tiles[y_i - 1]?.[x_i],
                tiles[y_i - 1]?.[x_i + 1],
                tiles[y_i][x_i - 1],
                tiles[y_i][x_i + 1],
                tiles[y_i + 1]?.[x_i - 1],
                tiles[y_i + 1]?.[x_i],
                tiles[y_i + 1]?.[x_i + 1],
            ])

            if (shape === 'circle') {
                if (
                    is_on_edge
                    || (
                        // in 75% cases forbid drawing circles next to other shapes
                        Math.random() > 0.25
                        && get_neighbor_tiles(xi, yi).find(t => t && t.shape)
                    )
                ) {
                    continue
                } else {
                    tiles[yi][xi].shape = 'circle'
                    if (Math.random() > 0.5) { // paint n neighbors in random direction in same color
                        // TODO need to check if there's space to grow on the right or bottom
                        if (Math.random() > 0.5) {
                            // extend right
                            tiles[yi][xi].w = tiles[yi][xi].w * 2 + tile_gap
                            tiles[yi][xi + 1] = undefined
                        } else {
                            // extend down
                            tiles[yi][xi].h = tiles[yi][xi].h * 2 + tile_gap
                            tiles[yi + 1][xi] = undefined
                        }
                        // extending "backwards" (top & left is forbidden for it caused minor glitches like eating the neighbor which was extended too)
                    }
                }
            }

            if (shape === 'triangle') {
                if (get_neighbor_tiles(xi, yi).find(t => t && t.shape)) {
                    // forbid neighbor triangles
                    continue
                } else {
                    tiles[yi][xi].shape = 'triangle'
                }
            }


            const center = [x_count / 2, y_count / 2]
            const x_tiles_from_center = Math.abs(center[0] - (xi + 0.5))
            const y_tiles_from_center = Math.abs(center[1] - (yi + 0.5))
            const x_ratio_from_center = x_tiles_from_center / ((x_count - 1) / 2)
            const y_ratio_from_center = y_tiles_from_center / ((y_count - 1) / 2)

            const centerness_ratio = 1 - (
                (x_ratio_from_center + y_ratio_from_center) / 2
            )
            const size_ratio = centerness_ratio + (1 - centerness_ratio) / 3
            tiles[yi][xi].shape_size_ratio = size_ratio
        }
    }




    tiles.forEach((row, yi) => {
        row.forEach((tile, xi) => {

            if (tile === undefined) return

            ctx.fillStyle = tile.color
            ctx.fillRect(
                tile.x,
                tile.y,
                tile.w,
                tile.h
            )
            // draw a border to prevent microgaps on the edges
            ctx.lineWidth = 1
            ctx.strokeStyle = tile.color
            ctx.strokeRect(tile.x,
                tile.y,
                tile.w,
                tile.h)


            if (tile.shape) {
                shapes[tile.shape](
                    xi,
                    yi,
                    tiles,
                    ctx
                )
            }


            if (tile_gap) {
                // draw a thicker border; otherwise there is a small gap btw triangle's white and tile_gap' white
                ctx.lineWidth = 4
                ctx.strokeStyle = '#fff'
                ctx.strokeRect(tile.x,
                    tile.y,
                    tile.w,
                    tile.h)
            }
        })
    })



}

controller.init(draw)
