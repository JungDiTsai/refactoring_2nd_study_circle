// #region 1
// 原始程式碼 - 開始拆分計算階段與格式化階段
// export default function createStatementData(invoice, plays) {
//   const result = {};

//   result.customer = invoice.customer;
//   result.performances = invoice.performances.map(enrichPerformance);
//   result.totalAmount = totalAmount(result);
//   result.totalVolumeCredits = totalVolumeCredits(result);

//   return result;

//   function enrichPerformance(aPerformance) {
//     const result = Object.assign({}, aPerformance);
//     result.play = playFor(result);
//     result.amount = amountFor(result);
//     result.volumeCredits = volumeCreditsFor(result);
//     return result;
//   }

//   function playFor(aPerformance) {
//     return plays[aPerformance.playID];
//   }


//   function amountFor(aPerformance) {
//     let result = 0;
//     switch (aPerformance.play.type) {
//       case "tragedy":
//         result = 40000;
//         if (aPerformance.audience > 30) {
//           result += 1000 * (aPerformance.audience - 30);
//         }
//         break;
//       case "comedy":
//         result = 30000;
//         if (aPerformance.audience > 20) {
//           result += 10000 + 500 * (aPerformance.audience - 20);
//         }
//         result += 300 * aPerformance.audience;
//         break;
//       default:
//         throw new Error(`unknown type: ${aPerformance.play.type}`);
//     }
//     return result;
//   }


//   function volumeCreditsFor(aPerformance) {
//     let result = 0;
//     result += Math.max(aPerformance.audience - 30, 0);
//     if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience /
//       5);
//     return result;
//   }

//   function totalAmount(data) {
//     return data.performances.reduce((total, perf) => total + perf.amount, 0);
//   }

//   function totalVolumeCredits(data) {
//     return data.performances.reduce((total, perf) => total + perf.volumeCredits, 0);
//   }
// }

// #endregion 1

// #region 2
// 建立 Performance 計算器
// 為了更好地組織程式碼，我們將每種表演類型的計算邏輯抽取到各自的類別中，這樣可以更清晰地分離不同類型的計算邏輯。

/**
 * 因應劇目類型的不同，創建一個 PerformanceCalculator 的子類別，用來擴充不同類型的計算邏輯。
 */
/**
 * 創建一個報表數據對象，包含客戶信息、表演列表、總金額和總積分。
 * @param {Object} invoice - 發票對象，包含客戶信息和表演列表。
 * @param {Object} plays - 劇目對象，包含每個表演的詳細信息。
 * @returns {Object} 包含客戶信息、表演列表、總金額
 * 和總積分的報表數據對象。
 * @throws {Error} 如果劇目類型未知，則拋出錯誤。
 */
export default function createStatementData(invoice, plays) {
  const result = {};

  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);

  return result;

  function enrichPerformance(aPerformance) {
    const calculator = new createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function totalAmount(data) {
    return data.performances.reduce((total, perf) => total + perf.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, perf) => total + perf.volumeCredits, 0);
  }
}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
    case "comedy": return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`unknown type: ${aPlay.type}`);
  }
}

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    throw new Error('subclass responsibility');
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
} 