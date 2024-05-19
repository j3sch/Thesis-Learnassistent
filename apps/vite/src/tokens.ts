import { createTokens } from 'tamagui'

const size = {
  0: 0,
  0.25: 2,
  0.5: 4,
  0.75: 8,
  1: 20,
  1.5: 24,
  2: 28,
  2.5: 32,
  3: 36,
  3.5: 40,
  4: 44,
  true: 44,
  4.5: 48,
  5: 52,
  5.5: 59,
  6: 64,
  6.5: 69,
  7: 74,
  7.6: 79,
  8: 84,
  8.5: 89,
  9: 94,
  9.5: 99,
  10: 104,
  11: 124,
  12: 144,
  13: 164,
  14: 184,
  15: 204,
  16: 224,
  17: 224,
  18: 244,
  19: 264,
  20: 284,
}

const spaces = Object.entries(size).map(
  ([k, v]) => [k, Math.max(0, v <= 16 ? Math.round(v * 0.333) : Math.floor(v * 0.7 - 12))] as const
)

const spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k}`, -v])

const space = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative),
} as any

const zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
}

const radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 7,
  4: 9,
  true: 9,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
  10: 34,
  11: 42,
  12: 50,
}

export const green = {
  green1: 'hsl(146, 30.0%, 7.4%)',
  green2: 'hsl(155, 44.2%, 8.4%)',
  green3: 'hsl(155, 46.7%, 10.9%)',
  green4: 'hsl(154, 48.4%, 12.9%)',
  green5: 'hsl(154, 49.7%, 14.9%)',
  green6: 'hsl(154, 50.9%, 17.6%)',
  green7: 'hsl(153, 51.8%, 21.8%)',
  green8: 'hsl(151, 51.7%, 28.4%)',
  green9: 'hsl(151, 55.0%, 41.5%)',
  green10: 'hsl(151, 49.3%, 46.5%)',
  green11: 'hsl(151, 50.0%, 53.2%)',
  green12: 'hsl(137, 72.0%, 94.0%)',
}

export const red = {
  red1: 'hsl(353, 23.0%, 9.8%)',
  red2: 'hsl(357, 34.4%, 12.0%)',
  red3: 'hsl(356, 43.4%, 16.4%)',
  red4: 'hsl(356, 47.6%, 19.2%)',
  red5: 'hsl(356, 51.1%, 21.9%)',
  red6: 'hsl(356, 55.2%, 25.9%)',
  red7: 'hsl(357, 60.2%, 31.8%)',
  red8: 'hsl(358, 65.0%, 40.4%)',
  red9: 'hsl(358, 75.0%, 59.0%)',
  red10: 'hsl(358, 85.3%, 64.0%)',
  red11: 'hsl(358, 100%, 69.5%)',
  red12: 'hsl(351, 89.0%, 96.0%)',
}

export const yellow = {
  yellow1: 'hsl(45, 100%, 5.5%)',
  yellow2: 'hsl(46, 100%, 6.7%)',
  yellow3: 'hsl(45, 100%, 8.7%)',
  yellow4: 'hsl(45, 100%, 10.4%)',
  yellow5: 'hsl(47, 100%, 12.1%)',
  yellow6: 'hsl(49, 100%, 14.3%)',
  yellow7: 'hsl(49, 90.3%, 18.4%)',
  yellow8: 'hsl(50, 100%, 22.0%)',
  yellow9: 'hsl(53, 92.0%, 50.0%)',
  yellow10: 'hsl(54, 100%, 68.0%)',
  yellow11: 'hsl(48, 100%, 47.0%)',
  yellow12: 'hsl(53, 100%, 91.0%)',
}

export const blue = {
  blue1: 'hsl(212, 35.0%, 9.2%)',
  blue2: 'hsl(216, 50.0%, 11.8%)',
  blue3: 'hsl(214, 59.4%, 15.3%)',
  blue4: 'hsl(214, 65.8%, 17.9%)',
  blue5: 'hsl(213, 71.2%, 20.2%)',
  blue6: 'hsl(212, 77.4%, 23.1%)',
  blue7: 'hsl(211, 85.1%, 27.4%)',
  blue8: 'hsl(211, 89.7%, 34.1%)',
  blue9: 'hsl(206, 100%, 50.0%)',
  blue10: 'hsl(209, 100%, 60.6%)',
  blue11: 'hsl(210, 100%, 66.1%)',
  blue12: 'hsl(206, 98.0%, 95.8%)',
}

const color = {
  darkTransparent: 'rgba(10,10,10,0)',
  dark1: '#101010',
  dark2: '#151515',
  dark3: '#191919',
  dark4: '#232323',
  dark5: '#282828',
  dark6: '#323232',
  dark7: '#424242',
  dark8: '#494949',
  dark9: '#545454',
  dark10: '#626262',
  dark11: '#a5a5a5',
  dark12: '#fff',

  lightTransparent: 'rgba(255,255,255,0)',

  light1: '#fff',
  light2: '#f9f9f9',
  light3: 'hsl(0, 0%, 97.3%)',
  light4: 'hsl(0, 0%, 95.1%)',
  light5: 'hsl(0, 0%, 94.0%)',
  light6: 'hsl(0, 0%, 92.0%)',
  light7: 'hsl(0, 0%, 89.5%)',
  light8: 'hsl(0, 0%, 81.0%)',
  light9: 'hsl(0, 0%, 56.1%)',
  light10: 'hsl(0, 0%, 50.3%)',
  light11: 'hsl(0, 0%, 42.5%)',
  light12: 'hsl(0, 0%, 9.0%)',

  ...green,

  ...red,
  ...yellow,
  ...blue,
}

export const tokens = createTokens({
  color,
  space,
  size,
  radius,
  zIndex,
})
