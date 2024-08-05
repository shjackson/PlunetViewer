import { BillingAndCount, OrderService } from "./order-service";
import * as luxon from 'luxon';

export class KPIService {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async getYearToYearMonthlyBillingGrowth(month?: number): Promise<YearToYearMonthlyBillingGrowthResponse> {
    if (!month) {
      month = new Date().getMonth();
    }
    const year = new Date().getFullYear();

    const current = await this.orderService.getMonthlyBilling(year, month);
    console.log(current);
    const past = await this.orderService.getMonthlyBilling(year - 1, month);
    console.log(past);
    const variation = past === 0 ? Infinity : parseFloat((((current - past)/past) * 100).toFixed(2));
    return {
      current,
      past,
      variation
    };
  }

  async getYearToYearElapsedTimeBillingGrowth(month?: number): Promise<YearToYearElapsedTimeBillingGrowthResponse> {
    if (!month) {
      month = new Date().getMonth();
    }
    const year = new Date().getFullYear();
    const pastYear = year - 1;
    const current = await this.orderService.getRangeBilling(year, 1, year, month);
    const past = await this.orderService.getRangeBilling(pastYear, 1, pastYear, month);
    const variation = past === 0 ? Infinity : parseFloat((((current - past)/past) * 100).toFixed(2));
    return {
      current,
      past,
      variation
    };
  }

  async getOrdersByCreationDate(): Promise<BillingAndCount> {
    const date = luxon.DateTime.local();
    return this.orderService.getOrdersByCreationDate(2024, 5, 10);//(date.year, date.month, date.day);
  }

  async getOrdersByCreationMonth(): Promise<BillingAndCount> {
    const date = luxon.DateTime.local();
    return this.orderService.getOrdersByCreationMonth(date.year, date.month);//(date.year, date.month, date.day);
  }

  async getMonthlyBillingBySection(): Promise<any> {
    const date = luxon.DateTime.local();
    return this.orderService.getMonthlyBillingBySection(date.year, date.month);//(date.year, date.month, date.day);
  }

  async getElapsedYearBillingBySection(): Promise<any> {
    const date = luxon.DateTime.local();
    return this.orderService.getRangeBillingBySection(date.year, 1, date.year, date.month);//(date.year, date.month, date.day);
  }

  async getMonthToMonthBillingGrowth(month?: number): Promise<YearToYearMonthlyBillingGrowthResponse> {
    if (!month) {
      month = new Date().getMonth();
    }
    const year = new Date().getFullYear();
    const now = luxon.DateTime.local(year, month, 15);
    const previousMonth = now.minus({months: 1});
    console.log(luxon.DateTime.local(year, month, 15).toFormat('yyyy-MM-dd'));
    console.log(luxon.DateTime.local(year, previousMonth.month, 15).toFormat('yyyy-MM-dd'));

    const current = await this.orderService.getMonthlyBilling(year, month);
    console.log(current);
    const past = await this.orderService.getMonthlyBilling(year, month - 1);
    console.log(past);
    const variation = past === 0 ? Infinity : parseFloat((((current - past)/past) * 100).toFixed(2));
    return {
      current,
      past,
      variation
    }
  }

  async getMonthlyBilledLanguages(month?: number) {
    if (!month) {
      month = new Date().getMonth();
    }
    const year = new Date().getFullYear();
    const current = await this.orderService.getMonthlyBilledLanguages(year, month);
    return current;
  }

  async getMonthlyBilledCustomers(month?: number) {
    if (!month) {
      month = new Date().getMonth();
    }
    const year = new Date().getFullYear();
    const current = await this.orderService.getMonthlyBilledCustomers(year, month);
    return current;
  }
}

export interface YearToYearElapsedTimeBillingGrowthResponse {
  current: number;
  past: number;
  variation: number;
}

export interface YearToYearMonthlyBillingGrowthResponse {
  current: number;
  past: number;
  variation: number;
}