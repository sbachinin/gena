
export const get_random_arr_index = (max) => {
    return Math.floor(Math.random() * max)
}
export const random_of_arr = (arr) => {
    return arr[get_random_arr_index(arr.length)]
}


export const parse_hex = c => {
    var c = c.substring(1)      // strip #
    var rgb = parseInt(c, 16)   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff  // extract red
    var g = (rgb >> 8) & 0xff  // extract green
    var b = (rgb >> 0) & 0xff  // extract blue
    return [r, g, b]
}


export const get_luma = c => {
    const [r, g, b] = parse_hex(c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
}

