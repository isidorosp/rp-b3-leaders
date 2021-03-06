import React from 'react'
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Bin } from '@visx/mock-data/lib/generators/genBins';
import { HeatmapCircle } from '@visx/heatmap';
import { ValidatorDataSet, ValidatorData } from '../validatorData';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import FormatNumber from '../components/FormatNumber';

const hot1 = '#77312f';
const hot2 = '#f33d15';
// const cool1 = '#122549';
// const cool2 = '#b4fbde';
export const background = 'transparent';


type TooltipData = ValidatorData;
let tooltipTimeout: number;
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 200,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};

type EnhancedBin = Bin & {
  data: ValidatorData;
}

export interface EnhancedBins {
  bin: number;
  bins: EnhancedBin[];
}

export type HeatmapProps = {
  width: number;
  height: number;
  data: ValidatorDataSet;
  numItems?: number,
  margin?: { top: number; right: number; bottom: number; left: number };
  separation?: number;
  events?: boolean;
};

const defaultMargin = { top: 10, left: 20, right: 20, bottom: 60 };

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.max(...data.map(value));
}

function min<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.min(...data.map(value));
}

const binnifyData = (data: ValidatorDataSet, binSize: number) => {
  let newArray = [];
  let bin = 0;

  // for some reason this heatmap starts from the bottom left and works up and right
  // so we need to start from the end then later reverse the result
  // for (let parentIndex = data.length-1; parentIndex >= 0; parentIndex -= binSize) {
  for (let parentIndex = 0; parentIndex < binSize; parentIndex++) {
    // const element = array[index];
    let bins = [];
    let subBin = 0;

    for (let subIndex = binSize-1; subIndex >= 0; subIndex--) {

      if ((parentIndex + subIndex*binSize) >= data.length)
        continue;

      const datum = {
        bin: subBin,
        count: data[parentIndex + subIndex*binSize].adjusted_balance ?? 0,
        data: data[parentIndex + subIndex*binSize]
      }
      bins.push(datum)
      subBin += 150
    }

    const newEl = { 
      bin: bin,
      bins: bins
    }
    bin += 1;
    newArray.push(newEl)
  }
   return newArray
}

export default withTooltip<HeatmapProps, TooltipData>(({
  width,
  height,
  data,
  numItems = 50,
  events = false,
  margin = defaultMargin,
  separation = 20,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  hideTooltip,
  showTooltip
}: HeatmapProps & WithTooltipProvidedProps<TooltipData>) => {
    const graphData: ValidatorDataSet | null = data ? data : null;

    const binData = binnifyData(graphData!, 16);

    const size =
      width > margin.left + margin.right ? width - margin.left - margin.right - separation : width;
    const xMax = size;
    const yMax = height - margin.bottom - margin.top;




    // accessors
    // const x = (d: ValidatorData) => Number(d!.index!);
    // const y = (d: ValidatorData) => d!.validator!;
    // const z = (d: ValidatorData) => d.adjusted_balance;


    // const colorMax = useMemo(
    //   () => {
    //     const colorMax = (graphData !== null) ? max(graphData, d => d.adjusted_balance) : 0;
    //     return colorMax
    //   }, [graphData]
    // );
    
    const bins = (d: EnhancedBins) => d.bins;
    const count = (d: EnhancedBin) => d.count;

    const colorMax = max(binData!, d => max(bins(d), count));
    const bucketSizeMax = max(binData!, d => bins(d).length);
    const binWidth = xMax / binData!.length;
    const binHeight = yMax / bucketSizeMax;
    const radius = min([binWidth, binHeight], d => d) / 2;

    // scales
    // const testDomain = (graphData !== null) ? graphData.map(getValidatorId) : ["N/A"];

    // const xScale = scaleLinear<number>({
    //   domain: extent(graphData!, z!)
    // });

    // const yScale = scaleLinear<number>({
    //   domain: [0, yMax],
    // });

    // scales
    const xScale = scaleLinear<number>({
      domain: [0, binData!.length],
    });
    const yScale = scaleLinear<number>({
      domain: [0, bucketSizeMax],
    });
    const circleColorScale = scaleLinear<string>({
      range: [hot1, hot2],
      domain: [0, colorMax],
    });
    const opacityScale = scaleLinear<number>({
      range: [0.1, 1],
      domain: [0, colorMax],
    });
    // const colorMax = max(graphData, d => max(getAdjustedBalance(d), getValidatorId));
    // const bucketSizeMax = max(binData, d => bins(d).length);
    xScale.range([0, xMax]);
    yScale.range([yMax, 0]);

    return (
      <div>
        { (data !== null && graphData) &&
          <div>
            <div className="w-full text-xl font-bold text-center md:text-4xl font-montserrat">Validator map</div>
            <svg width={width} height={height}>
              <rect x={0} y={0} width={width} height={height} rx={14} fill={background} />
              <Group top={margin.top} left={margin.left}>
                <HeatmapCircle
                  data={binData}
                  xScale={d => xScale(d) ?? 0}
                  yScale={d => yScale(d) ?? 0}
                  colorScale={circleColorScale}
                  opacityScale={opacityScale}
                  radius={radius}
                  gap={2}
                >
                  {heatmap =>
                    heatmap.map(heatmapBins =>
                      heatmapBins.map(bin => (
                        <circle
                          key={`heatmap-circle-${bin.row}-${bin.column}`}
                          className="text-white stroke-1 hover:stroke-current visx-heatmap-circle"
                          cx={bin.cx}
                          cy={bin.cy}
                          r={bin.r}
                          fill={bin.color}
                          fillOpacity={bin.opacity}
                          onClick={() => {
                            if (!events) return;
                            const { row, column } = bin;
                            alert(JSON.stringify({ row, column, bin: bin.bin }));
                          }}
                          onMouseLeave={() => {
                            tooltipTimeout = window.setTimeout(() => {
                              hideTooltip();
                            }, 300);
                          }}
                          onMouseMove={() => {
                            if (tooltipTimeout) clearTimeout(tooltipTimeout);
                            const top = bin.cy + radius*2;
                            const left = bin.cx + radius*2;
                            const binDetails = bin.bin as EnhancedBin;
                            showTooltip({
                              tooltipData: binDetails.data,
                              tooltipTop: top,
                              tooltipLeft: left,
                            });
                          }}
                        />
                      )),
                    )
                  }
                </HeatmapCircle>
              </Group>
            </svg>
            <div>
               {tooltipOpen && tooltipData && (
              <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles} className="z-50 opacity-80">
                <div className="flex-col items-center content-center justify-center">
                  <div className="font-bold text-center">
                    <FormatNumber number={tooltipData.adjusted_balance} />
                  </div>
                  <div className="text-center">Status {tooltipData.status}</div>
                  <div className="text-center">Since epoch {tooltipData.validator.activation_epoch}</div>
                  <div className="text-center">{tooltipData.validator.pubkey.slice(0, 5) + '...' + tooltipData.validator.pubkey.slice(-4)}</div>
                  <div className="text-center">{tooltipData.block_proposals} block(s) proposed</div>
                  <div className="text-center">Rewards Rank {tooltipData.rewards_rank}</div>
                  <div className="text-center">Rank {tooltipData.rank}</div>

                </div>
              </Tooltip>
              )}
            </div>
          </div>
          
          // <div>
          //   <div className="w-full text-4xl font-bold text-center font-montserrat">Heatmap</div>
          //   <svg width={width} height={height}>
          //     <rect width={width} height={height} fill={background} rx={14} />
          //     <Group top={verticalMargin / 2}>
          //       { graphData.map(d => {
          //         const validatorId = getValidatorId(d);
          //         const adjBal = getAdjustedBalance(d);
          //         const barWidth = xMax - (xScale(adjBal) ?? 0);
          //         const barHeight = yScale.bandwidth();
          //         const barX = 0;
          //         const barY = yScale(validatorId);

          //         return (
          //           <Bar 
          //             key={`bar-${validatorId}`}
          //             x={barX}
          //             y={barY}
          //             width={barWidth}
          //             height={barHeight}
          //             fill={barFill}
          //             onClick={()=> {
          //               if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
          //             }}
          //             onMouseLeave={() => {
          //               tooltipTimeout = window.setTimeout(() => {
          //                 hideTooltip();
          //               }, 300);
          //             }}
          //             onMouseMove={() => {
          //               if (tooltipTimeout) clearTimeout(tooltipTimeout);
          //               const top = barY;
          //               const left = barX + barWidth;
          //               const yOffset = verticalMargin;
          //               showTooltip({
          //                 tooltipData: d,
          //                 tooltipTop: top! + yOffset,
          //                 tooltipLeft: left,
          //               });
          //             }}
          //           />
          //         );
          //     })} 
          //     </Group>
          //   </svg>
          //   <div>
          //     {tooltipOpen && tooltipData && (
          //     <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          //       <div className="flex-col items-center content-center justify-center">
          //         <div className="font-bold text-center">
          //           <FormatNumber number={tooltipData.adjusted_balance} />
          //         </div>
          //         <div className="text-center">{tooltipData.validator.pubkey.slice(0, 5) + '...' + tooltipData.validator.pubkey.slice(-4)}</div>
          //         <div className="text-center">{tooltipData.block_proposals} block(s) proposed</div>
          //       </div>
          //     </Tooltip>
          //     )}
          //   </div>
          // </div>
        }
      </div>
    )
  }
);
