const ticksPerMinute = {
    strength: 45,
    defense: 30,
    energy: 30,
    sword: 45
}

const suffixes = [
    '', 'k', 'm', 'b', 't', 'qd', 'qn', 'sx', 'sp', 'oc',
    'no', 'de', 'ud', 'dd', 'tdd'
]

function parseNumber(text) {
    const regex = /^([\d.]+)\s*([a-z]*)$/i
    const match = text.toLowerCase().match(regex);

    if (!match) return 0;

    const [_, numStr, suffix] = match;
    const num = parseFloat(numStr);
    const power = suffixes.indexOf(suffix);
  
    if (power === -1) return 0;
  
    return num * Math.pow(10, power * 3);
}

function formatNumber(num, precision = 2) {
    if (num < 1000) return num.toString();
  
    const tier = ~~(Math.log10(num) / 3);
    const suffix = suffixes[tier] || '';
    const scaled = num / Math.pow(10, tier * 3);
    
    return scaled.toFixed(precision).replace(/\.?0+$/, '') + suffix;
}

function compactMinutes(mins, minUnit = 'Seconds') {
    let seconds = mins * 60;
  
    const units = {
      Weeks: 604800,
      Days: 86400,
      Hours: 3600,
      Minutes: 60,
      Seconds: 1
    };
  
    const unitOrder = Object.keys(units);
    const minIndex = unitOrder.indexOf(minUnit);
    const allowedUnits = unitOrder.slice(0, minIndex + 1); // ex: até 'Minutes'
  
    const result = [];
  
    for (const unit of allowedUnits) {
      const value = units[unit];
      const amount = Math.floor(seconds / value);
      if (amount > 0) {
        result.push(`${amount} ${amount > 1 ? unit : unit.slice(0, -1)}`);
        seconds %= value;
      }
    }
  
    return result.join(' ');
  }
  
  