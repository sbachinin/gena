const get_hex = (x, y, ctx) => {
    const p = ctx.getImageData(x, y, 1, 1).data
    if (p[0] > 255 || p[1] > 255 || p[2] > 255)
        throw "Invalid color component";
    return '#' + ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)
}

export const get_tile_from_point = (point, ctx) => {
    const init_color = get_hex(...point, ctx)
    if (init_color === '#ffffff') return null


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

    const inaccuracy = 2

    const is_impure = (
        Math.abs(left - left_edge_1[0]) > inaccuracy
        || Math.abs(right - right_edge_1[0]) > inaccuracy
        || Math.abs(top - top_edge_1[1]) > inaccuracy
        || Math.abs(bottom < bottom_edge_1[1]) > inaccuracy
    )
    // TODO check several points within rect for different color


    const canvas_center = [ctx.canvas.width / 2, ctx.canvas.height / 2]
    const rect_center = [
        right - (right - left) / 2,
        bottom - (bottom - top) / 2
    ]
    const x_distance_from_canv_center = Math.abs(rect_center[0] - canvas_center[0])
    const y_distance_from_canv_center = Math.abs(rect_center[1] - canvas_center[1])
    const distance_from_canv_center = Math.sqrt(
        Math.pow(x_distance_from_canv_center, 2) + Math.pow(y_distance_from_canv_center, 2)
    )
    const max_distance_from_canv_center = Math.sqrt(
        Math.pow(ctx.canvas.width / 2, 2) + Math.pow(ctx.canvas.height / 2, 2)
    )

    // center is 1;
    // distance from center to the corner is 0;
    const centerness_ratio = 1 - distance_from_canv_center / max_distance_from_canv_center

    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
        color: init_color,
        centerness_ratio,
        is_impure
    }
}