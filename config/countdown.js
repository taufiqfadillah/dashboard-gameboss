const countdown = require('countdown');

function calculateRemainingTime(totalDuration) {
  const remainingTime = countdown(totalDuration * 60 * 60 * 1000);
  return {
    hours: remainingTime.hours,
    minutes: remainingTime.minutes,
  };
}

module.exports = { calculateRemainingTime };
