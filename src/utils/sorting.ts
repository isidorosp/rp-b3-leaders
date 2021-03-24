
export const clone = (items: any) => items.map((item: any) => Array.isArray(item) ? clone(item) : item);


// Sort an object array with nested object by a key
//
// e.g.
// var b = [ 
//   { id: 0, last: 'Anne',     data:{title: 'habc'}},
//   { id: 1, last: 'Odine',    data:{title: 'asdf'}},
//   { id: 2, last: 'Prentice', data:{title: 'tzuio'}}
// ]
// keysrt(b,['data','title']);
export const sortObjArrByKey = (arr: any[], keyArr: Array<string>, reverse: boolean = false, forceNumerical = false) => {
  const arrCopy = clone(arr); // make a deep clone as to not mutate original array
  let sortOrder = 1;
  
  if (reverse) sortOrder = -1;
  
  return arrCopy.sort(function(a: any, b: any) {
    let x = a, y = b;
    for ( let i = 0; i < keyArr.length; i++ ) {
      x = x[keyArr[i]];
      y = y[keyArr[i]];
    }
    return sortOrder * ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
} 
