

const are_colors_equal = ([r1, g1, b1, a1], [r2, g2, b2, a2]) => {
    return r1 === r2
        && g1 === g2
        && b1 === b2
        && a1 === a2
}

export const get_tile_from_point = (point, ctx) => {
    const init_color_data = ctx.getImageData(...point, 1, 1).data
    // if (init_color_data === '#ffffff') return null


    const find_edge = (starting_point, get_next) => {
        let cursor = [...starting_point]
        while (true) {
            const next_cursor = get_next(cursor)
            const next_color_data = ctx.getImageData(...next_cursor, 1, 1).data
            if (are_colors_equal(next_color_data, init_color_data)) {
                cursor = next_cursor
            } else {
                break
            }
        }
        return cursor
    }



    const left = find_edge(point, p => ([p[0] - 1, p[1]]))[0]
    const right = find_edge(point, p => ([p[0] + 1, p[1]]))[0]
    const top = find_edge(point, p => ([p[0], p[1] - 1]))[1]
    const bottom = find_edge(point, p => ([p[0], p[1] + 1]))[1]


    console.log(point)
    console.log(right, left, top, bottom)

    const rect_data = ctx.getImageData(
        left,
        top,
        right - left,
        bottom - top
    ).data
    let is_pure_rect = true
    for (let i = 0; i <= rect_data.length - 1; i += 4) {
        if (rect_data[i] !== rect_data[0]) {
            is_pure_rect = false
            break
        }
    }


    // try extend the edges to check if rect isn't actually larger
    // const top_left_edge = find_edge(top_edge_1, p => ([p[0] - 1, p[1]])) // try expand top edge to left
    // const bottom_left_edge = find_edge(bottom_edge_1, p => ([p[0] - 1, p[1]])) // try expand bottom edge to left
    // const top_right_edge = find_edge(top_edge_1, p => ([p[0] + 1, p[1]])) // try expand top edge to right
    // const bottom_right_edge = find_edge(bottom_edge_1, p => ([p[0] + 1, p[1]])) // try expand bottom edge to right
    // const left_top_edge = find_edge(left_edge_1, p => ([p[0], p[1] - 1])) // try expand left edge up
    // const right_top_edge = find_edge(right_edge_1, p => ([p[0], p[1] - 1])) // try expand right edge up
    // const left_bottom_edge = find_edge(left_edge_1, p => ([p[0], p[1] + 1])) // try expand right edge down
    // const right_bottom_edge = find_edge(right_edge_1, p => ([p[0], p[1] + 1])) // try expand right edge down

    // const left = Math.min(top_left_edge[0], bottom_left_edge[0])
    // const right = Math.max(top_right_edge[0], bottom_right_edge[0])
    // const top = Math.min(left_top_edge[1], right_top_edge[1])
    // const bottom = Math.max(left_bottom_edge[1], right_bottom_edge[1])


    // const rect_data = ctx.getImageData(left, top, right - left, top - bottom).data
    // let count = 0
    // while (count <= rect_data.length - 1) {
    //     if (rect_data[count] === rect_data[0]) {
    //         count += 4
    //     } else {
    //         break
    //     }
    // }

    // const inaccuracy = 2

    // const is_impure = (
    //     Math.abs(left - left_edge_1[0]) > inaccuracy
    //     || Math.abs(right - right_edge_1[0]) > inaccuracy
    //     || Math.abs(top - top_edge_1[1]) > inaccuracy
    //     || Math.abs(bottom < bottom_edge_1[1]) > inaccuracy
    // )
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
        color_data: init_color_data,
        centerness_ratio,
        is_pure: is_pure_rect
    }
}