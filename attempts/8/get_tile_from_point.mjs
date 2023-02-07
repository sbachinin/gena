const get_hex = (x, y, ctx) => {
    const p = ctx.getImageData(x, y, 1, 1).data
    if (p[0] > 255 || p[1] > 255 || p[2] > 255)
        throw "Invalid color component";
    return ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)
}

export const get_tile_from_point = (point, ctx) => {
    const init_color = get_hex(...point, ctx)
    if (init_color === 'ffffff') return null


    const find_edge = (starting_point, get_next) => {
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



    const left_edge_1 = find_edge(point, p => ([p[0] - 1, p[1]]))
    const right_edge_1 = find_edge(point, p => ([p[0] + 1, p[1]]))
    const top_edge_1 = find_edge(point, p => ([p[0], p[1] - 1]))
    const bottom_edge_1 = find_edge(point, p => ([p[0], p[1] + 1]))


    // try extend the edges to check if rect isn't actually larger
    const top_left_edge = find_edge(top_edge_1, p => ([p[0] - 1, p[1]])) // try expand top edge to left
    const bottom_left_edge = find_edge(bottom_edge_1, p => ([p[0] - 1, p[1]])) // try expand bottom edge to left
    const top_right_edge = find_edge(top_edge_1, p => ([p[0] + 1, p[1]])) // try expand top edge to right
    const bottom_right_edge = find_edge(bottom_edge_1, p => ([p[0] + 1, p[1]])) // try expand bottom edge to right
    const left_top_edge = find_edge(left_edge_1, p => ([p[0], p[1] - 1])) // try expand left edge up
    const right_top_edge = find_edge(right_edge_1, p => ([p[0], p[1] - 1])) // try expand right edge up
    const left_bottom_edge = find_edge(left_edge_1, p => ([p[0], p[1] + 1])) // try expand right edge down
    const right_bottom_edge = find_edge(right_edge_1, p => ([p[0], p[1] + 1])) // try expand right edge down

    const left = Math.min(top_left_edge[0], bottom_left_edge[0])
    const right = Math.max(top_right_edge[0], bottom_right_edge[0])
    const top = Math.min(left_top_edge[1], right_top_edge[1])
    const bottom = Math.max(left_bottom_edge[1], right_bottom_edge[1])

    const contains_shape = (
        left < left_edge_1[0]
        || right > right_edge_1[0]
        || top < top_edge_1[1]
        || bottom < bottom_edge_1[1]
    )


    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
        color: init_color,
        contains_shape
    }
}