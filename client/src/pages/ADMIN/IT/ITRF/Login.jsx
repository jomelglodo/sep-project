import styles from "./Login.module.css";
export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <form action={styles.form}>
          <div className={styles.form}>
            <label>Username</label>
            <input type="text" />
          </div>
          <div className={styles.form}>
            <label>Password</label>
            <input type="text" />
          </div>
          <div className={styles.form}>
            <button>LOGIN</button>
          </div>
        </form>
      </div>
    </div>
  );
}
