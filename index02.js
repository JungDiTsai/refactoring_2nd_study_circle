/**
 * 當移除play變數的好處(移除一個區域範圍變數，更容易取出volulmn credit的計算程式 )
 * 剩下兩個區域變數需要處理。同樣的perf很容易傳入，但是volumeCredits比較麻煩，因為它是一個累加變數，
 * 會在每一次的迴圈迭代時更新，所以最好的做法是在提取出來的函式裡面初始化一個他的分身，再回傳它。
 */

/**
 * 重構的調整
 * 處理兩個區域變數 perf 和 vloumeCredits
 * 1. 取出 volumn credit
 * 2. 移除format 變數
 */
import invoices from './invoices.json' with { type: "json" };
import plays from './plays.json' with { type: "json" };

// #region 移除play變數

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

        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
        // print line for this order
        result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        let result = 0;
        switch (playFor(aPerformance).type) {
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
                throw new Error(`unknown type: ${playFor(aPerformance).type}`);
        }
        return result;
    }

}
// #endregion


// #region 1.取出 volumn credit

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
//         volumeCredits += volumeCreditsFor(perf);

//         // print line for this order
//         result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
//         totalAmount += amountFor(perf);
//     }
//     result += `Amount owed is ${format(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;


//     /**
//      * 計算演出的積分。
//      *
//      * @param {Object} perf - 演出物件。
//      * @param {number} perf.audience - 觀眾數量。
//      * @returns {number} - 積分。
//      */
//     function volumeCreditsFor(aPerformance) {
//         let result = 0;
//         result += Math.max(aPerformance.audience - 30, 0);
//         if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5)
//             ;
//         return result;
//     }


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

//#endregion

// #region 2.移除format 變數
/**
 * 因為format為暫時變數可能會產生問題，它的作用域只限於他們自己的子程式裡面，因此會促成更冗長、更複雜的子程式。
 * 遇到這種情況可以宣告一個函式來取代它。
 */

// function statement(invoice, plays) {
//     let totalAmount = 0;
//     let result = `Statement for ${invoice.customer}\n`;

//     for (let perf of invoice.performances) {
//         // print line for this order
//         result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
//         totalAmount += amountFor(perf);
//     }

//     // 使用Slide Statements 來將變數的宣告式移動到迴圈旁邊。
//     let volumeCredits = 0;
//     for (let perf of invoice.performances) {
//         volumeCredits += volumeCreditsFor(perf);
//     }

//     result += `Amount owed is ${usd(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;


//     function volumeCreditsFor(aPerformance) {
//         let result = 0;
//         result += Math.max(aPerformance.audience - 30, 0);
//         if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5)
//             ;
//         return result;
//     }


//     /**
//      * 無法清晰的描述，但是又因為它只在一個字串模板內使用，範圍很小，改用formatAsUSD又有點囉嗦。
//      * 所以應該要強調"它格式化的東西式貨幣金額"這個事實，所以選擇可以表達這件事情的名稱。並執行Change Function Declaration。
//      */
//     // function format(aNumber) {
//     //     return new Intl.NumberFormat("en-US",
//     //         {
//     //             style: "currency", currency: "USD",
//     //             minimumFractionDigits: 2
//     //         }).format(aNumber);
//     // }

//     function usd(aNumber) {
//         return new Intl.NumberFormat("en-US",
//             {
//                 style: "currency", currency: "USD",
//                 minimumFractionDigits: 2
//             }).format(aNumber / 100);
//     }

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
//#endregion




// #region 處理與更新volumeCredits
/**
 * 將更改處理與更新volumeCredits相關的變數的程式法放在一起後，
 * 可以更輕鬆的執行Replace Temp With Query。與之前一樣，將處理這個變數的所有程式Extract Function。
 */

// function statement(invoice) {
//     let totalAmount = 0;
//     let result = `Statement for ${invoice.customer}\n`;

//     for (let perf of invoice.performances) {
//         // print line for this order
//         result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
//         totalAmount += amountFor(perf);
//     }

//     result += `Amount owed is ${usd(totalAmount / 100)}\n`;
//     result += `You earned ${totalVolumeCredits()} credits\n`;
//     return result;

//     function totalVolumeCredits() {
//         let volumeCredits = 0;
//         for (let perf of invoice.performances) {
//             volumeCredits += volumeCreditsFor(perf);
//         }
//         return volumeCredits;
//     }

//     function usd(aNumber) {
//         return new Intl.NumberFormat("en-US",
//             {
//                 style: "currency", currency: "USD",
//                 minimumFractionDigits: 2
//             }).format(aNumber / 100);
//     }

//     function volumeCreditsFor(aPerformance) {
//         let result = 0;
//         result += Math.max(aPerformance.audience - 30, 0);
//         if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5)
//             ;
//         return result;
//     }

//     function playFor(aPerformance) {
//         return plays[aPerformance.playID];
//     }

//     /**
//  * 計算演出的金額。
//  *
//  * @param {Object} aPerformance - 演出的相關資訊。
//  * @returns {number} - 演出的金額。
//  * @throws {Error} - 當劇目類型未知時拋出錯誤。
//  */
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


// #region 重複同樣步驟移除 totalAmount

function statement(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(totalAmount())}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;


    function totalAmount() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += amountFor(perf);
        }
        return result;
    }


    function totalVolumeCredits() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }


    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(aNumber / 100);
    }


    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience /
            5);
        return result;
    }


    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }


    function amountFor(aPerformance) {
        let result = 0;
        switch (playFor(aPerformance).type) {
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
                throw new Error(`unknown type: ${playFor(aPerformance).type}`);
        }
        return result;
    }
}
// #endregion

/**
 * 現在程式的結構看起來好多了，頂層的statement函式只有七行程式，
 * 它的工作只有安排statement的列印。所有的計算邏輯都被移動到幾個支援函式了，
 * 這可以讓大家更容易瞭解各個計算式的目的。以及整體的報告流程。
 */

const result = statement(invoices[0], plays)

console.log(result)

// #region recap
/**
 * 重構至此，可能有些人會此次修改的性能問題感到擔憂。但通常這樣子再跑一次迴圈對性能來的影響是微不足道的。
 * 如果你真的去測量重構之前與之後的程式執行時間，得到的速度應該是差不多的。如果你真的去測量重構之前與之後的程式執行時間，
 * 得到的速度應該是差不多的。我們很多的直覺都已經被聰明的編譯器、新世代的快取技術等技術推翻了。 軟體的性能通常只取決於
 * 一小部分的程式。修改其他地方都不會產生明顯的差異。
 *
 * 但通常與總是是有差異的，有時重構友會對性能產生重大影響，就算遇到這種況我也會繼續重構下去，因為調整重構好的程式容易多了。
 * 如果在重構的過程中發現性能問題，也會在完成之後再花時間調整性能，我可能會撤些一些之前做過的重構。。但在多數的情況下，
 * 因為重構的關係，我可以採取用有效率的方式調整性能，最終可以得到既清楚且快速的程式碼。
 */



/**
//  * 所以關於重構性能問題，我的建議是: 在多數情況下，你都要忽略它。如果你的重構造成性能下降，請先完成重購，再做性能調整。
 */


/**
 * 關於此次的調整用了許多小步驟來移除volumnCredits。我使用四個步驟，在每一個步驟結束時，都會進行編譯、測試，並提交至本地原始碼存放區。
 * - Split Loop 來分出累加程式
 * - Slide Statements 將初始化程式移到累加程式旁邊
 * - Extract Function 建立一個計算總合的函式
 * - Inline Variable 完全移除變數
 */
//#endregion
