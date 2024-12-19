export class VectorMetrics {
  // Compute the Pearson correlation between two binary encoded variable vectors.
  public static pearsonCorrelation = (x, y): number => {
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0,
      sumY2 = 0;
    const minLength = x.length = y.length = Math.min(x.length, y.length),
      reduce = (xi, idx) => {
        const yi = y[idx];
        sumX += xi;
        sumY += yi;
        sumXY += xi * yi;
        sumX2 += xi * xi;
        sumY2 += yi * yi;
      }
    x.forEach(reduce);
    return (minLength * sumXY - sumX * sumY) / Math.sqrt((minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY));
  }

  // Compute the Distance correlation between two binary encoded variable vectors.
  public static distanceCorrelation = (x, y): number => {
    //TODO: Implement
    return 0;
  }

  /**
   * Count occurences of all possible combinations of binary pairs between the given vectors.
   *
   * For example, n00 contains the number of occurences where both x and y are zero at the same indices.
   *
   * @param {*} x The first binary vector.
   * @param {*} y The second binary vector.
   * @returns An object containing counts of pairs (0,0), (0,1), (1,0) and (1,1).
   */
  public static pairwiseCounts = (x, y) => {
    const complement = a => a.map(ai => 1 - ai);
    const multiply = (a, b) => a.map((ai, idx) => ai * b[idx]);
    const magnitude = a => a.reduce((s, ai) => s + ai, 0);

    const _x = complement(x);
    const _y = complement(y);

    return {
      n00: magnitude(multiply(_x, _y)),
      n01: magnitude(multiply(_x, y)),
      n10: magnitude(multiply(x, _y)),
      n11: magnitude(multiply(x, y))
    };
  }

  /**
   * Compute the phi coefficient for two binary vectors.
   *
   * For binary variables this is identical to the Pearson correlation.
   *
   * @param {*} x The first binary vector.
   * @param {*} y The second binary vector.
   * @returns The phi coefficient.
   */
  public static phiCoefficient = (x, y) => {
    const m = this.pairwiseCounts(x, y);
    const n0_ = m.n00 + m.n01;
    const n1_ = m.n10 + m.n11;
    const n_0 = m.n00 + m.n10;
    const n_1 = m.n01 + m.n11;

    return (m.n11*m.n00 - m.n10*m.n01) / Math.sqrt(n0_*n1_*n_0*n_1);
  }

  /**
   * Compute the Jaccard index/coefficient (also known as intersection over union) for two binary vectors.
   *
   * @param {*} x The first binary vector.
   * @param {*} y The second binary vector.
   * @returns The Jaccard index.
   */
  public static jaccardIndex = (x, y) => {
    const m = this.pairwiseCounts(x, y);
    return m.n11 / (m.n11 + m.n10 + m.n01);
  }
}
