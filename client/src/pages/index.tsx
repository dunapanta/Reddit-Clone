import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reddit Clone</title>
      </Head>
        <div className="fixed top-0 z-10 flex items-center justify-center h-12 insert-x-0"></div>
    </div>
  )
}
