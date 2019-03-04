import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {withCookies} from 'react-cookie';
import v4 from 'uuid/v4';

import BoardActions from '../actions/BoardActions';
import BoardStore from '../actions/BoardStore';
import { EventTypes } from '../actions/BoardActionTypes';
import BoardEntity from '../entities/Board';

class BoardOverview extends Component {
    constructor(props) {
        super(props);

         
        const { cookies } = props;
        let userId = cookies.get('uuid');
        if (!userId) {
            userId = v4();
            cookies.set('uuid', userId)
        }

        this.state = {
            boards : {
                owner: [],
                edited : []
            },
            board : {},
            userId : userId,
            isShowAddBoard:false
        };
        
        this.addBoard = this.addBoard.bind(this);
        this.addNewBoard = this.addNewBoard.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loadBoards = this.loadBoards.bind(this);
    }
    
    componentWillMount() {
        BoardStore.on(EventTypes.LOAD_BOARDS_COMPLETED, this.loadBoards);
    }

    componentWillUnmount() {
        BoardStore.removeListener(EventTypes.LOAD_BOARDS_COMPLETED, this.loadBoards);
    }

    componentDidMount() {
        BoardActions.loadBoards(this.state.userId);
    }
    
    loadBoards() {
        var boards = BoardStore.getBoards();
        if (boards.edited) {
            boards.edited = boards.edited.filter(function(b1) {
                const found = boards.owned.find(function(b2) {
                    return b2.id === b1.id;
                });
                console.log(found);
                return  !found ? true : false;
            });
        }
        this.setState({boards : boards});
    }
    
    addBoard() {
        var b = new BoardEntity();
        b.ownerId = this.state.userId;
        
        this.setState({
            board: b,
            isShowAddBoard: true
        });
    }
    
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        var board = this.state.board;
        if (name === 'stateInd') {
            switch (value) {
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
    
    addNewBoard() {
        BoardActions.addBoard(this.state.board);
        this.setState({isShowAddBoard: false});
    }
    
    render() {
        return (
            <section id="BoardOverview" className="section">
                <div className="container">
                    <h1 className="title">Boards Overview</h1>
                    <div className="level">
                        <div className="level-left">
                            <div className="level-item has-text-centered">
                                <button className="button is-primary" onClick={this.addBoard}>Add</button>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="tile is-ancestor is-vertical">
                        {
                            this.state.boards.owned && this.state.boards.owned.map((board) => {
                                return (
                                    <div key={board.id} className="tile is-parent">
                                         <article className="tile is-child notification is-info">
                                            <Link to={"/board/"+board.id}>
                                                <span class="icon">
                                                    <i class="fas fa-user"></i>
                                                </span>
                                                {board.title}
                                            </Link>
                                        </article>
                                    </div>
                                );
                            })
                        }
                        {
                            this.state.boards.edited && this.state.boards.edited.map((board) => {
                                return (
                                    <div key={board.id} className="tile is-parent">
                                         <article className="tile is-child notification is-success">
                                            <Link to={"/board/"+board.id}>
                                                <span class="icon">
                                                    <i class="fas fa-pen"></i>
                                                </span>
                                                {board.title}
                                            </Link>
                                        </article>
                                    </div>
                                );
                            })
                        }
                        </div>
                    </div>

                </div>
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
            </section>
        );
    }
    
}

export default withCookies(BoardOverview);