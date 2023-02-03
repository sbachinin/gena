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






const actions = [
    function draw_triangle(ctx, tile_x, tile_y, tile_w, tile_h) {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.moveTo(tile_x, tile_y)
        ctx.lineTo(tile_x + tile_w, tile_y + tile_h / 2)
        ctx.lineTo(tile_x, tile_y + tile_h)
        ctx.fill()
    },
    function draw_circle(ctx, tile_x, tile_y, tile_w, tile_h) {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(
            tile_x + tile_w / 2,
            tile_y + tile_h / 2,
            Math.min(tile_w, tile_h) / 2 - 10,
            0,
            360
        )
        ctx.fill()
    },
    function none() {},
    function none() {},
]

const colors = [
    '#884E7F', '#9F6A86', '#B2C730', '#7fe150', '#E1443B', '#E68220', '#0188A6', '#375D9A', 'black', '#E0301E'
]


const random_of_arr = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    const x_count = 6 + Math.round(Math.random() * 6)
    const y_count = 5 + Math.round(Math.random() * 8)
    const tile_w = w / x_count
    const tile_h = h / y_count

    for (let xi = 0; xi < x_count; xi++) {
        for (let yi = 0; yi < y_count; yi++) {
            ctx.fillStyle = random_of_arr(colors)
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
