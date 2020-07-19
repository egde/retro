import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {withCookies} from 'react-cookie';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import v4 from 'uuid/v4';

import Issue from '../components/Issue.jsx';
import IssueEntity from '../entities/Issue.js';

import IssueActions from '../actions/IssueActions';
import IssueStore from '../actions/IssueStore';
import { EventTypes as IssueEventTypes } from '../actions/IssueActionTypes';

import BoardActions from '../actions/BoardActions';
import BoardStore from '../actions/BoardStore';
import { EventTypes as BoardEventTypes } from '../actions/BoardActionTypes';

class Board extends Component {
    
    constructor(props) {
        super(props)
        
        const { cookies } = props;
        let userId = cookies.get('uuid');
        if (!userId) {
            userId = v4();
            cookies.set('uuid', userId)
        }

        this.state = {
            board : {
            },
            issues : [
            ],
            userId : userId
        }
        this.handleChange = this.handleChange.bind(this);
        this.addIssue = this.addIssue.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.setBoard = this.setBoard.bind(this);
        this.setIssues = this.setIssues.bind(this);
        this.saveEntry = this.saveEntry.bind(this);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentWillMount() {
        BoardStore.on(BoardEventTypes.LOAD_BOARD_COMPLETED, this.setBoard);
        BoardStore.on(BoardEventTypes.ADD_BOARD_USER_COMPLETED, this.addBoardUserCompleted);
        IssueStore.on(IssueEventTypes.LOAD_ISSUES_COMPLETED, this.setIssues);
        IssueStore.on(IssueEventTypes.DELETE_ISSUE_COMPLETED, this.deleteIssueCompleted);
        IssueStore.on(IssueEventTypes.BULKUPDATE_ISSUE_COMPLETED, this.setIssues);
    }

    componentWillUnmount() {
        BoardStore.removeListener(BoardEventTypes.LOAD_BOARD_COMPLETED, this.setBoard);
        BoardStore.removeListener(BoardEventTypes.ADD_BOARD_USER_COMPLETED, this.addBoardUserCompleted);
        IssueStore.removeListener(IssueEventTypes.LOAD_ISSUES_COMPLETED, this.setIssues);
        IssueStore.removeListener(IssueEventTypes.DELETE_ISSUE_COMPLETED, this.deleteIssueCompleted);
        IssueStore.removeListener(IssueEventTypes.BULKUPDATE_ISSUE_COMPLETED, this.setIssues);
    }

    componentDidMount() {
        const boardId = this.props.match.params.id;
        BoardActions.loadBoard(boardId);
        IssueActions.loadIssues(boardId);
    }
    
    addBoardUserCompleted = () => {
        const boardId = this.props.match.params.id;
        BoardActions.loadBoard(boardId);
    }

    deleteIssueCompleted = () => {
        const boardId = this.props.match.params.id;
        IssueActions.loadIssues(boardId);
    }

    setBoard() {
        this.setState({board: BoardStore.getBoard()});
    }
    
    setIssues() {
        const issues = IssueStore.getIssues()
        const issues_sorted = issues.sort((firstEl, secondEl) => {
            return firstEl.order - secondEl.order
        })

        this.setState({issues: issues_sorted});
    }
    
    saveEntry(id) {
        var issues = this.state.issues;
        
        const issue = issues.find((issue) => {
            return issue.id === id;
        });
        
        IssueActions.saveIssue(issue);
    }
    
    deleteEntry(id) {
        var issues = this.state.issues;
        
        const issue = issues.find((issue) => {
            return issue.id === id;
        });

        if (issue) {
            IssueActions.deleteIssue(issue);
        }
    }
    
    isUserInBoard = () => {
        const board = this.state.board;
        const userId = this.state.userId;

        const found = board.users.find((u) => {
            return u.userId === userId
        });

        return !found ? false : true;
    }

    addIssue(e) {
        const state = e.target.name;
        var issues = this.state.issues;
        var issue = new IssueEntity();
        issue.boardId = this.state.board.id;
        issue.state = state;
        issue.ownerId = this.state.userId;
        
        issues.push(issue);
        if (!this.isUserInBoard()) {
            BoardActions.addBoardUser(issue.boardId, this.state.userId);
        }
        this.setState({issues:issues});
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        var arrays = {}
        this.state.board.states.map((state, ind) => {
            arrays[state] = this.state.issues.filter((issue) => {
                    return issue.state === state
            })
        })
        
        var [removed] = arrays[result.source.droppableId].splice(result.source.index, 1)
        removed.state = result.destination.droppableId
        arrays[result.destination.droppableId].splice(result.destination.index, 0, removed)

        var result = []
        this.state.board.states.map((state, ind) => {
            arrays[state].forEach( element => {
                result.push(element)
            })
        })

        var i = 0
        result.forEach(element => {
            element.order = i
            i++
        });

        IssueActions.bulkSaveIssues(result)
    }
    
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (target.type === 'issue') {
            var issues = this.state.issues;
            const ind = issues.findIndex((issue) => {
                return issue.id === name
            });
            if (ind >= 0) {
                issues[ind] = value;
                
                this.setState({issues : issues});
            }
        }
    }
    
    render() {
        const getItemStyle = (isDragging, draggableStyle) => ({
            // some basic styles to make the items look a bit nicer
            userSelect: "none",
          
            // change background colour if dragging
            //background: isDragging ? "lightgreen" : "None",
            "padding-bottom": "20px",
          
            // styles we need to apply on draggables
            ...draggableStyle
          })
          
        const getListStyle = isDraggingOver => ({
            background: isDraggingOver ? "lightblue" : "None",
        });

        var home = window.location.protocol+'//'+window.location.hostname
        if (window.location.port) {
            home += ':' + window.location.port
        }
        if (this.state.board) {
            return (
                <section id="board" className="section">
                    <div className="container">
                    <h1 className="title">{`Board - ${this.state.board.title}`}</h1>
                        <nav className="breadcrumb" aria-label="breadcrumbs">
                        <ul>
                            <li><Link to="/boards">Boards</Link></li>
                            <li class="is-active"><Link to="." aria-current="page">{this.state.board.title}</Link></li>
                        </ul>
                        </nav>
                        <div className="notification is-info has-text-centered">Go to <strong>{home}</strong> and join this retro by using the code <strong>{this.state.board.id}</strong></div>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <div className="columns">
                                {
                                    this.state.board.states && this.state.board.states.map((state, ind) => {
                                        var issues = this.state.issues.filter((issue) => {
                                            return (issue.state === state);
                                        })
                                        return (
                                                <div key={state} className="column">
                                                    <div className="has-background-light">
                                                        <div className="level">
                                                            <div className="level-left">
                                                                <div className="level-item">
                                                                    <p className="heading">{state}</p> 
                                                                </div>
                                                            </div>
                                                            <div className="level-right">
                                                                <div className="level-item">
                                                                    <button name={state} className="button is-primary is-small" onClick={this.addIssue}>Add</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                                
                                                        <div className="section">
                                                            <div className="content">
                                                                <div className="tile is-ancestor">
                                                                    <div className="tile is-parent is-vertical">
                                                                        <Droppable droppableId={state}>
                                                                            {(provided, snapshot) => (
                                                                                <div
                                                                                    {...provided.droppableProps}
                                                                                    ref={provided.innerRef}
                                                                                    style={getListStyle(snapshot.isDraggingOver)}
                                                                                    >
                                                                                    {
                                                                                        issues.map((issue, ind) => (
                                                                                            <Draggable key={issue.id} draggableId={issue.id} index={ind}>
                                                                                                {(provided, snapshot) => (
                                                                                                    <div
                                                                                                        ref={provided.innerRef}
                                                                                                        {...provided.draggableProps}
                                                                                                        {...provided.dragHandleProps}
                                                                                                        style={getItemStyle(
                                                                                                            snapshot.isDragging,
                                                                                                            provided.draggableProps.style
                                                                                                        )}
                                                                                                        >
                                                                                                            <Issue issue={issue} states={this.state.board.states} userId={this.state.userId} key={ind} name={issue.id} onChange={this.handleChange} onDelete={this.deleteEntry} onFocusOut={this.saveEntry}/>
                                                                                                        </div>
                                                                                                )}
                                                                                            </Draggable>
                                                                                        ))
                                                                                    }
                                                                                    {provided.placeholder}
                                                                                </div>
                                                                            )}
                                                                        </Droppable>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        )
                                    })
                                }
                            </div>
                        </DragDropContext>
                    </div>
                </section>
            )
        }
         else {
            return (
                <section className="section">
                    <div className="container">
                        <h1 className="title">Sorry...</h1>
                        <div class="notification">
                            <p>The retro board you are looking for does not exist</p>
                            <p>You tried accessing the board with the id: <strong>{this.props.match.params.id}</strong></p>
                            <br/>
                            <Link className="button is-primary" to="/">Return</Link>
                        </div>
                    </div>
                </section>
                )
        }
    }
   
}

export default withCookies(Board);