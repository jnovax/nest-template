import { Injectable } from '@nestjs/common';
import * as Excel from 'exceljs'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getReport(): Promise<ArrayBuffer> {
    const workbook = new Excel.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date(2023, 1, 1);

    const worksheet = workbook.addWorksheet('My Sheet');
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
    ];

    // Access an individual columns by key, letter and 1-based column number
    // const idCol = worksheet.getColumn('id');
    // const nameCol = worksheet.getColumn('B');
    // const dobCol = worksheet.getColumn(3);

    worksheet.addRows([
      [1, 'John Doe', new Date(1970, 1, 1)],
      [2, 'Jane', new Date(1965, 1, 7)],
      [3, 'Sam', new Date()]
    ]);
    worksheet.addRows([5,'Bob',new Date()]);

    return await workbook.xlsx.writeBuffer();
  }
}
