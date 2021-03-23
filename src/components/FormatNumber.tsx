import React, { useContext } from 'react'
import { NumberFormatContext } from '../App'

export type FormatNumberProps = {
  number: number
}

const FormatNumber = ({
  number,
}: FormatNumberProps) => {
  let multiplier: number;
  let decimals: number;
  let symbol: string;

  const format = useContext(NumberFormatContext)

  switch (format) {
    case 'gwei':
      multiplier = 1;
      decimals = 0;
      symbol = 'GWEI';
      break;
  
    case 'eth':
    default:
      multiplier = 1/1000000000;
      decimals = 4;
      symbol = 'ETH';

      break;
  }

  const printNumber = (number * multiplier).toFixed(decimals)

  return (
    <>
      { `${printNumber} ${symbol} `}
    </>
  )
}

export default FormatNumber
