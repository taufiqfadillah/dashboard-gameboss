var Countdown = (function () {
	var countdowns = [];
  
	function getTimeRemaining(endTime) {
	  var totalSeconds = Math.max(Math.floor((endTime - Date.now()) / 1000), 0),
		days = Math.floor(totalSeconds / (60 * 60 * 24)),
		hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60)),
		minutes = Math.floor((totalSeconds % (60 * 60)) / 60),
		seconds = totalSeconds % 60;
	  return {
		days: days,
		hours: hours,
		minutes: minutes,
		seconds: seconds,
	  };
	}
  
	function updateCountdown(index) {
	  var time = getTimeRemaining(countdowns[index].targetDate),
		countdownWrap = countdowns[index].targetElement.querySelector('.countdown-wrap');
  
	  if (!countdownWrap) {
		countdownWrap = document.createElement('div');
		countdownWrap.className = 'countdown-wrap';
		countdowns[index].targetElement.appendChild(countdownWrap);
	  }
  
	  countdownWrap.innerHTML = `
		${time.days}:${time.hours}:${time.minutes}:${time.seconds}
	  `;
	}
  
	function init(hours, targetElementId, index) {
	  var storedTargetDate = localStorage.getItem(targetElementId);
	  if (storedTargetDate) {
		countdowns[index].targetDate = new Date(storedTargetDate);
	  } else {
		countdowns[index].targetDate = new Date(Date.now() + hours * 60 * 60 * 1000);
		localStorage.setItem(targetElementId, countdowns[index].targetDate);
	  }
  
	  countdowns[index].targetElement = document.getElementById(targetElementId);
	  if (!countdowns[index].targetElement) {
		console.error("Target element not found.");
		return;
	  }
  
	  updateCountdown(index);
	  setInterval(function () {
		updateCountdown(index);
	  }, 1000);
	}
  
	function addCountdown(hours, targetElementId) {
	  var index = countdowns.length;
	  countdowns.push({
		targetDate: null,
		targetElement: null,
	  });
	  init(hours, targetElementId, index);
	}
  
	return {
	  addCountdown: addCountdown,
	};
  })();
  