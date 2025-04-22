/**
 * 重構的調整
 * 1. 分解函式，分離不同關注點。
 * 2. 使用命名良好的變數和函式來提高可讀性。
 * 3. 調整參數名稱以更好地反映其用途。
 */

import invoices from './invoices.json' with { type: "json" };
import plays from './plays.json' with { type: "json" };

/**
 * 1. 分解函式，分離不同關注點。
 */
/**
 * 生成報表
 * @param {Object} invoice - 發票資訊
 * @param {Object} plays - 戲劇資訊
 * @returns {string} - 報表內容
 */
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = amountFor(perf, play);

        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
        // print line for this order
        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

/**
 * 計算演出的金額。
 *
 * @param {Object} perf - 演出的相關資訊。
 * @param {Object} play - 演出的劇目資訊。
 * @returns {number} - 演出的金額。
 * @throws {Error} - 當劇目類型未知時拋出錯誤。
 */
function amountFor(perf, play) {
    let thisAmount = 0;
    switch (play.type) {
        case "tragedy":
            thisAmount = 40000;
            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;
        case "comedy":
            thisAmount = 30000;
            if (perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300 * perf.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

/**
 * 2. 使用命名良好的變數和函式來提高可讀性。
 */

/**
 * 計算演出的金額。
 *
 * @param {Object} perf - 演出的相關資訊。
 * @param {Object} play - 演出的劇目資訊。
 * @returns {number} - 演出的金額。
 * @throws {Error} - 當劇目類型未知時拋出錯誤。
 */
// function amountFor(perf, play) {
//     let result = 0;
//     switch (play.type) {
//         case "tragedy":
//             result = 40000;
//             if (perf.audience > 30) {
//                 result += 1000 * (perf.audience - 30);
//             }
//             break;
//         case "comedy":
//             result = 30000;
//             if (perf.audience > 20) {
//                 result += 10000 + 500 * (perf.audience - 20);
//             }
//             result += 300 * perf.audience;
//             break;
//         default:
//             throw new Error(`unknown type: ${play.type}`);
//     }
//     return result;
// }

/**
 * 3. 調整參數名稱以更好地反映其用途。
 */
/**
 * 計算演出的金額。
 *
 * @param {Object} aPerformance - 演出的相關資訊。
 * @param {Object} play - 演出的劇目資訊。
 * @returns {number} - 演出的金額。
 * @throws {Error} - 當劇目類型未知時拋出錯誤。
 */
// function amountFor(aPerformance, play) {
//     let result = 0;
//     switch (play.type) {
//         case "tragedy":
//             result = 40000;
//             if (aPerformance.audience > 30) {
//                 result += 1000 * (aPerformance.audience - 30);
//             }
//             break;
//         case "comedy":
//             result = 30000;
//             if (aPerformance.audience > 20) {
//                 result += 10000 + 500 * (aPerformance.audience - 20);
//             }
//             result += 300 * aPerformance.audience;
//             break;
//         default:
//             throw new Error(`unknown type: ${play.type}`);
//     }
//     return result;
// }



const result = statement(invoices[0], plays)

console.log(result)