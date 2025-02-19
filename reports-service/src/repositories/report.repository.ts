import { sql } from 'bun';

export class ReportRepository {
  async createReport(data: { title: string; content: string }) {
    const result = await sql`
      INSERT INTO reports (title, content)
      VALUES (${data.title}, ${data.content})
      RETURNING *
    `;
    return result[0];
  }

  async getReportById(id: string) {
    const result = await sql`
      SELECT * FROM reports WHERE id = ${id}
    `;
    return result[0];
  }
}
