import React, { ChangeEvent, useState } from 'react';
import Footer from './components/Footer';
import TopXHorizontal from './components/TopXHorizontal';
import { useFetch } from './hooks/useFetch'
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { ValidatorData, ValidatorDataSet } from './validatorData';
import FormatNumber from './components/FormatNumber';
import Heatmap from './components/Heatmap';
import { Range, Direction } from 'react-range';
import { sortObjArrByKey } from './utils/sorting';

export const NumberFormatContext = React.createContext('eth');

function App() {
  const leaderboardUrl = `https://raw.githubusercontent.com/norinthebold/rocketpool-final-beta-leaderboard/main/data/leaderboard.json`;
  const allValidatorsUrl = `https://raw.githubusercontent.com/norinthebold/rocketpool-final-beta-leaderboard/main/data/all_validators.json`;
  const summaryUrl = `https://raw.githubusercontent.com/norinthebold/rocketpool-final-beta-leaderboard/main/data/summary.json`;

  const [dataToFetch, setDataToFetch] = useState(leaderboardUrl);
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false);

  const [eth1NodeAddr, setEth1NodeAddr] = useState('');

  const [numberFormat, setNumberFormat] = useState('eth');
  const [heatmapScrollValue, setHeatmapScrollValue] = useState([0]);
  const [heatmapRange, setHeatmapRange] = useState([0, 256]);

  const { status, data, error } = useFetch(dataToFetch);
  const { status: summaryStatus, data: summaryData, error: summaryError } = useFetch(summaryUrl);

  const handleConfigDrawerToggle = () => {
    setConfigDrawerVisible(!configDrawerVisible);
  }

  const sliceSize = 256;

  const handleHeatmapRangeChange = (values: number[]) => {
    setHeatmapScrollValue(values)
    if (data) {
      const multiplier = values[0]/100;
      const mappedValue = data.length * multiplier;

      const newLowerBound = Math.max(0, Math.min(Math.floor(mappedValue - sliceSize/2), data.length-sliceSize));
      const newUpperbound = Math.min(Math.floor(newLowerBound + sliceSize), data.length);
      setHeatmapRange([newLowerBound, newUpperbound])
    }
  }

  const handleDataSourceToggle = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case 'limited':
        setDataToFetch(leaderboardUrl);
        break;  
      default:
        setDataToFetch(allValidatorsUrl);
        break;
    }
  }

  const handleNumberFormatToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setNumberFormat(e.target.value)
  }

  const handleNodeAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEth1NodeAddr(e.target.value.toLowerCase())
  }

  const filterDataByNodeAddr = (data: ValidatorDataSet): ValidatorDataSet => {
    if (eth1NodeAddr !== '')
      return data.filter((datum: ValidatorData) => datum.eth1_addr === eth1NodeAddr);

    return data
  };

  const filteredData: ValidatorDataSet | null = (data) ? filterDataByNodeAddr(data) : null;

  const heatmapData = (data) ? sortObjArrByKey(filteredData!, ['validator', 'activation_epoch'], false, true).slice(heatmapRange[0], heatmapRange[1]) : null;



  return (
    <NumberFormatContext.Provider value={numberFormat}>
      <div className="flex flex-col items-center justify-center h-full text-white bg-black">
        <div className="flex items-center mb-16 text-6xl font-bold text-center font-montserrat">
          ROCKETPOOL b3<br />
          Leaderboard
        </div>
        <div className="flex flex-col w-5/6">
          <div>
            <button onClick={handleConfigDrawerToggle}>
              <svg className="inline w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
              <span className="align-text-top">Configure</span>
            </button>
          </div>
          <div className={`w-5/6 my-6 ${configDrawerVisible ? '' : 'hidden'}`}>
            <div className="flex flex-col">
              --- Data source
              <label>
                <input
                  className="mr-2"
                  type="radio"
                  name="dataSource"
                  value="limited"
                  checked={dataToFetch === leaderboardUrl}
                  onChange={handleDataSourceToggle}
                />
                Use leaderboard data (only counts best performing validator per node)
              </label>
              <label>
                <input
                  className="mr-2"
                  type="radio"
                  name="dataSource"
                  value="all"
                  checked={dataToFetch === allValidatorsUrl}
                  onChange={handleDataSourceToggle}
                />
                Use all validator data
              </label>
            </div>
            <div className="flex flex-col mt-4">
              --- Number format
              <label>
                <input
                  className="mr-2"
                  type="radio"
                  name="numberFormat"
                  value="eth"
                  checked={numberFormat === 'eth'}
                  onChange={handleNumberFormatToggle}
                />
                ETH
              </label>
              <label>
                <input
                  className="mr-2"
                  type="radio"
                  name="numberFormat"
                  value="gwei"
                  checked={numberFormat === 'gwei'}
                  onChange={handleNumberFormatToggle}
                />
                Gwei (10<sup>-9</sup> ETH)
              </label>
            </div>
          </div>
        </div>
        <div className="w-5/6">
          { ((!error && status === 'fetched') && (!summaryError && summaryStatus === 'fetched')) &&
            <div>
              <div className="w-1/2 mb-6 ml-auto mr-auto">
                <label htmlFor="email" className="block">Filter by node address</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="off"
                    value={eth1NodeAddr}
                    className="block w-full p-2 text-sm bg-black border-2 border-gray-700 rounded-md"
                    placeholder="0xYOURNODEADDRESS"
                    onChange={handleNodeAddressChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-14">
                <div className="h-96">
                  <ParentSize>
                    {({ width, height}) => 
                      <TopXHorizontal width={width} height={height} data={filteredData!} numItems={10} events={true} />
                    }
                  </ParentSize>
                </div>
                <div className="flex flex-row h-96">
                  <ParentSize>
                    {({ width, height}) => 
                      <Heatmap width={width} height={height} data={filterDataByNodeAddr(heatmapData)} events={true} />
                    }
                  </ParentSize>
                  <div className="mt-16">
                    { (filteredData && sliceSize < filteredData?.length) &&
                      <Range
                        step={0.1}
                        min={0}
                        max={100}
                        direction={Direction.Down}
                        values={heatmapScrollValue}
                        onChange={(values) => handleHeatmapRangeChange(values)}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            className="w-0.5 h-full bg-gray-800"
                            style={{
                              ...props.style
                            }}
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props }) => (
                          <div
                            {...props}
                            className="w-3 h-8 bg-gray-700"
                            style={{
                              ...props.style
                            }}
                          />
                        )}
                      />
                    }
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="text-center">
                <span className="block mb-1 text-4xl font-bold font-montserrat">Avg. Gains</span>
                <div className="text-3xl">
                  <div className="block">
                    <FormatNumber number={(data.reduce((acc: number, obj: ValidatorData) => { return acc + Number(obj.adjusted_balance) }, 0)/ data.length)} />
                  </div>
                  { filteredData!.length !== data.length && filteredData!.length > 0 &&
                    <div className="block">
                      <FormatNumber number={(filteredData!.reduce((acc: number, obj: ValidatorData) => { return acc + Number(obj.adjusted_balance) }, 0)/ filteredData!.length)} /> (selected node)
                    </div>
                  }
                </div>
              </div>
              <div className="text-center">
                <span className="block mb-1 text-4xl font-bold font-montserrat">Total Gains</span>
                <div className="text-3xl">
                  <div className="block">
                    <FormatNumber number={data.reduce((acc: number, obj: ValidatorData) => { return acc + Number(obj.adjusted_balance) }, 0)} />
                  </div>
                  { filteredData!.length !== data.length && filteredData!.length > 0 &&
                    <div className="block">
                      <FormatNumber number={filteredData!.reduce((acc: number, obj: ValidatorData) => { return acc + Number(obj.adjusted_balance) }, 0)} /> (selected node)
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="text-sm">
              { `Total records: ${data.length} `} <br />
              { `Last update: ${new Date(summaryData.script_start).toUTCString()} `}
            </div>
          </div>
          }
          { (status !== 'fetched') && 
            <div>Data is loading...</div>
          }
          { (error) && 
            <div>There was an error querying the data: {error}</div>
          }
        </div>

        <Footer />
      </div>
    </NumberFormatContext.Provider>
  );
}

export default App;
