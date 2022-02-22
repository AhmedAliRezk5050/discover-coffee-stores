import cn from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../../styles/coffee-store.module.css';
import {
  getCoffeStoreByIdWithImage,
  getCoffeStoresIds,
} from '../../data/coffee-stores-api';
import { useStoresLocationContext } from '../../context/stores-location-context';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import Spinner from '../../components/Spinner/Spinner';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const CoffeeStorePage = ({ coffeeStore: staticallyFetchedCoffeeStore }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [voteCount, setVoteCount] = useState(0);

  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(staticallyFetchedCoffeeStore);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  const {
    state: { nearByCoffeeStores: fetchedCoffeeStoresFromContext },
    dispatch,
  } = useStoresLocationContext();

  useEffect(() => {
    if (!id) {
      return;
    }
    const foo = async () => {
      if (coffeeStore) {
        const response = await fetchOrCreateCoffeeStoreFromDb(coffeeStore);
      }
      if (!coffeeStore) {
        if (
          fetchedCoffeeStoresFromContext &&
          fetchedCoffeeStoresFromContext.length > 0
        ) {
          const fetchedSingleCoffeeStoreFromContext =
            fetchedCoffeeStoresFromContext.find((cs) => cs.id === id);
          if (fetchedSingleCoffeeStoreFromContext) {
            setCoffeeStore(fetchedSingleCoffeeStoreFromContext);
          }
        } else {
          setLoading(true);
          const response = await fetch(`/api/getCoffeeStoreById?id=${id}`);
          if (response.ok) {
            const fetchedCoffeeStoreFromDb = (await response.json()).store;
            setCoffeeStore(fetchedCoffeeStoreFromDb);
          }
          setLoading(false);
        }
      }
      setLoading(false);
    };

    foo();
  }, [coffeeStore, fetchedCoffeeStoresFromContext, id]);

  useEffect(() => {
    if (data && data.store) {
      setVoteCount(data.store.voting);
    }
  }, [data, id]);

  const fetchOrCreateCoffeeStoreFromDb = async (data) => {
    const response = await fetch('/api/createCoffeeStore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, voting: 0 }),
    });

    const fetchedCoffeStore = (await response.json()).store;
    return fetchedCoffeStore;
  };

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/upVoteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('No store Found to upload');
      }

      const updateResult = await response.json();

      setVoteCount((prevCount) =>
        updateResult.store.voting === prevCount ? prevCount : prevCount + 1,
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  if (router.isFallback || loading) {
    return <Spinner />;
  }
  if (coffeeStore && !data) {
    return <Spinner />;
  }

  if (!coffeeStore) {
    return (
      <>
        <div className={cn(styles.backToHomeLink, styles.errorBox)}>
          <Link href='/'>
            <a>&larr; Back to home</a>
          </Link>
          <h1>Error getting store</h1>
        </div>
      </>
    );
  }
  const { name, imgUrl, address, neighborhood } = coffeeStore;

  const renderStoreInfo = () => {
    if (!address && !neighborhood && !voteCount) {
      return null;
    }

    return (
      <div className={cn('glass', styles.col2)}>
        {address && (
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/places.svg'
              width={24}
              height={24}
              alt='location icon'
            />
            <p className={styles.text}>{address}</p>
          </div>
        )}
        {neighborhood && (
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/nearMe.svg'
              width={24}
              height={24}
              alt='near me icon'
            />
            <p className={styles.text}>{neighborhood}</p>
          </div>
        )}
        {!isNaN(voteCount) && (
          <>
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/star.svg'
                width={24}
                height={24}
                alt='star icon'
              />
              <p className={styles.text}>{voteCount}</p>
            </div>
            <button
              className={styles.upvoteButton}
              onClick={handleUpvoteButton}
            >
              Up Vote!
            </button>
          </>
        )}
      </div>
    );
  };

  const placeholderImgUrl =
    'https://images.unsplash.com/photo-1505148454817-2fb30960599d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80';

  return (
    <div className={styles.layout}>
      <Head>
        <meta
          name='description'
          content={`details about ${name} coffee store`}
        />
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
              <a>&larr; Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          {
            <Image
              src={imgUrl ? imgUrl : placeholderImgUrl}
              width={600}
              height={360}
              alt={name}
              className={styles.storeImg}
            />
          }
        </div>
        {renderStoreInfo()}
      </div>
    </div>
  );
};

export async function getStaticProps(context) {
  const { id } = context.params;
  const coffeeStore = await getCoffeStoreByIdWithImage(id, 'regular');
  return {
    props: { coffeeStore: coffeeStore ? coffeeStore : null },
  };
}

export async function getStaticPaths() {
  const paths = (await getCoffeStoresIds()).map((storeId) => ({
    params: { id: storeId },
  }));
  return {
    paths,
    fallback: true,
  };
}

export default CoffeeStorePage;
