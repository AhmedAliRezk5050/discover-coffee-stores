import Image from 'next/image';
import Link from 'next/link';
import styles from './Card.module.css';
import cls from 'classnames';

const Card = ({ name, imgUrl, href }) => {
  return (
    <Link href={href}>
      <a className={styles.cardLink}>
        <div className={cls('glass', styles.container)}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              src={imgUrl}
              width={260}
              height={160}
              alt={name}
              className={styles.cardImage}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
