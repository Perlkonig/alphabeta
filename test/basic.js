//var assert = require("assert")
var alphabetaConstructor = require("../alphabeta.js")

module.exports = {


	'alphabeta is a function' : function(beforeExit, assert) {
		assert.equal('function', typeof alphabetaConstructor)
	},

	'constructor creates object' : function(beforeExit, assert) {

		var alphabeta = alphabetaConstructor( { } );

		assert.equal('object' , typeof alphabeta )
	},


	'constructor creates object' : function(beforeExit, assert) {

		var alphabeta = alphabetaConstructor( { } );

		assert.equal('object' , typeof alphabeta )
	},


	'complete successfully for no available moves' : function(beforeExit, assert) {

		var alphabeta = alphabetaConstructor( { 
			scoreFunction : function(state , callback) { callback(0) },
			generateMoves : function(state) { return [] },
			checkWinConditions : function(state) { return false }
		} );

		alphabeta.setup( {} , 3 )
		var n = 0;
		alphabeta.allSteps( function( bestMove ) {
			n++;
			assert.equal( false , bestMove )
		})

	    beforeExit(function() {
	        assert.equal(1, n, 'Ensure timeout is called');
	    });
	},


	'complete successfully for instant win condition' : function(beforeExit, assert) {

		var onlyMove = { move : "only" }

		var alphabeta = alphabetaConstructor( { 
			scoreFunction : function(state , callback) { return callback(0) },
			generateMoves : function(state) { return [ onlyMove ] },
			checkWinConditions : function(state) { return JSON.toString(state) == JSON.toString(onlyMove) }
		} );

		alphabeta.setup( {} , 3 )
		var n = 0;
		alphabeta.allSteps( function( bestMove ) {
			n++;
			assert.equal( onlyMove , bestMove )
		})

	    beforeExit(function() {
	        assert.equal(1, n, 'Ensure timeout is called');
	    });
	},


	'complete successfully for second call to allSteps' : function(beforeExit, assert) {

		var onlyMove = { move : "only" }

		var alphabeta = alphabetaConstructor( { 
			scoreFunction : function(state , callback) { return callback(0) },
			generateMoves : function(state) { return [ onlyMove ] },
			checkWinConditions : function(state) { return JSON.toString(state) == JSON.toString(onlyMove) }
		} );

		alphabeta.setup( {} , 3 )
		var n = 0;
		alphabeta.allSteps( function( bestMove ) {
			n++;
			assert.equal( onlyMove , bestMove )
			alphabeta.allSteps( function( bestMove ) {
				n++;
				assert.equal( onlyMove , bestMove )
			})
		})

	    beforeExit(function() {
	        assert.equal(2, n, 'Ensure timeout is called');
	    });
	},


	'complete chomp' : function(beforeExit, assert) {

		var alphabeta = createChompExample(10);

		var n = 0;
		alphabeta.allSteps( function( bestMove ) {
			n++;
			assert.equal( 2, bestMove.chompedLength )
			assert.equal( 8 , bestMove.linelength )
			assert.equal( 'second' , bestMove.player )

			var predicted = alphabeta.prediction().state

			assert.equal( 3 , predicted.chompedLength )
			assert.equal( 0 , predicted.linelength )
			assert.equal( 'second' , predicted.player )
		})

	    beforeExit(function() {
	        assert.equal(1, n, 'Ensure timeout is called');
	    });
	},


	'complete chomp in 60 seconds' : function(beforeExit, assert) {

		var alphabeta = createChompExample(10);

		var n = 0;
		alphabeta.stepForMilliseconds( 60 * 1000, function( bestMove ) {
			n++;
			assert.equal( 2, bestMove.chompedLength )
			assert.equal( 8 , bestMove.linelength )
			assert.equal( 'second' , bestMove.player )

			var predicted = alphabeta.prediction().state

			assert.equal( 3 , predicted.chompedLength )
			assert.equal( 0 , predicted.linelength )
			assert.equal( 'second' , predicted.player )
		})

	    beforeExit(function() {
	        assert.equal(1, n, 'Ensure timeout is called');
	    });
	}

}


function createChompExample(depth) {

	function createInitialState( ) {
		var someState = { linelength : 10 , player : "first" , move : "started" };
		return someState;
	}

	function scoreFunction( state , callback ) {
		callback( 0 ); // ignore state
	}

	function generateMoves( state ) {
		var possibleStates = [  ];

		function createState( state , chompedLength ) {
			return {
				chompedLength : chompedLength,
				linelength : state.linelength - chompedLength , 
				player : ( state.player == "first" ? "second" : "first" )					
			}
		}

		for( var chomp = 1 ; chomp <= 3 ; chomp++ ) {
			if ( state.linelength >= chomp ) {
				possibleStates.push( createState( state , chomp ) );
			}
		}

		return possibleStates;
	}


	function checkWinConditions( state ) {
		return state.linelength == 0
	}

	var alphabeta = require("../alphabeta.js")({
		scoreFunction : scoreFunction,
		generateMoves : generateMoves,
		checkWinConditions : checkWinConditions
	})

	alphabeta.setup( { state : createInitialState() , depth : depth } )
	return alphabeta;
}