import { vars } from "nativewind"

export type ThemeMode = 'light' | 'dark'

export const values = {
  light: {
    '--color-bg-default':   'rgb(250 250 250)',
    '--color-bg-card':      'rgb(255 255 255)',
    '--color-bg-deep':      'rgb(255 255 255)',
    '--color-bg-inverse':   'rgb(33  33  33)',
    '--color-text-default': 'rgb(27  27  27)',
    '--color-text-muted':   'rgb(128 128 128)',
    '--color-text-inverse': 'rgb(255 255 255)',
    '--color-error':        'rgb(255 0   0)',
    '--color-warning':      'rgb(255 255 0)',
    '--color-success':      'rgb(0   255 0)',
  },
  dark: {
    '--color-bg-default':   'rgb(33  33  33)',
    '--color-bg-card':      'rgb(45  45  45)',
    '--color-bg-deep':      'rgb(27  27  27)',
    '--color-bg-inverse':   'rgb(250 250 250)',
    '--color-text-default': 'rgb(255 255 255)',
    '--color-text-muted':   'rgb(128 128 128)',
    '--color-text-inverse': 'rgb(27  27  27)',
    '--color-error':        'rgb(255 0   0)',
    '--color-warning':      'rgb(255 255 0)',
    '--color-success':      'rgb(0   255 0)',
  }
}

export default {
  light: vars(values.light),
  dark: vars(values.dark)
}
