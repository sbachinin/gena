export const get_random_arr_index = (max) => {
    return Math.floor(Math.random() * max)
}
export const random_of_arr = (arr) => {
    return arr[get_random_arr_index(arr.length)]
}