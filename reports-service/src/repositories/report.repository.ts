import { PrismaClient } from '@prisma/client'
import type { IReport, IReportRepository, IReportResponse } from '../interfaces/report.interface'
import { bucket } from '@/minio';
import { v7 } from 'uuid';
import { getExtensionFromFiletype } from '@/utils';
import { reverseGeocode } from '@/services/nominatim';

export class ReportRepository implements IReportRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async create(report: Omit<IReport, 'id'>) {
    const uploads: Promise<string>[] = [];

    for (const file of report.multimediaReports ?? []) {
      const filename = `media/${v7()}.${getExtensionFromFiletype(file.type)}`;
      const f = bucket.file(filename);

      uploads.push(new Promise<string>((res, rej) => {
        file.bytes().then((data) => {
          f.write(data).then(() => {
            console.log('📄 File uploaded:', filename);
            res(filename);
          }).catch(rej);
        }).catch(rej);
      }));
    }

    const resourceNames = await Promise.all(uploads);
    const latitude = Number(report.latitude);
    const longitude = Number(report.longitude);

    let display_address: string | undefined;

    if (report.address) {
      display_address = report.address;
    } else {
      const location = await reverseGeocode(latitude, longitude);
      display_address = location?.display_name;
    }

    return this.prisma.report.create({
      data: {
        description: report.description,
        latitude: latitude,
        longitude: longitude,
        reportType: report.reportType,
        address: display_address,
        user: {
          connect: { email: 'admin@tombo.pe' },
        },
        multimediaReports: {
          create: resourceNames.map((res) => ({
            type: 'image',
            resource: res,
          }))
        },
      },
      include: {
        multimediaReports: true,
      },
    });
  }

  async findById(id: string): Promise<IReportResponse | null> {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        multimediaReports: true,
      },
    });
  }

  async findAll(): Promise<IReportResponse[]> {
    return this.prisma.report.findMany({
      include: {
        multimediaReports: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.report.delete({
      where: { id }
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.report.deleteMany({});
  }
}
