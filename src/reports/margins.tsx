import _ from "lodash";
import { OrderService } from "../services/order-service";
import { ItemService } from "../services/item-service";
import { DataJob } from "../plunet/data-job";
import { CustomerService } from "../services/customer-service";
import { percentile } from "../common/utils";
import { getToken } from "../plunet/context";
import { Prisma } from "@prisma/client";
import prisma from '../db/prisma';

export class MarginsReport {

  private orderService: OrderService;
  private itemService: ItemService;
  private dataJob: DataJob;

  constructor() {
    this.orderService = new OrderService();
    this.itemService = new ItemService();
    this.dataJob = new DataJob();
  }

  async generateReport(start: string, end: string): Promise<Array<MarginRow>> {
    const result: Array<MarginRow> =await prisma.$queryRaw`
      SELECT
        c."fullName" "customer",
        SUM(i."totalPrice") "billing",
        SUM(j."totalPrice") "cost",
        ROUND((SUM(i."totalPrice") - SUM(j."totalPrice"))/NULLIF(SUM(i."totalPrice"), 0), 2) "margin"
      FROM "Order" o
      INNER JOIN "Customer" c
      ON o."customerID" = c."customerID"
      INNER JOIN "Item" i
      ON o."orderID" = i."orderID"
      INNER JOIN "Job" j
      ON j."itemID" = i."itemID"
      WHERE o."orderDate" <= DATE_TRUNC('DAY', ${end}::TIMESTAMP) + INTERVAL '1 DAY - 1 MICROSECOND'
      AND o."orderDate" > DATE_TRUNC('DAY', ${start}::TIMESTAMP) - INTERVAL '1 DAY - 1 MICROSECOND'
      GROUP BY c."fullName"
      ORDER BY "margin"`;
    return result;
  }

  async generateReportPlunet(start: string, end: string) {
    const customers = await new CustomerService().findAll();
    const customersById = _.keyBy(customers, 'customerID');
    const billingByCustomer: any = {};
    const costByCustomer: any = {};
    const orders = await this.orderService.find({ start, end });
    const ordersActions = _.map(orders, (order) => {

      return this.itemService.find(order.orderID)
      .then((items)=> {
        let jobIDs: any[] = [];
        _.each(items, (item) => {
          if (item.jobIDList) {
            jobIDs = jobIDs.concat(item.jobIDList);
          }
          billingByCustomer[order.customerID] = (billingByCustomer[order.customerID] || 0) + +item.totalPrice;
        });

        return jobIDs;
      })
      .then(async (jobIDs) => {
        const jobsData = await Promise.all(_.map(jobIDs, async (jobID) => {
          const token = await getToken();
          return this.dataJob.getJobMetrics({
            UUID: token,
            projectType: 3,
            languageCode: 'EN',
            jobID
          });
        }));
        costByCustomer[order.customerID] = _.reduce(_.map(jobsData, 'totalPrice'),(accu, val) => accu + +val, 0);
      });
    });
    await Promise.all(ordersActions);
    return this.buildResponse(billingByCustomer, costByCustomer, this.calculateMarginByCustomer(billingByCustomer, costByCustomer), customersById);
  }

  private async buildResponse(billingByCustomer: any, costByCustomer: any, marginByCustomer: any, customersById: any) {
    const data: any[] = [];
    const customerIDs = Array.from(new Set((Object.keys(billingByCustomer) || []).concat(Object.keys(costByCustomer) || [])));
    _.each(customerIDs, (customerID) => {
      const billingCategory = this.calculatePercentileLevel(Object.values(billingByCustomer), billingByCustomer[customerID]);
      const marginCategory = this.calculatePercentileLevel(Object.values(marginByCustomer), marginByCustomer[customerID]);
      const customerData = {
        key: customerID,
        customer: customersById[customerID] ? customersById[customerID].fullName : 'Empty Customer',
        billing: billingByCustomer[customerID],
        cost: costByCustomer[customerID],
        margin: marginByCustomer[customerID],
        billingCategory: `${billingCategory}_billing`,
        marginCategory: `${marginCategory}_margin`,
        combinedCategory: `${billingCategory}_billing_${marginCategory}_margin`,
      }
      data.push(customerData);
    })
    return data;
  }

  private calculateMarginByCustomer(billingByCustomer: any, costByCustomer: any) {
    const marginByCustomer: any = {};
    const customerIDs = Array.from(new Set((Object.keys(billingByCustomer) || []).concat(Object.keys(costByCustomer) || [])));
    _.each(customerIDs, (customerID: string) => {
      marginByCustomer[customerID] = (billingByCustomer[customerID] - costByCustomer[customerID]) / billingByCustomer[customerID];
    });
    return marginByCustomer;
  }

  private calculatePercentileLevel(allValues: number[], value: number): string {
    const percentileValue: number = percentile(allValues, value);
    if (percentileValue > 66) {
      return 'high';
    }
    if (percentileValue < 33) {
      return 'low';
    }
    return 'mid';
  }

}

export interface MarginRow {
  customer: string;
  billing: number;
  cost: number;
  margin: number;
}