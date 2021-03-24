import React from 'react'

const Footer = () => {
  return (
    <div className="flex justify-between w-5/6 my-10 text-xs md:text-sm">
      <span>
        Made by <a href="https://twitter.com/IsdrsP">Izzy</a> for the <a href="https://www.rocketpool.net/">rocketpool</a> beta.
        Data by <a href="https://github.com/norinthebold/rocketpool-final-beta-leaderboard/">Norin</a>.
      </span>
      
      <span>
        <a href="https://github.com/isidorosp/rp-b3-leaders">
          <svg className="inline w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </a>
      </span>
    </div>
  )
}

export default Footer
