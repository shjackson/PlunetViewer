import type { NextApiRequest, NextApiResponse } from 'next';
import { MarginsReport } from '../../reports/margins';
import _ from 'lodash';
import assert from 'assert';
import { BadRequestError } from '../../errors/bad-request';
import { BaseError } from '../../errors/base';
import * as luxon from 'luxon';
import { getToken } from '../../plunet/context';
import { KPIService } from '../../services/kpi-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  req.query = req.query || {};
  let result = {}
  try {
    assert(req.query.type, new BadRequestError('Missing Report Type'));
    switch (req.query.type) {
      case 'year-to-year-monthly-growth': {
        if (process.env['MOCKED_DATA']) {
          result = { "current": "610500.55", "past": "550000.50", "variation": 11.3 };
          break;
        }
        result = await new KPIService().getYearToYearMonthlyBillingGrowth(luxon.DateTime.local().month);
        break;
      }
      case 'year-to-year-elapsed-time': {
        if (process.env['MOCKED_DATA']) {
          result = { "current": "7100238.54", "past": "6543998.66", "variation": 8.5 };
          break;
        }
        result = await new KPIService().getYearToYearElapsedTimeBillingGrowth(luxon.DateTime.local().month);
        break;
      }
      case 'orders-created-today': {
        if (process.env['MOCKED_DATA']) {
          result = { billing: '30000.00', count: 40 };
          break;
        }
        result = await new KPIService().getOrdersByCreationDate();
        break;
      }
      case 'orders-created-month': {
        if (process.env['MOCKED_DATA']) {
          result = { billing: '123000.00', count: 600 };
          break;
        }
        result = await new KPIService().getOrdersByCreationMonth();
        break;
      }
      case 'month-to-month-growth': {
        if (process.env['MOCKED_DATA']) {
          result = { billing: '181208.18', count: 1122 };
          break;
        }
        result = await new KPIService().getMonthToMonthBillingGrowth(luxon.DateTime.local().month);
        break;
      }
      case 'monthly-billing-by-section': {
        if (process.env['MOCKED_DATA']) {
          result = [
            {
              "billing": "166000",
              "businessUnit": "tbolab"
            },
            {
              "billing": "105000",
              "businessUnit": "tboloc"
            },
            {
              "billing": "90000",
              "businessUnit": "tbomedia"
            },
            {
              "billing": "200000",
              "businessUnit": "tboplay"
            },
            {
              "billing": "300000",
              "businessUnit": "tbotalent"
            },
            {
              "billing": "130000",
              "businessUnit": "tbolive"
            },
          ]
        } else {
          result = await new KPIService().getMonthlyBillingBySection();
        }
        for (const businessUnit of ['tbolab', 'tbolive', 'tboloc', 'tbomedia', 'tbotalent', 'tboplay']) {
          if (_.isUndefined(_.find(result, (data: any) => data.businessUnit === businessUnit))) {
            console.log(businessUnit);
            (result as any[]).push({
              billing: '0',
              businessUnit
            });
          }
        }
        result = {
          data: result
        }
        break;
      }
      case 'elapsed-year-billing-by-section': {
        if (process.env['MOCKED_DATA']) {
          result = [
            {
              "billing": "2166000",
              "businessUnit": "tbolab"
            },
            {
              "billing": "1605000",
              "businessUnit": "tboloc"
            },
            {
              "billing": "590000",
              "businessUnit": "tbomedia"
            },
            {
              "billing": "2200000",
              "businessUnit": "tboplay"
            },
            {
              "billing": "1345000",
              "businessUnit": "tbotalent"
            },
            {
              "billing": "1630000",
              "businessUnit": "tbolive"
            },
          ];
        } else {
          result = await new KPIService().getElapsedYearBillingBySection();
        }
        for (const businessUnit of ['tbolab', 'tbolive', 'tboloc', 'tbomedia', 'tbotalent', 'tboplay']) {
          if (_.isUndefined(_.find(result, (data: any) => data.businessUnit === businessUnit))) {
            console.log('AYYYYYYYYY');
            (result as any[]).push({
              billing: '0',
              businessUnit
            });
          }
        }
        result = {
          data: result
        }
        break;
      }
      case 'monthly-billed-languages': {
        if (process.env['MOCKED_DATA']) {
          result = [
            {
              "id": "Spanish (LA)",
              "billing": "653987",
              "cost": "26192.78",
              "margin": "0.86"
            },
            {
              "id": "Spanish (United States)",
              "billing": "523747",
              "cost": "6871.11",
              "margin": "0.96"
            },
            {
              "id": "Portuguese (Brazil)",
              "billing": "496582",
              "cost": "2395.13",
              "margin": "0.98"
            },
            {
              "id": "French (Canada)",
              "billing": "369998",
              "cost": "7835.18",
              "margin": "0.9"
            },
            {
              "id": "Vietnamese (Vietnam)",
              "billing": "120120",
              "cost": "8110.88",
              "margin": "0.74"
            },
            {
              "id": "English (United States)",
              "billing": "99653",
              "cost": "7821.83",
              "margin": "0.72"
            },
            {
              "id": "Spanish (Mexico)",
              "billing": "82000",
              "cost": "2947.07",
              "margin": "0.82"
            },
            {
              "id": "Haitian Creole",
              "billing": "77996",
              "cost": "2583.15",
              "margin": "0.76"
            },
            {
              "id": "French (France)",
              "billing": "45632",
              "cost": "4346.67",
              "margin": "0.53"
            },
            {
              "id": "Hakha-Chin (Myanmar)",
              "billing": "41111",
              "cost": "2109.36",
              "margin": "0.7"
            },
          ];
        } else {
          result = await new KPIService().getMonthlyBilledLanguages(luxon.DateTime.local().month);
        }

        result = {
          data: result
        }
        break;
      }
      case 'monthly-billed-customers': {
        if (process.env['MOCKED_DATA']) {
          result = [
            {
              "id": "Red Mars Corp.",
              "billing": "1453111",
              "cost": "5477.3",
              "margin": "0.97"
            },
            {
              "id": "Al Kitaab",
              "billing": "1146333",
              "cost": "3877.92",
              "margin": "0.98"
            },
            {
              "id": "Future Publishing Inc.",
              "billing": "1034562",
              "cost": "12699.66",
              "margin": "0.91"
            },
            {
              "id": "Interface Lingo",
              "billing": "789333",
              "cost": "18375.13",
              "margin": "0.78"
            },
            {
              "id": "LSP International",
              "billing": "626745",
              "cost": "1457.59",
              "margin": "0.94"
            },
            {
              "id": "Humanitarian NGO",
              "billing": "203692",
              "cost": "2929.07",
              "margin": "0.87"
            },
            {
              "id": "Design Tech S.A.",
              "billing": "125000",
              "cost": "5431.4",
              "margin": "0.75"
            },
            {
              "id": "Guttenberg UX",
              "billing": "49400",
              "cost": "1764.41",
              "margin": "0.91"
            },
            {
              "id": "Beyond Borders",
              "billing": "35936",
              "cost": "2998.24",
              "margin": "0.78"
            },
            {
              "id": "TEP Agency",
              "billing": "29000",
              "cost": "2483.35",
              "margin": "0.81"
            },
          ];
        } else {
          result = await new KPIService().getMonthlyBilledCustomers(luxon.DateTime.local().month);
        }

        result = {
          data: result
        }
        break;
      }
      default: {
        throw new BadRequestError('Report Type does not exist');
      }
    }
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    const error = e as BaseError;

    res.status(error.code).json({
      message: error.message
    });
  }

}