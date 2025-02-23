import { vars } from "nativewind"

export type ThemeMode = 'light' | 'dark'

export const values = {
  light: {
    '--color-bg-default':          'rgb(245 245 245)',
    '--color-bg-foreground':       'rgb(255 255 255)',
    '--color-bg-foreground-extra': 'rgb(245 245 245)',
    '--color-bg-foreground-mild':  'rgb(240 240 240)',
    '--color-bg-deep':             'rgb(255 255 255)',
    '--color-bg-inverse':          'rgb(33  33  33)',
    '--color-bg-inverse-mild':     'rgb(45  45  45)',
    '--color-text-default':        'rgb(27  27  27)',
    '--color-text-muted':          'rgb(128 128 128)',
    '--color-text-inverse':        'rgb(255 255 255)',
    '--color-danger':              'rgb(255 0   0)',
    '--color-warning':             'rgb(255 64  64)',
    '--color-success':             'rgb(71  248 152)',
  },
  dark: {
    '--color-bg-default':          'rgb(33  33  33)',
    '--color-bg-foreground':       'rgb(45  45  45)',
    '--color-bg-foreground-extra': 'rgb(52  52  52)',
    '--color-bg-foreground-mild':  'rgb(38  38  38)',
    '--color-bg-deep':             'rgb(27  27  27)',
    '--color-bg-inverse':          'rgb(250 250 250)',
    '--color-bg-inverse-mild':     'rgb(210 210 210)',
    '--color-text-default':        'rgb(255 255 255)',
    '--color-text-muted':          'rgb(128 128 128)',
    '--color-text-inverse':        'rgb(27  27  27)',
    '--color-danger':              'rgb(255 0   0)',
    '--color-warning':             'rgb(255 64  64)',
    '--color-success':             'rgb(71  248 152)',
  }
}

export default {
  light: vars(values.light),
  dark: vars(values.dark)
}
