import { controller } from '../../controller.mjs'

const w = 1300,
    h = 1700

const get_random_arr_index = (max) => {
    return Math.floor(Math.random() * max)
}
const random_of_arr = (arr) => {
    return arr[get_random_arr_index(arr.length)]
}


const draw_circle = (ctx, tile_x, tile_y, tile_w, tile_h, size_ratio) => {
    size_ratio *= size_ratio
    ctx.fillStyle = 'white'
    ctx.beginPath()
    const rad = Math.min(tile_w, tile_h) / 2
    ctx.arc(
        tile_x + tile_w / 2,
        tile_y + tile_h / 2,
        rad * size_ratio,
        0,
        360
    )
    ctx.fill()
    ctx.beginPath()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 6
    ctx.moveTo(tile_x + tile_w / 2, tile_y + tile_h)
    ctx.lineTo(tile_x + tile_w / 2, tile_y + tile_h / 2)
    ctx.stroke()
}

const draw_triangle = (ctx, tile_x, tile_y, tile_w, tile_h, size_ratio) => {
    ctx.fillStyle = 'white'
    ctx.beginPath()

    let size = Math.min(tile_w, tile_h) * (Math.pow(size_ratio, 1.5))
    if (size < 55) return

    const dir = Math.round(Math.random() * 4)

    if (dir === 0) {
        ctx.moveTo(tile_x, tile_y + tile_h / 2 - size / 2)
        ctx.lineTo(tile_x, tile_y + tile_h / 2 + size / 2)
        ctx.lineTo(tile_x + size, tile_y + tile_h / 2)
    } else if (dir === 1) {
        ctx.moveTo(tile_x + tile_w / 2 - size / 2, tile_y)
        ctx.lineTo(tile_x + tile_w / 2 + size / 2, tile_y)
        ctx.lineTo(tile_x + tile_w / 2, tile_y + size)
    } else if (dir === 2) {
        ctx.moveTo(tile_x + tile_w, tile_y + tile_h / 2 - size / 2)
        ctx.lineTo(tile_x + tile_w, tile_y + tile_h / 2 + size / 2)
        ctx.lineTo(tile_x + tile_w - size, tile_y + tile_h / 2)
    } else {
        ctx.moveTo(tile_x + tile_w / 2 - size / 2, tile_y + tile_h)
        ctx.lineTo(tile_x + tile_w / 2 + size / 2, tile_y + tile_h)
        ctx.lineTo(tile_x + tile_w / 2, tile_y + tile_h - size)
    }
    ctx.fill()
}


const draw_line = (ctx, tile_x, tile_y, tile_w, tile_h) => {
    ctx.beginPath()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 6
    if (Math.random() > 0.5) {
        ctx.moveTo(tile_x + tile_w / 2, tile_y + tile_h)
        ctx.lineTo(tile_x + tile_w / 2, tile_y)
    } else {
        ctx.moveTo(tile_x, tile_y + tile_h / 2)
        ctx.lineTo(tile_x + tile_w, tile_y + tile_h / 2)
    }
    ctx.stroke()
}

const actions = [
    // function sroke() {

    // },
    draw_triangle,
    draw_circle,
    draw_line,
    function none() { }
]


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
    var g = (rgb >>  8) & 0xff  // extract green
    var b = (rgb >>  0) & 0xff  // extract blue
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
}

////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    const x_count = 5 + Math.round(Math.random() * 4)
    const tile_width = w / x_count
    const max_y_count = Math.floor(h / tile_width)
    const min_y_count = Math.floor(h / (tile_width * 1.5))
    const y_count = min_y_count + Math.round(Math.random() * (max_y_count - min_y_count))

    const tile_w = w / x_count
    const tile_h = h / y_count

    const tiles = []

    for (let xi = 0; xi < x_count; xi++) {
        for (let yi = 0; yi < y_count; yi++) {
            const color = random_of_arr(klee_colors)
            ctx.fillStyle = color

            tiles[yi] = tiles[yi] || []
            tiles[yi][xi] = { color }

            const tile_x = w / x_count * xi
            const tile_y = h / y_count * yi
            ctx.fillRect(
                tile_x,
                tile_y,
                tile_w,
                tile_h
            )
        }
    }


    for (let xi = 0; xi < x_count; xi++) {
        for (let yi = 0; yi < y_count; yi++) {

            const tile_x = w / x_count * xi
            const tile_y = h / y_count * yi
            
            if (get_luma(tiles[yi][xi].color) > 120) continue // don't draw shapes over light tiles

            const action = random_of_arr(actions)

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

            const is_on_edge = xi === 0 || xi === x_count - 1 || yi === 0 || yi === y_count - 1

            if (action === draw_circle) {
                if (
                    is_on_edge
                    || Math.random() > 0.5
                    || get_neighbor_tiles(xi, yi).find(t => t && t.shape)
                ) {
                    // forbid neighbor circles
                    continue
                } else {
                    tiles[yi][xi].shape = 'circle'
                }
            }

            if (action === draw_triangle) {
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
            action(
                ctx,
                tile_x,
                tile_y,
                tile_w,
                tile_h,
                size_ratio
            )

        }
    }

}

controller.init(draw)
