import styles from './page.module.css';

const fetchDatas = async () => {
  const res = await fetch('http://localhost:3000/api/todolist', {
    method: 'POST',
    cache: 'no-cache',
  });
  const fetchDatas = await res.json();
  console.log(fetchDatas);
  return fetchDatas;
};

const Home = async () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todo List Next</h1>
    </div>
  );
};

export default Home;
