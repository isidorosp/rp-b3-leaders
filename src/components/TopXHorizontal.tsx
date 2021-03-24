import React, { useMemo } from 'react'
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { ValidatorData, ValidatorDataSet } from '../validatorData';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import FormatNumber from '../components/FormatNumber';

export type BarGroupProps = {
  width: number;
  height: number;
  data: ValidatorDataSet;
  numItems?: number;
  events?: boolean;
};

type TooltipData = ValidatorData;

const verticalMargin = 40;
const background = 'transparent';
const barFill = '#DE6D6E';
let tooltipTimeout: number;
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 200,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};

export default withTooltip<BarGroupProps, TooltipData>(({
  width,
  height,
  data,
  numItems = 5,
  events = false,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  hideTooltip,
  showTooltip
  }: BarGroupProps & WithTooltipProvidedProps<TooltipData>) => {
    const graphData: ValidatorDataSet | null = data ? data!.slice(0, numItems) : null;

    // bounds
    const xMax = width;
    const yMax = height - verticalMargin;

      // accessors
    const getAdjustedBalance = (d: ValidatorData) => d.adjusted_balance;
    const getValidatorId = (d: ValidatorData) => d.validator.pubkey;

    // scales
    const xScale = useMemo(
      () => {
        const balanceDomain = (graphData !== null) ? Math.max(...graphData.map(getAdjustedBalance)) : 0;
        return scaleLinear<number>({
          range: [xMax, 0],
          round: true,
          domain: [0, balanceDomain],
        })
      }, [graphData, xMax]
    );

    const yScale = useMemo(
      () => {
        const validatorDomain = (graphData !== null) ? graphData.map(getValidatorId) : ["N/A"];
        return scaleBand<string>({
          range: [0, yMax],
          round: true,
          domain: validatorDomain,
          padding: 0.4,
        });
    }, [graphData, yMax]
    );

    return (
      <div>
        { (data !== null && graphData) &&
          <div>
            <div className="w-full text-4xl font-bold text-center font-montserrat">Top {numItems}</div>
            <svg width={width} height={height}>
              <rect width={width} height={height} fill={background} rx={14} />
              <Group top={verticalMargin / 2}>
                { graphData.map(d => {
                  const validatorId = getValidatorId(d);
                  const adjBal = getAdjustedBalance(d);
                  const barWidth = xMax - (xScale(adjBal) ?? 0);
                  const barHeight = yScale.bandwidth();
                  const barX = 0;
                  const barY = yScale(validatorId);

                  return (
                    <Bar 
                      key={`bar-${validatorId}`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={barFill}
                      onClick={()=> {
                        if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                      }}
                      onMouseLeave={() => {
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                      onMouseMove={() => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        const top = barY;
                        const left = barX + barWidth;
                        const yOffset = verticalMargin;
                        showTooltip({
                          tooltipData: d,
                          tooltipTop: top! + yOffset,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  );
              })} 
              </Group>
            </svg>
            <div>
              {tooltipOpen && tooltipData && (
              <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles} className="z-50 opacity-80">
                <div className="flex-col items-center content-center justify-center">
                  <div className="font-bold text-center">
                    <FormatNumber number={tooltipData.adjusted_balance} />
                  </div>
                  <div className="text-center">Rewards Rank {tooltipData.rewards_rank}</div>
                  <div className="text-center">{tooltipData.validator.pubkey.slice(0, 5) + '...' + tooltipData.validator.pubkey.slice(-4)}</div>
                  <div className="text-center">{tooltipData.block_proposals} block(s) proposed</div>
                </div>
              </Tooltip>
              )}
            </div>
          </div>
        }
      </div>
    )
  }
);
// export default TopXHorizontal
