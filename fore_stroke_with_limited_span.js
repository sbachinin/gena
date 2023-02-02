// fore stroke
const is_thin = Math.random() > 0.5
const fore_line_width = 2 + Math.random() * (is_thin ? 10 : 30)
const fore_lines_count = (7 + Math.random() * 12) / (fore_line_width / (is_thin ? 4 : 10))
ctx.beginPath()
ctx.strokeStyle = get_jolly_color()
ctx.lineWidth = fore_line_width
ctx.lineJoin = 'round'
const last_point = [
    canvas.width / 5 * 2 + Math.random() * canvas.width / 5,
    canvas.height / 5 * 2 + Math.random() * canvas.height / 5
]
ctx.moveTo(...last_point)
for (let i = 0; i < fore_lines_count; i++) {
    const line_span = 400 + Math.random() * 800
    const margin = border_width + w / 30
    const min_x = Math.min(
        w - margin - line_span,
        Math.max(
            last_point[0] - line_span / 2,
            margin
        )
    )

    const min_y = Math.min(
        h - margin - line_span,
        Math.max(
            last_point[1] - line_span / 2,
            margin
        )
    )

    last_point[0] = min_x + Math.random() * line_span
    last_point[1] = min_y + Math.random() * line_span
    ctx.lineTo(...last_point)
    
}
ctx.stroke()