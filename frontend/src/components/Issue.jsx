import React, { Component } from 'react';
import IssueEntity from '../entities/Issue.js';

class Issue extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            mode: 'READ'
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        
    }
    
    deleteEntry() {
        const id = this.props.name;
        this.props.onDelete(id);
    }
    
    onFocusOut() {
        
        const id = this.props.name;
        this.props.onFocusOut(id);
        this.setState({mode:'READ'});
    }
    
    
    
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        var issueValue = this.props.issue.text;
        var stateValue = this.props.issue.state;
        
        if (target.name === "text") {
            issueValue = value;
        } else if (target.name === "state") {
            stateValue = value;
        }
        
        var issue = new IssueEntity();
        issue.id = this.props.name;
        issue.state = stateValue;
        issue.text = issueValue;
        issue.boardId = this.props.issue.boardId;
        issue.dbId = this.props.issue.dbId;
        issue.ownerId = this.props.issue.ownerId;
        
        var e = {
            target : {
                type : "issue",
                value: issue,
                name: this.props.name
            }
        };
        
        this.props.onChange(e);
        
        if (target.type === "select-one") {
            this.onFocusOut(); // weird i know. But whenever the value in the select box has changed, will trigger an focus out
        }
    }
    
    onMouseOver = () => {
        if (this.props.issue.ownerId === this.props.userId) {
            this.setState({mode:'EDIT'});
        }
    }
    
    onMouseLeaveTimed = () => {
        setTimeout(this.onMouseLeave, 2000);
    }
    
    render() {
        return (
            <div id={"issue-"+this.props.issue.id} className={this.props.issue.ownerId === this.props.userId ? "tile is-child box retro-box" : "tile is-child box retro-otherbox"}>
                <div className="level" style={{"margin-bottom": "0px"}}>
                    <div className="level-left"></div>
                    <div className="level-right">
                        <div className="level-item">
                            {
                                (this.props.issue.ownerId === this.props.userId) && (
                                    <a className="has-text-grey-light" onClick={this.deleteEntry}>
                                        <span className="icon">
                                            <i className="fas fa-times"></i>
                                        </span>
                                    </a>
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        {
                            this.state.mode === 'READ' && (
                                <p className="retro-textarea-readOnly" name="text" onClick={this.onMouseOver}>{this.props.issue.text}</p>
                                )
                        }
                        {
                            this.state.mode === 'EDIT' && (
                                <textarea className="textarea has-fixed-size" name="text" value={this.props.issue.text} onChange={this.handleChange} onMouseLeave={this.onFocusOut} onBlur={this.onFocusOut}/>
                                )
                        }
                    </div>
                </div>
                   
                <div className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <span className="has-text-grey-light is-family-monospace is-size-7">{this.props.issue.state}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default Issue;