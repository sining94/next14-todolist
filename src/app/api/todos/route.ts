import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

interface TodoUpdateRequest {
  todo_text: string;
  todo_chk: any;
}

interface TextUpdateRequest {
  todo_index: number;
  todo_text: string;
}

interface DeleteRequest {
  todo_text: string;
}

interface AddTodoRequest {
  todo_text: string;
}

export async function GET(response: NextResponse) {
  try {
    const db = await pool.getConnection();
    const query = 'select * from TODOLIST';
    const [rows] = await db.execute(query);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, response: NextResponse) {
  try {
    const body: TodoUpdateRequest = await request.json();

    const { todo_text, todo_chk } = body;

    const db = await pool.getConnection();
    const updateQuery = 'UPDATE TODOLIST SET todo_chk = ? WHERE todo_text = ?';
    const [result] = await db.execute(updateQuery, [todo_chk, todo_text]);

    const getTodosQuery = 'SELECT * FROM TODOLIST';
    const [todos] = await db.execute(getTodosQuery);
    db.release();

    return NextResponse.json(todos);
  } catch (error: any) {
    console.error('Error occurred:', error.message);
    return NextResponse.json(
      { error: 'An error occurred while checking todo item.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, response: NextResponse) {
  try {
    const body: TextUpdateRequest = await request.json();
    const { todo_index, todo_text } = body;

    const db = await pool.getConnection();
    const updateQuery =
      'UPDATE TODOLIST SET todo_text = ? WHERE todo_index = ?';
    const [result] = await db.execute(updateQuery, [todo_text, todo_index + 1]);

    const getTodosQuery = 'SELECT * FROM TODOLIST';
    const [todos] = await db.execute(getTodosQuery);

    // 데이터베이스 커넥션 해제
    db.release();

    return NextResponse.json(todos);
  } catch (error: any) {
    console.error('Error occurred while updating todo item:', error.message);
    return NextResponse.json(
      { error: 'An error occurred while updating todo item.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  try {
    const body: DeleteRequest = await request.json();
    const { todo_text } = body;

    const db = await pool.getConnection();
    const updateQuery = 'DELETE FROM TODOLIST WHERE todo_text = ?';
    const [result] = await db.execute(updateQuery, [todo_text]);

    const getTodosQuery = 'SELECT * FROM TODOLIST';
    const [todos] = await db.execute(getTodosQuery);

    // 데이터베이스 커넥션 해제
    db.release();

    return NextResponse.json(todos);
  } catch (error: any) {
    console.error('Error occurred while updating todo item:', error.message);
    return NextResponse.json(
      { error: 'An error occurred while updating todo item.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const body: AddTodoRequest = await request.json();
    const { todo_text } = body;

    const db = await pool.getConnection();
    // const updateQuery = 'DELETE FROM TODOLIST WHERE todo_text = ?';
    const addQuery = 'INSERT INTO TODOLIST(todo_text, todo_chk) VALUES(?, 0)';
    const [result] = await db.execute(addQuery, [todo_text]);

    const getTodosQuery = 'SELECT * FROM TODOLIST';
    const [todos] = await db.execute(getTodosQuery);

    // 데이터베이스 커넥션 해제
    db.release();

    return NextResponse.json(todos);
  } catch (error: any) {
    console.error('Error occurred while add todo item:', error.message);
    return NextResponse.json(
      { error: 'An error occurred while add todo item.' },
      { status: 500 },
    );
  }
}
