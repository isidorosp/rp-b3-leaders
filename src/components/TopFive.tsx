import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useFetch } from '../hooks/useFetch'
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { ValidatorData, ValidatorDataSet } from '../validatorData';

export type BarGroupProps = {
  width: number;
  height: number;
  events?: boolean;
};

const verticalMargin = 120;



const TopFive = ({
  width,
  height,
  events = false,
}: BarGroupProps) => {
  const [query, setQuery] = useState('');
  const url = `https://raw.githubusercontent.com/norinthebold/rocketpool-final-beta-leaderboard/main/data/all_validators.json`;
  const { status, data, error } = useFetch(url);

  // const width = 500;
  // const height = 500;
  // const margin = {top: 20, bottom: 20, left: 20, right: 20 };

  // // Then we'll create some bounds
  // const xMax = width - margin.left - margin.right;
  // const yMax = height - margin.top - margin.bottom;

  // // We'll make some helpers to get at the data we want
  // const x = d => d.letter;
  // const y = d => +d.frequency * 100;

  
  // // And then scale the graph by our data
  // const xScale = scaleBand({
    //   range: [0, xMax],
    //   round: true,
    //   domain: graphData.map(x),
    //   padding: 0.4,
    // });
    // const yScale = scaleLinear({
      //   range: [yMax, 0],
      //   round: true,
      //   domain: [0, Math.max(...graphData.map(y))],
      // });
      
      // // Compose together the scale and accessor functions to get point functions
      // const compose = (scale, accessor) => data => scale(accessor(data));
      // const xPoint = compose(xScale, x);
      // const yPoint = compose(yScale, y);
  const xMax = width;
  const yMax = height - verticalMargin;
  const graphData: ValidatorDataSet = data ? data!.slice(0, 10) : null;

    // accessors
  const getAdjustedBalance = (d: ValidatorData) => d.adjusted_balance;
  const getValidatorId = (d: ValidatorData) => d.validator.pubkey.slice(0, 5);

  // const balanceScale = scaleBand<number>({
  //   domain: graphData.map(getAdjustedBalance),
  //   padding: 0.2,
  // })

  // const validatorScale = scaleBand<string>({
  //   domain: graphData.map(getValidatorId),
  //   padding: 0.2,
  // })
  

  // scales, memoize for performance

  // const xScale = useRef();
  // const yScale = useRef();
  // useEffect(() => {
  //   if (graphData !== null) {
  //     console.log('were in the loop')
  //     console.log(graphData.map(getValidatorId))
      
  //     const x = scaleBand<string>({range: [0, xMax],round: true, domain: graphData.map(getValidatorId),padding: 0.4});
  //     const y = scaleLinear<number>({range: [yMax, 0],round: true, domain: [0, Math.max(...graphData.map(getAdjustedBalance))]});
  //     xScale.current = x;
  //     yScale.current = y;
  //   }
  // });
  // const [xScale, setXScale] = useState<any>();
  // const [yScale, setYScale] = useState<any>();

  // useEffect(() => {
  //   if (graphData !== null) {
  //     console.log('were in the loop')
  //     console.log(graphData.map(getValidatorId))
      
  //     const x = scaleBand({range: [0, xMax],round: true, domain: graphData.map(getValidatorId),padding: 0.4});
  //     setXScale(x);
  //     setYScale(scaleLinear({range: [yMax, 0],round: true, domain: [0, Math.max(...graphData.map(getAdjustedBalance))]}));
  //     console.log(xScale)
  //   }

  // // }, [graphData, xMax, yMax, xScale]);

  const xScale = useMemo(
    () => {
      // if (graphData !== null) {
        const domainTest = (graphData !== null) ? graphData.map(getValidatorId) : ["N/A"];
        return scaleBand<string>({
          range: [0, xMax],
          round: true,
          domain: domainTest,
          padding: 0.4,
        });
      // }
    }, [graphData, xMax]
  );

  const yScale = useMemo(
    () => {
      // if (graphData !== null) {
        const domainTestY = (graphData !== null) ? Math.max(...graphData.map(getAdjustedBalance)) : 0;
        return scaleLinear<number>({
          range: [yMax, 0],
          round: true,
          domain: [0, domainTestY],
        })
      // }
    }, [graphData, yMax]
  );

  return (
    <div>
      { (status === 'fetched' && graphData !== null) &&
        <div>
          asdf
          <svg width={width} height={height}>
            <rect width={width} height={height} fill="url(#teal)" rx={14} />
            <Group top={verticalMargin / 2}>
              { graphData.map(d => {
                const validatorId = getValidatorId(d);
                const barWidth = xScale.bandwidth();
                const barHeight = yMax - (yScale(getAdjustedBalance(d)) ?? 0);
                const barX = xScale(validatorId);
                const barY = yMax - barHeight;

                return (
                  <Bar key={`bar-${validatorId}`} x={barX} y={barY} width={barWidth} height={barHeight}
                    fill="rgba(23, 233, 217, .5)" onClick={()=> {
                      if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                    }}
                  />
                );
            })} 
            </Group>
          </svg>
        </div>
      }
      { (status === 'fetching') && 
        <div>
          <span className="relative flex w-3 h-3">
            <span className="absolute inline-flex w-full h-full bg-purple-400 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex w-3 h-3 bg-purple-500 rounded-full"></span>
          </span>
        </div>
      }
      { (status === 'error') && 
        <div>{error}</div>
      }
    </div>
  )
}

export default TopFive
