import _ from "lodash";
import { DataOrder, DefaultSearchOptions } from "../plunet/data-order";
import prisma from '../db/prisma';
import { executeDelayed, executeWithRetry } from "../plunet/context";

export class OrderService {

  private dataOrder;

  constructor() {
    this.dataOrder = new DataOrder();
  }


  async find(options: {start: string, end: string}) {
    // search all the orders
    const searchOrderOptions = _.cloneDeep(DefaultSearchOptions);
    searchOrderOptions.SearchFilter.timeFrame.dateFrom = options.start;
    searchOrderOptions.SearchFilter.timeFrame.dateTo = options.end;

    let searchResponse = await executeDelayed(this.dataOrder.search, searchOrderOptions);
    if (searchResponse.length === 0) {
      return [];
    }
    const getObjectOrderListOptions = {
      orderIDList: {
        integerList: searchResponse || []
      }
    }

    //get the details of each order
    const getOrderObjectListResponse = await executeDelayed(this.dataOrder.getOrderObjectList, getObjectOrderListOptions);

    return _.flatten([getOrderObjectListResponse]);
  }

  async findFromDb(options: {start: string, end: string}) {
    return prisma.order.findMany({
      where: {

      }
    });
  }


  async getOrdersByCreationDate(year: number, month: number, day: number): Promise<BillingAndCount> {
    const queryDay = `${year}-${month}-${day}`;
    console.log(`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing",
      COUNT(distinct(o."orderID"))::int "count"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE DATE_TRUNC('DAY', o."orderDate") = '${queryDay}'`);
    const result: Array<any> =await prisma.$queryRaw`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing",
      COUNT(distinct(o."orderID"))::int "count"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE DATE_TRUNC('DAY', o."orderDate") = ${queryDay}::timestamp`;
    return result[0];
  }

  async getOrdersByCreationMonth(year: number, month: number): Promise<BillingAndCount> {
    const queryDay = `${year}-${month}-01`;
    console.log(`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing",
      COUNT(distinct(o."orderID"))::int "count"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE DATE_TRUNC('MONTH', o."orderDate") = '${queryDay}'`);
    const result: Array<any> =await prisma.$queryRaw`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing",
      COUNT(distinct(o."orderID"))::int "count"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE DATE_TRUNC('MONTH', o."orderDate") = ${queryDay}::timestamp`;
    return result[0];
  }

  async getRangeBilling(startYear: number, startMonth: number, endYear: number, endMonth: number): Promise<number> {
    const startDay = `${startYear}-${startMonth}-01`;
    const endDay = `${endYear}-${endMonth}-01`;
    console.log(`${startDay} / ${endDay}`);
    console.log(`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${endDay}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
      AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${startDay}::TIMESTAMP)`);
    const result: Array<any> =await prisma.$queryRaw`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${endDay}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
      AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${startDay}::TIMESTAMP)`;
    return result[0].billing;
  }

  async getRangeBillingBySection(startYear: number, startMonth: number, endYear: number, endMonth: number): Promise<any> {
    const startDay = `${startYear}-${startMonth}-01`;
    const endDay = `${endYear}-${endMonth}-01`;
    console.log(`${startDay} / ${endDay}`);
    console.log(`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing",
      o."businessUnit"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${endDay}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
      AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${startDay}::TIMESTAMP)
      GROUP BY o."businessUnit"`);
    const result: Array<any> =await prisma.$queryRaw`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing",
      o."businessUnit"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${endDay}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
      AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${startDay}::TIMESTAMP)
      GROUP BY o."businessUnit"`;
    return result;
  }

  async getMonthlyBilling(year: number, month: number): Promise<number> {
    const day = `${year}-${month}-01`;
    console.log(`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${day}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
      AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${day}::TIMESTAMP)`);
    const result: Array<any> =await prisma.$queryRaw`
      SELECT
      ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${day}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
      AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${day}::TIMESTAMP)`;
    return result[0].billing;
  }

  async getMonthlyBillingBySection(year: number, month: number): Promise<any> {
    const day = `${year}-${month}-01`;
    console.log(`
        SELECT
        ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing",
        o."businessUnit"
        FROM "Order" o
        INNER JOIN "Item" i
        ON o."orderID" = i."orderID"
        WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${day}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
        AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${day}::TIMESTAMP)
        GROUP BY o."businessUnit" `);
    const result: Array<any> =await prisma.$queryRaw`
        SELECT
        ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing",
        o."businessUnit"
        FROM "Order" o
        INNER JOIN "Item" i
        ON o."orderID" = i."orderID"
        WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${day}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
        AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${day}::TIMESTAMP)
        GROUP BY o."businessUnit" `;
    return result;
  }

  async getMonthlyBilledLanguages(year: number, month: number) {
    const day = `${year}-${month}-01`;
    console.log(day);
    const result: Array<any> = await prisma.$queryRaw`
      SELECT
        i."targetLanguage" "id",
        ROUND(SUM(i."totalPrice"/o."rate"), 2) "billing",
        ROUND(SUM(j."totalPrice"/o."rate"), 2) "cost",
        ROUND((SUM(i."totalPrice"/o."rate") - SUM(j."totalPrice"/o."rate"))/NULLIF(SUM(i."totalPrice"/o."rate"), 0), 2) "margin"
      FROM "Order" o
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      INNER JOIN "Job" j
      ON j."itemID" = i."itemID"
	    WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${day}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
      AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${day}::TIMESTAMP)
      GROUP BY i."targetLanguage"
      having ROUND((SUM(i."totalPrice"/o."rate") - SUM(j."totalPrice"/o."rate"))/NULLIF(SUM(i."totalPrice"/o."rate"), 0), 2) > 0
      ORDER BY "billing" desc`;
    return result;
  }

  async getMonthlyBilledCustomers(year: number, month: number) {
    const day = `${year}-${month}-01`;
    console.log(day);
    const result: Array<any> = await prisma.$queryRaw`
      SELECT
        c."fullName" "id",
        ROUND(SUM(i."totalPrice"), 2) "billing",
        ROUND(SUM(j."totalPrice"), 2) "cost",
        ROUND((SUM(i."totalPrice") - SUM(j."totalPrice"))/NULLIF(SUM(i."totalPrice"), 0), 2) "margin"
      FROM "Order" o
      INNER JOIN "Customer" c
      ON o."customerID" = c."customerID"
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      INNER JOIN "Job" j
      ON j."itemID" = i."itemID"
      WHERE o."deliveryDeadline" <= DATE_TRUNC('MONTH', ${day}::TIMESTAMP) + INTERVAL '1 MONTH - 1 MICROSECOND'
      AND o."deliveryDeadline" >= DATE_TRUNC('MONTH', ${day}::TIMESTAMP)
      GROUP BY c."fullName"
      HAVING ROUND((SUM(i."totalPrice") - SUM(j."totalPrice"))/NULLIF(SUM(i."totalPrice"), 0), 2) > 0
      ORDER BY "billing" desc`;
    return result;
  }

  async backupOrderData(token: string, month: {start: string, end: string, orderIDs: any[]}) {
    const searchOrderOptions = _.cloneDeep(DefaultSearchOptions);
    searchOrderOptions.SearchFilter.timeFrame.dateFrom = month.start;
    searchOrderOptions.SearchFilter.timeFrame.dateTo = month.end;
    searchOrderOptions.UUID = token;
    const searchResponse = await executeWithRetry(this.dataOrder.search, searchOrderOptions);
    token = searchResponse.token;
    let searchData = searchResponse.data;
    month.orderIDs = searchData;
    if (searchData.length === 0) {
      return;
    }
    const getObjectOrderListOptions = {
      UUID: token,
      orderIDList: {
        integerList: searchData || []
      }
    }
    //get the details of each order
    let getOrderObjectListResponse = await executeWithRetry(this.dataOrder.getOrderObjectList, getObjectOrderListOptions);
    token = getOrderObjectListResponse.token;
    let getOrderObjectListData = getOrderObjectListResponse.data;
    getOrderObjectListData = _.flatten([getOrderObjectListData]);
    const filteredOrdersToSave = _.filter(getOrderObjectListData, (order) => {
      return order.customerID !== '0';
    });
    await prisma.order.createMany({
      data: _.flatten(filteredOrdersToSave)
    });
    return filteredOrdersToSave;
  }
}

export interface BillingAndCount {
  billing?: number;
  count: number;
}