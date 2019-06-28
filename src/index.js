import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';

import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

  function Square(props) {
    let className = "square";
    if (props.isCheckmate) className += " checkmate";
    return (
      <button className={className} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  function Toggle(props) {
    const order = props.order === "asc" ? "▲" : "▼";
    return(
      <Button onClick={props.onClick} className={props.order} type="button" active={props.active} variant="outline-primary">{order}</Button>
    )
  }

  class Board extends React.Component {
    renderSquare(i, col, row) {
      const isCheckmate = (col === this.props.checkmate.col && row === this.props.checkmate.row)
      return (
        <Square
          key = {i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i, col, row)}
          isCheckmate={isCheckmate}
        />
      );
    }
  
    render() {
        const boardColumns = this.props.columns;
        const boardRows = this.props.rows;
      return (
        <div>
          {Array(boardRows).fill(null).map((_, i) => (            
            <div className="board-row" key={i}>
              {Array(boardColumns).fill(null).map((_, j) =>(
                this.renderSquare((i * boardColumns + j), j, i)
              ))}
            </div>
          ))}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    BOARD_COLUMNS = 3;
    BOARD_ROWS = 3;
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
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) ||  squares[i]) {
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
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      let checkmateSquare = {"col": -1, "row": -1}
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' col:' +  step.col + ' row:' + step.row:
          'Go to game start';

        const currentSelect = (this.state.stepNumber === move) ? "current-select active" : ""
        return (
          <ListGroup.Item key={move} as="button" onClick={() => this.jumpTo(move)} className={currentSelect} >
            {desc}
          </ListGroup.Item>
        );
      });
  
      let status;
      let isEndGame = false;
      if (winner) {
        status = "Winner: " + winner;
        checkmateSquare.col = current.col;
        checkmateSquare.row = current.row;
        isEndGame = true;
      } else {
        // 引き分け判定
        if(caluclateEven(history, this.BOARD_COLUMNS, this.BOARD_ROWS)) {
          status = "Even";
          isEndGame = true;
        } else {
          status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i, col, row) => this.handleClick(i, col, row)}
              checkmate={checkmateSquare}
              columns={this.BOARD_COLUMNS}
              rows={this.BOARD_ROWS}
            />
          </div>
          <div className="game-info">
            <Alert variant={isEndGame ? "success" : "primary"}>{status}</Alert>
            <ListGroup as="ol">{this.state.histroyOrder === "asc" ? moves : moves.reverse()}</ListGroup>
          </div>
          <ButtonGroup vertical={true} className="toggle-area">
            <Toggle
              key = "asc"
              order={"asc"} 
              onClick={() => this.handleChangeOrder("asc")}
              active={this.state.histroyOrder === "asc"}
            />
            <Toggle
              key = "desc"
              order={"desc"} 
              onClick={() => this.handleChangeOrder("desc")}
              active={this.state.histroyOrder === "desc"}
            />
          </ButtonGroup>
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

  function caluclateEven(history, columns, rows) {
    return history.length >= (columns * rows + 1)
  }
  