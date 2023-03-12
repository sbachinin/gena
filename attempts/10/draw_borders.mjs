import { get_tile_from_point } from './get_tile_from_point.mjs'
import { get_luma, get_hex_from_image_data } from './colors.mjs'
import { random_of_arr } from './utils.mjs'

export const draw_borders = (count, ctx) => {
    const get_neighbor_color = tile => {
        const neighbor_colors = [
            ctx.getImageData(tile.left - 1, tile.top + tile.height / 2, 1, 1).data,
            ctx.getImageData(tile.left - 1, tile.top, 1, 1).data,
            ctx.getImageData(tile.left - 1, tile.bottom, 1, 1).data,
            ctx.getImageData(tile.right + 1, tile.top + tile.height / 2, 1, 1).data,
            ctx.getImageData(tile.right + 1, tile.top, 1, 1).data,
            ctx.getImageData(tile.right + 1, tile.bottom, 1, 1).data,
            ctx.getImageData(tile.left + tile.width / 2, tile.top - 1, 1, 1).data,
            ctx.getImageData(tile.left, tile.top - 1, 1, 1).data,
            ctx.getImageData(tile.right, tile.top - 1, 1, 1).data,
            ctx.getImageData(tile.left + tile.width / 2, tile.bottom + 1, 1, 1).data,
            ctx.getImageData(tile.left, tile.bottom + 1, 1, 1).data,
            ctx.getImageData(tile.right, tile.bottom + 1, 1, 1).data
        ]

        const remotest_color = neighbor_colors.sort((a, b) => {
            return Math.abs(get_luma(a) - get_luma(tile.color_data))
            - Math.abs(get_luma(b) - get_luma(tile.color_data))
        })[neighbor_colors.length - 1]

        // remotest by luma
        return get_hex_from_image_data(remotest_color)
    }

    Array.from(Array(count / 2)).forEach(
        _ => {
            const tile = get_tile_from_point([
                Math.round(Math.random() * (ctx.canvas.width - 1)),
                Math.round(Math.random() * (ctx.canvas.height - 1))
            ], ctx)
            
            if (!tile.is_pure) return

            ctx.beginPath()
            ctx.strokeStyle = get_neighbor_color(tile)
            const max_line_width = (Math.min(tile.width, tile.height) - 40) / 2
            const line_width = random_of_arr([20, 40, 60, 80].filter(w => w <= max_line_width))
            ctx.lineWidth = line_width
            ctx.strokeRect(tile.left + line_width / 2, tile.top + line_width / 2, tile.width - line_width + 1, tile.height - line_width + 1)
        }
    )
}