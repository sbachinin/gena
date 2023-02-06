import { controller } from '../../controller.mjs'

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


const actions = [
    // function sroke() {

    // },
    function draw_triangle(ctx, tile_x, tile_y, tile_w, tile_h) {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        const peak_reduction_ratio = Math.random() * (Math.max(tile_w, tile_h) / 8)
        const tl = [tile_x, tile_y]
        const tc = [tile_x + tile_w / 2, tile_y + peak_reduction_ratio]
        const tr = [tile_x + tile_w, tile_y]
        const ml = [tile_x + peak_reduction_ratio, tile_y + tile_h / 2] // middle left
        const mr = [tile_x + tile_w - peak_reduction_ratio, tile_y + tile_h / 2] // middle right
        const bl = [tile_x, tile_y + tile_h]
        const bc = [tile_x + tile_w / 2, tile_y + tile_h - peak_reduction_ratio]
        const br = [tile_x + tile_w, tile_y + tile_h]

        const points = [tl, tc, tr, mr, br, bc, bl, ml]
        // const shift = Math.round(Math.random() * 8) // to enable 'diagonal' rectangles too
        const is_tile_long_vertical = tile_h / tile_w > 1.2
        const shifts = is_tile_long_vertical ? [0, 4] : [0, 2, 4, 6] // for a long vertical tile allow only 'backwards' triangles
        const shift = random_of_arr(shifts)
        ctx.moveTo(...points[shift % 8])
        ctx.lineTo(...points[(3 + shift) % 8])
        ctx.lineTo(...points[(6 + shift) % 8])
        ctx.fill()
    },
    function draw_circle(ctx, tile_x, tile_y, tile_w, tile_h) {
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
    },
    function none() { },
    function none() { },
    function none() { },
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
    '#262537'
]

////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    const x_count = 6 + Math.round(Math.random() * 4)
    const y_count = 5 + Math.round(Math.random() * 5)
    const tile_w = w / x_count
    const tile_h = h / y_count

    for (let xi = 0; xi < x_count; xi++) {
        for (let yi = 0; yi < y_count; yi++) {
            ctx.fillStyle = random_of_arr(klee_colors)
            const tile_x = w / x_count * xi
            const tile_y = h / y_count * yi
            ctx.fillRect(
                tile_x,
                tile_y,
                tile_w,
                tile_h
            )

            random_of_arr(actions)(
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
