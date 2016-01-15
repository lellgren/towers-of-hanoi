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

        // Constants

        "BOARD_BOTTOM_Y_POS": 550,
        "PIECE_HEIGHT": 30,
        "PEG_A_X_POS": 166,
        "PEG_B_X_POS": 500,
        "PEG_C_X_POS": 833,
        "HOLDING_Y_POS": 0,
        "HOLDING_X_POS": 500,

        // Public methods

		"newGame": function() {
			this.resetPieces();

            this.registerEventCallbacks();
		},

        "resetPieces": function() {
            // First hide all pieces
            $(".piece").hide();

            this.pegA = [];
            this.pegB = [];
            this.pegC = [];

            // Reposition pieces to leftmost peg
            var top, left, pieceRadius;
            for (var i = 1; i<=9; i++) {
                this.positionPiece("pegA", i, i);
                this.pegA.push(i);
            }

            // Show pieces again
            $(".piece").show();

            this.currentPiece = null;
        },

        "positionPiece": function(peg, piece, positionInStack) {
            var pegXPos;
            switch (peg) {
                case "pegA":
                    pegXPos = this.PEG_A_X_POS;
                    break;
                case "pegB":
                    pegXPos = this.PEG_B_X_POS;
                    break;
                case "pegC":
                    pegXPos = this.PEG_C_X_POS;
                    break;
            }

            var top = this.BOARD_BOTTOM_Y_POS - (this.PIECE_HEIGHT * positionInStack);
            var pieceRadius = 150 - ((piece - 1) * 15);
            var left = pegXPos - pieceRadius;

            $("#piece" + piece).css({
                "top": top + "px",
                "left": left + "px"
            });
        },

        "positionTakenPiece": function(piece) {
            var pieceRadius = 150 - ((piece - 1) * 15);
            $("#piece" + piece).css({
                "top": this.HOLDING_Y_POS + "px",
                "left": (this.HOLDING_X_POS - pieceRadius) + "px"
            });
        },

        "isPieceSelected": function() {
            return this.currentPiece !== null;
        },

        "canPlacePiece": function(pegId) {
            var peg = this[pegId];
            if (peg === undefined) {
                // show error
                return false;
            }

            if (peg[peg.length-1] > this.currentPiece) {
                // show error
                return false;
            }
            return true;
        },

        "canTakePiece": function(pegId) {
            var peg = this[pegId];
            if (peg === undefined) {
                // show error
                return false;
            }

            if (peg.length === 0) {
                // show error
                return false;
            }

            return true;
        },

        "addPiece": function(pegId) {
            var peg = this[pegId];
            peg.push(this.currentPiece);
            this.positionPiece(pegId, this.currentPiece, peg.length);
            this.currentPiece = null;
            this.checkWinState();
        },

        "takePiece": function(pegId) {
            var piece = this[pegId].pop();
            this.positionTakenPiece(piece);
            this.currentPiece = piece;
        },


        "checkWinState": function() {
            
        },

        "registerEventCallbacks": function() {
            $(".boardPegArea").on("click", $.proxy(this.onClickPegArea, this));
        },

        // Event Handlers

        "onClickPegArea": function(event) {
            // Retrieve ID of target area
            var targetId = $(event.currentTarget).attr("id");

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
	};
	return tower;
}
