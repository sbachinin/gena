import { controller } from '../../controller.mjs'

const w = 1300,
    h = 1700


const ease = x => {
    return Math.sin((x * Math.PI) / 2);

}

function easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}


const draw_circle = (ctx, ring_width, fraction) => {

    const center = [
        Math.random() * w,
        fraction * h
    ]

    const should_skip = Math.random() * (fraction * fraction ) > 0.5
    if (should_skip) return

    // const [r, g, b, a] = ctx.getImageData(...center, 1, 1).data
    ctx.lineWidth = 4 + 6 * fraction

    const size_ratio = (0.3 + fraction * 0.7) * (0.8 + Math.random() * 0.4)

    const init_rad = 250 * size_ratio
    const ring_count = init_rad / (ring_width * size_ratio)
    const center_size = 0
    let curr_ring_index = 0
    let rad = init_rad

    while (curr_ring_index <= (ring_count)) {
        ctx.beginPath()
        ctx.arc(
            center[0],
            center[1],
            init_rad - (center_size + (init_rad - center_size) * ease(curr_ring_index / ring_count)),
            0,
            360
        )
        ctx.stroke()
        ctx.fill()
        curr_ring_index++
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

    const circ_count = 80

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
