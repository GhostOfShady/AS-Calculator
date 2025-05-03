window.addEventListener('DOMContentLoaded', async() => {
    const { default: Ranks } = await import('./ranks.json', { with: { type: 'json' } });

    const selectRank = document.getElementById('select-rank')
    const ranksName = Object.keys(Ranks)

    for (let name of ranksName) {
        const option =  document.createElement('option')
        option.text = name
        option.value = name
        selectRank.appendChild(option)
    }

    const buttons = document.querySelectorAll('button')

    for (let button of buttons) {
        button.addEventListener('click', window[button.id.replace(/[-]/g, '_')])
    }
})