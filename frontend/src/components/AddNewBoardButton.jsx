import React, { Component } from 'react';

import BoardActions from '../actions/BoardActions';

import BoardEntity from '../entities/Board';

class AddNewBoardButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            board: null,
            isShowAddBoard:false,
            label : this.props.label ? this.props.label : 'Add'
        }

        this.handleChange = this.handleChange.bind(this);
        this.addBoard = this.addBoard.bind(this);
        this.addNewBoard = this.addNewBoard.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        var board = this.state.board;
        if (name === 'stateInd') {
            switch (value) {
                case '2':
                    board.states = ['Glad', 'Sad', 'Mad', 'Afraid'];
                    break;
                case '1':
                    board.states = ['GOOD', 'BAD', 'DISCONTINUE'];
                    break;
                default:
                    board.states = ['Smile', 'Frown', 'Improve'];
                    break;
            }        
        }
        board[name] = value;
    
        this.setState({board : board});
    }

    addBoard() {
        var b = new BoardEntity();
        b.ownerId = this.props.userId;
        
        this.setState({
            board: b,
            isShowAddBoard: true
        });
    }

    addNewBoard() {
        BoardActions.addBoard(this.state.board);
        this.setState({isShowAddBoard: false});
    }

    render() {
        return (
            <div id="AddNewBoardButton">
                <button className="button is-primary" onClick={this.addBoard}>{this.state.label}</button>
                {
                    this.state.isShowAddBoard && (
                        <div className="modal is-active">
                            <div className="modal-background"></div>
                            <div className="modal-content">
                                <div className="box">
                                    <div className="field">
                                        <label className="label">Title:</label>
                                        <div className="control">
                                            <input type="text" className="input" name="title" value={this.state.board.title} onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">States</label>
                                        <div className="control">
                                            <div className="select">
                                                <select name="stateInd" onChange={this.handleChange} value={this.state.board.stateInd}>
                                                    <option value="0">Smile - Frown - Improve</option>
                                                    <option value="1">GOOD - BAD - DISCONTINUE</option>
                                                    <option value="2">Glad - Sad - Mad - Afraid</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button className="button is-primary" onClick={this.addNewBoard}>Add</button>
                                        </div>
                                        <div className="control">
                                            <button className="button" onClick={()=>this.setState({isShowAddBoard: false})}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="modal-close is-large" aria-label="close" onClick={()=>this.setState({isShowAddBoard: false})}></button>
                        </div>
                    )   
                }
            </div>
        )
    }
}

export default AddNewBoardButton;