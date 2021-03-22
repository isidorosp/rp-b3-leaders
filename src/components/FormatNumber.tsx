import React from 'react'

export type FormatNumberProps = {
  format: string;
  number: number
}

const FormatNumber = ({
  format = 'eth',
  number,
}: FormatNumberProps) => {
  let multiplier: number;
  let decimals: number;
  let symbol: string;

  switch (format) {
    case 'gwei':
      multiplier = 1;
      decimals = 0;
      symbol = 'GWEI';
      break;
  
    case 'eth':
    default:
      multiplier = 1/1000000000;
      decimals = 2;
      symbol = 'ETH';

      break;
  }

  const printNumber = (number * multiplier).toFixed(decimals)

  return (
    <>
      { `${printNumber} ${symbol}` }
    </>
  )
}

export default FormatNumber
