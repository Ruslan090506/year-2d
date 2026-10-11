export const premises={A:{slots:1,transport:.3,rent:12000},B:{slots:1,transport:.4,rent:10000},C:{slots:1,transport:.3,rent:12000},D:{slots:1,transport:.1,rent:17000},E:{slots:2,transport:.2,rent:15000},F:{slots:3,transport:.2,rent:16000}};
export const machines={1:{capacity:72000,price:35000,maintenance:1800},2:{capacity:120000,price:95000,maintenance:2900},3:{capacity:68000,price:38000,maintenance:2100},4:{capacity:95000,price:70000,maintenance:2900},5:{capacity:45000,price:28000,maintenance:1300},6:{capacity:110000,price:90000,maintenance:2900}};
export const strategies=[{name:'Low-cost entry',machine:5,premises:'B',milk:2,production:40000,requested:40000,allocation:40000,market:1000,borrow:0,term:8},{name:'Capacity with discipline',machine:1,premises:'D',milk:3,production:60000,requested:60000,allocation:60000,market:1000,borrow:0,term:8}];
export function calculate(s,drop=0){
 const m=machines[s.machine],p=premises[s.premises],round=Math.round;
 const errors=[];
 for(const k of ['milk','production','requested','allocation','market','borrow','term'])if(!Number.isFinite(s[k]))errors.push('Complete all numeric fields.');
 if(s.milk<1)errors.push('Buy at least one ton of milk.');
 if(s.market<1000)errors.push('Market investment must be at least Sh 1,000.');
 if(s.production<0||!Number.isInteger(s.production)||s.production>Math.min(s.milk*20000,m.capacity))errors.push('Production must be whole units within milk and machine capacity.');
 if(s.requested<0||s.requested%10000!==0)errors.push('Requested sales must be non-negative blocks of 10,000.');
 if(s.allocation<0||s.allocation%10000!==0)errors.push('Allocation must be non-negative blocks of 10,000.');
 if(s.borrow<0||s.borrow>200000||!Number.isInteger(s.borrow))errors.push('Borrowing must be whole shekels from 0 to 200,000.');
 if(!Number.isInteger(s.term)||s.term<1||s.term>8)errors.push('Loan term must be 1 to 8 seasons.');
 const eligible=Math.floor(Math.min(s.requested,s.production)/10000)*10000;
 if(s.allocation>eligible)errors.push('Allocation cannot exceed the eligible request.');
 if(errors.length)return {errors:[...new Set(errors)]};
 const sales=Math.floor(s.allocation*(1-drop/100)/10000)*10000;
 const revenue=round(sales*2),milkCost=round(s.milk*20000),maintenance=m.maintenance,depreciation=round(m.price/8);
 const gross=revenue-milkCost-maintenance-depreciation;
 const transport=round(sales*p.transport),market=round(s.market),bonus=round(Math.max(0,gross)*.05),salary=10000,rent=p.rent,interest=round(s.borrow*.1);
 const pbt=gross-transport-market-bonus-salary-rent-interest;
 const tax=round(Math.max(0,pbt)*.1),net=pbt-tax,pool=Math.max(0,-pbt),principal=round(s.borrow/s.term);
 const purchase=m.price,afterPurchase=100000+s.borrow-purchase,afterMilk=afterPurchase-milkCost,afterMarket=afterMilk-market;
 const operating=milkCost+maintenance+transport+market+bonus+salary+rent;
 const cashFlow=revenue-operating-interest-tax-purchase+s.borrow-principal,closing=100000+cashFlow;
 return {errors:[],sales,eligible,produced:s.production,spoilage:s.production-sales,unusedMilk:s.milk-s.production/20000,revenue,milkCost,maintenance,depreciation,gross,transport,market,bonus,salary,rent,interest,pbt,tax,net,pool,principal,purchase,borrow:s.borrow,afterPurchase,afterMilk,afterMarket,operating,cashFlow,closing,debt:s.borrow-principal,minimum:Math.min(100000,afterPurchase,afterMilk,afterMarket,closing),life:7,book:purchase-depreciation};
}
