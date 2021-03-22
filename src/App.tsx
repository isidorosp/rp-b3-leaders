import React, { ChangeEvent, useState } from 'react';
import Footer from './components/Footer';
import TopXHorizontal from './components/TopXHorizontal';
import { useFetch } from './hooks/useFetch'
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { ValidatorData } from './validatorData';
import FormatNumber from './components/FormatNumber';

function App() {
  const leaderboardUrl = `https://raw.githubusercontent.com/norinthebold/rocketpool-final-beta-leaderboard/main/data/leaderboard.json`;
  const allValidatorsUrl = `https://raw.githubusercontent.com/norinthebold/rocketpool-final-beta-leaderboard/main/data/all_validators.json`;
  const [dataToFetch, setDataToFetch] = useState(leaderboardUrl);
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false);

  const [numberFormat, setNumberFormat] = useState('eth');

  const { status, data, error } = useFetch(dataToFetch);

  const handleConfigDrawerToggle = () => {
    setConfigDrawerVisible(!configDrawerVisible);
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


  return (
    <div className="flex flex-col items-center justify-center h-full text-white bg-black">
      <div className="flex items-center mb-16 text-6xl font-bold text-center font-montserrat">
        ROCKETPOOL b3<br />
        Leaderboard
      </div>
      <div className="flex flex-col w-5/6 mb-16">
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
      <div className="w-5/6 mb-8">
        { (!error && status === 'fetched') &&
          <div>
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="h-80">
                <ParentSize>
                  {({ width, height}) => 
                    <TopXHorizontal width={width} height={height} data={data} numItems={10} events={true} />
                  }
                </ParentSize>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="text-center">
                <span className="block mb-1 text-4xl font-bold font-montserrat">Avg. Gains</span>
                <span className="text-3xl">
                  <FormatNumber format={numberFormat} number={(data.reduce((acc: number, obj: ValidatorData) => { return acc + Number(obj.adjusted_balance) }, 0)/ data.length)} />
                </span>
              </div>
              <div className="text-center">
                <span className="block mb-1 text-4xl font-bold font-montserrat">Total Gains</span>
                <span className="text-3xl">
                  <FormatNumber format={numberFormat} number={data.reduce((acc: number, obj: ValidatorData) => { return acc + Number(obj.adjusted_balance) }, 0)} />
                </span>
              </div>
            </div>
            { `total records: ${data.length}`}
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
  );
}

export default App;
