const canvas_fading_duration = parseFloat(
    getComputedStyle(document.querySelector('canvas')).transitionDuration
) * 1000

const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const get_current_canvas_id = () => { // => number or null
    const current_canvas = document.querySelector('canvas.current')
    if (current_canvas === null) {
        return null
    }
    return +current_canvas.id.replace('canvas', '')
}


const update_view = async (state) => {

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

    const next_saved_ids = Object.keys(state.ids)
        .filter(id => id > state.current_opus_id && Boolean(state.ids[id]))
    if (next_saved_ids.length) {
        document.querySelector('.right').classList.add('active')
    } else {
        document.querySelector('.right').classList.remove('active')
    }

    document.querySelector('.opus-id').innerText = state.current_opus_id
}



const handle_clicks = (create_next_canvas, state) => {
    document.body
    .addEventListener('click', e => {
        const current_canvas = document.querySelector('canvas.current')
        const keep = document.querySelector('.keep')
        if (e.target === current_canvas
            || e.target.closest('.nav-button.create') !== null) {
            create_next_canvas()

        } else if (e.target === keep) {
            state.ids[state.current_opus_id] = !state.ids[state.current_opus_id]

        } else if (e.target.closest('.left.active')) {
            const prev_saved_ids = Object.keys(state.ids)
                .filter(id => id < state.current_opus_id && Boolean(state.ids[id]))
            if (prev_saved_ids.length) {
                state.current_opus_id = Math.max(...prev_saved_ids)
            }
        } else if (e.target.closest('.right.active')) {
            const next_saved_ids = Object.keys(state.ids)
                .filter(id => id > state.current_opus_id && Boolean(state.ids[id]))
            if (next_saved_ids.length) {
                state.current_opus_id = Math.min(...next_saved_ids)
            }
        } else {
            return
        }
        update_view(state)
    })
}



export const controller = {
    init: (draw) => {
        const state = {
            next_canvas_index: 0,
            ids: {}, // [id]: boolean (saved or not)
            current_opus_id: null
        }

        const create_next_canvas = () => {
            const canvas = document.createElement('canvas')
            canvas.id = 'canvas' + state.next_canvas_index
            document.body.prepend(canvas)
            draw(canvas)

            state.ids[state.next_canvas_index] = false
            state.current_opus_id = state.next_canvas_index
            state.next_canvas_index++
        }

        create_next_canvas()
        update_view(state)
        handle_clicks(create_next_canvas, state)
    }
}