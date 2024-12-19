export class Utils {
  // Combine all unique combinations of length k from elements (recursive implementation)
  public static computeCombinationsRecursive (elements, start, end, index, k, data, result): void {
    // Current combination is ready
    if(index === k) {
      result.push(data.slice());
      return;
    }

    // Replace index with all possible elements. The condition "end-i+1 >= k-index"
    // makes sure that including one element at index will make a combination with
    // remaining elements at remaining positions.
    for(let i = start; i <= end && end - i + 1 >= k - index; ++i) {
      data[index] = elements[i];
      this.computeCombinationsRecursive(elements, i + 1, end, index + 1, k, data, result);
    }
  }

  // Combine all unique combinations of length k from elements
  public static computeCombinations (elements, k) {
    const data = new Array(k);
    const result = [];
    this.computeCombinationsRecursive(elements, 0, elements.length - 1, 0, k, data, result);
    return result;
  }

  public static arrayEquals (a, b): boolean{
    return a.length === b.length && a.every((e, i) => e === b[i]);
  }

  public static setEquals (a, b): boolean {
    if(a.size === b.size) {
      let equal = true;
      a.forEach((key, value) => equal &&= b.has(value) );
      return equal;
    } else {
      return false;
    }
  };

  /**
   * Compute the solvability of selected goal facts as the fraction
   * of solvable subets over all possible subsets containing those goal facts.
   *
   * @param {*} elements
   * @param {*} MSGS
   * @param {*} selected
   * @returns
   */
  public static computeSolvabilityFraction = (elements, MSGS, selected) => {

    // Remove duplicates from the selected elements just in case.
    const S = new Set(selected);

    let Ms = MSGS
      .map(msgs => msgs.l.slice()) // Operate on copies of the original lists
      .filter(msgs => msgs.filter(element => S.has(element)).length === S.size) // Get all MSGS that individually contain all of the goal facts in S: M \in MSGS and S \subset M

    // Remove all elements in S from all sets in the filtered list of MSGS: M \ S
    // Additionally sort the lists.
    for(let i = 0; i < Ms.length; ++i) {
      Ms[i] = Ms[i].filter(e => !S.has(e)).sort();
    }

    // Get the number of unique subsets of all sets in Ms. Use a map to
    // store lists of subsets with equal length. This allows to efficiently
    // search for duplicates by limiting the search space to sets of equal
    // size.
    const uniqueSubsets = new Map();

    Ms.forEach(msgs => {
      msgs.forEach((e, i) => {
        const combinations = this.computeCombinations(msgs, i + 1);

        combinations.forEach(s => {
          // If the set is non-empty we check if it is already contained in uniqueSubsets and if not add it to the list
          if(s.length > 0) {

            // Get the corresponding list of subsets with the required length
            if(!uniqueSubsets.has(s.length))
              uniqueSubsets.set(s.length, []);

            const subsets = uniqueSubsets.get(s.length);

            let contained = false;
            for(let j = 0; j < subsets.length; ++j) {
              // As our arrays represent sets the order of elements does not matter. This would need special care
              // when comparing two arrays but since they are always sorted this is not an issue and we can just
              // call arrayEquals().
              if(this.arrayEquals(subsets[j], s)) {
                contained = true;
                break;
              }
            }

            if(!contained)
              subsets.push(s);
          }
        });
      });
    });

    // Return count of all unique solvable subsets that contain all goal facts in S.
    let solvableCount = 0;
    uniqueSubsets.forEach(e => solvableCount += e.length);
    // Add one to account for S itself.
    solvableCount += 1;

    // Get the number of all possible unique subsets of elements with the elements in selection fixed (see power set).
    const totalCount = Math.pow(2, elements.length - S.size);

    return solvableCount / totalCount;
  }

  public static uniq (array, compareFunc){

    let uniques = [];
    array.forEach(element => {
      let found = false;
      for(let i = 0; i < uniques.length; ++i) {
        if(compareFunc(uniques[i], element)) {
          found = true;
          break;
        }
      }

      if(!found)
        uniques.push(element);
    });
    return uniques;
  };
}
