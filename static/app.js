const $board = $('#game');
const words = new Set();

// Handler for word submition
async function handleWordSubmit(e) {
	e.preventDefault();

	// Input
	const $word = $('.word', $board);

	// Input value
	let word = $word.val();

	// If input is blank do nothing
	if (!word) {
		return;
	}

	// If word already submitted do nothing
	if (words.has(word)) {
		return;
	}

	// Axios request to check word against dictionary of words
	const res = await axios.get('/check-word', { params: { word: word } });

	// Check word and respond with message about word status
	if (res.data.result === 'not-a-word') {
		showMessage(`${word} is not a valid word`, 'err');
	} else if (res.data.result === 'not-on-board') {
		showMessage(`${word} is not on this game board`, 'err');
	} else {
		showWord(word);
		showMessage(`Added: ${word}! Worth ${word} points!`, 'ok');
	}

	$word.val('').focus();
}

$('.add-word button').on('submit', handleWordSubmit);

function showMessage(msg, cls) {
	$('.msg', $board).empty().text(msg).removeClass().addClass(`msg-${cls}`);
}

function showWord(word) {
	$('.words', $board).append($('<li>', { text: word }));
}

let score = 0;

function showScore() {
	$('.score', $board).text(0);
}

async function scoreGame() {
	$('.add-word', $board).hide();
	const res = await axios.post('/game-over', { score: score });
	if (res.data.brokeRecord) {
		showMessage(`New record: ${this.score}`, 'ok');
	} else {
		showMessage(`Final score: ${this.score}`, 'ok');
	}
}

const timer = setInterval(countDown, 1000);
let time = 60;

function Timer() {
	$('.timer', $board).text(time);
}

async function countDown() {
	time -= 1;
	Timer();

	if (time === 0) {
		clearInterval(timer);
		await this.scoreGame();
	}
}
