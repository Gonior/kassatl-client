const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./public/index.html','./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        "width" : "width"
      },
      keyframes: {
        boom: {
          "0%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform : "scale(1.0)" }
        },
        blink : {
          "0%": { opacity :0 },
          "50%": { opacity:1 },
          "100%": { opacity:0 }
        }
      },
      animation: {
        boom: "boom 200ms ease-in-out",
        blink : "blink 1s  infinite"
      }
    },
  },
  plugins: [
    require('daisyui'),
    plugin(function({ addUtilities }){
      const newUtilities = {
        '.safe-top' : {
            paddingTop: 'constant(safe-area-inset-top)',
            paddingTop: 'env(safe-area-inset-top)'
        },
        '.safe-left' : {
            paddingLeft: 'constant(safe-area-inset-left)',
            paddingLeft: 'env(safe-area-inset-left)'
        },
        '.safe-right' : {
            paddingRight: 'constant(safe-area-inset-right)',
            paddingRight: 'env(safe-area-inset-right)'
        },
        '.safe-bottom' : {
            paddingBottom: 'constant(safe-area-inset-bottom)',
            paddingBottom: 'env(safe-area-inset-bottom)'
        },
        '.disable-scrollbars' : {
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
            '&::-webkit-scrollbar' : {
                width: '0px',
                background: 'transparent',
                display: 'none'
            },
            '& *::-webkit-scrollbar' : {
                width: '0px',
                background: 'transparent',
                display: 'none'
            },
            '& *' : {
                scrollbarWidth: 'none',
                '-ms-overflow-style': 'none'
            }
          },
        '.no-tap-highlighting': {
          '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
        }
      }
      addUtilities( newUtilities );
    })
  ],
  daisyui : {
    themes : [
      "light", "dark"
    ],
  }
}
