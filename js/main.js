$('document').ready(function(){
	var $simonBlue = $('.simon-blue'),
		$simonYellow = $('.simon-yellow'),
		$simonGreen = $('.simon-green'),
		$simonRed = $('.simon-red'),
		$score = $('.score'),
		$highScore = $('.high-score'),
		$startBtn = $('.start-btn'),
		$gameState = $('.game-state'),
		$gameResult = $('.game-result'),
		$info = $('.info'),
		$strictBtn = $('.strict-btn'),
		simonBlueAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
		simonYellowAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
		simonGreenAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
		simonRedAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
		simonMap = {
			'1': $simonBlue,
			'2': $simonYellow,
			'3': $simonGreen,
			'4': $simonRed
		},
		simonAudio = {
			'1': simonBlueAudio,
			'2': simonYellowAudio,
			'3': simonGreenAudio,
			'4': simonRedAudio
		},
		currentSequence = [],
		newSequence = [],
		userSequence = [],
		getRandomNumberString,
		matchSequences,
		score = 0,
		highScore = 0,
		strictMode = false,
		presentSequenceToUser,
		endGame,
		presentingSequence = false,
		gameStopped = true,
		restartGame;

	getRandomNumberString = function getRandomNumberString(min,max) {
		return ""+(Math.floor(Math.random()*(max-min))+min);
	};

	matchSequences = function matchSequences(current,user) {
		var matched = false;
		if(current.length === user.length) {
			for(var i=0;i<current.length;i++) {
				if(current[i] === user[i]) {
					matched = true;
				} else {
					matched = false;
					break;
				}
			}
		} 
		return matched;
	};

	presentSequenceToUser = function presentSequenceToUser(sequence) {
		
		var i = 0;
		function loop() {
			if(gameStopped) {
				return;
			}
			$(simonMap[sequence[i]]).addClass('active');
			presentingSequence = true;
			if(simonAudio[sequence[i]]) {
				simonAudio[sequence[i]].play();
			}
			setTimeout(function(){
				$(simonMap[sequence[i]]).removeClass('active');
				if(i<sequence.length) {
					i++;
					setTimeout(function(){
						loop();
					},800);
				} else {
					presentingSequence = false;
				}
			},600);
		}
		loop();
	};
	endGame = function endGame() {
		$startBtn.removeClass('pressed').html('start');
		currentSequence = [];
		userSequence = [];
		if(score > highScore) {
			highScore = score;
		}
		$gameState.html('Game stopped');
		$info.html('');
		$highScore.html(highScore);
		gameStopped = true;
	};
	$('.simon').on('click',function(e){
		if(!presentingSequence) {
			var simonNumber = ""+$(e.currentTarget).data('val');
			userSequence.push(simonNumber);
			simonAudio[simonNumber].play();
			if(matchSequences(currentSequence, userSequence)) {
				score++;
				$score.html(score);
				$info.html('You got it!');
				userSequence = [];
				currentSequence.push(getRandomNumberString(1,5));
				setTimeout(function(){
					presentSequenceToUser(currentSequence);
				},1000);
			} else if (currentSequence.length === userSequence.length) {
				if(strictMode) {
					$gameResult.html('You lost :(');
					endGame();
				} else {
					userSequence = [];
					$info.html("You didn't get this! Repeating sequence");
					setTimeout(function(){
						presentSequenceToUser(currentSequence);
					},3000);
				}
			}
		}
	});

	$('.start-btn').on('click',function(e){
		currentSequence = [];
		userSequence = [];
		currentSequence.push(getRandomNumberString(1,5));
		$(e.currentTarget).toggleClass('pressed');
		if($(e.currentTarget).hasClass('pressed')) {
			score = 0;
			$score.html(score);
			$gameResult.html('');
			$(e.currentTarget).html('Stop');
			gameStopped = false;
			presentSequenceToUser(currentSequence);
			$gameState.html('Game running');
		} else {
			endGame();
		}
	});

	$('.strict-btn-wrap').on('click',function(){
		$($strictBtn).toggleClass('off').toggleClass('on');
		strictMode = !strictMode;
	});
});

