// UTILS

const get_random_point = () => ([
    Math.random() * canvas.width,
    Math.random() * canvas.height
])

const get_rand_color = (min = 0, max = 255) => {
    return 'rgb('
        + min + Math.random() * (max - min)
        + ','
        + min + Math.random() * (max - min)
        + ','
        + min + Math.random() * (max - min)
        + ')'
}

//////////////////////////////////////////////////////













const w = 1300, h = 1700

const border_width = 120


const canvas = document.querySelector('canvas')
canvas.width = w
canvas.height = h
const ctx = canvas.getContext('2d')

ctx.fillStyle = get_rand_color()
ctx.fillRect(0, 0, canvas.width, canvas.height)

const get_wide_random_point = () => {
    const [x, y] = get_random_point()
    return [
        -canvas.width / 13.3 + x * 1.15,
        -canvas.height / 13.3 + y * 1.15
    ]
}

const bg_thickness = 4000 + Math.random() * 6000
const fore_thickness = 10 + Math.random() * 90


ctx.strokeStyle = 'rgb(30, 30, 30)'
ctx.lineWidth = 1
ctx.beginPath()
ctx.moveTo(...get_wide_random_point())
for (let i = 0; i <= bg_thickness; i++) {
    ctx.lineTo(...get_wide_random_point())
}
ctx.stroke()


const get_narrow_random_point = () => {
    const [x, y] = get_random_point()
    return [
        canvas.width / 5 + x * 0.6,
        canvas.height / 5 + y * 0.6
    ]
}


ctx.beginPath()
ctx.strokeStyle = get_rand_color()
ctx.lineWidth = 1 + Math.random() * 9
ctx.moveTo(...get_narrow_random_point())
for (let i=0; i<fore_thickness; i++) {
    ctx.lineTo(...get_narrow_random_point())
}
ctx.stroke()



ctx.strokeStyle = get_rand_color()
ctx.lineWidth = border_width
ctx.strokeRect(0, 0, canvas.width, canvas.height)
