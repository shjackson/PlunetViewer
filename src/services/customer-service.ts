import _ from "lodash";
import { DataCustomer } from "../plunet/data-customer";
import prisma from '../db/prisma';
import { getToken, executeDelayed } from "../plunet/context";
import { Prisma } from "@prisma/client";

export class CustomerService {
  private dataCustomer;

  constructor() {
    this.dataCustomer = new DataCustomer();
  }

  async findAll() {
    const actionCustomerByStatus = [];
    for (const customerStatus of [1,2,3,4,6]) {
      actionCustomerByStatus.push(executeDelayed(this.dataCustomer.getAllCustomerObjets, {
        Status: '' + customerStatus
      }));
    }
    const actionCustomerByStatusResponse = await Promise.all(actionCustomerByStatus);
    console.log('done with the customers search');

    const result = _.flatten(actionCustomerByStatusResponse);
    console.log(result.length);
    return result;
  }

  async syncCustomers() {
    await getToken();
    const remoteCustomers = await this.findAll();
    await prisma.$queryRaw(Prisma.sql`TRUNCATE TABLE "Customer" CASCADE;`);
    console.log('reseteada la tabla');
    await prisma?.customer.createMany({
      data: remoteCustomers
    });
    return remoteCustomers;
  }
}