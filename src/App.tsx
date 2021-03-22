import React from 'react';
import Footer from './components/Footer';
import TopXHorizontal from './components/TopXHorizontal';
import { useFetch } from './hooks/useFetch'
import ParentSize from '@visx/responsive/lib/components/ParentSize';

function App() {
  const url = `https://raw.githubusercontent.com/norinthebold/rocketpool-final-beta-leaderboard/main/data/all_validators.json`;
  const { status, data, error } = useFetch(url);


  return (
    <div className="flex flex-col items-center justify-center h-full text-white bg-black">
      <div className="flex items-center mb-32 text-6xl font-bold text-center font-montserrat">
        ROCKETPOOL b3<br />
        Leaderboard
      </div>
      <div className="w-5/6 mb-8">
        { (!error && status === 'fetched') &&
          <div className="grid grid-cols-3 gap-4">
            <div className="h-80">
              <ParentSize>
                {({ width, height}) => 
                  <TopXHorizontal width={width} height={height} data={data} numItems={10} events={true} />
                }
              </ParentSize>
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
  );
}

export default App;
