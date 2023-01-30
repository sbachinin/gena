const w = 1300,
    h = 1700,
    border_width = 120

// UTILS

const get_random_point = () => ([
    Math.random() * w,
    Math.random() * h
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
// INTERACTION

document.body
    .addEventListener('click', e => {
        const current_canvas = document.querySelector('canvas.current')
        const keep = document.querySelector('.keep')
        if (e.target === current_canvas) {
            e.target.classList.remove('current')
            draw_next_canvas()
            keep.classList.remove('selected')
            setTimeout(
                () => {
                    !e.target.classList.contains('saved') && e.target.remove()
                },
                350
            )
        } else if (e.target === keep) {
            if (!current_canvas.classList.contains('saved')) {
                current_canvas.classList.add('saved')
                keep.classList.add('selected')
            } else {
                current_canvas.classList.remove('saved')
                keep.classList.remove('selected')
            }
        } else if (e.target.closest('.left')) {
            document.querySelector('canvas.saved:not(.current)').classList.add('current')
            keep.classList.add('selected')
            setTimeout(
                () => {
                    current_canvas.classList.remove('current')
                    !current_canvas.classList.contains('saved') && current_canvas.remove()
                },
                350
            )
        }
    })











////////////////////////////////////////////////////////

const draw_next_canvas = () => {
    const canvas = document.createElement('canvas')
    canvas.classList.add('current')

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
    for (let i = 0; i < fore_thickness; i++) {
        ctx.lineTo(...get_narrow_random_point())
    }
    ctx.stroke()



    ctx.strokeStyle = get_rand_color()
    ctx.lineWidth = border_width
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    document.body.prepend(canvas)
}

draw_next_canvas()