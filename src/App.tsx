import React from 'react';
import Footer from './components/Footer';
import TopXHorizontal from './components/TopXHorizontal';
import { useFetch } from './hooks/useFetch'

function App() {
  const url = `https://raw.githubusercontent.com/norinthebold/rocketpool-final-beta-leaderboard/main/data/all_validators.json`;
  const { status, data, error } = useFetch(url);


  return (
    <div className="flex flex-col items-center justify-center h-full text-white bg-black">
      <div className="flex items-center mb-32 text-6xl font-bold text-center font-montserrat">
        ROCKETPOOL b3<br />
        Leaderboard
      </div>
      <div className="grid w-5/6 grid-cols-3 gap-4">
        <div>
          <TopXHorizontal width={300} height={300} data={data} numItems={10} events={true} />
        </div>
      </div>

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
