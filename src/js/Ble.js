import P5 from 'p5'
import P5ble from 'p5ble'
let that
let filtering = true
class Ble {
  constructor () {
    console.log('looking for: A22A0001-AD0B-4DF2-A4E2-1745CBB4dCEE')
    this.serviceUuid = 'A22A0001-AD0B-4DF2-A4E2-1745CBB4dCEE'
    this.myBLE = new P5ble()
    this.isConnected = false
    this.sensorValues = []
    this.sensorValues[0] = 0
    this.sensorValues[1] = 0
    this.sensorValues[2] = 0
    this.sensorValues[3] = 0
    this.sensorValues[4] = 0
    this.sensorValues[5] = 0
    this.sensorValues[6] = 0
    this.sensorValues[7] = 0
    that = this
  }

  connectAndStartNotify () {
    // Connect to a device by passing the service UUID
    this.myBLE.connect(this.serviceUuid, this.gotCharacteristics)
  }
  gotCharacteristics (error, characteristics) {
    // A function that will be called once got characteristics
    if (error) {
      console.log('error: ', error)
    } else {
      console.log(characteristics[0])
      // Check if myBLE is connected
      console.log('check connection.')
      that.isConnected = that.myBLE.isConnected()

      // Add a event handler when the device is disconnected
      that.myBLE.onDisconnected(that.onDisconnected)

      for (let i = 0; i < characteristics.length; i++) {
        if (i === 0) {
          const sensorCharacteristic = characteristics[i]
          // Set datatype to 'custom', p5.ble.js won't parse the data, will return data as it is.
          that.myBLE.startNotifications(sensorCharacteristic, that.handleSensor, 'custom')
          console.log('characteristics: 1')
        } else if (i === 1) {
          console.log('characteristics: 2')
        } else if (i === 2) {
          console.log('characteristics: 3')
        } else {
          console.log("characteristic doesn't match.")
        }
      }
    }
  }

  onDisconnected () {
    console.log('Device was disconnected.')
    this.isConnected = false
  }

  handleSensor (data) {
    if (filtering) {
      let factor = 0.01
      that.sensorValues[0] = Math.floor(that.sensorValues[0] * factor)
      that.sensorValues[1] = Math.floor(that.sensorValues[1] * factor)
      that.sensorValues[2] = Math.floor(that.sensorValues[2] * factor)
      that.sensorValues[3] = Math.floor(that.sensorValues[3] * factor)
      that.sensorValues[4] = Math.floor(that.sensorValues[4] * factor)
      that.sensorValues[5] = Math.floor(that.sensorValues[5] * factor)
      that.sensorValues[6] = Math.floor(that.sensorValues[6] * factor)
      that.sensorValues[7] = Math.floor(that.sensorValues[7] * factor)
      that.sensorValues[0] += Math.floor(data.getUint16(0, true) * (1.0 - factor))
      that.sensorValues[1] += Math.floor(data.getUint16(2, true) * (1.0 - factor))
      that.sensorValues[2] += Math.floor(data.getUint16(4, true) * (1.0 - factor))
      that.sensorValues[3] += Math.floor(data.getUint16(6, true) * (1.0 - factor))
      that.sensorValues[4] += Math.floor(data.getUint16(8, true) * (1.0 - factor))
      that.sensorValues[5] += Math.floor(data.getUint16(10, true) * (1.0 - factor))
      that.sensorValues[6] += Math.floor(data.getUint16(11, true) * (1.0 - factor))
      that.sensorValues[7] += Math.floor(data.getUint16(12, true) * (1.0 - factor))
    } else {
      that.sensorValues[0] = data.getUint16(0, true)
      that.sensorValues[1] = data.getUint16(2, true)
      that.sensorValues[2] = data.getUint16(4, true)
      that.sensorValues[3] = data.getUint16(6, true)
      that.sensorValues[4] = data.getUint16(8, true)
      that.sensorValues[5] = data.getUint16(10, true)
      that.sensorValues[6] = data.getUint16(11, true)
      that.sensorValues[7] = data.getUint16(12, true)
    }
  }
}
export default Ble
