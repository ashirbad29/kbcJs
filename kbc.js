import readlineSync from 'readline-sync';
import chalk from 'chalk';
import questions from './questions.js';

const gameState = {
	totalMoneyWon: 0,
	hasLifeline: true,
	level: 1,
	hasWon: true,
};

const isAnswerCorrect = (question, answer) => {
	return answer === question.answer;
};

const lifeLine = ques => {
	/*
    :param ques: The question for which the lifeline is asked for. (Type JSON)
    :return: delete the key for two incorrect options and return the new ques value. (Type JSON)
  */
	const optionMap = {
		1: 'option1',
		2: 'option2',
		3: 'option3',
		4: 'option4',
	};

	let deleted = 0;
	for (let op in optionMap) {
		if (op == ques.answer) continue;

		if (deleted < 2) {
			ques[optionMap[op]] = 'deleted for you🙄';
			deleted++;
		}
	}
};

const kbc = () => {
	/*
    Rules to play KBC:
      * The user will have 15 rounds
      * In each round, user will get a question
      * For each question, there are 4 choices out of which ONLY one is correct.
      * Prompt the user for input of Correct Option number and give feedback about right or wrong.
      * Each correct answer get the user money corresponding to the question and displays the next question.
      * If the user is:
          1. below questions number 5, then the minimum amount rewarded is Rs. 0 (zero)
          2. As he correctly answers question number 5, the minimum reward becomes Rs. 10,000 (First level)
          3. As he correctly answers question number 11, the minimum reward becomes Rs. 3,20,000 (Second Level)
      * If the answer is wrong, then the user will return with the minimum reward.
      * If the user inputs "lifeline" (case insensitive) as input, then hide two incorrect options and
          prompt again for the input of answer.
      * NOTE:
          50-50 lifeline can be used ONLY ONCE.
          There is no option of lifeline for the last question( ques no. 15 ), even if the user has not used it before.
      * If the user inputs "quit" (case insensitive) as input, then user returns with the amount he has won until now,
          instead of the minimum amount.
  */
	// Display a welcome message only once to the user at the start of the game.
	console.log(chalk.yellowBright('\t----- Welcome To KBC.js 🦊 ------'));
	// For each question, display the prize won until now and available life line.
	// For now, the below code works for only one question without LIFE-LINE and QUIT checks
	let idx = 0;
	while (idx < questions.length) {
		const qNo = idx + 1;
		if (qNo == 15) gameState.hasLifeline = false;

		console.log(`
      Total Earnings: ${gameState.totalMoneyWon} | LifeLine ${
			gameState.hasLifeline
				? chalk.green('Avalilable')
				: chalk.red('Not Available')
		}`);

		const question = questions[idx];
		console.log(`\tQuestion ${qNo}: ${question.name}`);
		console.log('\t\tOptions:');
		console.log(`\t\t\tOption 1: ${question.option1}`);
		console.log(`\t\t\tOption 2: ${question.option2}`);
		console.log(`\t\t\tOption 3: ${question.option3}`);
		console.log(`\t\t\tOption 4: ${question.option4}`);
		const ans = readlineSync.question('Your choice ( 1-4 ) : ');

		// check for the input validations
		if (ans.toLowerCase() === 'quit') {
			console.log(chalk.yellowBright('Thanks for Playing. 😺'));
			break;
		}

		if (ans.toLowerCase() == 'll') {
			if (gameState.hasLifeline) {
				lifeLine(question, idx);
				gameState.hasLifeline = false;
				continue;
			} else {
				console.log(chalk.grey('You have used your lifeline🤧. try again'));
				continue;
			}
		}

		if (parseInt(ans) < 1 || parseInt(ans) > 4) {
			console.log(chalk.gray('Invalid input 😕'));
			continue;
		}

		if (isAnswerCorrect(question, parseInt(ans))) {
			console.log(chalk.green('\nCorrect 🥉'));

			// print the total money won.
			gameState.totalMoneyWon += question.money;
			console.log(`You have won ${gameState.totalMoneyWon} 💰 till now `);

			// see if the user has crossed a level, print that if yes
			if (qNo % 5 == 0) {
				gameState.level = gameState.level + 1;
				console.log(
					chalk.green(
						`You have crossed a level⚡, current level: ${gameState.level}`
					)
				);
			}
			idx++;
			console.log(chalk.red('- - - - - - - - - - - - - - - - - - - - - - '));
		} else {
			// end the game now.
			gameState.hasWon = false;
			// also print the correct answer
			console.log(chalk.red('\nIncorrect, Game Over 😔'));
			console.log(
				chalk.yellow('The Correct Answer is option ' + question.answer)
			);
			break;
		}
	}

	// print the total money won in the end.
	if (gameState.hasWon) {
		console.log(`You Have Won ${gameState.totalMoneyWon} 🤑`);
	} else {
		if (idx < 5) {
			console.log(`You Have Won 0 💰`);
		} else if (idx < 10) {
			console.log(`You Have Won 10,000 💰`);
		} else if (idx < 15) {
			console.log(`You Have Won 3,20,000 🤑`);
		}
	}
};

kbc();
