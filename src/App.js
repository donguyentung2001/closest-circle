import { Component } from 'react';
import React from 'react';
import './App.css';

// my code starts below
class Square extends Component {
  constructor(props) { 
    super(props); 
  }

  componentDidUpdate(prevProps) { 
    if (this.props.condition != prevProps.condition) { 
        var current_square = document.getElementById(this.props.id)
      if (this.props.condition == true) { 
        current_square.style.background = "#1E90FF"; 
      }
      else { 
        current_square.style.background = "#808080"; 
      }
    }
  }
  render() { 
    return (
      <button className="square" id = {this.props.id} onClick={this.props.changeClosest} condition = {this.props.condition} coordinates = {this.props.coordinates} style = {{width: "10px", border: "0px white", backgroundColor: "grey", padding: "5px", marginRight: "10px", marginBottom: "0px"}}> </button>
    )
  }
}

class Grid extends Component { 
  constructor(props) { 
    super(props); 
    this.renderSquare = this.renderSquare.bind(this) 
    this.renderSquares = this.renderSquares.bind(this)
    this.renderGrid = this.renderGrid.bind(this)
    this.changeClosest = this.changeClosest.bind(this)
    this.canvasHeight = 200
    this.canvasWidth = 200
    this.canvasRef = React.createRef()
    this.calculateRDerivative = this.calculateRDerivative.bind(this)
    this.calculateXDerivative = this.calculateXDerivative.bind(this)
    this.calculateYDerivative = this.calculateYDerivative.bind(this)
    this.generateCircle = this.generateCircle.bind(this)
    this.drawCircle = this.drawCircle.bind(this)
    this.resetGrid = this.resetGrid.bind(this)
    this.state = {
      conditions: [], //status of each circle: whether chosen or not
      coordinates: [], //list of coordinates of circle
      closestPoint: [], //list of points that our circle has to be close to
      context: null
    }
    for ( var i = 1; i <= 10; i++ ) {
      this.state.conditions[i] = []; 
      this.state.coordinates[i] = []
    }
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) { 
        this.state.conditions[i][j] = false 
        this.state.coordinates[i][j] = [5 + (j-1)*20, 15 + (i-1)*20]
      }
    }
  }

  changeClosest(point) {
    // toggle the point to chosen if not chosen, and vice versa.
    var new_conditions = this.state.conditions 
    var new_closestPoint = this.state.closestPoint 
    if (this.state.conditions[point[0]][point[1]] == true) {
      new_conditions[point[0]][point[1]] = false 
      new_closestPoint.splice(new_closestPoint.indexOf(this.state.coordinates[point[0]][point[1]]), 1)
      this.setState(state => ({ 
        conditions: new_conditions, 
        closestPoint: new_closestPoint
      }))
    }
    else { 
      if (!new_closestPoint.includes(this.state.coordinates[point[0]][point[1]])) {
        new_closestPoint.push(this.state.coordinates[point[0]][point[1]])
      }
      new_conditions[point[0]][point[1]] = true 
      this.setState(state => ({ 
        conditions: new_conditions, 
        closestPoint: new_closestPoint
      }))
    }
  }

  renderSquare(i,j, coordinates) { 
    return <Square id = {[i,j]} coordinates = {coordinates} condition = {this.state.conditions[i][j]}  changeClosest={() => this.changeClosest([i,j])}/>
  }

  renderSquares(start) { 
    var elements = []
    for (let i = 1; i <= 10; i++) { 
      elements.push(this.renderSquare(start, i, [5 + (i-1)*10, 15 + (start-1)*10])); 
    }
    return elements
  }

  renderGrid() { 
    var board = []; 
    for (let i = 1; i <= 10; i++) { 
      board.push(<div> {this.renderSquares(i)}  </div>); 
    }
    return board
  }

  calculateRDerivative(x, y, r) { 
    //calculate partial derivative of distance function with respect to radius of circle
    var output = 0
    for (let i = 0; i < this.state.closestPoint.length; i++) {
      let current_point = this.state.closestPoint[i]
      output += r - Math.sqrt(Math.pow(current_point[0] - x, 2) + Math.pow(current_point[1] - y,2))
    }
    output = output*2
    return output 
  }

  calculateXDerivative(x, y, r) { 
    // calculate partial derivative of distance function with respect to x coordinate of center
    var output = 0 
    for (let i = 0; i < this.state.closestPoint.length; i++) {
      let current_point = this.state.closestPoint[i]
      output += (x - current_point[0])*(Math.sqrt(Math.pow(current_point[0] - x, 2) + Math.pow(current_point[1] - y,2)) - r)/Math.sqrt(Math.pow(current_point[0] - x, 2) + Math.pow(current_point[1] - y,2))
    }
    output = output*2
    return output
  }

  calculateYDerivative(x,y,r) { 
    // calculate partial derivative of distance function with respect to y coordinate of center
    var output = 0 
    for (let i = 0; i < this.state.closestPoint.length; i++) {
      let current_point = this.state.closestPoint[i]
      output += (y - current_point[1])*(Math.sqrt(Math.pow(current_point[0] - x, 2) + Math.pow(current_point[1] - y,2)) - r)/Math.sqrt(Math.pow(current_point[0] - x, 2) + Math.pow(current_point[1] - y,2))
    }
    output = output*2
    return output
  }

  generateCircle() {
    var current_x = 100 //initialize values for x, y, r
    var current_y = 100
    var current_r = 1
    var learning_rate = 0.1
    var iterations = 0
    var current_xDerivative = this.calculateXDerivative(current_x, current_y, current_r)
    var current_yDerivative = this.calculateYDerivative(current_x, current_y, current_r)
    var current_rDerivative = this.calculateRDerivative(current_x, current_y, current_r)
    while ((current_xDerivative > 0.5 && current_yDerivative > 0.5 && current_rDerivative > 0.5) || iterations < 500) { //gradient descent step
      current_x = current_x - learning_rate*current_xDerivative //update each variable with respect to its partial derivative
      current_y = current_y - learning_rate*current_yDerivative
      current_r = current_r - learning_rate*current_rDerivative
      current_xDerivative = this.calculateXDerivative(current_x, current_y, current_r) //calculate new derivatives after update
      current_yDerivative = this.calculateYDerivative(current_x, current_y, current_r)
      current_rDerivative = this.calculateRDerivative(current_x, current_y, current_r)
      iterations += 1
    }
    this.drawCircle(current_x, current_y, current_r)
  }

  drawCircle(x,y,r) { 
    var context = this.canvasRef.current.getContext('2d')
    context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    context.beginPath()
    context.strokeStyle = "blue"
    context.arc(x,y,r, 0, 2 * Math.PI);
    context.stroke()
  }

  resetGrid() { 
    // reset all squares to be unchosen, erase any circle present on the grid.
    var new_conditions = this.state.conditions
    var new_closestPoint = []
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) { 
        new_conditions[i][j] = false 
      }
    }
    this.setState(state => ({ 
      conditions: new_conditions, 
      closestPoint: new_closestPoint
    }))
    var context = this.canvasRef.current.getContext('2d');
    context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  render() { 
    return (
      <div> 
      <div style = {{width:"200px", height: "200px", position: "relative"}}> 
        {this.renderGrid()}
        <canvas id="canvas" width = {this.canvasWidth} height = {this.canvasHeight} ref={this.canvasRef} style = {{position: "absolute", width: "100%", height: "100%", top: "0", left: "0", zIndex: -1}}> </canvas>
      </div>
      <button onClick = {this.generateCircle}> Generate </button>
      <button onClick = {this.resetGrid}> Reset grid</button>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App" style = {{display: "flex", justifyContent: "center"}}>
    <Grid/>
    </div>
  );
}

export default App;
