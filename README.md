# alphabeta
Minimax implementation using AlphaBeta in Node using *asynchronous* calls to customizable game logic, scoring, and move generation.

The rational and motivation to use asynchronous calls (specifically to the scoring function) is to support integration with other processes such as DBs and REST calls whereby a scoring function uses a growing data lookup.  This cannot be accomplished in a synchronous way in javascript.

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Gitter chat][gitter-image]][gitter-url]

Help improve this package.  Ask me questions using [![Gitter chat][gitter-image]][gitter-url] or you can [log bugs here](https://github.com/panchishin/alphabeta/issues).  Even what seems trivial such as minor documentation errors or typos.


# Usage

## alphabeta configuration
Construct an alphabeta calculator like so:

```js
var config = {
	scoreFunction 		: scoreFunction,
	generateMoves		: generateMovesFunction,
	checkWinConditions 	: checkWinConditionsFunction
}

var alphabeta = require('alphabeta')( config );
```

That creates one instance of an alphabeta calculator which uses the scoring, move generation, and win condition checking that you provide.  If you want to make two different computer opponents battle eachother using two different strategies you'll want to create two instances of alphabeta each with its own configuration.

## alphabeta.setup
Each new turn or new problem will require you to set the current state of alphabeta.  You can reuse the previous configuration unless you want to change the logic (scoring, move generation) that is used.
Setup or reset the alphabeta calculator with data like so:

```js
var setup = {
	state : yourInitialStateObject,
	depth : theDepthOfSearch_alsoKnownAsLookAhead
}

alphabeta.setup( setup );
```

'depth' is optional (defaults to 1) and is the depth of search in moves.  Also known as look-ahead.


## alphabeta.step
Call the alphabeta calculator like so:
```js
alphabeta.step( callback );
```

A typical callback is as follows:
```js
function callback( done ) {
	if ( done === true ) {
		var bestNextStateAsGeneratedByGenerateMoves = alphabeta.best()
		// do something
	} else {
		// do something else
	}
}
```

'step' moves the calculator ahead by one step.  Depending on the number of moves generated and the depthParameter there could be hundreds, thousands, millions, or more steps needed before the calculator finishes.  alphabeta.best() returns the best state.

## alphabeta.allSteps
To execute all the steps until alphabeta has found the best move for the depth.  Call like so:
```js
alphabeta.allSteps( callback );
```

A typical callback is as follows
```js
function callback( beststate ) {
	// beststate is the best state as generated by generateMoves
}
```

## alphabeta.stepForMilliseconds
To execute all the steps until alphabeta has found the best move for the depth or the number of milliseconds has expired.  Call like so:

```js
alphabeta.stepForMilliseconds( milliseconds , callback );
```

A typical callback is as follows

```js
function callback( beststate ) {
	// beststate is the best state as generated by generateMoves
}
```


## Configuration Functions
This is the specification of the configuration functions you pass to alphabeta

### scoreFunction
The scoreFunction that you provide is an asynchronous function that evaluates a state like so:

```js
scoreFunction( state , scoreCallback ) {
	var scoreNumber = 0;
	// inspect state and modify the score
	scoreCallback( scoreNumber );
}
```

### generateMoves
The generateMovesFunction that you provide is a synchronous function that returns a list of possible states like so:

```js
generateMovesFunction( currentState ) {
	var nextPossibleStates = [];

	// use the currentState and possibly some 
	// other info to create new state objects
	// which would represent valid next states.
	// If this is a game, then the state
	// is the game board and move as an object

	// for ( item in a list of possible moves ) {
		// use item to create a new state
		// push state onto nextPossibleStates
	// }

	return nextPossibleStates;

}
nextPossibleStates = generateMovesFunction( currentState );
```

### checkWinConditionsFunction
The checkWinConditionsFunction that you provide is a synchronous function that checks to see if the state is a good end state such as a winning move.  A psudo code implementation may look like so:

```js
checkWinConditionsFunction( state ) {
	if ( /* state is a win or positive end condition */ ) {
		return true; // anything truthy such as 
					 //'true' or a string specifying the reason
	} else {
		return false; // anything falsy such as null or undefined
	}
}
```

If you want to know the best score found you can use 

```js
var score = alphabeta.alpha();
```

If you want to know the predicted final state if the everything unfolds as the alphabeta calculator predicts use:

```js
var state = alphabeta.prediction();
```

# Example

## Tic Tac Toe

Execute the *tic tac toe* example like so using the command line

```bash
# player 1 and 2 both only get 1 look-ahead
node example/tic-tac-toe/index.js 1 1

# player 2 gets 3 look-aheads
node example/tic-tac-toe/index.js 1 3

# player 1 gets 3 look-aheads
node example/tic-tac-toe/index.js 3 1

# player 1 and 2 both only get 9 look-ahead
node example/tic-tac-toe/index.js 9 9
```

## Template

There is an empty template with 'TODO' comments to create a fully working computer vs computer scenario.

```bash
node example/template/index.js
```

## Chomp (from template)

Chomp is a trivial game of two players.  Each player can eat 1, 2, or 3 pieces of a line of 10 pieces long.  The player who eats the last peices wins.  This example uses template/index.js as a boilerplate.

```bash
node example/template/chomp.js
```

# FAQ

**What is the state object?**  It is whatever you decided is best for your problem.  It is what **generateMovesFunction** creates and what **scoreFunction** takes as an argument.  If your problem is tic tac toe, then perhaps state contains the current board and some other data that you find interesting such as what the previous move was.

**Why is there a .step(callback) function and not just .allSteps(callback)?**  Depending on the depthParameter and the average number of moves generated from **generateMovesFunction** calculating the best next state can take a very long time.  Using **.step(callback)** allows you to move the calculation forward towards completion without blocking and exit when you want, such as after 10 seconds.

**What is the difference between a move and a state?** A move is the just the state that comes after some previous state.  It's just another name for state.

# References

* [Instructor: Patrick Winston from MIT](https://www.youtube.com/watch?v=STjW3eH0Cik)
* [Wikipedia entry for Minimax](https://en.wikipedia.org/wiki/Minimax)


[gitter-url]: https://gitter.im/panchishin/alphabeta
[gitter-image]: https://badges.gitter.im/panchishin/alphabeta.png
[downloads-image]: http://img.shields.io/npm/dm/alphabeta.svg

[npm-url]: https://npmjs.org/package/alphabeta
[npm-image]: http://img.shields.io/npm/v/alphabeta.svg

[travis-url]: https://travis-ci.org/panchishin/alphabeta
[travis-image]: http://img.shields.io/travis/panchishin/alphabeta.svg

[coveralls-url]: https://coveralls.io/r/panchishin/alphabeta
[coveralls-image]: http://img.shields.io/coveralls/panchishin/alphabeta/master.svg
