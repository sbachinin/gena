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
    const colors = [
        // reds
        '#cc230a',
        '#cc3300',
        '#b51f09',
        '#9e1b08',

        '#cc3300',
        '#ff9966',
        '#ffcc00',
        '#99cc33',
        '#1ebbd7',
        '#be29ec',
        // orange
        '#ffc100',
        '#ff9a00',
        '#ff7400',
        '#ff4d00',
        '#ff0000',
    ]
    return colors[Math.floor(Math.random() * colors.length)]
    // let random1, random2, random3, avg = 0

    // // ensure high avg numbers
    // while (avg < brightness_ratio) {
    //     random1 = Math.random()
    //     random2 = Math.random()
    //     random3 = Math.random()
    //     avg = (random1 + random2 + random3) / 3
    // }

    // return `rgb(${random1 * 255}, ${random2 * 255}, ${random3 * 255})`
}










////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    // draw BG color
    ctx.fillStyle = 'rgb('
        + (Math.random() * 15)
        + ','
        + (Math.random() * 10)
        + ','
        + (Math.random() * 20)
        + ')'
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
    ctx.strokeStyle = 'rgb(130, 130, 130, .1)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(...get_wide_random_point())
    for (let i = 0; i <= bg_thickness; i++) {
        ctx.lineTo(...get_wide_random_point())
    }
    ctx.stroke()



    const margin = 200







    // fore stroke

    const fore_thickness = 1.5 + Math.random() * 5
    const fore_line_width = 5 + Math.random() * 6
    ctx.beginPath()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = fore_line_width
    ctx.lineJoin = 'round'
    const max_step_len = 120 * fore_thickness

    const points = []

    const create_adjacent_point = () => {
        const prev = points[points.length - 1]
        let min_x = margin
        let max_x = w - margin
        let min_y = margin
        let max_y = h - margin
        if (prev) {
            min_x = Math.max(margin, prev[0] - max_step_len)
            max_x = Math.min(w - margin, prev[0] + max_step_len)
            min_y = Math.max(margin, prev[1] - max_step_len)
            max_y = Math.min(h - margin, prev[1] + max_step_len)
        }
        return [
            min_x + Math.random() * (max_x - min_x),
            min_y + Math.random() * (max_y - min_y),
        ]
    }


    ([
        margin + Math.random() * (w - margin * 2),
        margin + Math.random() * (h - margin * 2)
    ])

    let has_available_space = true
    while (has_available_space) {
        const point_is_close_to_another_point = (p) => {
            return points.find(pp => {
                var a = p[0] - pp[0]
                var b = p[1] - pp[1]
                const distance = Math.sqrt(a * a + b * b)
                return distance < (60 * fore_thickness)
            })
        }

        let point
        let attempts_count = 0
        do {
            if (attempts_count > 100) {
                has_available_space = false
                break
            }
            point = create_adjacent_point()
            attempts_count++
        } while (point_is_close_to_another_point(point))

        ctx.lineTo(...point)
        points.push(point)
    }

    ctx.stroke()


    // circles
    const count = 5 + Math.floor(Math.random() * 5)
    for (let xi = 0; xi <= count - 1; xi++) {
        const x = margin + (w - margin * 2) / (count - 1) * xi
        for (let yi = 0; yi <= count - 1; yi++) {
            ctx.beginPath()
            const y = margin + (h - margin * 2) / (count - 1) * yi
            ctx.arc(x, y, 15, 0, 360)
            ctx.fillStyle = 'black'
            ctx.fill()
        }
    }


}

controller.init(draw)
