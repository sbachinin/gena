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










////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    // draw BG color
    ctx.fillStyle = get_jolly_color(0.3)
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // occasionally draw 2ND BG color
    if (Math.random() > 0.7) {
        ctx.fillStyle = get_jolly_color(0.3)
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2)
    }

    // often draw a BORDER behind the bg_stroke
    let border_width = 0
    if (Math.random() > 0.5) {
        ctx.strokeStyle = get_rand_color(50, 150)
        border_width = ctx.lineWidth = 50 + Math.random() * 200
        ctx.strokeRect(0, 0, canvas.width, canvas.height)
    }

    const get_wide_random_point = () => {
        const [x, y] = get_random_point()
        return [
            -canvas.width / 13.3 + x * 1.15,
            -canvas.height / 13.3 + y * 1.15
        ]
    }



    // bg stroke
    const bg_thickness = 6000 + Math.random() * 4000
    ctx.strokeStyle = 'rgb(30, 30, 30)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(...get_wide_random_point())
    for (let i = 0; i <= bg_thickness; i++) {
        ctx.lineTo(...get_wide_random_point())
    }
    ctx.stroke()



    // fore stroke
    const is_thin = Math.random() > 0.5
    const fore_line_width = 2 + Math.random() * (is_thin ? 10 : 30)
    const fore_lines_count = (7 + Math.random() * 12) / (fore_line_width / (is_thin ? 4 : 10))
    ctx.beginPath()
    ctx.strokeStyle = get_jolly_color()
    ctx.lineWidth = fore_line_width
    ctx.lineJoin = 'bevel'
    const last_point = [
        canvas.width / 5 * 2 + Math.random() * canvas.width / 5,
        canvas.height / 5 * 2 + Math.random() * canvas.height / 5
    ]
    ctx.moveTo(...last_point)
    for (let i = 0; i < fore_lines_count; i++) {
        const line_span = 400 + Math.random() * 800
        const margin = border_width + w / 30
        const min_x = Math.min(
            w - margin - line_span,
            Math.max(
                last_point[0] - line_span / 2,
                margin
            )
        )

        const min_y = Math.min(
            h - margin - line_span,
            Math.max(
                last_point[1] - line_span / 2,
                margin
            )
        )

        last_point[0] = min_x + Math.random() * line_span
        last_point[1] = min_y + Math.random() * line_span
        ctx.lineTo(...last_point)

    }
    ctx.stroke()
}

controller.init(draw)
