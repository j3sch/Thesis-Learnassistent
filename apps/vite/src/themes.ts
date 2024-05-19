import { createTheme } from '@tamagui/create-theme'

import { green, red, tokens, yellow } from './tokens'

/**
 * This is an advanced setup of themes for *only* light + dark (no colors)
 *
 * For color themes, see the @tamagui/config source code themes.ts file
 * which this was based off of, which includes extra steps for color and
 * alternate sub-themes.
 */

export const themes = (() => {
  // background => foreground
  const palettes = {
    light: [
      tokens.color.darkTransparent,
      tokens.color.light1,
      tokens.color.light2,
      tokens.color.light3,
      tokens.color.light4,
      tokens.color.light5,
      tokens.color.light6,
      tokens.color.light7,
      tokens.color.light8,
      tokens.color.light9,
      tokens.color.light10,
      tokens.color.light11,
      tokens.color.light12,
      tokens.color.lightTransparent,
    ],
    dark: [
      tokens.color.lightTransparent,
      tokens.color.dark1,
      tokens.color.dark2,
      tokens.color.dark3,
      tokens.color.dark4,
      tokens.color.dark5,
      tokens.color.dark6,
      tokens.color.dark7,
      tokens.color.dark8,
      tokens.color.dark9,
      tokens.color.dark10,
      tokens.color.dark11,
      tokens.color.dark12,
      tokens.color.darkTransparent,
    ],
    green: [
      tokens.color.green1,
      tokens.color.green2,
      tokens.color.green3,
      tokens.color.green4,
      tokens.color.green5,
      tokens.color.green6,
      tokens.color.green7,
      tokens.color.green8,
      tokens.color.green9,
      tokens.color.green10,
      tokens.color.green11,
      tokens.color.green12,
    ],
    blue: [
      tokens.color.blue1,
      tokens.color.blue2,
      tokens.color.blue3,
      tokens.color.blue4,
      tokens.color.blue5,
      tokens.color.blue6,
      tokens.color.blue7,
      tokens.color.blue8,
      tokens.color.blue9,
      tokens.color.blue10,
      tokens.color.blue11,
      tokens.color.blue12,
    ],
    yellow: [
      tokens.color.yellow1,
      tokens.color.yellow2,
      tokens.color.yellow3,
      tokens.color.yellow4,
      tokens.color.yellow5,
      tokens.color.yellow6,
      tokens.color.yellow7,
      tokens.color.yellow8,
      tokens.color.yellow9,
      tokens.color.yellow10,
      tokens.color.yellow11,
      tokens.color.yellow12,
    ],
    red: [
      tokens.color.red1,
      tokens.color.red2,
      tokens.color.red3,
      tokens.color.red4,
      tokens.color.red5,
      tokens.color.red6,
      tokens.color.red7,
      tokens.color.red8,
      tokens.color.red9,
      tokens.color.red10,
      tokens.color.red11,
      tokens.color.red12,
    ],
  }

  const genericsTemplate = {
    backgroundTransparent: 1,
    background: 4,
    backgroundHover: 5,
    backgroundPress: 6,
    backgroundFocus: 4,
    color: -1,
    colorHover: -2,
    colorPress: -1,
    colorFocus: -2,
    borderColor: 4,
    borderColorHover: 7,
    borderColorPress: 5,
    borderColorFocus: 6,
    placeholderColor: -4,
  }

  const colorStepsTemplate = {
    color1: 1,
    color2: 2,
    color3: 3,
    color4: 4,
    color5: 5,
    color6: 6,
    color7: 7,
    color8: 8,
    color9: 9,
    color10: 10,
    color11: 11,
    color12: 12,
  }

  const shadowsTemplate = {
    shadowColor: 1,
    shadowColorHover: 1,
    shadowColorPress: 2,
    shadowColorFocus: 2,
  }

  const template = {
    ...colorStepsTemplate,
    ...shadowsTemplate,
    ...genericsTemplate,
  }

  /**
   * Create the base light/dark themes, they use the full "template"
   */
  const light = createTheme(palettes.light, template)
  const dark = createTheme(palettes.dark, template)
  const green = createTheme(palettes.green, template)
  const blue = createTheme(palettes.blue, template)
  const yellow = createTheme(palettes.yellow, template)
  const red = createTheme(palettes.red, template)

  const baseThemes = {
    light,
    dark,
    green,
    blue,
    yellow,
    red,
  }

  return baseThemes
})()
