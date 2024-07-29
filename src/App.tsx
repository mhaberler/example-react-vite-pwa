import { useState, useEffect, useContext } from 'react';
import NotyfContext from './NotyfContext.js';
import { Notyf } from 'notyf';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'notyf/notyf.min.css';

function App() {
  const [count, setCount] = useState(0)
  const [supportsBluetooth, setSupportsBluetooth] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(null);

  const notyf: Notyf = useContext(NotyfContext);

  // When the component mounts, check that the browser supports Bluetooth
  useEffect(() => {
    console.log("navigator.bluetooth:", navigator.bluetooth)
    if (navigator.bluetooth) {
      setSupportsBluetooth(true);
    }
  }, []);


  const logDataView = (labelOfDataSource, key, valueDataView) => {
    const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
      return b.toString(16).padStart(2, '0');
    }).join(' ');
    const textDecoder = new TextDecoder('ascii');
    const asciiString = textDecoder.decode(valueDataView.buffer);

    notyf.success(
      `  ${labelOfDataSource} Data: ` + key +
      '\n    (Hex) ' + hexString +
      '\n    (ASCII) ' + asciiString);

  }

  // {"acceptAllAdvertisements":true}
  const startScanForBLEDevices = async () => {
    const options = {
      acceptAllAdvertisements: true,
      keepRepeatedDevices: true,
      active: true
    }
    try {
      const scan = await navigator.bluetooth.requestLEScan(options);

      navigator.bluetooth.addEventListener('advertisementreceived', event => {
        const result =
          'Advertisement received: ' +
          '  Device Name: ' + event.device.name +
          '  Device ID: ' + event.device.id +
          '  RSSI: ' + event.rssi +
          '  TX Power: ' + event.txPower +
          '  UUIDs: ' + event.uuids;
        notyf.success(result);

        event.manufacturerData.forEach((valueDataView, key) => {
          logDataView('Manufacturer', key, valueDataView);
        });
        event.serviceData.forEach((valueDataView, key) => {
          logDataView('Service', key, valueDataView);
        });
      });
    } catch (error) {
      console.log('Argh! ' + error);
    }
  };

  const stopScan = () => {
    // https://github.com/capacitor-community/bluetooth-le/blob/0ce507c207b072d84707567a98184b1c91fa5d1c/src/web.ts#L105
    //     await this.stopLEScan();
    console.log('stopScan');

  };
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="webble">
        <h1>Scan for Bluetooth devices</h1>

        {supportsBluetooth && isDisconnected &&
          <button onClick={startScanForBLEDevices}>Start Scan</button>
        }
        {supportsBluetooth && !isDisconnected &&
          <button onClick={stopScan}>Stop Scan</button>
        }
        {!supportsBluetooth &&
          <p>This browser doesn't support the Web Bluetooth API</p>
        }
        <div>
          <button onClick={() => notyf.error('Please fill out all the fields in the form')}>Notify3</button>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App;
