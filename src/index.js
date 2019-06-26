import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  function Toggle(props) {
      const order = props.order === "asc" ? "▲" : "▼";
      return(
        <button onClick={props.onClick} className={props.order}>{order}</button>
      )
  }
  
  class Board extends React.Component {
    renderSquare(i, col, row) {
      return (
        <Square
          key = {i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i, col, row)}
        />
      );
    }
  
    render() {
        const boardColumns = 3;
        const boardRows = 3;
      return (
        <div>
          {Array(boardRows).fill(null).map((_, i) => (            
            <div className="board-row" key={i}>
              {Array(boardColumns).fill(null).map((_, j) =>(
                // console.log("key:" + (i * boardColumns + j)),
                this.renderSquare((i * boardColumns + j), j, i)
              ))}
            </div>
          ))}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
            col: 0,
            row: 0,
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        histroyOrder: "asc",
      };
    }
  
    handleClick(i, col, row) {
      // console.log("handleClick: i="+i + ", stepNumber:" + this.state.stepNumber + ", col:" + col + ", row:" + row)
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
            col: col,
            row: row
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    handleChangeOrder(order) {
      this.setState({
        histroyOrder: order
      });
    }
  
    render() {
      // console.log("historyOrder:" + this.state.histroyOrder)
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' col:' +  step.col + ' row:' + step.row:
          'Go to game start';

        const currentSelect = (this.state.stepNumber === move) ? "current-select" : ""
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} className={currentSelect}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i, col, row) => this.handleClick(i, col, row)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{this.state.histroyOrder === "asc" ? moves : moves.reverse()}</ol>
          </div>
          <div className="toggle-area">
            <Toggle
              key = "asc"
              order={"asc"} 
              onClick={() => this.handleChangeOrder("asc")}
            />
            <Toggle
              key = "desc"
              order={"desc"} 
              onClick={() => this.handleChangeOrder("desc")}
            />
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  