/**
 * 重構的調整
 * 1. 查看參數來自何方。
 * - 1.1 aPerformance: 來自發票的 performances 陣列 (每次回圈迭代時改變)。
 * - 1.2 play: 是從 performances 得到，無須使用參數來傳遞。
 * 
 * 2. 移除不必要的參數。
 * - 2.1.提取賦值改為函式
 * - 2.2.使用內連變量(Inline Variable)來簡化程式碼
 * 
 * 3. 函數應用改變函式聲明 (Change Function Declaration)、移除區域變數使其容易提取。
 * - 3.1 函式內部使用新的
 * - 3.2 刪除不必要的參數
 */

import invoices from './invoices.json' with { type: "json" };
import plays from './plays.json' with { type: "json" };


// #region 1. 查看參數來自何方。

/**
 * 1.1 aPerformance: 來自發票的 performances 陣列 (每次回圈迭代時改變)。
 * 1.2 play: 是從 performances 得到，無須使用參數來傳遞。
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

    /**
     * 計算演出的金額。
     *
     * @param {Object} aPerformance - 演出的相關資訊。
     * @returns {number} - 演出的金額。
     * @throws {Error} - 當劇目類型未知時拋出錯誤。
     */
    function amountFor(aPerformance, play) {
        let result = 0;
        switch (play.type) {
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
                throw new Error(`unknown type: ${play.type}`);
        }
        return result;
    }

}



// #endregion


// #region 2. 移除不必要的參數。

// #region 2.1 提取賦值改為函式

// function statement(invoice, plays) {
//     let totalAmount = 0;
//     let volumeCredits = 0;
//     let result = `Statement for ${invoice.customer}\n`;
//     const format = new Intl.NumberFormat("en-US",
//         {
//             style: "currency", currency: "USD",
//             minimumFractionDigits: 2
//         }).format;
//     for (let perf of invoice.performances) {
//         const play = playFor(perf);
//         let thisAmount = amountFor(perf, play);

//         // add volume credits
//         volumeCredits += Math.max(perf.audience - 30, 0);
//         // add extra credit for every ten comedy attendees
//         if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
//         // print line for this order
//         result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
//         totalAmount += thisAmount;
//     }
//     result += `Amount owed is ${format(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;


//     /**
//      * 根據提供的表演資訊，返回對應的表演物件。
//      *
//      * @param {Object} aPerformance - 表演資訊物件。
//      * @returns {Object} - 表演物件。
//      */
//     function playFor(aPerformance) {
//         return plays[aPerformance.playID];
//     }


//     // 調整參數名稱以更好地反映其用途。
//     function amountFor(aPerformance, play) {
//         let result = 0;
//         switch (play.type) {
//             case "tragedy":
//                 result = 40000;
//                 if (aPerformance.audience > 30) {
//                     result += 1000 * (aPerformance.audience - 30);
//                 }
//                 break;
//             case "comedy":
//                 result = 30000;
//                 if (aPerformance.audience > 20) {
//                     result += 10000 + 500 * (aPerformance.audience - 20);
//                 }
//                 result += 300 * aPerformance.audience;
//                 break;
//             default:
//                 throw new Error(`unknown type: ${play.type}`);
//         }
//         return result;
//     }

// }


// #endregion

// #region 2.2 使用內連變量(Inline Variable)來簡化程式碼

// function statement(invoice, plays) {
//     let totalAmount = 0;
//     let volumeCredits = 0;
//     let result = `Statement for ${invoice.customer}\n`;
//     const format = new Intl.NumberFormat("en-US",
//         {
//             style: "currency", currency: "USD",
//             minimumFractionDigits: 2
//         }).format;
//     for (let perf of invoice.performances) {
//         let thisAmount = amountFor(perf, playFor(perf));

//         // add volume credits
//         volumeCredits += Math.max(perf.audience - 30, 0);
//         // add extra credit for every ten comedy attendees
//         if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
//         // print line for this order
//         result += ` ${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
//         totalAmount += thisAmount;
//     }
//     result += `Amount owed is ${format(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;

//     function playFor(aPerformance) {
//         return plays[aPerformance.playID];
//     }

//     function amountFor(aPerformance, play) {
//         let result = 0;
//         switch (play.type) {
//             case "tragedy":
//                 result = 40000;
//                 if (aPerformance.audience > 30) {
//                     result += 1000 * (aPerformance.audience - 30);
//                 }
//                 break;
//             case "comedy":
//                 result = 30000;
//                 if (aPerformance.audience > 20) {
//                     result += 10000 + 500 * (aPerformance.audience - 20);
//                 }
//                 result += 300 * aPerformance.audience;
//                 break;
//             default:
//                 throw new Error(`unknown type: ${play.type}`);
//         }
//         return result;
//     }

// }

// #endregion

// #region 3. 函數應用改變函式聲明 (Change Function Declaration)、移除區域變數。

// #region 3.1 函式內部使用新函式、3.2 刪除不必要的參數

// function statement(invoice, plays) {
//     let totalAmount = 0;
//     let volumeCredits = 0;
//     let result = `Statement for ${invoice.customer}\n`;
//     const format = new Intl.NumberFormat("en-US",
//         {
//             style: "currency", currency: "USD",
//             minimumFractionDigits: 2
//         }).format;
//     for (let perf of invoice.performances) {

//         // add volume credits
//         volumeCredits += Math.max(perf.audience - 30, 0);
//         // add extra credit for every ten comedy attendees
//         if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
//         // print line for this order
//         result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
//         totalAmount += amountFor(perf);
//     }
//     result += `Amount owed is ${format(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;

//     function playFor(aPerformance) {
//         return plays[aPerformance.playID];
//     }

//     function amountFor(aPerformance) {
//         let result = 0;
//         switch (playFor(aPerformance).type) {
//             case "tragedy":
//                 result = 40000;
//                 if (aPerformance.audience > 30) {
//                     result += 1000 * (aPerformance.audience - 30);
//                 }
//                 break;
//             case "comedy":
//                 result = 30000;
//                 if (aPerformance.audience > 20) {
//                     result += 10000 + 500 * (aPerformance.audience - 20);
//                 }
//                 result += 300 * aPerformance.audience;
//                 break;
//             default:
//                 throw new Error(`unknown type: ${playFor(aPerformance).type}`);
//         }
//         return result;
//     }

// }

// #endregion


/**
 * 當移除play變數的好處(移除一個區域範圍變數，更容易取出volulmn credit的計算程式 )
 * 剩下兩個區域變數需要處理。同樣的perf很容易傳入，但是volumeCredits比較麻煩，因為它是一個累加變數，
 * 會在每一次的迴圈迭代時更新，所以最好的做法是在提取出來的函式裡面初始化一個他的分身，再回傳它。
 */


const result = statement(invoices[0], plays)

console.log(result)