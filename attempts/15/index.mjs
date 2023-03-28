import { controller } from '../../controller.mjs'

const w = 1300,
    h = 1700

const get_random_arr_index = (max) => {
    return Math.floor(Math.random() * max)
}
const random_of_arr = (arr) => {
    return arr[get_random_arr_index(arr.length)]
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

const get_centerness_ratio = (x_count, y_count, xi, yi) => {
    const center = [x_count / 2, y_count / 2]
    const x_tiles_from_center = Math.abs(center[0] - (xi + 0.5))
    const y_tiles_from_center = Math.abs(center[1] - (yi + 0.5))
    const x_ratio_from_center = x_tiles_from_center / ((x_count - 1) / 2)
    const y_ratio_from_center = y_tiles_from_center / ((y_count - 1) / 2)

    return 1 - (
        (x_ratio_from_center + y_ratio_from_center) / 2
    )
}

const ring_width = 10 + Math.random() * 15

const draw_circle = (ctx) => {
    
    const center = [
        Math.random() * w,
        Math.random() * h
    ]

    const [r,g,b,a] = ctx.getImageData(...center, 1, 1).data
    if (!(r === 26 && g === 26 && b === 26 && a === 255)) {
        return
    }
    

    let rad = 70 + Math.random() * 70

    while (rad > 0) {
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
        rad -= ring_width
    }
}

////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = `hsl(0 0% 10%)`
    ctx.fillRect(0, 0, w, h)

    ctx.lineWidth = 15

    const circ_count = 300

    for (let x = 0; x < circ_count; x++) {
        const ratio = x / (circ_count / 100) // % btw 0 and circ_count
        const l = 30 + ratio * 0.7
        ctx.fillStyle = `hsl(0 0% ${l}%)`
        ctx.strokeStyle = `hsl(0 ${l}% 50%)`
        draw_circle(ctx)
    }
}

controller.init(draw)
