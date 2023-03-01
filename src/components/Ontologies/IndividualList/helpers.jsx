/**
 * Sort an array of individuals based on the label
 *
 * @param {*} array
 * @returns
 */
export function sortIndividuals (individuals) {
    return individuals.sort(function (a, b) {
      let x = a["label"]; 
      let y = b["label"];      
      return (x<y ? -1 : 1 )
    })
  }