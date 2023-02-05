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










////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    // draw BG color
    ctx.fillStyle = get_rand_color(70, 160)
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const get_wide_random_point = () => {
        const [x, y] = get_random_point()
        return [
            -canvas.width / 13.3 + x * 1.15,
            -canvas.height / 13.3 + y * 1.15
        ]
    }



    // bg stroke
    const bg_thickness = 6000 + Math.random() * 4000
    ctx.strokeStyle = 'rgb(30, 30, 30, .3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(...get_wide_random_point())
    for (let i = 0; i <= bg_thickness; i++) {
        ctx.lineTo(...get_wide_random_point())
    }
    ctx.stroke()



    // fore stroke

    const fore_line_width = 6 + Math.random() * 30
    ctx.beginPath()
    ctx.strokeStyle = get_jolly_color()
    ctx.lineWidth = fore_line_width
    const span = fore_line_width * 4
    const margin = 200
    let current_y = margin + Math.random() * span
    while (current_y < (h - margin)) {
        const point = [
            margin + Math.random() * (w - margin * 2),
            current_y
        ]

        ctx.lineTo(...point)
        current_y += 100 + Math.random() * span
    }

    ctx.stroke()
}

controller.init(draw)
