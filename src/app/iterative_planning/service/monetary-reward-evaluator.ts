export class MonetaryRewardEvaluator{

  //
  // Input:
  // - the proportion of max **utility**, e.g., 6/12 has proportion 0.5
  // - min money that's earnable
  // - max money that's earnable with bonus
  //
  // Output:
  // - the **payment** that is earned with given utility proportion

  //   CAREFUL: the semantic can be either bonus payment or total payment
  //   - for bonus payment set minMoney = 0 and maxMoney to the max. bonus reward
  //   - for total payment set minMoney to the base reward and maxMoney to the base + max bonus.
  //
  // HACK: the way that utility proportion maps onto monetary-reward proportion is hard coded
  //
  static computePayment(
    utilityProportion: number,
    minMoney: number | undefined,
    maxMoney: number | undefined
  ): number {

    //
    // Handle possible issues with input parameters
    //
    // NOTE: the fall-back value is 0, i.e., "you will get no (bonus) money"
    //
    if (utilityProportion < 0 || utilityProportion > 1) {
        console.error("utilityProportion should be between 0 and 1 (inclusive)");
        return 0.0;
    }
    if (minMoney === undefined || maxMoney === undefined) {
        console.error("minMoney and/or maxMoney is undefined");
        return 0.0;
    }
    if (minMoney < 0 || maxMoney < 0 || minMoney > maxMoney) {
        console.error("bad values of minMoney and/or maxMoney");
        return 0.0;
    }

    const maxBonus = maxMoney - minMoney;

    if (utilityProportion < 0.5) {
      return minMoney;
    } else if (utilityProportion < 0.75) {
      return minMoney + ((1/3) * maxBonus);
    } else if (utilityProportion < 1.0) {
      return minMoney + ((2/3) * maxBonus);
    } else if (utilityProportion == 1.0) {
      return minMoney + maxBonus;
    }

    // Catch-all
    return 0.0;
  }

  //
  // Input:
  // - current attained utility
  // - max possible utility
  //
  // Output:
  // - a **utility** proportion, e.g., 6/12 has proportion 0.5
  //
  static computeUtilityProportion(
    currentUtility: number | undefined,
    maxUtility: number | undefined
  ): number {

    //
    // Handle possible issues with input parameters
    //
    // NOTE: the fall-back value is 0.0, i.e., "you have attained 0 utility"
    //
    if (currentUtility === undefined) {
      // undefined currentUtility is interpreted as zero
      return 0.0;
    }
    if (maxUtility === undefined) {
      // if maxUtility is undefined, treat is zero
      return 0.0;
    }
    if (maxUtility == 0) {
      return 0.0;
    }
    if (currentUtility < 0 || maxUtility < 0 || currentUtility > maxUtility) {
      console.error("bad value of currentUtility and/or maxUtility");
      return 0.0;
    }

    return currentUtility / maxUtility;
  }

  //
  // Input:
  // - utility proportion
  // - max possible utility
  //
  // Output:
  // - the utility corresponding to the proportion, e.g. 0.5 with maxUtility = 12 returns 6
  //
  static computeUtilityFromProportion(
    utilityProportion: number | undefined,
    maxUtility: number | undefined
  ): number {

    //
    // Handle possible issues with input parameters
    //
    // NOTE: the fall-back value is 0.0
    //
    if (utilityProportion === undefined || utilityProportion < 0.0 || utilityProportion > 1.0) {
      console.error("bad utilityProportion");
      return 0.0;
    }
    if (maxUtility === undefined) {
      // if maxUtility is undefined, treat is zero
      return 0.0;
    }
    if (maxUtility == 0) {
      return 0.0;
    }

    return utilityProportion * maxUtility;

  }

}