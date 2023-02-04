import { controller } from '../controller.mjs'

const w = 1300,
    h = 1700

const get_random_point = () => ([
    Math.random() * w,
    Math.random() * h
])

// providing narrow range btw min and max leads to more greyness
const get_rand_color = (min = 0, max = 255, greyness_ratio = 0 /* 0-1 */) => {

    // apply greyness
    let random1 = Math.random(),
        random2 = Math.random(),
        random3 = Math.random()
    const avg = (random1 + random2 + random3) / 3
    random1 = random1 - (random1 - avg) * greyness_ratio
    random2 = random2 - (random2 - avg) * greyness_ratio
    random3 = random3 - (random3 - avg) * greyness_ratio

    return 'rgb('
        + (min + random1 * (max - min))
        + ','
        + (min + random2 * (max - min))
        + ','
        + (min + random3 * (max - min))
        + ')'
}

const get_jolly_color = (brightness_ratio = 0.6) => {
    let random1, random2, random3, avg = 0

    // ensure high avg numbers
    while (avg < brightness_ratio) {
        random1 = Math.random()
        random2 = Math.random()
        random3 = Math.random()
        avg = (random1 + random2 + random3) / 3
    }

    return `rgb(${random1 * 255}, ${random2 * 255}, ${random3 * 255})`
}


const get_random_arr_index = (max) => {
    return Math.floor(Math.random() * max)
}
const random_of_arr = (arr) => {
    return arr[get_random_arr_index(arr.length)]
}


const draw_circle = (ctx, tile_x, tile_y, tile_w, tile_h) => {
    ctx.fillStyle = 'white'
    ctx.beginPath()
    const rad = Math.min(tile_w, tile_h) / 2
    const reduction = 4 + Math.random() * (rad / 3)
    ctx.arc(
        tile_x + tile_w / 2,
        tile_y + tile_h / 2,
        rad - reduction,
        0,
        360
    )
    ctx.fill()
    ctx.beginPath()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 10
    ctx.moveTo(tile_x + tile_w / 2, tile_y + tile_h)
    ctx.lineTo(tile_x + tile_w / 2, tile_y + tile_h / 2)
    ctx.stroke()
}

const draw_triangle = (ctx, tile_x, tile_y, tile_w, tile_h) => {
    ctx.fillStyle = 'white'
    ctx.beginPath()

    let size = Math.min(tile_w, tile_h)
    // size -= Math.random() * (size / 6)

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
    ctx.lineWidth = 10
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

const colors = [
    '#D9AF99',
    '#D1C0A3',
    '#D9CBBC',
    '#EBC3BA',
    '#DAB434',

    '#355a87',
    '#165399',
    '#343431',
    '#343431',
    '#A96B50',
    '#A12018',
    '#A12018',
    '#F7D867',
    '#422B1B',
    '#C88B16',
    '#C88B16',
    '#C88B16',
    '#9E4728',
    '#9E4728',
    '#917258',
    '#BD5637',
    '#81725E',
    '#686B5A',
    '#4383cf',
    'black',
    'black',
    'black',
    'black',
    'black',
    'black',
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
    '#BC596D',
    '#12342D',
    '#262537',
    '#262537'
]

////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    const x_count = 6 + Math.round(Math.random() * 4)
    const tile_width = w / x_count
    const max_y_count = Math.floor(h / tile_width)
    const min_y_count = Math.floor(h / (tile_width * 1.5))
    const y_count = min_y_count + Math.round(Math.random() * (max_y_count - min_y_count))

    const tile_w = w / x_count
    const tile_h = h / y_count

    const tiles = []

    for (let xi = 0; xi < x_count; xi++) {
        for (let yi = 0; yi < y_count; yi++) {
            console.log(JSON.stringify(tiles, null, 2))
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

            const is_on_edge = xi === 0 || xi === x_count-1 || yi === 0 || yi === y_count-1

            if (action === draw_circle) {
                if (is_on_edge || get_neighbor_tiles(xi, yi).find(t => t && t.shape)) {
                    // forbid neighbor circles
                    continue
                } else {
                    tiles[yi][xi].shape = 'circle'
                }
            }

            if (action === draw_triangle) {
                if (
                    is_on_edge
                    || (Math.random() > 0.3 && get_neighbor_tiles(xi, yi).find(t => t && t.shape))
                ) {
                    // forbid neighbor triangles
                    continue
                } else {
                    tiles[yi][xi].shape = 'triangle'
                }
            }


            action(
                ctx,
                tile_x,
                tile_y,
                tile_w,
                tile_h
            )
        }
    }

}

controller.init(draw)
