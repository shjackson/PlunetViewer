import type { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import assert from 'assert';
import { BadRequestError } from '../../errors/bad-request';
import { BaseError } from '../../errors/base';
import { CustomerService } from '../../services/customer-service';
import { OrderService } from '../../services/order-service';
import { ItemService } from '../../services/item-service';
import { JobService } from '../../services/job-service';
import { BackupService } from '../../services/backup-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  req.query = req.query || {};
  let result = {}
  try {
    assert(req.query.type, new BadRequestError('Missing Sync Type'));
    switch(req.query.type) {
      case 'customers': {
        await new CustomerService().syncCustomers();
        console.log('finished customer sync');
        res.status(200).json(result);
        break;
      }
      case 'all': {
        const result =  await new BackupService().backupThatShit();
        res.status(200).json(result);
        break;
      }
      default: {
        throw new BadRequestError('Sync Type does not exist');
      }
    }

  } catch(e) {
    console.log('EEEEEEEEEEEEEEEE');
    console.log('EEEEEEEEEEEEEEEE');
    console.log('EEEEEEEEEEEEEEEE');
    console.log('EEEEEEEEEEEEEEEE');

    console.log(e);
    const error = e as BaseError;
    res.status(error.code).json({
      message: error.message
    });
  }

}