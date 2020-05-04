import React, {Component} from 'react';
import CounterButton from './counterButton'


const workTimeLabel = 'Work Time counter'
const freeTimeLabel = 'Free Time counter'

export default class App extends Component {

    state ={
        workCounter : 0,
        freeTimeCounter:0,
        showCounters : false,
        showWorkCounter : false,
        showFreeCounter : false,
        workTime:0,
        freeTime:0,
        enableButton : false
    }

    validateInputs=()=>{
        if( !isNaN(this.state.workTime) && !isNaN(this.state.freeTime) &&
            this.state.workTime > 0 &&  this.state.freeTime > 0){
            this.setState({
                enableButton : true
            })
        }else{
            this.setState({
                enableButton : false
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.workTime !== this.state.workTime || prevState.freeTime !== this.state.freeTime ){
            this.validateInputs()
        }
    }


    handleWorkTimeChange =(event)=> {
        this.setState({workTime: event.target.value})

    }
    handleFreeTimeChange=(event)=> {
        this.setState({freeTime: event.target.value})
    }

    toggleTimer=()=>{
        this.setState((prevState)=>({
            showCounters:!prevState.showCounters,
            showFreeCounter : false,
            showWorkCounter:true
        }))
    }

    workTimeDone=()=>{
        this.setState((prevState)=>({
            showWorkCounter:false,
            workCounter : prevState.workCounter++ ,
            showFreeCounter: true
        }))
    }

    freeTimeDone=()=>{
        this.setState((prevState)=>({
            showFreeCounter:false,
            freeTimeCounter : prevState.freeTimeCounter++ ,
            showWorkCounter : true
        }))
    }

    render() {
        return(
            <div className='container'>
                <label htmlFor="workTime">Work Time in seconds</label>
                <input type="text"  className="form-control"  value={this.state.workTime} onChange={this.handleWorkTimeChange}/>
                <label htmlFor="freeTime">Free Time in seconds</label>
                <input type="text"  className="form-control"  value={this.state.freeTime} onChange={this.handleFreeTimeChange}/>

                <button className='btn btn-primary' onClick={this.toggleTimer} disabled={!this.state.enableButton}>Toggle Start/Stop</button>
                {this.state.showCounters &&
                <div className="jumbotron">
                    <CounterButton buttonText='Working Time (sec)' count={(this.state.workCounter*this.state.workTime)}/> &nbsp;
                    <CounterButton buttonText='Free Time (sec)' count={(this.state.freeTimeCounter*this.state.freeTime)}/> &nbsp;
                    {this.state.showWorkCounter && <Counter timerLabel={workTimeLabel} maxTimeOut={this.state.workTime} parentCallBackForTimeOut={this.workTimeDone}/>}
                    {this.state.showFreeCounter && <Counter timerLabel={freeTimeLabel} maxTimeOut={this.state.freeTime} parentCallBackForTimeOut={this.freeTimeDone}/>}
                </div> }


            </div>

        )
    }


}

class Counter extends Component {
    state={
        count : 0
    }

    incrementCount = () =>{
        //conversion of string to int is important, else comparison fails !
        //i.e. this.props.maxTimeOut to  +this.props.maxTimeOut
        if(this.state.count === +this.props.maxTimeOut){
            this.props.parentCallBackForTimeOut()
            this.componentWillUnmount()
        }else{
            this.setState(prevState => ({count: prevState.count + 1}))
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }


    componentDidMount() {
        this.timer = setInterval(this.incrementCount, 1000)
    }


    render() {
        return(
        <>
            <label><b>{this.props.timerLabel} - {this.state.count}</b></label>

        </>
        )

    }
}


