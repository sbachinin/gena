const insert_controls_html = () => {
    document.querySelector('.controls').innerHTML = `
<span class="home nav-button active">
    <a href="../">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"/></svg>
    </a>
</span>
<span class="left nav-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
    </svg>
</span>

<span class="opus-id">0</span>

<span class="right nav-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
    </svg>
</span>

<span class="keep" title="Pictures which are &#34;kept&#34; can be viewed later">
    <svg class="filled-checkbox" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
            d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z" />
    </svg>
    <svg class="empty-checkbox" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" />
    </svg>
    Keep
</span>

<span class="create nav-button active" title="Create new opus">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
    </svg>
</span>    
`
}


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

        insert_controls_html()

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