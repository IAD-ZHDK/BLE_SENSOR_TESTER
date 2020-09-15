import './css/style.css'
import P5 from 'p5'
import Ble from './js/Ble'
// import * as dat from 'dat.gui'
// todo: webpack is building with html file paths defaulting to root. This should be local to make it easer to host demos with github pages
const containerElement = document.getElementById('p5-container')

const sketch = (p) => {
  let x = 100
  let y = 100
  let myFont
  let myBLE
  let chanelNames = ['Battery', 'Reference', 'Ch 6', 'Ch 5', 'Ch 4', 'Ch 3', 'Ch 2', 'Ch 1']
  let histogram = new Array(8)
  // Loop to create 2D array
  for (let i = 0; i < histogram.length; i++) {
    histogram[i] = new Array(1)
  }

  const serviceUuid = 'ff9c1e42-7b32-11ea-bc55-0242ac130003'
  let sensorCharacteristic
  let isConnected = false

  // settings gui
  const dat = require('dat.gui')
  const gui = new dat.GUI()
  let object1 = {
    type3_number: 0
  }
  gui.remember(object1)

  p.preload = function () {
    myFont = p.loadFont('static/fonts/inconsolata.otf')
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight)
    myBLE = new Ble()
    p.textFont(myFont)
    p.textSize(p.width / 100)
    p.fill(255)
    p.noStroke()
    p.textAlign(p.CENTER, p.CENTER)
    let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
    if (!isChrome) {
      window.alert('BLE may not work in your browser. Use Chrome or check for a list of compatible browsers here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API')
    }
    // setup settings gui
    let filter = this.gui.addFolder('filter')
    filter.add(object1, 'type3_number', -5, 5)
    filter.open()
  }

  p.draw = function () {
    p.clear()
    if (myBLE.isConnected) {
      // one sensor
      // p.push()
      // p.translate(p.windowWidth / 2, p.windowHeight / 2)
      // let radius = p.map(myBLE.sensorValues[myBLE.sensorValues.length - 1], 0, 16384, 10, 500)
      // p.ellipse(0, 0, radius, radius)
      // p.text(myBLE.sensorValues[myBLE.sensorValues.length - 1], 0, p.windowHeight / 4)
      // p.pop()

      // p.textAlign(p.LEFT)
      // p.text('battery: ' + myBLE.sensorValues[0], 20, 20)
      // p.textAlign(p.CENTER, p.CENTER)
      // remove first value (battery) and offset array
      let sensorValues = []
      for (let i = 0; i < myBLE.sensorValues.length - 1; i++) {
        sensorValues.push(myBLE.sensorValues[i + 1])
      }
      let spacing = p.windowWidth / myBLE.sensorValues.length
      p.translate((spacing / 2), p.windowHeight / 2)

      for (let i = 0; i < myBLE.sensorValues.length; i++) {
        p.push()
        p.translate(spacing * i, 0)
        let radius = p.map(myBLE.sensorValues[i], 0, 16384, 10, spacing * 0.3)
        histogram[i].unshift(radius / 2)
        p.stroke(100)
        for (let j = 0; j < histogram[i].length; j++) {
          p.line(-histogram[i][j], -j, histogram[i][j], -j)
        }
        if (histogram[i].length > 700) {
          histogram[i].pop([histogram[i].length])
        }
        p.ellipse(0, 0, radius, radius)
        p.noStroke()
        p.translate(0, spacing / 3 * 4.0)
        p.text(myBLE.sensorValues[i], 0, 0)
        p.translate(0, p.textSize())
        p.text(chanelNames[i], 0, 0)
        p.pop()
      }
    } else {
      p.translate(p.windowWidth / 2, p.windowHeight / 2)
      p.text('No BLE Connection, click anywhere to pair BLE device', 0, 0)
    }
  }

  p.touchStarted = function () {
    myBLE.connectAndStartNotify()
  }
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

let PFIVE = new P5(sketch, containerElement)
