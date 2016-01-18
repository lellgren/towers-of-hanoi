/* Towers of Hanoi
 * by Lucas Ellgren
 */

TowerGame = function() {
	var tower = {
        // Member variables

		"pegA": [],
		"pegB": [],
		"pegC": [],
        "currentPiece": null,
        "gameOver": true,
        "isInAutoPlay": false,
        "autoPlayInterval": null,
        "autoMoveStep": 1,
        "showAnimations": true,

        // Constants

        "NUM_PIECES": 8,
        "BOARD_BOTTOM_Y_POS": 450,
        "PIECE_HEIGHT": 30,
        "PEG_A_X_POS": 166,
        "PEG_B_X_POS": 500,
        "PEG_C_X_POS": 833,
        "HOLDING_Y_POS": 0,
        "HOLDING_X_POS": 500,

        // Public methods

		"initialize": function() {
			this.resetGame();
            this.registerEventCallbacks();
		},

        "resetGame": function() {
            // Disable automatic play if it is running
            this.disableAutoPlay();

            // Stop all current piece animations and then
            // reset their positions
            $(".piece").stop(true, true);
            this.resetPieces();

            // Hide messages and reset variables
            $("#winText").hide();
            $("#errorMessage").hide();
            this.currentPiece = null;
            this.gameOver = false;
            this.isInAutoPlay = false;
        },

        "resetPieces": function() {
            // Hide all pieces and clear game board
            $(".piece").hide();
            this.pegA = [];
            this.pegB = [];
            this.pegC = [];

            // Reposition all pieces to leftmost peg
            var top, left, pieceRadius;
            for (var i = 1; i <= this.NUM_PIECES; i++) {
                this.pegA.push(i);
                this.positionPiece("pegA", i, i);
            }

            // Finally show them again
            $(".piece").show();
        },

        "positionPiece": function(peg, piece, positionInStack) {
            var pegXPos = this.getPegXPos(peg);

            var top = this.BOARD_BOTTOM_Y_POS - (this.PIECE_HEIGHT * positionInStack);
            var pieceRadius = 150 - ((piece - 1) * 15);
            var left = pegXPos - pieceRadius;

            $("#piece" + piece).css({
                "top": top + "px",
                "left": left + "px"
            });
        },

        "getPegXPos": function(pegId) {
            var pegXPos;
            switch (pegId) {
                case "pegA":
                    pegXPos = this.PEG_A_X_POS;
                    break;
                case "pegB":
                    pegXPos = this.PEG_B_X_POS;
                    break;
                case "pegC":
                    pegXPos = this.PEG_C_X_POS;
                    break;
                default:
                    pegXPos = 0;
                    console.error("Tried to get X position for invalid peg!");
                    break;
            }
            return pegXPos;
        },

        "positionTakenPiece": function(piece) {
            var pieceRadius = 150 - ((piece - 1) * 15);
            $("#piece" + piece).css({
                "top": this.HOLDING_Y_POS + "px",
                "left": (this.HOLDING_X_POS - pieceRadius) + "px"
            });
        },

        "animatePlacedPiece": function(piece, pegId, position) {
            var pegXPos = this.getPegXPos(pegId);

            var pieceRadius = 150 - ((piece - 1) * 15);
            var top = this.BOARD_BOTTOM_Y_POS - (this.PIECE_HEIGHT * position);

            // Calculate animation speedup according to how far down
            // the piece is on the peg
            var pegSpeedUp = (position + 1) * 8;
            // Calculate animation speedup according to which peg
            // the piece will be placed on
            var holdSpeedUp = pegId === "pegB" ? 100 : 0;

            $("#piece" + piece).animate({
                "top":  "120px",
                "left": (pegXPos - pieceRadius) + "px"
            }, (150 - holdSpeedUp), "linear").animate({
                "top": top + "px"
            }, (150 - pegSpeedUp), "swing");
        },

        "animateTakenPiece": function(piece, pegId, position) {
            var pieceRadius = 150 - ((piece - 1) * 15);

            // Calculate animation speedup according to how far down
            // the piece is on the peg
            var pegSpeedUp = (position + 1) * 8;
            // Calculate animation speedup according to which peg
            // the piece will be placed on
            var holdSpeedUp = pegId === "pegB" ? 150 : 0;

            $("#piece" + piece).animate({
                "top": "120px"
            }, (150 - pegSpeedUp), "linear").animate({
                "top": this.HOLDING_Y_POS + "px",
                "left": (this.HOLDING_X_POS - pieceRadius) + "px"
            }, (250 - holdSpeedUp), "swing");
        },

        "isPieceSelected": function() {
            return this.currentPiece !== null;
        },

        "canPlacePiece": function(pegId) {
            var peg = this[pegId];
            if (peg === undefined) {
                this.showError("Invalid move");
                return false;
            }

            if (peg[peg.length-1] > this.currentPiece) {
                this.showError("Invalid move");
                return false;
            }
            return true;
        },

        "canTakePiece": function(pegId) {
            var peg = this[pegId];
            if (peg === undefined) {
                this.showError("Invalid move");
                return false;
            }

            if (peg.length === 0) {
                this.showError("No piece to take");
                return false;
            }

            return true;
        },

        "addPiece": function(pegId) {
            var peg = this[pegId];
            var position = peg.length + 1;
            var piece = this.currentPiece;

            peg.push(piece);
            this.currentPiece = null;
            this.checkWinState();

            if (this.showAnimations) {
                this.animatePlacedPiece(piece, pegId, position);    
            } else {
                this.positionPiece(pegId, piece, peg.length);
            }
            
        },

        "takePiece": function(pegId) {
            var position = this[pegId].length;
            var piece = this[pegId].pop();
            this.currentPiece = piece;

            if (this.showAnimations) {
                this.animateTakenPiece(piece, pegId, position);
            } else {
                this.positionTakenPiece(piece);
            }
        },


        "checkWinState": function() {
            if (this.pegHasCorrectOrder(this.pegB) || this.pegHasCorrectOrder(this.pegC)) {
                $("#winText").show();
                this.gameOver = true;
            }
        },

        "pegHasCorrectOrder": function(peg) {
            if (peg.length === this.NUM_PIECES) {
                for (var i = 0; i < this.NUM_PIECES; i++) {
                    if (peg[i] !== (i + 1)) {
                        return false;
                    }
                    return true;
                }
            } else {
                return false;
            }
        },

        "enableAutoPlay": function() {
            this.isInAutoPlay = true;
            this.autoMoveStep = 1;
            this.autoPlayInterval = setInterval($.proxy(this.doAutomaticMove, this), 750);
            $("#autoPlayButton").text("Disable Auto Play");
        },

        "disableAutoPlay": function() {
            clearInterval(this.autoPlayInterval);
            this.isInAutoPlay = false;
            $("#autoPlayButton").text("Enable Auto Play");
        },

        "doAutomaticMove": function(event) {
            if (this.gameOver) {
                this.disableAutoPlay();
                return;
            }

            if (this.autoMoveStep === 1) {
                if (this.isMoveValid(this.pegA, this.pegB)) {
                    this.takePiece("pegA");
                    this.addPiece("pegB");
                } else {
                    this.takePiece("pegB");
                    this.addPiece("pegA");
                }
            } else if (this.autoMoveStep === 2) {
                if (this.isMoveValid(this.pegA, this.pegC)) {
                    this.takePiece("pegA");
                    this.addPiece("pegC");
                } else {
                    this.takePiece("pegC");
                    this.addPiece("pegA");
                }
            } else { // autoMoveStep === 3
                if (this.isMoveValid(this.pegB, this.pegC)) {
                    this.takePiece("pegB");
                    this.addPiece("pegC");
                } else {
                    this.takePiece("pegC");
                    this.addPiece("pegB");
                }
            }

            this.autoMoveStep++;
            if (this.autoMoveStep > 3) {
                this.autoMoveStep = 1;
            }
        },

        "isMoveValid": function(peg1, peg2) {
            if (peg1.length === 0) {
                return false;
            }
            var topPiece1 = peg1[peg1.length-1];
            var topPiece2 = peg2.length === 0 ? 0 : peg2[peg2.length-1];
            return topPiece1 > topPiece2;
        },

        "showError": function(message) {
            $("#errorMessage span").last().text(message);
            $("#errorMessage").show().delay(500).fadeOut(250);
        },

        "registerEventCallbacks": function() {
            $(".boardPegArea").on("click", $.proxy(this.onClickPegArea, this));
            $("#resetGameButton").on("click", $.proxy(this.onClickResetGame, this));
            $("#animationToggle").on("click", $.proxy(this.onClickToggleAnimation, this));
            $("#autoPlayButton").on("click", $.proxy(this.onClickAutoPlay, this));
            $("#animationToggle input[type=checkbox]").on("click", $.proxy(this.onClickCheckbox, this));
        },

        // Event Handlers

        "onClickPegArea": function(event) {
            // Retrieve ID of target area
            var targetId = $(event.currentTarget).attr("id");

            // If the game has ended or is in automatic play
            // then do nothing
            if (this.gameOver || this.isInAutoPlay) {
                return;
            }

            // If we already have a piece, try to place it
            // otherwise, take a piece from the stack
            if (this.isPieceSelected()) {
                if (this.canPlacePiece(targetId)) {
                    this.addPiece(targetId);
                }
            } else {
                if (this.canTakePiece(targetId)) {
                    this.takePiece(targetId);
                }
            }
        },

        "onClickResetGame": function(event) {
            event.preventDefault();

            var response = window.confirm("Are you sure you want to reset the game?");
            if (response === true) {
                this.resetGame();
            }
        },

        "onClickAutoPlay": function(event) {
            event.preventDefault();
            
            if (this.isInAutoPlay) {
                this.disableAutoPlay();
            } else {
                // If the game is in the starting state, just turn on
                // auto play right away, otherwise show a prompt first
                if (this.pegA.length === this.NUM_PIECES) {
                    this.enableAutoPlay();
                } else {
                    var response = window.confirm("This will reset the game. Are you sure?");
                    if (response === true) {
                        this.resetGame();
                        this.enableAutoPlay();
                    }
                }
            }
        },

        "onClickToggleAnimation": function(event) {
            event.preventDefault();
            this.showAnimations = !this.showAnimations;
            $("#animationToggle input[type=checkbox]").prop("checked", this.showAnimations);
        },

        "onClickCheckbox": function(event) {
            event.stopPropagation();
            var checked = $(event.currentTarget).prop("checked");
            this.showAnimations = checked;
        }
	};
	return tower;
}
