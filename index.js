const w = 900, h = 1200


const canvas = document.querySelector('canvas')
canvas.width = w + 400
canvas.height = h + 500
const ctx = canvas.getContext('2d')

ctx.fillStyle = 'tomato'
ctx.fillRect(0, 0, canvas.width, canvas.height)

const get_random_point = () => ([
    Math.random() * canvas.width,
    Math.random() * canvas.height
])


const get_wide_random_point = () => {
    const [x, y] = get_random_point()
    return [
        -canvas.width / 13.3 + x * 1.15,
        -canvas.height / 13.3 + y * 1.15
    ]
}
ctx.strokeStyle = 'rgb(30, 30, 30)'
ctx.lineWidth = 1
ctx.beginPath()
ctx.moveTo(...get_wide_random_point())
for (let i = 0; i <= 8000; i++) {
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
ctx.strokeStyle = 'green'
ctx.lineWidth = 2
ctx.moveTo(...get_narrow_random_point())
for (let i=0; i<100; i++) {
    ctx.lineTo(...get_narrow_random_point())
}
ctx.stroke()



ctx.strokeStyle = '#193d5f'
ctx.lineWidth = 200
ctx.strokeRect(0, 0, canvas.width, canvas.height)
