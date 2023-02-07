const get_hex = (x, y, ctx) => {
    const p = ctx.getImageData(x, y, 1, 1).data
    if (p[0] > 255 || p[1] > 255 || p[2] > 255)
        throw "Invalid color component";
    return ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)
}

const find_edge = (starting_point, get_next, init_color, ctx) => {
    let cursor = [...starting_point]
    while (true) {
        const next_cursor = get_next(cursor)
        if (get_hex(...next_cursor, ctx) === init_color) {
            cursor = next_cursor
        } else {
            break
        }
    }
    return cursor
}

export const get_tile_from_point = (point, ctx) => {
    const init_color = get_hex(...point, ctx)
    if (init_color === 'ffffff') return null

    const left_edge = find_edge(point, p => ([p[0] - 1, p[1]]), init_color, ctx)
    const right_edge = find_edge(point, p => ([p[0] + 1, p[1]]), init_color, ctx)
    const top_edge = find_edge(point, p => ([p[0], p[1] - 1]), init_color, ctx)
    const bottom_edge = find_edge(point, p => ([p[0], p[1] + 1]), init_color, ctx)

    // try extend the edges to check if rect isn't actually larger
    // while (true) {
    //     cursor[0]--
    // }





    return {
        left: left_edge[0],
        top: top_edge[1],
        right: right_edge[0],
        bottom: bottom_edge[1],
        width: right_edge[0] - left_edge[0],
        height: bottom_edge[1] - top_edge[1],
        color: init_color
    }
}