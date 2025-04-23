import React from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.diamond}></div>
    </div>
  );
};

export default Loader;
