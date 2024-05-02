import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

interface TodoUpdateRequest {
  todo_index: number;
  todo_chk: number;
}

// export async function GET(request: NextRequest) {
//   try {
//     const db = await pool.getConnection();
//     const query = 'select * from TODOLIST';
//     const [rows] = await db.execute(query);
//     db.release();

//     return NextResponse.json(rows);
//   } catch (error) {
//     return NextResponse.json(
//       {
//         msg: 'Issue Happend',
//       },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: NextRequest & { body: TodoUpdateRequest }) {
  try {
    // const { todo_index, todo_chk } = req.body;

    // const db = await pool.getConnection();
    // const updateQuery = 'UPDATE TODOLIST SET todo_chk = ? WHERE todo_index = ?';
    // const [result] = await db.execute(updateQuery, [todo_index, todo_chk]);
    // db.release();

    // return NextResponse.json(result);
    return '1';
  } catch (error: any) {
    console.error('Error occurred:', error.message);
    return NextResponse.json(
      { error: 'An error occurred while updating todo item.' },
      { status: 500 },
    );
  }
}
