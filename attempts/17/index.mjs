import { controller } from '../../controller.mjs'

const w = 1300,
    h = 1700


// https://easings.net/#easeInOutSine
const ease = x => {
    return 1 + ((Math.cos(Math.PI * x) - 1) / 2);
}

function easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}


const draw_circle = (ctx, ring_width, fraction) => {

    const center = [
        Math.random() * w,
        fraction * h
    ]

    const [r, g, b, a] = ctx.getImageData(...center, 1, 1).data

    let rad = (100 + Math.random() * 100) * (0.3 + fraction * 0.7)

    const r_w = ring_width * 0.45 + fraction * (ring_width * 0.55)

    const min_rad = r_w * easeInOutQuart(Math.random()) / 2

    ctx.lineWidth = 6 + 6 * fraction

    while (rad > min_rad) {
        ctx.beginPath()
        ctx.arc(
            center[0],
            center[1],
            rad,
            0,
            360
        )
        ctx.stroke()
        ctx.fill()
        rad -= r_w
    }
}

////////////////////////////////////////////////////////
const draw = (canvas) => {

    const ring_width = 20 + Math.random() * 5

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = `hsl(60deg 100% 30%)`
    ctx.fillRect(0, 0, w, h)

    const circ_count = 200

    for (let x = 0; x < circ_count; x++) {
        const ratio = x / (circ_count / 100) // % btw 0 and circ_count
        const l = 30 + ratio * 0.7
        ctx.strokeStyle = `hsl(0 0% 10%)`
        ctx.fillStyle = `hsl(0 50% 50%)`
        draw_circle(
            ctx,
            ring_width,
            ease(x / circ_count)
        )
    }
}

controller.init(draw)
