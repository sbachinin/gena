export const klee_colors = {
    bright: [
        '#ea4916',
        '#cb7155',
        '#c88334',
        '#eaa27f',
        '#d49f88',
        '#e08d65'
    ],

    neutral: [
        '#4f4b92',
        '#1e6a83',
        '#4c6666',
        '#356d75',
        '#1a6980',
        '#55655b',
        '#55655b',
        '#347f9c',
        '#25718d'
    ],

    dark: [
        '#6a1a25',
        '#11121b',
        '#12342d',
        '#262537',
        '#262537',
        '#2b2c36'
    ]
}

export const get_klee_colors = () => {
    return [
        ...klee_colors.bright,
        ...klee_colors.neutral,
        ...klee_colors.dark
    ]
}

export const get_luma = color_data => { // (luma means perceived brightness)
    const [r, g, b] = color_data
    return 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
}

export const get_hex_from_image_data = (data) => {
    const [r, g, b] = data
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component"
    return '#' + ((r << 16) | (g << 8) | b).toString(16)
}

export const parse_hex = c => {
    var c = c.substring(1)      // strip #
    var rgb = parseInt(c, 16)   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff  // extract red
    var g = (rgb >> 8) & 0xff  // extract green
    var b = (rgb >> 0) & 0xff  // extract blue
    return [r, g, b]
}

export const hexTransparencies = {
    100: 'FF',
    99: 'FC',
    98: 'FA',
    97: 'F7',
    96: 'F5',
    95: 'F2',
    94: 'F0',
    93: 'ED',
    92: 'EB',
    91: 'E8',
    90: 'E6',
    89: 'E3',
    88: 'E0',
    87: 'DE',
    86: 'DB',
    85: 'D9',
    84: 'D6',
    83: 'D4',
    82: 'D1',
    81: 'CF',
    80: 'CC',
    79: 'C9',
    78: 'C7',
    77: 'C4',
    76: 'C2',
    75: 'BF',
    74: 'BD',
    73: 'BA',
    72: 'B8',
    71: 'B5',
    70: 'B3',
    69: 'B0',
    68: 'AD',
    67: 'AB',
    66: 'A8',
    65: 'A6',
    64: 'A3',
    63: 'A1',
    62: '9E',
    61: '9C',
    60: '99',
    59: '96',
    58: '94',
    57: '91',
    56: '8F',
    55: '8C',
    54: '8A',
    53: '87',
    52: '85',
    51: '82',
    50: '80',
    49: '7D',
    48: '7A',
    47: '78',
    46: '75',
    45: '73',
    44: '70',
    43: '6E',
    42: '6B',
    41: '69',
    40: '66',
    39: '63',
    38: '61',
    37: '5E',
    36: '5C',
    35: '59',
    34: '57',
    33: '54',
    32: '52',
    31: '4F',
    30: '4D',
    29: '4A',
    28: '47',
    27: '45',
    26: '42',
    25: '40',
    24: '3D',
    23: '3B',
    22: '38',
    21: '36',
    20: '33',
    19: '30',
    18: '2E',
    17: '2B',
    16: '29',
    15: '26',
    14: '24',
    13: '21',
    12: '1F',
    11: '1C',
    10: '1A',
    9: '17',
    8: '14',
    7: '12',
    6: '0F',
    5: '0D',
    4: '0A',
    3: '08',
    2: '05',
    1: '03',
    0: '00'
}