import invoices from './invoices.json' with { type: "json" };
import plays from './plays.json' with { type: "json" };

import { statement, htmlStatement } from './index04/statement.js'


const result = statement(invoices[0], plays)
const resultHtml = htmlStatement(invoices[0], plays)

console.log(result)
console.log(resultHtml)