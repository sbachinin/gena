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

const state = {
    ids: {}, // [id]: boolean (saved or not)
    current_id: null
}

const update_view = () => {
    document.querySelectorAll('canvas').forEach(c => {
        c.classList.remove('current')
        if (state.ids[c.id.replace('canvas', '')] === true) {
            c.classList.add('saved')
        } else {
            c.classList.remove('saved')
        }
    })

    document.querySelector(`#canvas${state.current_id}`).classList.add('current')

    document.querySelectorAll('canvas:not(.current):not(.saved)').forEach(c => c.remove())

    if (state.ids[state.current_id] === false) {
        document.querySelector('.keep').classList.remove('selected')
    } else {
        document.querySelector('.keep').classList.add('selected')
    }

    const prev_saved_ids = Object.keys(state.ids)
        .filter(id => id < state.current_id && Boolean(state.ids[id]))
    if (prev_saved_ids.length) {
        document.querySelector('.left').classList.add('active')
    } else {
        document.querySelector('.left').classList.remove('active')
    }
}

document.body
    .addEventListener('click', e => {
        const current_canvas = document.querySelector('canvas.current')
        const keep = document.querySelector('.keep')
        if (e.target === current_canvas) {
            create_next_canvas()

        } else if (e.target === keep) {
            state.ids[state.current_id] = !state.ids[state.current_id]

        } else if (e.target.closest('.left.active')) {
            const prev_saved_ids = Object.keys(state.ids)
                .filter(id => id < state.current_id && Boolean(state.ids[id]))
            if (prev_saved_ids.length) {
                state.current_id = Math.max(...prev_saved_ids)
            }
        } else {
            return
        }
        console.log(JSON.stringify(state, null, 2))
        update_view()
    })











////////////////////////////////////////////////////////
let count = 0
const create_next_canvas = () => {
    const canvas = document.createElement('canvas')
    canvas.classList.add('current')
    canvas.id = 'canvas' + count

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

    state.ids[count] = false
    state.current_id = count
    count++
}

create_next_canvas()