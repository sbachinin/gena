import { controller } from '../../controller.mjs'

const w = 1300,
    h = 1700




const get_dist = (p1, p2) => Math.sqrt(
    Math.pow(Math.abs(p1[0] - p2[0]), 2) + Math.pow(Math.abs(p1[1] - p2[1]), 2)
)

const get_near_point = (p1, p2) => {
    let rp = null
    do {
        rp = [Math.random() * w, Math.random() * h]
    } while (
        get_dist(rp, p1) < 140
        || get_dist(rp, p1) > 310
        || (p2 !== undefined && get_dist(rp, p2) < 140)
        || (p2 !== undefined && get_dist(rp, p2) > 310)
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


    ctx.lineWidth = 10
    ctx.fillStyle = `hsl(170deg 80% 20%)`
    ctx.strokeStyle = `hsl(0 0% 100%)`

    const shapes = []






    const shape = []
    shapes.push(shape)
    ctx.beginPath()
    shape[0] = [Math.random() * w, Math.random() * h]
    ctx.lineTo(...shape[0])
    shape[1] = get_near_point(shape[0])
    ctx.lineTo(...shape[1])
    shape[2] = get_near_point(shape[0], shape[1])
    ctx.lineTo(...shape[2])
    ctx.closePath()
    ctx.fill()
    ctx.stroke()


    Array.from(Array(5)).forEach(_ => {
        
    })





}

controller.init(draw)
