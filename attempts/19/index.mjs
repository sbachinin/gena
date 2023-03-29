import { controller } from '../../controller.mjs'
import { random_of_arr } from '../../utils.mjs'


const w = 1300,
    h = 1700




const get_dist = (p1, p2) => Math.sqrt(
    Math.pow(Math.abs(p1[0] - p2[0]), 2) + Math.pow(Math.abs(p1[1] - p2[1]), 2)
)

const is_reasonably_far = (p1, p2) => {
    const dist = get_dist(p1, p2)
    return dist > 140 && dist < 310
}

const get_near_point = (...points) => {
    let rp = null
    do {
        rp = [Math.random() * w, Math.random() * h]
    } while (
        !points.every(p => is_reasonably_far(p, rp))
    )
    return rp
}


////////////////////////////////////////////////////////
const draw = (canvas) => {

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = `hsl(70deg 80% 20%)`
    ctx.fillRect(0, 0, w, h)


    ctx.lineWidth = 6
    ctx.fillStyle = `hsl(170deg 80% 20%)`
    ctx.strokeStyle = `hsl(0 0% 100%)`
    ctx.lineJoin = 'bevel'


    const shapes = []






    const shape = []
    shapes.push(shape)
    ctx.beginPath()
    shape[0] = [Math.random() * w, Math.random() * h]
    shape[1] = get_near_point(shape[0])
    shape[2] = get_near_point(shape[0], shape[1])
    ctx.lineTo(...shape[0])
    ctx.lineTo(...shape[1])
    ctx.lineTo(...shape[2])
    ctx.closePath()
    ctx.fill()
    ctx.stroke()


    Array.from(Array(1000)).forEach(_ => {

            const neighbor = random_of_arr(shapes)

            const shape = []
            shapes.push(shape)

            ctx.beginPath()
            shape[0] = get_near_point(...neighbor)
            shape[1] = get_near_point(...neighbor)
            shape[2] = random_of_arr(neighbor)
            ctx.lineTo(...shape[0])
            ctx.lineTo(...shape[1])
            ctx.lineTo(...shape[2])
            ctx.closePath()
            ctx.fill()
            ctx.stroke()

    })





}

controller.init(draw)
