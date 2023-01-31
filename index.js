const w = 1300,
    h = 1700,
    border_width = 120

const canvas_fading_duration = parseFloat(
    getComputedStyle(document.querySelector('canvas')).transitionDuration
) * 1000

const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// UTILS

const get_current_canvas_id = () => { // => number or null
    const current_canvas = document.querySelector('canvas.current')
    if (current_canvas === null) {
        return null
    }
    return +current_canvas.id.replace('canvas', '')
}

const get_random_point = () => ([
    Math.random() * w,
    Math.random() * h
])

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
        + min + random1 * (max - min)
        + ','
        + min + random2 * (max - min)
        + ','
        + min + random3 * (max - min)
        + ')'
}

//////////////////////////////////////////////////////

const state = {
    ids: {}, // [id]: boolean (saved or not)
    current_opus_id: null
}

const update_view = async () => {

    if (state.ids[state.current_opus_id] === false) {
        document.querySelector('.keep').classList.remove('selected')
    } else {
        document.querySelector('.keep').classList.add('selected')
    }

    // if current didn't change, skip all the rest
    if (state.current_opus_id === get_current_canvas_id()) return

    document.querySelectorAll('canvas').forEach(c => {
        c.classList.remove('current')
        if (state.ids[c.id.replace('canvas', '')] === true) {
            c.classList.add('saved')
        } else {
            c.classList.remove('saved')
        }
    })

    await wait(canvas_fading_duration)

    document.querySelector(`#canvas${state.current_opus_id}`).classList.add('current')

    document.querySelectorAll('canvas:not(.current):not(.saved)').forEach(c => c.remove())

    const prev_saved_ids = Object.keys(state.ids)
        .filter(id => id < state.current_opus_id && Boolean(state.ids[id]))
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
            state.ids[state.current_opus_id] = !state.ids[state.current_opus_id]

        } else if (e.target.closest('.left.active')) {
            const prev_saved_ids = Object.keys(state.ids)
                .filter(id => id < state.current_opus_id && Boolean(state.ids[id]))
            if (prev_saved_ids.length) {
                state.current_opus_id = Math.max(...prev_saved_ids)
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



    ctx.strokeStyle = get_rand_color(0, 150, 0.6)
    ctx.lineWidth = border_width
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    document.body.prepend(canvas)

    state.ids[count] = false
    state.current_opus_id = count
    count++
}

create_next_canvas()
update_view()
