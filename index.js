const projects_count = 4

Array.from(Array(projects_count)).forEach((_, i) => {
    const id = i + 1
    const link = document.createElement('a')
    link.setAttribute('href', `./${id}/index.html`)
    link.innerText = id
    document.body.append(link)
})