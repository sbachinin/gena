import { get_luma } from './utils.mjs'

export const draw_circle = (
    rect,
    ctx
) => {

    if (rect === null) return
    if (rect.is_impure) return
    if (get_luma(rect.color) > 120) return

    const mild_centerness_ratio = rect.centerness_ratio + (1 - rect.centerness_ratio) / 3
    const randomly_adjusted_centerness = Math.min(1, mild_centerness_ratio - 0.10 + Math.random() * 0.2)

    let rad = (Math.min(rect.width, rect.height) / 2) * 0.9 * randomly_adjusted_centerness
    ctx.beginPath()
    const transparent_color = `rgba(255,255,255, ${rect.centerness_ratio - (1 - rect.centerness_ratio) / 2})`
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
