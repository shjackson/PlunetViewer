import type { NextApiRequest, NextApiResponse } from 'next';
import { BaseError } from '../../errors/base';
import prisma from '../../db/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  req.query = req.query || {};
  try {
    await prisma.soapEvent.create({
      data: {data: JSON.stringify(req.body)}
    });
    res.status(200).json({message: 'Success'});
  } catch(e) {
    console.log(e);
    const error = e as BaseError;
    res.status(error.code).json({
      message: error.message
    });
  }

}