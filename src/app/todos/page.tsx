'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import { TodoType } from '@/type/ListType';
import { noSSR } from 'next/dynamic';

interface TodosProps {
  todos: TodoType[];
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
}

export const Todos: React.FC<TodosProps> = () => {
  const [inpText, setInpText] = useState('');
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [editTableText, setEditTableText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3000/api/todos', {
        cache: 'no-store',
      });
      const data = await res.json();
      setTodos(data);
    };

    fetchData();
  }, []);

  const handleChkChange = async (todo_text: string, todo_chk: number) => {
    try {
      const updatedTodoChk = todo_chk === 1 ? 0 : 1;
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo_text, todo_chk: updatedTodoChk }),
      });

      const responseData = await response.json();
      setTodos(responseData); // 업데이트된 데이터로 상태 업데이트
    } catch (error: any) {
      console.error('Error occurred:', error.message);
    }
  };

  const handleEditClick = (index: number) => {
    setEditableIndex(index); // 선택된 항목의 인덱스 설정
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTableText(e.target.value);
  };

  const handleConfirmText = async () => {
    try {
      let overlayText = todos.some((el) => el.todo_text === editTableText);

      if (!overlayText) {
        const response = await fetch('http://localhost:3000/api/todos', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            todo_index: editableIndex,
            todo_text: editTableText,
          }),
        });

        const responseData = await response.json();

        setTodos(responseData);
      } else {
        alert('이미 있는 할일 입니다.');
        return false;
      }
    } catch (error: any) {
      console.error('Error occurred:', error.message);
    }
    setEditableIndex(null);
  };

  const handleDeleteItem = async (text: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo_text: text,
        }),
      });

      const responseData = await response.json();

      setTodos(responseData);
    } catch (error: any) {
      console.error('Error occurred:', error.message);
    }
  };

  const handleAddTodo = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo_text: inpText,
        }),
      });

      const responseData = await response.json();
      setTodos(responseData);
      setInpText('');
    } catch (error: any) {
      console.error('Error occurred', error.message);
    }
  };

  const activeEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Todo List Next</div>
      <div className={styles.inpArea}>
        <input
          type="text"
          className={styles.inpText}
          placeholder="Enter Todo"
          value={inpText}
          onChange={(e) => setInpText(e.target.value)}
          onKeyDown={(e) => activeEnter(e)}
        />

        <button className={styles.addBtn} onClick={() => handleAddTodo()}>
          Add
        </button>
        <button className={styles.delBtn}>Clear</button>
      </div>
      <div className={styles.todoWrap}>
        {todos.map((todo: TodoType, index) => (
          <div className={styles.todoItem} key={todo.todo_index}>
            <div className={styles.todoInner}>
              <input
                type="checkbox"
                checked={todo.todo_chk == 1 ? true : false}
                onChange={() => handleChkChange(todo.todo_text, todo.todo_chk)}
                className={styles.todoChk}
              />
              <input
                type="text"
                className={styles.todoText}
                defaultValue={`${todo.todo_text}`}
                onChange={(e) => onTextChange(e)}
                disabled={editableIndex !== todo.todo_index} // 선택된 항목만 입력 가능하도록 설정
              />

              {editableIndex == todo.todo_index ? (
                <>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleConfirmText()}
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEditClick(todo.todo_index)}
                  >
                    Edit
                  </button>
                </>
              )}

              <button
                className={styles.delBtn}
                onClick={() => handleDeleteItem(todo.todo_text)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
