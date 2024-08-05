import { DataItem } from "../plunet/data-item";
import { DataJob } from "../plunet/data-job";
import { DataOrder, DefaultSearchOptions } from "../plunet/data-order";
import { PlunetConnector } from "../plunet/plunet-api";
import prisma from '../db/prisma';
import * as luxon from 'luxon';
import { executeAllWithRetry, executeWithRetry, getToken } from "../plunet/context";
import _ from "lodash";
import { Prisma } from "@prisma/client";


export class BackupService {
  private dataOrder: DataOrder;
  private dataItem: DataItem;
  private dataJob: DataJob;
  private connector: PlunetConnector;

  constructor() {
    this.dataOrder = new DataOrder();
    this.dataItem = new DataItem();
    this.dataJob = new DataJob();
    this.connector = new PlunetConnector();
  }

  async backupThatShit() {
    let token = await getToken();
    //await prisma.$queryRaw(Prisma.sql`TRUNCATE TABLE "Order" CASCADE;`);
    //await prisma.$queryRaw(Prisma.sql`TRUNCATE TABLE "Item" CASCADE;`);
    let months = [];
    for(let year = 2010; year <= luxon.DateTime.local().year; year++) {
      for (let month = 1; month <= 12; month++) {
        months.push({
          start: luxon.DateTime.local(year, month, 15).startOf('month').toFormat('yyyy-MM-dd'),
          end: luxon.DateTime.local(year, month, 15).endOf('month').toFormat('yyyy-MM-dd'),
          orderIDs: []
        });
      }
    }

    //months = [{start: '2024-01-01', end: '2024-01-31', orderIDs: []}];
/*
    for (const month of months) {
      const searchOrderOptions = _.cloneDeep(DefaultSearchOptions);
      searchOrderOptions.SearchFilter.timeFrame.dateFrom = month.start;
      searchOrderOptions.SearchFilter.timeFrame.dateTo = month.end;
      searchOrderOptions.UUID = token;
      const searchResponse = await executeWithRetry(this.dataOrder.search, searchOrderOptions);
      console.log(searchResponse);
      token = searchResponse.token;
      let searchData = searchResponse.data;
      month.orderIDs = searchData;
      if (searchData.length === 0) {
        continue;
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
      const ordersSliceSize = 100;
      const keyedOrdersToSave: any = _.keyBy(filteredOrdersToSave, 'orderID');
      if(month.start.substring(0,4) === '2024') {
        for(let i = 0; i < filteredOrdersToSave.length; i+= ordersSliceSize) {
          const filteredOrdersSlice = _.slice(filteredOrdersToSave, i, i + ordersSliceSize);
          const optionsToGetBusinessUnit = _.map(filteredOrdersSlice, (filteredOrder) => {
            return {
              UUID: token,
              orderID: filteredOrder.orderID,
              propertyNameEnglish: 'Business Unit'
            };
          });
          const getPropertyResponse = await executeAllWithRetry(this.dataOrder.getProperty, optionsToGetBusinessUnit, (data: any, option: any) => {

            console.log(`${option.orderID} : ${JSON.stringify(data)}`);
            keyedOrdersToSave[option.orderID].businessUnit = data;
            return {
              data,
              orderID: option.orderID,
            };
          });
          token = getPropertyResponse.token;
        }
        console.dir(keyedOrdersToSave, {depth: null});
      }
      await prisma.order.createMany({
        data: _.flatten(Object.values(keyedOrdersToSave))
      });
    }*/
    let items: any[] = [];
    let jobs: any[] = [];
    for (const itemStatus of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]) {
    //for (const itemStatus of [3]) {
      console.log(itemStatus)
      const getItemByStatusResponse = await executeWithRetry(this.dataItem.getItemsByStatus, {
        UUID: token,
        projectType: 3,
        status: itemStatus
      })
      items = items.concat(getItemByStatusResponse.data);
      console.log(getItemByStatusResponse.data.length);
      token = getItemByStatusResponse.token;
    }

    let itemsToSave: any[] = _.map(_.cloneDeep(items), (item) => { delete item.jobIDList; item.orderID = item.projectID; return item; });
    await prisma.item.createMany({
      data: itemsToSave
    });
    console.log(items.length);
    const processedItems = _.map(items, (item) => {
      if (item.jobIDList) {
        if (_.isArray(item.jobIDList)) {
          jobs.push(_.map(item.jobIDList, (jobID) => {
            return {
              jobID,
              itemID: item.itemID
            };
          }));
        } else {
          jobs.push({
            jobID: item.jobIDList,
            itemID: item.itemID
          });
        }
      }
      item.orderID = item.projectID;
      return item;
    });
    console.log(processedItems[0]);
    console.log(_.flatten(jobs));
    jobs = _.flatten(jobs);
    //let jobsData: any[] = [];
    //jobs = jobs.slice(0, 10);
    console.log(jobs);
    const sliceSize = 100;
    for(let i = 0; i < jobs.length; i+= sliceSize) {
      const jobIDsSlice = _.slice(jobs, i, i + sliceSize);
      const params = _.map(jobIDsSlice, (job) => {
        return {
          UUID: token,
          jobID: job.jobID,
          itemID: job.itemID,
          projectType: 3,
          languageCode: 'EN'
        };
      });
      const getJobMetricsResponse = await executeAllWithRetry(this.dataJob.getJobMetrics, params, (data: any, option: any) => {
        return {
          ...data,
          jobID: option.jobID,
          itemID: option.itemID
        };
      });

      token = getJobMetricsResponse.token;
      //jobsData = jobsData.concat(getJobMetricsResponse.data);
      //console.log(jobsData);
      //console.log(jobsData.length);
      await this.saveJobs(getJobMetricsResponse.data);
    }

    return jobs;
  }

  private async saveJobs(jobs: any[]) {
    console.log(jobs);
    const amountsToSave: any[] = [];
    const jobsToSave: any[] = [];
    for (const job of jobs) {

      if (job.amounts) {
        for (const amount of _.flatten([job.amounts])) {
          amountsToSave.push({
            jobID: job.jobID,
            ...amount
          });
        }
        delete job.amounts;
      }
      jobsToSave.push(job);
    }
    console.log(`jobs: ${jobsToSave.length}`);
    console.log(`amounts: ${amountsToSave.length}`);
    return prisma.amount.deleteMany({
      where: {
        jobID: {
          in: _.map(amountsToSave, 'jobID')
        }
      }
    })
    .then(() => prisma.job.deleteMany({
      where: {
        jobID: {
          in: _.map(jobsToSave, 'jobID')
        }
      }
    }))
    .then(() => prisma.job.createMany({
      data: jobsToSave
    }))
    .then(() => prisma.amount.createMany({
      data: amountsToSave
    }));
  }

}