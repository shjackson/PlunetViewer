import type { NextApiRequest, NextApiResponse } from 'next';
import { MarginsReport } from '../../reports/margins';
import _ from 'lodash';
import assert from 'assert';
import { BadRequestError } from '../../errors/bad-request';
import { BaseError } from '../../errors/base';
import * as luxon from 'luxon';
import { getToken } from '../../plunet/context';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  req.query = req.query || {};
  let result = {}
  try {
    assert(req.query.reportType, new BadRequestError('Missing Report Type'));
    switch(req.query.reportType) {
      case 'margins': {
        assert(luxon.DateTime.fromFormat(req.query.startDate as string, 'yyyy-MM-dd').isValid, new BadRequestError('Invalid Start Date'));
        assert(luxon.DateTime.fromFormat(req.query.endDate as string, 'yyyy-MM-dd').isValid, new BadRequestError('Invalid End Date'));
        console.log(req.query.startDate);
        console.log(req.query.endDate);
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;
        result = await new MarginsReport().generateReport(startDate, endDate);
        break;
      }
      default: {
        throw new BadRequestError('Report Type does not exist');
      }
    }
    res.status(200).json(result);
  } catch(e) {
    console.log(e);
    const error = e as BaseError;

    res.status(error.code).json({
      message: error.message
    });
  }

}