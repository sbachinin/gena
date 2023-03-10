import { get_luma, parse_hex, random_of_arr } from './utils.mjs'
import { klee_colors, get_klee_colors } from './colors.mjs'

export const draw_circle = (
    rect,
    ctx
) => {

    if (rect === null) return
    if (rect.is_impure) return
    // if (get_luma(rect.color) > 120) return

    const mild_centerness_ratio = rect.centerness_ratio + (1 - rect.centerness_ratio) / 3
    const randomly_adjusted_centerness = Math.min(1, mild_centerness_ratio - 0.10 + Math.random() * 0.2)

    let rad = (Math.min(rect.width, rect.height) / 2) * 0.9 * randomly_adjusted_centerness
    ctx.beginPath()
    
    let shape_color = '#ffffff'
    // pick a shape color which is in high contrast to rect color
    if (klee_colors.bright.includes(rect.color)) {
        shape_color = random_of_arr(klee_colors.dark)
    } else if (klee_colors.dark.includes(rect.color)) {
        shape_color = random_of_arr(klee_colors.bright)
    }

    const [r, g, b] = parse_hex(shape_color)
    const opacity = rect.centerness_ratio < 0.6 ? Math.max(0.1, rect.centerness_ratio) : 1
    const transparent_color = `rgba(${r}, ${g}, ${b}, ${opacity})`
    console.log(transparent_color)
    ctx.fillStyle = transparent_color

    ctx.arc(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rad,
        0,
        360
    )
    ctx.fill()


    // if (Math.random() > 0.8) {
    //     ctx.beginPath()
    //     ctx.strokeStyle = 'white'
    //     ctx.lineWidth = 6
    //     ctx.moveTo(tile.x + tile.w / 2, tile.y + tile.h)
    //     ctx.lineTo(tile.x + tile.w / 2, tile.y + tile.h / 2)
    //     ctx.stroke()
    // }
}
