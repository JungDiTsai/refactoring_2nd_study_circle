/**
 * 拆分計算與格式化階段
 * 策略: 將計算邏輯與格式化邏輯分離
 * 目的: 提高可讀性與可維護性
 */

import invoices from './invoices.json' with { type: "json" };
import plays from './plays.json' with { type: "json" };

// #region 1
// 原始程式碼 - 開始拆分計算階段與格式化階段
// function statement(invoice, plays) {
//   return renderPlainText(invoice, plays);
// }

// function renderPlainText(invoice, plays) {
//   let result = `Statement for ${invoice.customer}\n`;
//   for (let perf of invoice.performances) {
//     result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
//   }
//   result += `Amount owed is ${usd(totalAmount())}\n`;
//   result += `You earned ${totalVolumeCredits()} credits\n`;
//   return result;


//   function totalAmount() {
//     let result = 0;
//     for (let perf of invoice.performances) {
//       result += amountFor(perf);
//     }
//     return result;
//   }


//   function totalVolumeCredits() {
//     let result = 0;
//     for (let perf of invoice.performances) {
//       result += volumeCreditsFor(perf);
//     }
//     return result;
//   }


//   function usd(aNumber) {
//     return new Intl.NumberFormat("en-US",
//       {
//         style: "currency", currency: "USD",
//         minimumFractionDigits: 2
//       }).format(aNumber / 100);
//   }


//   function volumeCreditsFor(aPerformance) {
//     let result = 0;
//     result += Math.max(aPerformance.audience - 30, 0);
//     if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience /
//       5);
//     return result;
//   }


//   function playFor(aPerformance) {
//     return plays[aPerformance.playID];
//   }


//   function amountFor(aPerformance) {
//     let result = 0;
//     switch (playFor(aPerformance).type) {
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
//         throw new Error(`unknown type: ${playFor(aPerformance).type}`);
//     }
//     return result;
//   }
// };

// #endregion


// #region 2
// 創建物件作為中轉結構。
// 檢查一下renderPlainText用到的其他參數。希望可以將它們也放到這個中轉物件結構中。
// 這樣所有計算程式碼都可以被挪到statement函數中，讓只操作通過data參數傳進來的數據。
// function statement(invoice, plays) {
//   const statementData = {};

//   // 第一步將customer(顧客)添加到中轉物件中
//   statementData.customer = invoice.customer;

//   // 第二步將performances(表演)添加到中轉物件中，這樣就可以移除掉renderPlainText的invoice參數
//   statementData.performances = invoice.performances;

//   // return renderPlainText(statementData, invoice, plays);
//   return renderPlainText(statementData, plays);
// }

// function renderPlainText(data, plays) {
//   let result = `Statement for ${data.customer}\n`;
//   for (let perf of data.performances) {
//     result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
//   }
//   result += `Amount owed is ${usd(totalAmount())}\n`;
//   result += `You earned ${totalVolumeCredits()} credits\n`;
//   return result;


//   function totalAmount() {
//     let result = 0;
//     for (let perf of data.performances) {
//       result += amountFor(perf);
//     }
//     return result;
//   }


//   function totalVolumeCredits() {
//     let result = 0;
//     for (let perf of data.performances) {
//       result += volumeCreditsFor(perf);
//     }
//     return result;
//   }


//   function usd(aNumber) {
//     return new Intl.NumberFormat("en-US",
//       {
//         style: "currency", currency: "USD",
//         minimumFractionDigits: 2
//       }).format(aNumber / 100);
//   }


//   function volumeCreditsFor(aPerformance) {
//     let result = 0;
//     result += Math.max(aPerformance.audience - 30, 0);
//     if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience /
//       5);
//     return result;
//   }


//   function playFor(aPerformance) {
//     return plays[aPerformance.playID];
//   }


//   function amountFor(aPerformance) {
//     let result = 0;
//     switch (playFor(aPerformance).type) {
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
//         throw new Error(`unknown type: ${playFor(aPerformance).type}`);
//     }
//     return result;
//   }
// }

// #endregion

// #region 3
// 現在我想要從中間資料取得play名稱，為此，我要用play的資料來enrich表演紀錄。
// function statement(invoice, plays) {
//   const statementData = {};

//   statementData.customer = invoice.customer;

//   statementData.performances = invoice.performances.map(enrichPerformance);

//   return renderPlainText(statementData, plays);


//   function enrichPerformance(aPerformance) {
//     // 先簡單地返回aPerformance物件的副本。返回副本的原因是，我不想修改傳給函數的參數，總是保持數據不可變(immutable)是一個好習慣。
//     const result = Object.assign({}, aPerformance); // 複製表演紀錄
//     // enrich表演紀錄，添加play屬性。然後開始替換playFor函數的調用，讓他們使用新數據。
//     result.play = playFor(result);
//     return result;
//   }

//   // 搬移 playFor 函數。
//   function playFor(aPerformance) {
//     return plays[aPerformance.playID];
//   }
// }

// function renderPlainText(data, plays) {
//   let result = `Statement for ${data.customer}\n`;
//   for (let perf of data.performances) {
//     result += ` ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
//   }
//   result += `Amount owed is ${usd(totalAmount())}\n`;
//   result += `You earned ${totalVolumeCredits()} credits\n`;
//   return result;


//   function totalAmount() {
//     let result = 0;
//     for (let perf of data.performances) {
//       result += amountFor(perf);
//     }
//     return result;
//   }


//   function totalVolumeCredits() {
//     let result = 0;
//     for (let perf of data.performances) {
//       result += volumeCreditsFor(perf);
//     }
//     return result;
//   }


//   function usd(aNumber) {
//     return new Intl.NumberFormat("en-US",
//       {
//         style: "currency", currency: "USD",
//         minimumFractionDigits: 2
//       }).format(aNumber / 100);
//   }


//   function volumeCreditsFor(aPerformance) {
//     let result = 0;
//     result += Math.max(aPerformance.audience - 30, 0);
//     if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience /
//       5);
//     return result;
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
// }

// #endregion

// #region 4
// 同樣手法移動amountFor、volumeCredits函數到statement函數中。
// 最後將兩個計算總數的函數搬移到statement函數中。 儘管可以讓這些計算總數的函數直接使用statementData變數(反正它在作用域內)，但我更喜歡顯示的傳入參數。
function statement(invoice, plays) {
  const statementData = {};

  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);


  return renderPlainText(statementData, plays);


  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  // 搬移 playFor 函數。
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }


  function amountFor(aPerformance) {
    let result = 0;
    switch (aPerformance.play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`);
    }
    return result;
  }


  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience /
      5);
    return result;
  }

  // function totalAmount(data) {
  //   let result = 0;
  //   for (let perf of data.performances) {
  //     result += perf.amount;
  //   }
  //   return result;
  // }

  function totalAmount(data) {
    return data.performances.reduce((total, perf) => total + perf.amount, 0);
  }


  // function totalVolumeCredits(data) {
  //   let result = 0;
  //   for (let perf of data.performances) {
  //     result += perf.volumeCredits;
  //   }
  //   return result;
  // }
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, perf) => total + perf.volumeCredits, 0);
  }
}

function renderPlainText(data, plays) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
      {
        style: "currency", currency: "USD",
        minimumFractionDigits: 2
      }).format(aNumber / 100);
  }

}
// #endregion

const result = statement(invoices[0], plays)

console.log(result)