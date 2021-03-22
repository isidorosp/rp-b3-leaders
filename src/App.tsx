import React from 'react';
import Footer from './components/Footer';
import TopXHorizontal from './components/TopXHorizontal';
import { useFetch } from './hooks/useFetch'
import ParentSize from '@visx/responsive/lib/components/ParentSize';

function App() {
  const url = `https://raw.githubusercontent.com/norinthebold/rocketpool-final-beta-leaderboard/main/data/all_validators.json`;
  const { data, error } = useFetch(url);


  return (
    <div className="flex flex-col items-center justify-center h-full text-white bg-black">
      <div className="flex items-center mb-32 text-6xl font-bold text-center font-montserrat">
        ROCKETPOOL b3<br />
        Leaderboard
      </div>
      { (!error) ?
        <div className="grid w-5/6 grid-cols-3 gap-4">
          <div className="h-80">
            <ParentSize>
              {({ width, height}) => 
                <TopXHorizontal width={width} height={height} data={data} numItems={10} events={true} />
              }
            </ParentSize>
          </div>
        </div>
        :
        <div>There was an error querying the data: {error}</div>
      }

      <p className="mt-6 tracking-wide">
        Edit <code>src/App.jsx</code> and save to reload.
      </p>
      <div className="flex justify-center mt-4">
        <a
          className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="px-4 py-2 ml-4 text-white bg-indigo-500 rounded hover:bg-indigo-600"
          href="https://tailwindcss.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Tailwind
        </a>
      </div>
      <Footer />
    </div>
  );
}

export default App;
