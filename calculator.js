const timeUnitsInMinutes = {
    w: 7 * 24 * 60, // semana
    d: 24 * 60,     // dia
    h: 60,          // hora
    m: 1            // minuto
};

function calculate_time() {
    const selectedUnit = document.getElementById('select-time-status').value;
    const minutesPerUnit = timeUnitsInMinutes[selectedUnit];

    const amountOfUnits = +document.getElementById('status-time').value || 1;

    const tickInputs = ['stat-tick', 'champ-tick'];
    const [statTickRate, champTickRate] = tickInputs.map(id =>
        parseNumber(document.getElementById(id).value)
    );

    const selectedStat = document.getElementById('select-status').value;
    const ticksPerMin = ticksPerMinute[selectedStat] ?? 0;

    const totalStatPerMinute = (ticksPerMin * statTickRate) + (champTickRate * 10);
    const totalStatsGained = amountOfUnits * minutesPerUnit * totalStatPerMinute;

    const outputElement = document.getElementById('stat-time-gains');
    outputElement.innerText = `Total Stats Gained: ${formatNumber(totalStatsGained) || 0}`;
}


function calculate_tick_time(){
    const selectedUnit = document.getElementById('select-tick-status').value;
    const currentTicks = parseNumber(document.getElementById('current-ticks').value) || 0
    const neededTicks = parseNumber(document.getElementById('needed-ticks').value) || 0
    const missingTicks = neededTicks - currentTicks

    if (missingTicks < 0) return;

    const ticksPerMin = ticksPerMinute[selectedUnit] ?? 0;
    const totalTime = compactMinutes(missingTicks / ticksPerMin) || 0

    const outputElement = document.getElementById('ticks-result')
    outputElement.innerText = `Time Needed for Ticks: ${totalTime}`
}

function calculate_stat() {
    const ids = ['stat-tick', 'champ-tick', 'current-stat', 'wanted-stat']
    const [tick, champTick, currentStat, wantedStat] = ids.map((id) => parseNumber(document.getElementById(id).value))    
    const stat = document.getElementById('select-status').value

    const statusTick = ticksPerMinute[stat] ?? 0
    // StatusTickPerMinute * StatusTick + ChampionTick * ChampionTickPerMinute
    const statusPerMinute = (statusTick * tick) + (champTick * 10)

    const gainsPerMinuteText = document.getElementById('stat-gains')
    gainsPerMinuteText.innerText = `${stat[0].toUpperCase() + stat.slice(1)} Gain per Minute: ${formatNumber(statusPerMinute)}`
    
    const missingStat = wantedStat - currentStat
    const timeRemaining = compactMinutes(missingStat / statusPerMinute) || '0 Seconds'

    const timeRemainingText = document.getElementById('remaining-time')
    timeRemainingText.innerText = `Time to Reach Desired Stats: ${timeRemaining}`
}

async function calculate_coins() {
    const { default: Ranks } = await import('./ranks.json', { with: { type: 'json' } });

    const get = (id) => document.getElementById(id);
    const parse = (val) => parseNumber(val) || 0;

    const currentRank = get('select-rank').value;
    const multiplier = (get('hasX2').checked ? 2 : 1) * (get('hasGolden').checked ? 1.2 : 1);
    const gainsPerMinute = Ranks[currentRank] * multiplier;

    const timeUnit = get('select-time-coins').value;
    const timeCount = +get('coins-time').value || 1;
    const minutesPerUnit = timeUnitsInMinutes[timeUnit];
    const totalTimeInMinutes = minutesPerUnit * timeCount;

    const currentCoins = parse(get('current-coins').value);
    const neededCoins = parse(get('needed-coins').value);
    const coinGain = gainsPerMinute * totalTimeInMinutes;

    const output = get('coins-gains-result');
    const formatTime = { w: 'Week', d: 'Day', h: 'Hour', m: 'Minute' };
    const unitLabel = formatTime[timeUnit] + (timeCount > 1 ? 's' : '');
    const gainsText = `Coins in ${timeCount} ${unitLabel}: ${formatNumber(coinGain)}`;

    if (!neededCoins) {
        output.innerText = gainsText;
        return;
    }

    if (currentCoins >= neededCoins) {
        output.innerText = `You already have enough coins.\n${gainsText}`;
        return;
    }

    const missing = neededCoins - currentCoins;
    const estimatedTime = compactMinutes(missing / gainsPerMinute, 'Minutes') || '1 Minute';

    output.innerText = `Calculated Coins Needed: ${formatNumber(missing)}\nTime Required: ${estimatedTime}\n${gainsText}`;
}