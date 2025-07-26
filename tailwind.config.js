module.exports = {
  theme: {
    extend: {
      animation: {
        'tarot-wiggle': 'tarotWiggle 1.2s infinite',
      },
      keyframes: {
        tarotWiggle: {
          '0%, 100%': { transform: 'rotate(-8deg) scale(1)' },
          '20%': { transform: 'rotate(8deg) scale(1.05)' },
          '40%': { transform: 'rotate(-6deg) scale(1.08)' },
          '60%': { transform: 'rotate(6deg) scale(1.05)' },
          '80%': { transform: 'rotate(-4deg) scale(1)' },
        },
      },
    },
  },
} 